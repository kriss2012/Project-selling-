// Main Application & Frontend Logic

// 1. Static Project Database with REAL IMAGES
const DATABASE = {
  projects: [
    {
      id: 'proj-001',
      title: 'E-commerce Superstore',
      description: 'A blazing fast online store with Stripe payments, admin panel, and inventory management.',
      price: 50000,
      category: 'E-commerce',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRtrfXvmM3ck1zdt7QGgsOYL_rup5hYq_0fw&s', 
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      features: ['Product catalog', 'Shopping cart', 'Payment gateway', 'Order management']
    },
    {
      id: 'proj-002',
      title: 'Corporate Landing Page',
      description: 'Conversion-focused landing page designed to turn visitors into leads.',
      price: 15000,
      category: 'Landing Pages',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind'],
      features: ['Responsive design', 'Contact form', 'SEO optimized']
    },
    {
      id: 'proj-003',
      title: 'Restaurant Booking App',
      description: 'Elegant table reservation system with digital menu and customer reviews.',
      price: 35000,
      category: 'Web Apps',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
      technologies: ['Vue.js', 'Firebase', 'Bootstrap'],
      features: ['Table booking', 'Menu management', 'Customer reviews']
    },
    {
      id: 'proj-004',
      title: 'Creative Portfolio',
      description: 'Minimalist portfolio to showcase your photography or design work.',
      price: 12000,
      category: 'Landing Pages',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      features: ['Gallery showcase', 'About section', 'Contact form']
    },
    {
      id: 'proj-005',
      title: 'Fitness Tracker Dashboard',
      description: 'SaaS dashboard for tracking workouts, nutrition, and personal records.',
      price: 45000,
      category: 'Web Apps',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
      technologies: ['React', 'Chart.js', 'Express'],
      features: ['Workout tracking', 'Nutrition planner', 'Analytics']
    },
    {
      id: 'proj-006',
      title: 'Real Estate Platform',
      description: 'Property listing engine with map integration and agent profiles.',
      price: 60000,
      category: 'Web Apps',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600',
      technologies: ['Next.js', 'MongoDB', 'Google Maps'],
      features: ['Property listings', 'Advanced search', 'Agent dashboard']
    }
  ]
};

// 2. Portfolio Logic
function renderPortfolio(filter = 'all') {
  const grid = document.getElementById('portfolioGrid');
  if(!grid) return;

  const projects = filter === 'all' 
    ? DATABASE.projects 
    : DATABASE.projects.filter(p => p.category === filter);
  
  grid.innerHTML = projects.map(project => `
    <div class="project-card" onclick="showProjectDetails('${project.id}')">
      <div class="project-image-container">
        <img src="${project.image}" alt="${project.title}" class="project-img-real" loading="lazy">
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p style="color: #9ca3af; margin-bottom: 1rem;">${project.description}</p>
        <div class="project-tags">
            ${project.technologies.map(t => `<span class="tag" style="display:inline-block; font-size:0.75rem; padding:4px 12px; margin-right:5px; margin-bottom:5px; border-radius:20px; background:rgba(255,255,255,0.05); color:#9ca3af; border:1px solid rgba(255,255,255,0.05);">${t}</span>`).join('')}
        </div>
        <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.05);">
          <span style="font-size:1.5rem; font-weight:700; color:#6366f1;">₹${project.price.toLocaleString()}</span>
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
      <img src="${project.image}" style="width:100%; height: 300px; object-fit:cover; border-radius:16px; margin-bottom: 2rem;">
      <p style="color: #94a3b8; font-size: 1.1rem; line-height: 1.8;">${project.description}</p>
      
      <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Key Features</h3>
      <ul style="margin-left: 1.2rem; color: #cbd5e1; margin-bottom: 2rem;">${project.features.map(f => `<li style="margin-bottom:0.5rem">${f}</li>`).join('')}</ul>
      
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.1);">
        <div>
          <small style="color: #94a3b8;">Investment</small>
          <div style="font-size: 2rem; font-weight: 800; color: #6366f1;">₹${project.price.toLocaleString()}</div>
        </div>
        <button class="btn btn-primary btn-large" onclick="orderProject('${project.id}'); closeModal('projectModal');">Start Project</button>
      </div>
    </div>
  `;
  document.getElementById('projectDetails').innerHTML = content;
  openModal('projectModal');
}

function orderProject(projectId) {
  const project = DATABASE.projects.find(p => p.id === projectId);
  if (project) ORDERS.showOrderModal(project);
}

// 3. Navigation & Auth State Logic
function setupNavigation() {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if(hamburger) hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
    });

    // --- AUTHENTICATION STATE HANDLING ---
    if (typeof CURRENT_USER !== 'undefined' && CURRENT_USER) {
        // User is Logged In
        const userProfile = document.getElementById('userProfile');
        const loginBtn = document.getElementById('loginBtn');
        const userAvatar = document.getElementById('userAvatar');
        
        // Hide Login Button
        if(loginBtn) loginBtn.classList.add('hidden');
        
        // Show Dashboard/Profile Group
        if(userProfile) userProfile.classList.remove('hidden');
        
        // Set Avatar Image
        if(userAvatar && CURRENT_USER.picture) userAvatar.src = CURRENT_USER.picture;
    } else {
        // User is Guest
        const loginBtn = document.getElementById('loginBtn');
        if(loginBtn) {
            loginBtn.classList.remove('hidden');
            loginBtn.addEventListener('click', () => window.location.href = "/login");
        }
        
        // Hide Dashboard Group just in case
        const userProfile = document.getElementById('userProfile');
        if(userProfile) userProfile.classList.add('hidden');
    }
}

