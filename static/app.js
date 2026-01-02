// Main Application

// Database (In-memory storage)
const DATABASE = {
  users: [
    {
      userId: 'user-001',
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      profilePicture: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=4F46E5&color=fff',
      loginCount: 8,
      lastLogin: '2025-11-11T07:30:00',
      registeredDate: '2025-10-15T10:00:00',
      orders: []
    },
    {
      userId: 'user-002',
      name: 'Sneha Desai',
      email: 'sneha.desai@example.com',
      profilePicture: 'https://ui-avatars.com/api/?name=Sneha+Desai&background=7C3AED&color=fff',
      loginCount: 5,
      lastLogin: '2025-11-10T16:45:00',
      registeredDate: '2025-10-20T14:30:00',
      orders: []
    },
    {
      userId: 'user-003',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      profilePicture: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=EC4899&color=fff',
      loginCount: 12,
      lastLogin: '2025-11-09T09:15:00',
      registeredDate: '2025-09-28T11:20:00',
      orders: []
    },
    {
      userId: 'user-004',
      name: 'Anjali Mehta',
      email: 'anjali.mehta@example.com',
      profilePicture: 'https://ui-avatars.com/api/?name=Anjali+Mehta&background=10B981&color=fff',
      loginCount: 3,
      lastLogin: '2025-11-08T13:00:00',
      registeredDate: '2025-11-01T08:45:00',
      orders: []
    },
    {
      userId: 'user-005',
      name: 'Karan Malhotra',
      email: 'karan.malhotra@example.com',
      profilePicture: 'https://ui-avatars.com/api/?name=Karan+Malhotra&background=F59E0B&color=fff',
      loginCount: 15,
      lastLogin: '2025-11-11T06:20:00',
      registeredDate: '2025-09-15T15:10:00',
      orders: []
    }
  ],
  
  projects: [
    {
      id: 'proj-001',
      title: 'E-commerce Website',
      description: 'Full-featured online store with payment gateway, cart, and admin panel',
      price: 50000,
      category: 'E-commerce',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      features: [
        'Product catalog with search and filters',
        'Shopping cart and wishlist',
        'Payment gateway integration',
        'Order management system',
        'Admin dashboard',
        'Responsive design'
      ]
    },
    {
      id: 'proj-002',
      title: 'Business Landing Page',
      description: 'Modern, conversion-optimized landing page for your business',
      price: 15000,
      category: 'Landing Pages',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind'],
      features: [
        'Responsive design',
        'Contact form integration',
        'SEO optimized',
        'Fast loading speed',
        'Modern animations'
      ]
    },
    {
      id: 'proj-003',
      title: 'Restaurant Booking System',
      description: 'Online reservation system for restaurants with table management',
      price: 35000,
      category: 'Web Apps',
      technologies: ['Vue.js', 'Firebase', 'Bootstrap'],
      features: [
        'Table booking system',
        'Menu management',
        'Customer reviews',
        'Admin panel',
        'Email notifications'
      ]
    },
    {
      id: 'proj-004',
      title: 'Portfolio Website',
      description: 'Stunning portfolio website to showcase your work',
      price: 12000,
      category: 'Landing Pages',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      features: [
        'Gallery showcase',
        'About section',
        'Contact form',
        'Blog integration',
        'Fully responsive'
      ]
    },
    {
      id: 'proj-005',
      title: 'Fitness App Dashboard',
      description: 'Complete fitness tracking web application with analytics',
      price: 45000,
      category: 'Web Apps',
      technologies: ['React', 'Chart.js', 'Express', 'PostgreSQL'],
      features: [
        'Workout tracking',
        'Nutrition planner',
        'Progress analytics',
        'Social features',
        'Mobile responsive'
      ]
    },
    {
      id: 'proj-006',
      title: 'Real Estate Portal',
      description: 'Property listing website with advanced search and filters',
      price: 60000,
      category: 'Web Apps',
      technologies: ['Next.js', 'MongoDB', 'Google Maps API'],
      features: [
        'Property listings',
        'Advanced search filters',
        'Map integration',
        'Agent dashboard',
        'Inquiry management'
      ]
    },
    {
      id: 'proj-007',
      title: 'Educational Platform',
      description: 'Online learning management system with course creation',
      price: 70000,
      category: 'Web Apps',
      technologies: ['Django', 'React', 'PostgreSQL', 'AWS'],
      features: [
        'Course management',
        'Student enrollment',
        'Quiz system',
        'Progress tracking',
        'Certificate generation'
      ]
    },
    {
      id: 'proj-008',
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for managing multiple social media accounts',
      price: 40000,
      category: 'Custom Development',
      technologies: ['Angular', 'Node.js', 'Redis', 'Social APIs'],
      features: [
        'Multi-platform integration',
        'Analytics and insights',
        'Post scheduling',
        'Team collaboration',
        'Custom reports'
      ]
    }
  ],
  
  orders: [
    {
      orderId: 'ORD-001',
      userId: 'user-001',
      userName: 'Rahul Verma',
      userEmail: 'rahul.verma@example.com',
      projectName: 'E-commerce Website',
      projectPrice: 50000,
      advancePayment: 12500,
      finalPayment: 37500,
      paymentStatus: 'Advance Paid',
      projectStatus: 'In Progress',
      orderDate: '2025-11-10T15:30:00',
      deliveryDate: null,
      description: 'Custom e-commerce website with payment integration'
    },
    {
      orderId: 'ORD-002',
      userId: 'user-003',
      userName: 'Vikram Singh',
      userEmail: 'vikram.singh@example.com',
      projectName: 'Portfolio Website',
      projectPrice: 12000,
      advancePayment: 3000,
      finalPayment: 9000,
      paymentStatus: 'Fully Paid',
      projectStatus: 'Completed',
      orderDate: '2025-11-05T10:00:00',
      deliveryDate: '2025-11-09T18:00:00',
      description: 'Personal portfolio website'
    }
  ],
  
  maintenanceRequests: [
    {
      requestId: 'MAINT-001',
      userId: 'user-001',
      userName: 'Rahul Verma',
      issueType: 'Bug Fixing & Error Resolution',
      description: 'Login form not working on mobile devices',
      urgency: 'High',
      status: 'In Progress',
      submittedDate: '2025-11-11T08:00:00',
      notes: []
    },
    {
      requestId: 'MAINT-002',
      userId: 'user-003',
      userName: 'Vikram Singh',
      issueType: 'Performance Optimization',
      description: 'Website loading slowly, need optimization',
      urgency: 'Medium',
      status: 'Pending',
      submittedDate: '2025-11-10T14:30:00',
      notes: []
    }
  ],
  
  contactInquiries: [
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 9876543210',
      service: 'E-commerce Solutions',
      message: 'I need an online store for my clothing business',
      date: '2025-11-11T09:00:00'
    },
    {
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91 9876543211',
      service: 'Custom Web Development',
      message: 'Looking for a custom CRM solution',
      date: '2025-11-10T11:30:00'
    }
  ]
};

