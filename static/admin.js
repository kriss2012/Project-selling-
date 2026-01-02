// Admin Dashboard Module
const ADMIN = {
  isLoggedIn: false,
  credentials: {
    email: '202krishnapatil@gmail.com',
    password: '202@Krishna'
  },
  
  init() {
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    // Admin link in footer
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
      adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showLoginModal();
      });
    }
    
    // Admin login form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }
    
    // Admin menu items
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('admin-menu-item')) {
        e.preventDefault();
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
        
        // Update active state
        document.querySelectorAll('.admin-menu-item').forEach(item => {
          item.classList.remove('active');
        });
        e.target.classList.add('active');
      }
    });
  },
  
  showLoginModal() {
    openModal('adminLoginModal');
  },
  
  handleLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === this.credentials.email && password === this.credentials.password) {
      this.isLoggedIn = true;
      closeModal('adminLoginModal');
      this.showDashboard();
      showToast('Admin login successful', 'success');
    } else {
      showToast('Invalid credentials', 'error');
    }
  },
  
  showDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    dashboard.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.switchTab('overview');
  },
  
  switchTab(tab) {
    const content = document.getElementById('adminContent');
    
    switch(tab) {
      case 'overview':
        content.innerHTML = this.renderOverview();
        break;
      case 'users':
        content.innerHTML = this.renderUsers();
        break;
      case 'orders':
        content.innerHTML = this.renderOrders();
        break;
      case 'maintenance':
        content.innerHTML = this.renderMaintenance();
        break;
      case 'contacts':
        content.innerHTML = this.renderContacts();
        break;
      case 'analytics':
        content.innerHTML = this.renderAnalytics();
        setTimeout(() => this.initCharts(), 100);
        break;
      case 'settings':
        content.innerHTML = this.renderSettings();
        break;
    }
  },
  
  renderOverview() {
    const totalRevenue = DATABASE.orders.reduce((sum, order) => {
      if (order.paymentStatus === 'Advance Paid') return sum + order.advancePayment;
      if (order.paymentStatus === 'Fully Paid') return sum + order.projectPrice;
      return sum;
    }, 0);
    
    const pendingOrders = DATABASE.orders.filter(o => o.projectStatus === 'In Progress').length;
    const completedOrders = DATABASE.orders.filter(o => o.projectStatus === 'Completed').length;
    
    return `
      <h2>Dashboard Overview</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <div class="stat-value">${DATABASE.users.length}</div>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="stat-value">${DATABASE.orders.length}</div>
        </div>
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <div class="stat-value">₹${totalRevenue.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <h3>Pending Orders</h3>
          <div class="stat-value">${pendingOrders}</div>
        </div>
        <div class="stat-card">
          <h3>Completed Orders</h3>
          <div class="stat-value">${completedOrders}</div>
        </div>
        <div class="stat-card">
          <h3>Active Users Today</h3>
          <div class="stat-value">${DATABASE.users.filter(u => {
            const lastLogin = new Date(u.lastLogin);
            const today = new Date();
            return lastLogin.toDateString() === today.toDateString();
          }).length}</div>
        </div>
      </div>
      
      <h3 class="mt-3">Recent Orders</h3>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${DATABASE.orders.slice(-5).reverse().map(order => `
              <tr>
                <td>${order.orderId}</td>
                <td>${order.userName}</td>
                <td>${order.projectName}</td>
                <td>₹${order.projectPrice.toLocaleString()}</td>
                <td><span class="status status--${order.projectStatus === 'Completed' ? 'success' : 'warning'}">${order.projectStatus}</span></td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
  
  renderUsers() {
    return `
      <h2>Users Management</h2>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Login Count</th>
              <th>Last Login</th>
              <th>Registered</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            ${DATABASE.users.map(user => `
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.loginCount}</td>
                <td>${new Date(user.lastLogin).toLocaleString()}</td>
                <td>${new Date(user.registeredDate).toLocaleDateString()}</td>
                <td>${user.orders?.length || 0}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
  
  renderOrders() {
    return `
      <h2>Orders Management</h2>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Project Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DATABASE.orders.map(order => `
              <tr>
                <td>${order.orderId}</td>
                <td>${order.userName}</td>
                <td>${order.userEmail}</td>
                <td>${order.projectName}</td>
                <td>₹${order.projectPrice.toLocaleString()}</td>
                <td><span class="status status--${order.paymentStatus === 'Fully Paid' ? 'success' : 'warning'}">${order.paymentStatus}</span></td>
                <td><span class="status status--${order.projectStatus === 'Completed' ? 'success' : 'info'}">${order.projectStatus}</span></td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <select onchange="ADMIN.updateOrderStatus('${order.orderId}', this.value)">
                    <option value="In Progress" ${order.projectStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${order.projectStatus === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Delivered" ${order.projectStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
  
  renderMaintenance() {
    return `
      <h2>Maintenance Requests</h2>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>User</th>
              <th>Issue Type</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${DATABASE.maintenanceRequests.map(req => `
              <tr>
                <td>${req.requestId}</td>
                <td>${req.userName}</td>
                <td>${req.issueType}</td>
                <td><span class="status status--${req.urgency === 'High' ? 'error' : 'info'}">${req.urgency}</span></td>
                <td><span class="status status--${req.status === 'Resolved' ? 'success' : 'warning'}">${req.status}</span></td>
                <td>${new Date(req.submittedDate).toLocaleDateString()}</td>
                <td>
                  <select onchange="ADMIN.updateMaintenanceStatus('${req.requestId}', this.value)">
                    <option value="Pending" ${req.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Resolved" ${req.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
  
  renderContacts() {
    return `
      <h2>Contact Inquiries</h2>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${DATABASE.contactInquiries.map(contact => `
              <tr>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>${contact.service}</td>
                <td>${contact.message.substring(0, 50)}...</td>
                <td>${new Date(contact.date).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },
  
  renderAnalytics() {
    return `
      <h2>Analytics &amp; Insights</h2>
      <div class="chart-container">
        <h3>User Login Trend (Last 30 Days)</h3>
        <canvas id="loginTrendChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Popular Projects</h3>
        <canvas id="popularProjectsChart"></canvas>
      </div>
      <div class="chart-container">
        <h3>Revenue Trend</h3>
        <canvas id="revenueTrendChart"></canvas>
      </div>
    `;
  },
  
  renderSettings() {
    return `
      <h2>Settings</h2>
      <div style="max-width: 600px;">
        <div class="card" style="padding: 2rem; margin-bottom: 2rem;">
          <h3>Payment Gateway Configuration</h3>
          <p style="color: var(--text-gray); margin-bottom: 1rem;">Configure your payment gateway credentials here.</p>
          
          <div class="form-group">
            <label>Payment Gateway</label>
            <select class="form-control">
              <option>Razorpay</option>
              <option>Stripe</option>
              <option>PayPal</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>API Key / Key ID</label>
            <input type="text" class="form-control" placeholder="YOUR_API_KEY_HERE">
            <small style="color: var(--text-gray);">Add your Razorpay Key ID or Stripe Publishable Key</small>
          </div>
          
          <div class="form-group">
            <label>API Secret</label>
            <input type="password" class="form-control" placeholder="YOUR_API_SECRET_HERE">
            <small style="color: var(--text-gray);">Add your API Secret Key (Keep this secure!)</small>
          </div>
          
          <button class="btn btn-primary">Save Payment Settings</button>
        </div>
        
        <div class="card" style="padding: 2rem;">
          <h3>Bank Account Details</h3>
          <p style="color: var(--text-gray); margin-bottom: 1rem;">For manual payment verification</p>
          
          <div class="form-group">
            <label>Account Name</label>
            <input type="text" class="form-control" value="Krishna Patil" readonly>
          </div>
          
          <div class="form-group">
            <label>Account Number</label>
            <input type="text" class="form-control" placeholder="[Your Account Number]">
          </div>
          
          <div class="form-group">
            <label>IFSC Code</label>
            <input type="text" class="form-control" placeholder="[Your IFSC Code]">
          </div>
          
          <div class="form-group">
            <label>Bank Name</label>
            <input type="text" class="form-control" placeholder="[Your Bank Name]">
          </div>
          
          <div class="form-group">
            <label>UPI ID</label>
            <input type="text" class="form-control" placeholder="202krishnapatil@paytm">
          </div>
          
          <button class="btn btn-primary">Save Bank Details</button>
        </div>
      </div>
    `;
  },
  
  initCharts() {
    // Login Trend Chart
    const loginCtx = document.getElementById('loginTrendChart');
    if (loginCtx) {
      new Chart(loginCtx, {
        type: 'line',
        data: {
          labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
          datasets: [{
            label: 'Daily Logins',
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 20) + 5),
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Popular Projects Chart
    const projectCtx = document.getElementById('popularProjectsChart');
    if (projectCtx) {
      const projectCounts = {};
      DATABASE.orders.forEach(order => {
        projectCounts[order.projectName] = (projectCounts[order.projectName] || 0) + 1;
      });
      
      new Chart(projectCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(projectCounts),
          datasets: [{
            label: 'Orders',
            data: Object.values(projectCounts),
            backgroundColor: '#4F46E5'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Revenue Trend Chart
    const revenueCtx = document.getElementById('revenueTrendChart');
    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: Array.from({length: 12}, (_, i) => `Month ${i + 1}`),
          datasets: [{
            label: 'Revenue (₹)',
            data: Array.from({length: 12}, () => Math.floor(Math.random() * 500000) + 100000),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  },
  
  updateOrderStatus(orderId, status) {
    const order = DATABASE.orders.find(o => o.orderId === orderId);
    if (order) {
      order.projectStatus = status;
      showToast('Order status updated', 'success');
      this.switchTab('orders');
    }
  },
  
  updateMaintenanceStatus(requestId, status) {
    const request = DATABASE.maintenanceRequests.find(r => r.requestId === requestId);
    if (request) {
      request.status = status;
      showToast('Maintenance request status updated', 'success');
      this.switchTab('maintenance');
    }
  }
};

function closeAdminDashboard() {
  const dashboard = document.getElementById('adminDashboard');
  dashboard.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  ADMIN.init();
});