// 4. Contact Form Handling
function setupForms() {
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = "Sending...";
            btn.disabled = true;

            fetch('/api/contact', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: document.getElementById('contactName').value,
                    email: document.getElementById('contactEmail').value,
                    phone: document.getElementById('contactPhone').value,
                    service: document.getElementById('serviceInterest').value,
                    message: document.getElementById('contactMessage').value
                })
            })
            .then(res => res.json())
            .then(data => {
                showToast("Message sent successfully!", "success");
                contactForm.reset();
            })
            .catch(err => showToast("Error sending message.", "error"))
            .finally(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            });
        });
    }
}

// 5. DASHBOARD & MAINTENANCE LOGIC

// Toggle Dashboard View (Open/Close)
function toggleDashboard() {
    if (!AUTH.currentUser) {
        window.location.href = "/login";
        return;
    }
    const dash = document.getElementById('clientDashboard');
    const isActive = dash.classList.contains('active');
    
    if (isActive) {
        dash.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scroll
    } else {
        dash.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scroll
        loadDashboardData(); // Load data from API
    }
}

// Switch Tabs inside Dashboard (Overview, Orders, Maintenance)
function switchDashTab(tabId) {
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    
    // Update active sidebar link
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Maintenance Cost Calculator & Submit
function setupMaintenanceForm() {
    const form = document.getElementById('enhancedMaintForm');
    if (!form) return;

    const checkboxes = document.querySelectorAll('.addon-check');
    const issueSelect = document.getElementById('maintIssueType');
    const estCostDisplay = document.getElementById('estCost');

    // Calculate Function
    function calculateCost() {
        let cost = 0;
        const issue = issueSelect.value;
        
        // Base costs
        if (issue === 'New Feature') cost += 5000;
        if (issue === 'Content Update') cost += 1000;
        // Bug Fix is 0 (Free)
        
        // Add-ons
        checkboxes.forEach(cb => {
            if (cb.checked) cost += parseInt(cb.value);
        });

        estCostDisplay.textContent = '₹' + cost.toLocaleString();
    }

    // Event Listeners for Calculation
    checkboxes.forEach(cb => cb.addEventListener('change', calculateCost));
    issueSelect.addEventListener('change', calculateCost);

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const description = document.getElementById('maintDesc').value;
        const issue = issueSelect.value;
        
        // Collect checked add-ons text
        let addons = [];
        checkboxes.forEach(cb => {
            if(cb.checked) addons.push(cb.parentElement.textContent.trim());
        });
        
        // Get the calculated cost as a number
        const costValue = parseInt(estCostDisplay.textContent.replace(/[^0-9]/g, '')) || 0;

        fetch('/api/maintenance', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                issueType: issue,
                description: description,
                addons: addons.join(', '),
                cost: costValue
            })
        }).then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                showToast("Request Submitted! Check your email.", "success");
                form.reset();
                calculateCost(); // Reset cost to 0
            } else {
                showToast("Error: " + (data.error || "Unknown error"), "error");
            }
        }).catch(err => showToast("Server error. Try again later.", "error"));
    });
}

// Load Real Data into Dashboard (Orders, Total Spent)
function loadDashboardData() {
    // Set User Name
    document.getElementById('dashUserName').textContent = AUTH.currentUser.name;
    
    // Fetch Orders from API
    fetch('/api/my_orders')
    .then(res => res.json())
    .then(orders => {
        const tbody = document.getElementById('dashOrdersTable');
        const activeCount = document.getElementById('activeProjectsCount');
        const totalSpent = document.getElementById('totalSpentVal');
        
        // Calculate Stats
        let spent = 0;
        orders.forEach(o => spent += o.amount);
        
        activeCount.textContent = orders.length;
        totalSpent.textContent = '₹' + spent.toLocaleString();

        // Render Table
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="padding:20px; text-align:center; color: #9ca3af;">No orders found.</td></tr>';
        } else {
            tbody.innerHTML = orders.map(o => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 15px;">${o.date}</td>
                    <td style="padding: 15px; color: #fff;">${o.project_name}</td>
                    <td style="padding: 15px;">₹${o.amount.toLocaleString()}</td>
                    <td style="padding: 15px;"><span style="color: #4ade80; background: rgba(74, 222, 128, 0.1); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${o.status}</span></td>
                </tr>
            `).join('');
        }
    });
}

// 6. Helpers (Modals, Toasts, Cookies)
function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }
function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({behavior: 'smooth'}); }

function showToast(msg, type='info') {
    const toast = document.getElementById('toast');
    if(toast) {
        toast.textContent = msg;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function setupCookieConsent() {
    const consent = document.getElementById('cookieConsent');
    if(consent && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => consent.classList.add('show'), 2000);
    }
}
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    document.getElementById('cookieConsent')?.classList.remove('show');
}
function showPrivacyPolicy() { alert("Privacy Policy: Your data is secure."); }
function showTerms() { alert("Terms: Standard service terms apply."); }

// Initialize Everything on Load
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolio();
    setupNavigation();
    setupForms();
    setupMaintenanceForm(); // Activates the calculator
    setupCookieConsent();
    
    // Global Modal Close Logic
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', (e) => { if(e.target === m) m.classList.remove('active'); });
    });
});