// Authentication Module
// Note: Using in-memory storage instead of sessionStorage due to sandbox restrictions
const AUTH = {
  currentUser: null,
  sessionData: {},
  
  init() {
    this.checkSession();
    this.setupGoogleLogin();
    this.setupEventListeners();
  },
  
  setupGoogleLogin() {
    // Initialize Google Sign-In
    // Note: In production, you'll need to add your Google Client ID
    // Get it from: https://console.developers.google.com/
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.simulateGoogleLogin();
      });
    }
  },
  
  simulateGoogleLogin() {
    // Simulate Google OAuth login
    // In production, this would use actual Google Sign-In API
    const user = {
      userId: 'user-' + Date.now(),
      name: prompt('Enter your name:') || 'Demo User',
      email: prompt('Enter your email:') || 'user@example.com',
      profilePicture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent('Demo User') + '&background=4F46E5&color=fff',
      loginTimestamp: new Date().toISOString(),
      loginCount: 1
    };
    
    if (user.name && user.email) {
      this.handleLoginSuccess(user);
    }
  },
  
  handleLoginSuccess(user) {
    // Save user to session (in-memory)
    this.currentUser = user;
    this.sessionData.currentUser = user;
    
    // Save to users database
    const existingUser = DATABASE.users.find(u => u.email === user.email);
    if (existingUser) {
      existingUser.loginCount++;
      existingUser.lastLogin = user.loginTimestamp;
    } else {
      DATABASE.users.push({
        ...user,
        registeredDate: user.loginTimestamp,
        orders: []
      });
    }
    
    this.updateUI();
    showToast('Login successful! Welcome ' + user.name, 'success');
  },
  
  checkSession() {
    // Check in-memory session
    if (this.sessionData.currentUser) {
      this.currentUser = this.sessionData.currentUser;
      this.updateUI();
    }
  },
  
  updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (this.currentUser) {
      loginBtn.classList.add('hidden');
      userProfile.classList.remove('hidden');
      userAvatar.src = this.currentUser.profilePicture;
      userName.textContent = this.currentUser.name;
    } else {
      loginBtn.classList.remove('hidden');
      userProfile.classList.add('hidden');
    }
  },
  
  logout() {
    this.currentUser = null;
    this.sessionData.currentUser = null;
    this.updateUI();
    showToast('Logged out successfully', 'success');
  },
  
  requireLogin(callback) {
    if (!this.currentUser) {
      showToast('Please login to continue', 'error');
      document.getElementById('loginBtn').click();
      return false;
    }
    callback();
    return true;
  },
  
  setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  AUTH.init();
});