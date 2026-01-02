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

# --- SECURITY CONFIG FOR LOCALHOST ---
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "super_secret_key_default")

# --- DATABASE SETUP ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- CONFIGURATIONS ---
oauth = OAuth(app)
razorpay_client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

# Google OAuth
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

# --- DATABASE MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(100), unique=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    profile_pic = db.Column(db.String(200))
    role = db.Column(db.String(20), default="user")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(50), unique=True)
    user_email = db.Column(db.String(100))
    project_name = db.Column(db.String(100))
    amount = db.Column(db.Float)
    status = db.Column(db.String(50)) # 'Created', 'Paid'
    payment_id = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    service = db.Column(db.String(50))
    message = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)

# UPDATED: Maintenance Requests Model (Added Addons & Cost)
class Maintenance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100))
    issue_type = db.Column(db.String(100))
    description = db.Column(db.Text)
    addons = db.Column(db.String(200))      # Stores selected add-ons like 'Priority Support'
    estimated_cost = db.Column(db.Integer)  # Stores the calculated cost
    status = db.Column(db.String(20), default='Pending')
    date = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

# --- EMAIL HELPER ---
def send_email(to_email, subject, body):
    sender_email = os.getenv("MAIL_USERNAME")
    sender_password = os.getenv("MAIL_PASSWORD")
    
    if not sender_email or not sender_password:
        print("Email credentials missing in .env")
        return

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Email error: {e}")

# --- ROUTES ---
@app.route('/')
def home():
    user_info = session.get('user')
    payment_link = "https://razorpay.me/@krishnachandrakantpatil"
    return render_template('index.html', user=user_info, payment_link=payment_link)

@app.route('/login')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    try:
        token = google.authorize_access_token()
        resp = google.get('https://www.googleapis.com/oauth2/v1/userinfo')
        user_info = resp.json()
        
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
        
        session['user'] = {
            'name': user.name,
            'email': user.email,
            'picture': user.profile_pic,
            'role': user.role
        }
        return redirect('/')
    except Exception as e:
        return f"Login Error: {str(e)}"

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

# --- API ROUTES ---

@app.route('/create_order', methods=['POST'])
def create_order():
    if 'user' not in session:
        return jsonify({'error': 'Login required'}), 401
    
    data = request.json
    amount = float(data.get('amount'))
    project_name = data.get('project_name')
    amount_paise = int(amount * 100)
    
    try:
        razorpay_order = razorpay_client.order.create(dict(
            amount=amount_paise,
            currency='INR',
            receipt=f'order_{int(datetime.now().timestamp())}'
        ))
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
            'amount': amount_paise,
            'key': os.getenv("RAZORPAY_KEY_ID"),
            'user_name': session['user']['name'],
            'user_email': session['user']['email']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/payment_success', methods=['POST'])
def payment_success():
    data = request.json
    order = Order.query.filter_by(order_id=data['razorpay_order_id']).first()
    if order:
        order.status = 'Paid'
        order.payment_id = data['razorpay_payment_id']
        db.session.commit()
        
        # Email User
        send_email(order.user_email, "Order Confirmation", f"Paid ₹{order.amount} for {order.project_name}. Trans ID: {order.payment_id}")
        # Email Admin
        send_email("202krishnapatil@gmail.com", "New Order", f"User {order.user_email} paid ₹{order.amount}")
        
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error'}), 400

@app.route('/api/my_orders')
def my_orders():
    if 'user' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    user_orders = Order.query.filter_by(user_email=session['user']['email']).order_by(Order.date.desc()).all()
    orders_data = [{'project_name': o.project_name, 'amount': o.amount, 'status': o.status, 'payment_id': o.payment_id or 'N/A', 'date': o.date.strftime('%Y-%m-%d')} for o in user_orders]
    return jsonify(orders_data)

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    new_contact = Contact(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        service=data['service'],
        message=data['message']
    )
    db.session.add(new_contact)
    db.session.commit()
    send_email("202krishnapatil@gmail.com", "New Contact Inquiry", f"From: {data['name']} ({data['email']})\nMsg: {data['message']}")
    return jsonify({'status': 'success'})

# UPDATED: Submit Maintenance Request (DB Save + Email)
@app.route('/api/maintenance', methods=['POST'])
def submit_maintenance():
    if 'user' not in session:
        return jsonify({'error': 'Login required'}), 401
    
    data = request.json
    
    # 1. Save to Database
    new_req = Maintenance(
        user_email=session['user']['email'],
        issue_type=data.get('issueType'),
        description=data.get('description'),
        addons=data.get('addons', 'None'),
        estimated_cost=data.get('cost', 0)
    )
    db.session.add(new_req)
    db.session.commit()
    
    # 2. Email Admin (You)
    admin_email_body = f"""
    <h2>New Maintenance Request</h2>
    <p><b>Client:</b> {session['user']['email']}</p>
    <p><b>Issue Type:</b> {data.get('issueType')}</p>
    <p><b>Selected Add-ons:</b> {data.get('addons')}</p>
    <p><b>Estimated Cost:</b> ₹{data.get('cost')}</p>
    <hr>
    <p><b>Description:</b><br>{data.get('description')}</p>
    """
    send_email("202krishnapatil@gmail.com", "Maintenance Request Alert", admin_email_body)
    
    # 3. Email Client (Confirmation)
    client_email_body = f"""
    <h2>Request Received</h2>
    <p>Hi {session['user']['name']},</p>
    <p>We received your request for <b>{data.get('issueType')}</b>.</p>
    <p>Estimated Cost: ₹{data.get('cost')}</p>
    <p>Our team will review it and contact you shortly.</p>
    """
    send_email(session['user']['email'], "Maintenance Request Confirmation", client_email_body)
    
    return jsonify({'status': 'success'})

# ADMIN DASHBOARD DATA
@app.route('/api/admin/data')
def admin_data():
    if 'user' not in session or session['user']['email'] != '202krishnapatil@gmail.com':
        return jsonify({'error': 'Unauthorized'}), 403
    
    users = User.query.all()
    orders = Order.query.all()
    contacts = Contact.query.all()
    maintenance = Maintenance.query.all()
    
    return jsonify({
        'users': [{'name': u.name, 'email': u.email, 'last_login': str(u.created_at)} for u in users],
        'orders': [{'orderId': o.order_id, 'userName': o.user_email, 'projectName': o.project_name, 'projectPrice': o.amount, 'projectStatus': o.status} for o in orders],
        'contacts': [{'name': c.name, 'email': c.email, 'service': c.service, 'message': c.message} for c in contacts],
        'maintenance': [{'user': m.user_email, 'issue': m.issue_type, 'addons': m.addons, 'cost': m.estimated_cost, 'status': m.status} for m in maintenance]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)