import os
import json
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
import razorpay
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

# --- DATABASE SETUP ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- CONFIGURATIONS ---
oauth = OAuth(app)
razorpay_client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

# Google OAuth Configuration
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
)

# --- DATABASE MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(100), unique=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    profile_pic = db.Column(db.String(200))
    role = db.Column(db.String(20), default="user") # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), unique=True) # Razorpay Order ID
    user_email = db.Column(db.String(100))
    project_name = db.Column(db.String(100))
    amount = db.Column(db.Float)
    amount_paid = db.Column(db.Float)
    status = db.Column(db.String(50)) # 'Created', 'Paid'
    payment_id = db.Column(db.String(100)) # Razorpay Payment ID
    date = db.Column(db.DateTime, default=datetime.utcnow)

# Create DB tables
with app.app_context():
    db.create_all()

# --- EMAIL FUNCTION ---
def send_email(to_email, subject, body):
    sender_email = os.getenv("MAIL_USERNAME")
    sender_password = os.getenv("MAIL_PASSWORD")
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# --- ROUTES ---

@app.route('/')
def home():
    # Pass the user to the template if logged in
    user_info = session.get('user')
    return render_template('index.html', user=user_info)

# --- AUTH ROUTES ---
@app.route('/login')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    
    # Check if user exists in DB, if not create them
    user = User.query.filter_by(email=user_info['email']).first()
    if not user:
        user = User(
            google_id=user_info['id'],
            name=user_info['name'],
            email=user_info['email'],
            profile_pic=user_info['picture']
        )
        db.session.add(user)
        db.session.commit()
    
    # Save to session
    session['user'] = {
        'name': user.name,
        'email': user.email,
        'picture': user.profile_pic,
        'role': user.role
    }
    return redirect('/')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

# --- PAYMENT ROUTES ---
@app.route('/create_order', methods=['POST'])
def create_order():
    if 'user' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    data = request.json
    amount = data.get('amount') # In Rupees
    project_name = data.get('project_name')
    
    # Create Razorpay Order
    order_amount = int(amount * 100) # Convert to paise
    order_currency = 'INR'
    order_receipt = 'order_rcptid_11'
    
    razorpay_order = razorpay_client.order.create(dict(
        amount=order_amount,
        currency=order_currency,
        receipt=order_receipt
    ))
    
    # Save partial order to DB
    new_order = Order(
        order_id=razorpay_order['id'],
        user_email=session['user']['email'],
        project_name=project_name,
        amount=amount,
        status='Created'
    )
    db.session.add(new_order)
    db.session.commit()
    
    return jsonify({
        'order_id': razorpay_order['id'],
        'amount': order_amount,
        'key': os.getenv("RAZORPAY_KEY_ID"),
        'user_name': session['user']['name'],
        'user_email': session['user']['email']
    })

@app.route('/payment_success', methods=['POST'])
def payment_success():
    data = request.json
    # In a real app, verify signature here
    
    order = Order.query.filter_by(order_id=data['razorpay_order_id']).first()
    if order:
        order.status = 'Paid'
        order.payment_id = data['razorpay_payment_id']
        order.amount_paid = order.amount # Assuming full payment
        db.session.commit()
        
        # Send Email Notification
        email_body = f"""
        <h1>Payment Successful!</h1>
        <p>Dear {order.user_email},</p>
        <p>We have received your payment of ₹{order.amount} for the project: <b>{order.project_name}</b>.</p>
        <p>We will start working on it immediately.</p>
        <br>
        <p>Regards,<br>Krishna Patil<br>DesignStudio</p>
        """
        send_email(order.user_email, "Order Confirmation - DesignStudio", email_body)
        
        # Notify Admin (You)
        send_email("202krishnapatil@gmail.com", "New Order Received!", f"New order from {order.user_email} for ₹{order.amount}")
        
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error'}), 400

# --- ADMIN API ---
@app.route('/api/admin/data')
def admin_data():
    if 'user' not in session or session['user']['email'] != '202krishnapatil@gmail.com':
        return jsonify({'error': 'Unauthorized'}), 403
        
    users = User.query.all()
    orders = Order.query.all()
    
    user_list = [{'name': u.name, 'email': u.email, 'last_login': str(u.created_at)} for u in users]
    order_list = [{'orderId': o.order_id, 'userName': o.user_email, 'projectName': o.project_name, 'projectPrice': o.amount, 'projectStatus': o.status} for o in orders]
    
    return jsonify({'users': user_list, 'orders': order_list})

if __name__ == '__main__':
    app.run(debug=True, port=5000)