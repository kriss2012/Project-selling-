// Authentication Module
// Connects with Python Backend via index.html injected variable

const AUTH = {
  currentUser: null,
  
  init() {
    // Check for user injected from Python (index.html)
    if (typeof CURRENT_USER !== 'undefined' && CURRENT_USER) {
      this.currentUser = CURRENT_USER;
      this.updateUI();
    }
    this.setupEventListeners();
  },
  
  setupEventListeners() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Redirect to Python Google Login route
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = "/login";
      });
    }

    // Redirect to Python Logout route
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.location.href = "/logout";
      });
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
      // Google provides 'picture' field, mapped in Python
      userAvatar.src = this.currentUser.picture;
      userName.textContent = this.currentUser.name;
    } else {
      loginBtn.classList.remove('hidden');
      userProfile.classList.add('hidden');
    }
  },

  // Helper for other modules
  requireLogin(callback) {
    if (!this.currentUser) {
      showToast('Please login to continue', 'error');
      // Trigger Python login
      window.location.href = "/login";
      return false;
    }
    callback();
    return true;
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  AUTH.init();
});