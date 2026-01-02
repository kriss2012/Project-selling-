const ADMIN = {
  isLoggedIn: false,
  credentials: { email: '202krishnapatil@gmail.com', password: '202@Krishna' },
  
  init() {
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    document.getElementById('adminLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('adminLoginModal');
    });

    document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
    });

    // Tab Switching
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('admin-menu-item')) {
        e.preventDefault();
        document.querySelectorAll('.admin-menu-item').forEach(i => i.classList.remove('active'));
        e.target.classList.add('active');
        this.switchTab(e.target.dataset.tab);
      }
    });
  },
  
  handleLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    if (email === this.credentials.email && password === this.credentials.password) {
      this.isLoggedIn = true;
      closeModal('adminLoginModal');
      this.showDashboard();
    } else {
      alert('Invalid Credentials');
    }
  },
  
  showDashboard() {
    document.getElementById('adminDashboard').classList.add('active');
    document.body.style.overflow = 'hidden';
    this.switchTab('overview');
  },
  
  switchTab(tab) {
    const content = document.getElementById('adminContent');
    content.innerHTML = '<div style="padding:2rem; text-align:center;">Loading Real Data...</div>';

    fetch('/api/admin/data')
    .then(res => {
        if(res.status === 403) throw new Error("Unauthorized Access");
        return res.json();
    })
    .then(data => {
        this.renderContent(tab, data, content);
    })
    .catch(err => content.innerHTML = `<p style="color:red; text-align:center;">${err.message}</p>`);
  },

  renderContent(tab, data, content) {
    // 1. OVERVIEW TAB
    if(tab === 'overview') {
        const revenue = data.orders.reduce((acc, o) => acc + (o.projectPrice || 0), 0);
        content.innerHTML = `
            <h2>Dashboard Overview</h2>
            <div class="stats-grid">
                <div class="stat-card"><h3>Users</h3><div class="stat-value">${data.users.length}</div></div>
                <div class="stat-card"><h3>Orders</h3><div class="stat-value">${data.orders.length}</div></div>
                <div class="stat-card"><h3>Revenue</h3><div class="stat-value">₹${revenue.toLocaleString()}</div></div>
                <div class="stat-card"><h3>Inquiries</h3><div class="stat-value">${data.contacts.length}</div></div>
            </div>
        `;
    }
    // 2. USERS TAB
    else if(tab === 'users') {
        content.innerHTML = `
            <h2>Registered Users</h2>
            <div class="data-table">
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
                    <tbody>
                        ${data.users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.last_login}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
    }
    // 3. ORDERS TAB
    else if(tab === 'orders') {
        content.innerHTML = `
            <h2>Order History</h2>
            <div class="data-table">
                <table>
                    <thead><tr><th>Order ID</th><th>Client</th><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                        ${data.orders.map(o => `<tr><td>${o.orderId}</td><td>${o.userName}</td><td>${o.projectName}</td><td>₹${o.projectPrice}</td><td>${o.projectStatus}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
    }
    // 4. MAINTENANCE TAB
    else if(tab === 'maintenance') {
        content.innerHTML = `
            <h2>Maintenance Requests</h2>
            <div class="data-table">
                <table>
                    <thead><tr><th>User</th><th>Issue</th><th>Urgency</th><th>Status</th></tr></thead>
                    <tbody>
                        ${data.maintenance.map(m => `<tr><td>${m.user}</td><td>${m.issue}</td><td><span class="tag">${m.urgency}</span></td><td>${m.status}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
    }
    // 5. CONTACTS TAB
    else if(tab === 'contacts') {
        content.innerHTML = `
            <h2>Inquiries</h2>
            <div class="data-table">
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Service</th><th>Message</th></tr></thead>
                    <tbody>
                        ${data.contacts.map(c => `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.service}</td><td>${c.message}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
    }
  }
};

function closeAdminDashboard() {
  document.getElementById('adminDashboard').classList.remove('active');
  document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => ADMIN.init());