// Initialize Portfolio Grid
function renderPortfolio(filter = 'all') {
  const grid = document.getElementById('portfolioGrid');
  const projects = filter === 'all' 
    ? DATABASE.projects 
    : DATABASE.projects.filter(p => p.category === filter);
  
  grid.innerHTML = projects.map(project => `
    <div class="project-card" onclick="showProjectDetails('${project.id}')">
      <div class="project-image">
        <i class="fas fa-laptop-code"></i>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
        </div>
        <div class="project-footer">
          <span class="project-price">₹${project.price.toLocaleString()}</span>
          <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); orderProject('${project.id}')">Order Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function showProjectDetails(projectId) {
  const project = DATABASE.projects.find(p => p.id === projectId);
  if (!project) return;
  
  const content = `
    <h2>${project.title}</h2>
    <div style="margin: 2rem 0;">
      <div class="project-image" style="height: 250px; margin-bottom: 2rem;">
        <i class="fas fa-laptop-code"></i>
      </div>
      
      <h3>Description</h3>
      <p style="color: var(--text-gray); margin-bottom: 2rem;">${project.description}</p>
      
      <h3>Features</h3>
      <ul style="margin-bottom: 2rem;">
        ${project.features.map(feature => `<li style="margin-bottom: 0.5rem;">${feature}</li>`).join('')}
      </ul>
      
      <h3>Technologies Used</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
      </div>
      
      <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; background: var(--bg-light); padding: 1.5rem; border-radius: 0.5rem;">
        <div>
          <div style="font-size: 0.875rem; color: var(--text-gray);">Starting from</div>
          <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">₹${project.price.toLocaleString()}</div>
        </div>
        <button class="btn btn-primary btn-large" onclick="orderProject('${project.id}'); closeModal('projectModal');">Order Similar Project</button>
      </div>
    </div>
  `;
  
  document.getElementById('projectDetails').innerHTML = content;
  openModal('projectModal');
}

function orderProject(projectId) {
  const project = DATABASE.projects.find(p => p.id === projectId);
  if (!project) return;
  
  ORDERS.showOrderModal(project);
}

// Portfolio Filters
function setupPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolio(btn.dataset.filter);
    });
  });
}

// Navigation
function setupNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navMenu.classList.remove('active');
    });
  });
  
  // Sticky navbar
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Forms
function setupForms() {
  // Maintenance Form
  const maintenanceForm = document.getElementById('maintenanceForm');
  maintenanceForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!AUTH.currentUser) {
      showToast('Please login to submit a maintenance request', 'error');
      document.getElementById('loginBtn').click();
      return;
    }
    
    const request = {
      requestId: 'MAINT-' + Date.now(),
      userId: AUTH.currentUser.userId,
      userName: AUTH.currentUser.name,
      issueType: document.getElementById('issueType').value,
      description: document.getElementById('issueDescription').value,
      urgency: document.getElementById('urgency').value,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
      notes: []
    };
    
    DATABASE.maintenanceRequests.push(request);
    maintenanceForm.reset();
    showToast('Maintenance request submitted successfully!', 'success');
  });
  
  // Contact Form
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inquiry = {
      name: document.getElementById('contactName').value,
      email: document.getElementById('contactEmail').value,
      phone: document.getElementById('contactPhone').value,
      service: document.getElementById('serviceInterest').value,
      message: document.getElementById('contactMessage').value,
      date: new Date().toISOString()
    };
    
    DATABASE.contactInquiries.push(inquiry);
    contactForm.reset();
    showToast('Thank you for contacting us! We\'ll get back to you soon.', 'success');
  });
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Toast Notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Privacy Policy & Terms
function showPrivacyPolicy() {
  const content = `
    <h2>Privacy Policy</h2>
    <div style="max-height: 60vh; overflow-y: auto;">
      <h3>1. Information Collection</h3>
      <p>We collect information you provide directly to us, including name, email, and project requirements.</p>
      
      <h3>2. Use of Information</h3>
      <p>We use the information to provide, maintain, and improve our services, and to communicate with you.</p>
      
      <h3>3. Data Security</h3>
      <p>We implement security measures to protect your personal information from unauthorized access.</p>
      
      <h3>4. Cookies</h3>
      <p>We use cookies to enhance your browsing experience and analyze site traffic.</p>
      
      <h3>5. Third-Party Services</h3>
      <p>We may use third-party services for payment processing and analytics.</p>
      
      <h3>6. Contact Us</h3>
      <p>For privacy concerns, contact us at 202krishnapatil@gmail.com</p>
    </div>
    <button class="btn btn-primary" onclick="closeModal('projectModal')">Close</button>
  `;
  
  document.getElementById('projectDetails').innerHTML = content;
  openModal('projectModal');
}

function showTerms() {
  const content = `
    <h2>Terms of Service</h2>
    <div style="max-height: 60vh; overflow-y: auto;">
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing our website, you agree to these terms of service.</p>
      
      <h3>2. Services</h3>
      <p>We provide web development services as described on our website.</p>
      
      <h3>3. Payment Terms</h3>
      <p>25% advance payment is required to start a project. The remaining 75% is due upon project completion.</p>
      
      <h3>4. Project Timeline</h3>
      <p>Project timelines are estimates and may vary based on project complexity and client feedback.</p>
      
      <h3>5. Refund Policy</h3>
      <p>Refunds are available within 7 days if the project has not started.</p>
      
      <h3>6. Intellectual Property</h3>
      <p>Upon full payment, you own all rights to the delivered work.</p>
      
      <h3>7. Limitation of Liability</h3>
      <p>We are not liable for any indirect or consequential damages.</p>
    </div>
    <button class="btn btn-primary" onclick="closeModal('projectModal')">Close</button>
  `;
  
  document.getElementById('projectDetails').innerHTML = content;
  openModal('projectModal');
}

// Cookie Consent
// Using in-memory storage instead of sessionStorage
let cookieConsentGiven = false;

function setupCookieConsent() {
  const consent = document.getElementById('cookieConsent');
  
  if (!cookieConsentGiven) {
    setTimeout(() => {
      consent.classList.add('show');
    }, 2000);
  }
}

function acceptCookies() {
  cookieConsentGiven = true;
  document.getElementById('cookieConsent').classList.remove('show');
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  setupPortfolioFilters();
  setupNavigation();
  setupForms();
  setupCookieConsent();
  
  // Close modals on background click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
});

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);