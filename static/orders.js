// Order Management Module
const ORDERS = {
  init() {
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    // Will be called from app.js when order buttons are clicked
  },
  
  showOrderModal(project) {
    if (!AUTH.currentUser) {
      showToast('Please login to place an order', 'error');
      document.getElementById('loginBtn').click();
      return;
    }
    
    const advanceAmount = project.price * 0.25;
    const finalAmount = project.price * 0.75;
    
    const modalContent = `
      <h2>Order: ${project.title}</h2>
      <div style="margin: 2rem 0;">
        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem;">
          <h3 style="margin-bottom: 1rem;">Project Details</h3>
          <p><strong>Project:</strong> ${project.title}</p>
          <p><strong>Category:</strong> ${project.category}</p>
          <p><strong>Total Price:</strong> ₹${project.price.toLocaleString()}</p>
          <p style="margin-top: 1rem;"><strong>Technologies:</strong></p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
            ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
          </div>
        </div>
        
        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem;">
          <h3 style="margin-bottom: 1rem;">Payment Options</h3>
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; border-radius: 0.5rem; margin-bottom: 0.5rem;">
              <div>
                <strong>Advance Payment (25%)</strong>
                <p style="color: var(--text-gray); font-size: 0.875rem;">Pay to start your project</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">₹${advanceAmount.toLocaleString()}</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: white; border-radius: 0.5rem;">
              <div>
                <strong>Final Payment (75%)</strong>
                <p style="color: var(--text-gray); font-size: 0.875rem;">Pay after project completion</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">₹${finalAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style="background: #FEF3C7; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #F59E0B; margin-bottom: 1rem;">
          <p style="margin: 0; color: #92400E;"><strong>Note:</strong> You need to pay 25% advance to start the project. The remaining 75% will be collected after project completion and your approval.</p>
        </div>
        
        <form id="paymentForm">
          <div class="form-group">
            <label>Payment Method</label>
            <select id="paymentMethod" class="form-control" required>
              <option value="">Select Payment Method</option>
              <option value="upi">UPI</option>
              <option value="card">Credit/Debit Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>
          
          <div style="background: var(--bg-light); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <p style="font-size: 0.875rem; color: var(--text-gray); margin: 0;">
              <strong>For Developers:</strong><br>
              // PAYMENT GATEWAY INTEGRATION - ADVANCE PAYMENT (25%)<br>
              // Add your payment gateway API keys here (Razorpay, Stripe, PayPal, etc.)<br>
              // Example for Razorpay:<br>
              // const razorpayKey = 'YOUR_RAZORPAY_KEY_ID';<br>
              // const razorpaySecret = 'YOUR_RAZORPAY_SECRET';<br><br>
              
              // BANK ACCOUNT DETAILS FOR MANUAL PAYMENTS:<br>
              // Account Name: Krishna Patil<br>
              // Account Number: [Your Account Number]<br>
              // IFSC Code: [Your IFSC Code]<br>
              // Bank Name: [Your Bank Name]<br>
              // UPI ID: 202krishnapatil@paytm (example)
            </p>
          </div>
          
          <button type="submit" class="btn btn-primary btn-large btn-full">Pay ₹${advanceAmount.toLocaleString()} (25% Advance)</button>
        </form>
      </div>
    `;
    
    document.getElementById('orderDetails').innerHTML = modalContent;
    openModal('orderModal');
    
    // Setup form submission
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.processPayment(project, 'advance');
    });
  },
  
  processPayment(project, type) {
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!paymentMethod) {
      showToast('Please select a payment method', 'error');
      return;
    }
    
    // Simulate payment processing
    showToast('Processing payment...', 'info');
    
    setTimeout(() => {
      // Show payment gateway modal
      this.showPaymentGatewayModal();
      
      setTimeout(() => {
        this.completeOrder(project, type);
      }, 2000);
    }, 1000);
  },
  
  showPaymentGatewayModal() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content modal-small" style="text-align: center;">
        <i class="fas fa-credit-card" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
        <h2>Payment Gateway</h2>
        <p style="margin: 1.5rem 0;">In production, this will redirect to your configured payment gateway (Razorpay, Stripe, PayPal, etc.)</p>
        <p style="background: var(--bg-light); padding: 1rem; border-radius: 0.5rem; font-size: 0.875rem;">
          Add your payment gateway credentials in the admin settings to enable real payments.
        </p>
        <div style="margin-top: 2rem;">
          <div class="spinner" style="border: 4px solid var(--bg-light); border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
          <p style="margin-top: 1rem; color: var(--text-gray);">Simulating payment...</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
      modal.remove();
    }, 2000);
  },
  
  completeOrder(project, type) {
    const orderId = 'ORD-' + Date.now();
    const order = {
      orderId: orderId,
      userId: AUTH.currentUser.userId,
      userName: AUTH.currentUser.name,
      userEmail: AUTH.currentUser.email,
      projectName: project.title,
      projectPrice: project.price,
      advancePayment: project.price * 0.25,
      finalPayment: project.price * 0.75,
      paymentStatus: type === 'advance' ? 'Advance Paid' : 'Fully Paid',
      projectStatus: 'In Progress',
      orderDate: new Date().toISOString(),
      deliveryDate: null,
      description: project.description
    };
    
    // Save order to database
    DATABASE.orders.push(order);
    
    // Add order to user
    const user = DATABASE.users.find(u => u.email === AUTH.currentUser.email);
    if (user) {
      if (!user.orders) user.orders = [];
      user.orders.push(orderId);
    }
    
    closeModal('orderModal');
    
    // Show success message
    this.showOrderConfirmation(order);
  },
  
  showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content" style="text-align: center;">
        <div style="width: 80px; height: 80px; background: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          <i class="fas fa-check" style="font-size: 2.5rem; color: white;"></i>
        </div>
        <h2>Order Confirmed!</h2>
        <p style="margin: 1.5rem 0; color: var(--text-gray);">Thank you for your order. We'll start working on your project right away.</p>
        
        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 0.5rem; text-align: left; margin: 1.5rem 0;">
          <h3 style="margin-bottom: 1rem;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Project:</strong> ${order.projectName}</p>
          <p><strong>Total Amount:</strong> ₹${order.projectPrice.toLocaleString()}</p>
          <p><strong>Paid:</strong> ₹${order.advancePayment.toLocaleString()} (25%)</p>
          <p><strong>Remaining:</strong> ₹${order.finalPayment.toLocaleString()} (75%)</p>
          <p><strong>Status:</strong> ${order.projectStatus}</p>
        </div>
        
        <p style="margin: 1rem 0;">We'll contact you at <strong>${order.userEmail}</strong> with project updates.</p>
        
        <button class="btn btn-primary btn-large" onclick="this.closest('.modal').remove()">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    showToast('Order placed successfully!', 'success');
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  ORDERS.init();
});