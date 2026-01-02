const ORDERS = {
  showOrderModal(project) {
    if (!AUTH.currentUser) {
      showToast('Please login to place an order', 'error');
      return;
    }
    
    // Calculate Amounts
    const advanceAmount = project.price * 0.25;
    const finalAmount = project.price * 0.75;
    
    const modalContent = `
      <h2>Order: ${project.title}</h2>
      <div style="margin: 1.5rem 0;">
        <div style="background: #f9fafb; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <p><strong>Total Price:</strong> ₹${project.price.toLocaleString()}</p>
          <p><strong>Advance (25%):</strong> ₹${advanceAmount.toLocaleString()}</p>
          <p><strong>Final (75%):</strong> ₹${finalAmount.toLocaleString()}</p>
        </div>
        
        <div style="background: #FEF3C7; color: #92400E; padding: 0.8rem; border-radius: 6px; font-size: 0.9rem; margin-bottom: 1rem;">
           <strong>Note:</strong> You are paying the 25% Advance to start the project.
        </div>
        
        <button id="payBtn" class="btn btn-primary btn-large btn-full">Pay ₹${advanceAmount.toLocaleString()} via Razorpay</button>
        <p id="payStatus" style="text-align:center; margin-top:10px; display:none;">Initializing Payment...</p>
      </div>
    `;
    
    document.getElementById('orderDetails').innerHTML = modalContent;
    openModal('orderModal');
    
    document.getElementById('payBtn').addEventListener('click', () => {
        this.processPayment(project, advanceAmount);
    });
  },
  
  processPayment(project, amount) {
    const btn = document.getElementById('payBtn');
    const status = document.getElementById('payStatus');
    btn.disabled = true;
    status.style.display = 'block';

    fetch('/create_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount, project_name: project.title })
    })
    .then(res => res.json())
    .then(data => {
        if(data.error) throw new Error(data.error);
        
        const options = {
            "key": data.key,
            "amount": data.amount,
            "currency": "INR",
            "name": "DesignStudio",
            "description": `Advance for ${project.title}`,
            "order_id": data.order_id,
            "handler": function (response) {
                status.innerText = "Verifying...";
                fetch('/payment_success', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    })
                }).then(r => r.json()).then(() => {
                    closeModal('orderModal');
                    showToast("Payment Successful!", "success");
                    // Refresh Orders if Account modal is open
                    if(document.getElementById('accountModal').classList.contains('active')) openAccountModal();
                });
            },
            "prefill": { "name": data.user_name, "email": data.user_email },
            "theme": { "color": "#4F46E5" },
            "modal": { 
                "ondismiss": function() {
                    btn.disabled = false;
                    status.style.display = 'none';
                }
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();
    })
    .catch(err => {
        btn.disabled = false;
        status.innerText = "Error: " + err.message;
    });
  }
};