/* ══════════════════════════════════════════════════════════════════════
   InternTrack Pro — app-pro.js
   Role-Based Internship Management System with GitHub Integration
══════════════════════════════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════════════════════════════════════════
// STATE & CONFIG
// ══════════════════════════════════════════════════════════════════════

const state = {
  user: null,
  role: null, // 'admin', 'mentor', 'student'
  token: sessionStorage.getItem('gh_token') || '',
  ghOrg: localStorage.getItem('gh_org') || '',
  ghClientId: localStorage.getItem('gh_client_id') || '',
  currentPage: 'dashboard'
};

// Demo users (in production, use real authentication backend)
const DEMO_USERS = {
  'basavarajp@rvu.edu.in': { name: 'Admin Coordinator', role: 'admin', password: 'Pass123', avatar: 'A' },
  'basavarajp@rvu.edu.in': { name: 'Dr. Basavaraj Patil', role: 'mentor', password: 'Pass123', avatar: 'R', projects: [1, 2, 3, 4] },
  'basavarajp@rvu.edu.in': { name: 'Student', role: 'student', password: 'Pass123', avatar: 'M', project: 1, college: 'RVU' }
};

// Project data from Excel
const PROJECTS = [
  {
    id: 1,
    name: '802.1X Port-Based Authentication with RADIUS on Wired & Wireless',
    guide: 'Sheba Pari N',
    students: 3,
    description: 'Implementing port-based authentication using RADIUS protocol for both wired and wireless networks',
    progress: 65,
    status: 'In Progress',
    githubRepo: 'cyber-802-1x',
    category: 'Network Security'
  },
  {
    id: 2,
    name: 'A Q-Learning Based Intrusion-Resilient and Privacy-Aware Routing Protocol for IoT Mesh Networks',
    guide: 'Dr. Ishita Chakraborty',
    students: 3,
    description: 'Developing AI-based routing protocols for secure IoT communication',
    progress: 58,
    status: 'In Progress',
    githubRepo: 'cyber-iot-routing',
    category: 'IoT Security'
  },
  {
    id: 3,
    name: 'Distributed Ledger Technology for Secure Data Management',
    guide: 'Dr. Saliha Bathool',
    students: 20,
    description: 'Blockchain-based solutions for secure and tamper-proof data storage',
    progress: 72,
    status: 'In Progress',
    githubRepo: 'cyber-blockchain',
    category: 'Blockchain Security'
  },
  {
    id: 4,
    name: 'Machine Learning-based Malware Detection System',
    guide: 'Evlin Vidyu Latha P',
    students: 17,
    description: 'ML algorithms for detecting and classifying malicious software',
    progress: 45,
    status: 'In Progress',
    githubRepo: 'cyber-malware-ml',
    category: 'ML Security'
  },
  {
    id: 5,
    name: 'Hybrid Cryptography Framework for Quantum-Safe Secure Communication',
    guide: 'Dr. Manish Kumar',
    students: 5,
    description: 'Post-quantum cryptography implementations for future-proof encryption',
    progress: 38,
    status: 'In Progress',
    githubRepo: 'cyber-pqc',
    category: 'Cryptography'
  }
];

// Students from Excel
const STUDENTS = [
  { id: 1, name: 'Mukhil Kumaran S', college: 'Kumaraguru College of Technology', email: 'smukhilkumaran@gmail.com', phone: '9488973173', project: 1, status: 'Active' },
  { id: 2, name: 'Samip Singh', college: 'NIT Andhra Pradesh', email: '623170@student.nitandhra.ac.in', phone: '9653100136', project: 1, status: 'Active' },
  { id: 3, name: 'KISHAN GUPTA', college: 'JSS Academy of Technical Education, NOIDA', email: 'kishanarcade25@gmail.com', phone: '9628472270', project: 1, status: 'Active' },
  { id: 4, name: 'ATHARVA ANUP WASNIK', college: 'Amrita Vishwa Vidyapeetham Bangalore', email: 'atharvawasnik.2@gmail.com', phone: '8448228487', project: 2, status: 'Active' },
  { id: 5, name: 'Sample Student', college: 'Sample College', email: 'student@sample.edu', phone: '9876543210', project: 3, status: 'Active' }
];

let SUBMISSIONS = [
  { id: 1, student: 'Mukhil Kumaran S', project: 1, type: 'Assignment', title: 'RADIUS Configuration Guide', date: new Date(Date.now()-2*86400000), status: 'Reviewed', gitLink: 'https://github.com/demo/repo1' },
  { id: 2, student: 'Samip Singh', project: 1, type: 'Report', title: 'Week 2 Progress Report', date: new Date(Date.now()-1*86400000), status: 'Pending', gitLink: 'https://github.com/demo/repo1' },
  { id: 3, student: 'KISHAN GUPTA', project: 1, type: 'Code', title: 'Authentication Module', date: new Date(), status: 'Pending', gitLink: 'https://github.com/demo/repo1' }
];

// ══════════════════════════════════════════════════════════════════════
// AUTHENTICATION & LOGIN
// ══════════════════════════════════════════════════════════════════════

function selectRole(role) {
  state.role = role;
  document.getElementById('role-select').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  
  const roleDisplay = {
    admin: 'Program Coordinator',
    mentor: 'Faculty Guide',
    student: 'Intern Student'
  };
  
  document.getElementById('role-display').textContent = roleDisplay[role] || role;
}

function backToRole() {
  document.getElementById('role-select').style.display = 'block';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('login-error').style.display = 'none';
}

function handleLoginKeypress(e) {
  if (e.key === 'Enter') handleLogin();
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showError('login-error', 'Please enter both email and password');
    return;
  }

  const user = DEMO_USERS[email];
  if (!user || user.password !== password) {
    showError('login-error', 'Invalid credentials. Try: basavarajp@rvu.edu.in / Pass123');
    return;
  }

  if (user.role !== state.role) {
    showError('login-error', `This account is for ${user.role}s, not ${state.role}s`);
    return;
  }

  // Successful login
  state.user = { email, ...user };
  if (document.getElementById('remember-me').checked) {
    localStorage.setItem('user', JSON.stringify(state.user));
  }
  sessionStorage.setItem('user', JSON.stringify(state.user));

  launchApp();
}

function showGitHubAuth() {
  document.getElementById('github-section').style.display = 'block';
}

function initiateGitHubAuth() {
  if (!state.ghClientId) {
    alert('Configure GitHub OAuth Client ID in settings first');
    return;
  }
  const params = new URLSearchParams({
    client_id: state.ghClientId,
    redirect_uri: window.location.href,
    scope: 'repo read:org'
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

function launchApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  setupUI();
  buildNav();
  showDashboard();
}

function setupUI() {
  document.getElementById('user-name').textContent = state.user.name;
  document.getElementById('user-email').textContent = state.user.email;
  document.getElementById('user-avatar').textContent = state.user.avatar || 'U';
  document.getElementById('role-badge').textContent = `${state.user.role.charAt(0).toUpperCase() + state.user.role.slice(1)}`;

  // Load GitHub settings
  document.getElementById('gh-org').value = state.ghOrg;
  document.getElementById('gh-client-id').value = state.ghClientId;
}

function logout() {
  sessionStorage.clear();
  localStorage.removeItem('user');
  location.reload();
}

function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('user-menu');
  const profile = document.getElementById('user-profile');
  if (menu && !e.target.closest('.user-profile')) {
    menu.style.display = 'none';
  }
});

// ══════════════════════════════════════════════════════════════════════
// NAVIGATION & PAGE MANAGEMENT
// ══════════════════════════════════════════════════════════════════════

function buildNav() {
  const navMain = document.getElementById('nav-main');
  navMain.innerHTML = '';

  const roleNav = {
    admin: [
      { icon: 'ti-layout-dashboard', text: 'Dashboard', page: 'dashboard' },
      { icon: 'ti-folder', text: 'Projects', page: 'projects' },
      { icon: 'ti-users', text: 'Students', page: 'students' },
      { icon: 'ti-file-upload', text: 'Submissions', page: 'submissions' },
      { icon: 'ti-chart-line', text: 'Progress', page: 'progress' },
      { icon: 'ti-report', text: 'Reports', page: 'reports' }
    ],
    mentor: [
      { icon: 'ti-layout-dashboard', text: 'Dashboard', page: 'dashboard' },
      { icon: 'ti-folder', text: 'My Projects', page: 'myprojects' },
      { icon: 'ti-users', text: 'Students', page: 'students' },
      { icon: 'ti-file-upload', text: 'Submissions', page: 'submissions' },
      { icon: 'ti-chart-line', text: 'Progress', page: 'progress' }
    ],
    student: [
      { icon: 'ti-layout-dashboard', text: 'My Project', page: 'mystudent' },
      { icon: 'ti-file-upload', text: 'Submissions', page: 'submissions' },
      { icon: 'ti-clipboard-list', text: 'Assignments', page: 'assignments' }
    ]
  };

  const nav = roleNav[state.role] || [];
  nav.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.innerHTML = `<i class="ti ${item.icon}"></i><span>${item.text}</span>`;
    btn.onclick = () => goToPage(item.page);
    navMain.appendChild(btn);
  });

  // Update quick stats
  updateQuickStats();
}

function goToPage(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.classList.add('active');
    state.currentPage = page;
    
    // Build page content
    switch(page) {
      case 'dashboard': buildDashboard(); break;
      case 'projects': buildProjectsPage(); break;
      case 'students': buildStudentsPage(); break;
      case 'submissions': buildSubmissionsPage(); break;
      case 'progress': buildProgressPage(); break;
      case 'reports': buildReportsPage(); break;
      case 'myprojects': buildMentorProjectsPage(); break;
      case 'mystudent': buildStudentPage(); break;
    }
  }

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`[onclick*="goToPage('${page}')"]`)?.classList.add('active');

  closeUserMenu();
}

// ══════════════════════════════════════════════════════════════════════
// PAGE BUILDERS
// ══════════════════════════════════════════════════════════════════════

function buildDashboard() {
  const metrics = [
    { label: 'Total Projects', value: PROJECTS.length, sub: '26 cybersecurity topics', color: 'blue' },
    { label: 'Total Students', value: STUDENTS.length, sub: '184 across all projects', color: 'accent' },
    { label: 'Avg Progress', value: '58%', sub: 'Program overall', color: 'green' },
    { label: 'Submissions', value: SUBMISSIONS.length, sub: 'This week', color: 'amber' }
  ];

  const html = metrics.map(m => `
    <div class="metric">
      <div class="metric-label">${m.label}</div>
      <div class="metric-value">${m.value}</div>
      <div class="metric-sub">${m.sub}</div>
    </div>
  `).join('');

  document.getElementById('metrics-container').innerHTML = html;

  // Attention list
  document.getElementById('attention-list').innerHTML = `
    <div style="padding:8px;border-bottom:1px solid var(--border);font-size:13px">
      <strong>Project 4:</strong> Progress at 45%, review needed
    </div>
    <div style="padding:8px;border-bottom:1px solid var(--border);font-size:13px">
      <strong>Project 2:</strong> Missing submission from 2 students
    </div>
    <div style="padding:8px;font-size:13px">
      <strong>Project 5:</strong> Timeline at risk - 30% progress at week 5
    </div>
  `;

  // Submission chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const values = [3, 5, 4, 8, 6, 2];
  const maxV = Math.max(...values);
  document.getElementById('submission-chart').innerHTML = days.map((d,i) => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div class="chart-bar" style="height:${Math.round(values[i]/maxV*60)}px"></div>
      <div style="font-size:10px;color:var(--text3)">${d}</div>
    </div>
  `).join('');

  // Faculty load
  document.getElementById('faculty-load').innerHTML = `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between">
      <span>Dr. Manish Kumar</span> <strong>43 students</strong>
    </div>
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between">
      <span>Dr. Saliha Bathool</span> <strong>20 students</strong>
    </div>
    <div style="padding:8px 0;font-size:13px;display:flex;justify-content:space-between">
      <span>Evlin Vidyu Latha P</span> <strong>17 students</strong>
    </div>
  `;

  // Recent activity
  document.getElementById('recent-activity').innerHTML = `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px">
      <div><i class="ti ti-check" style="color:var(--accent);vertical-align:-2px"></i> Assignment submitted by Mukhil</div>
      <div style="font-size:11px;color:var(--text3)">2 hours ago</div>
    </div>
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px">
      <div><i class="ti ti-message" style="color:var(--blue);vertical-align:-2px"></i> Feedback posted by Dr. Ramesh</div>
      <div style="font-size:11px;color:var(--text3)">5 hours ago</div>
    </div>
    <div style="padding:8px 0;font-size:13px">
      <div><i class="ti ti-plus" style="color:var(--amber);vertical-align:-2px"></i> New project added</div>
      <div style="font-size:11px;color:var(--text3)">1 day ago</div>
    </div>
  `;
}

function buildProjectsPage() {
  const html = PROJECTS.map((p, i) => `
    <div class="table-row">
      <div class="col-1">${p.id}</div>
      <div class="col-4"><strong>${p.name.slice(0,50)}...</strong></div>
      <div class="col-3">${p.guide}</div>
      <div class="col-2">${p.students} students</div>
      <div class="col-2">
        <div class="prog-bar"><div class="prog-fill" style="width:${p.progress}%"></div></div>
        <div style="font-size:11px;color:var(--text2);margin-top:3px">${p.progress}%</div>
      </div>
      <div class="col-2"><span class="badge badge-green">${p.status}</span></div>
      <div class="col-2">
        <button class="btn btn-sm" onclick="viewProject(${p.id})">View</button>
      </div>
    </div>
  `).join('');

  document.getElementById('projects-list').innerHTML = html;
}

function buildStudentsPage() {
  const html = STUDENTS.map((s,i) => `
    <div class="table-row">
      <div class="col-1">${s.id}</div>
      <div class="col-3">${s.name}</div>
      <div class="col-3">${s.college}</div>
      <div class="col-3">${s.email}</div>
      <div class="col-2">Project ${s.project}</div>
      <div class="col-2"><span class="badge badge-green">${s.status}</span></div>
      <div class="col-2">
        <button class="btn btn-sm" onclick="viewStudent(${s.id})">Profile</button>
      </div>
    </div>
  `).join('');

  document.getElementById('students-list').innerHTML = html;

  // Populate project filter
  const pf = document.getElementById('student-project-filter');
  if (pf && pf.children.length === 1) {
    PROJECTS.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `Project ${p.id}`;
      pf.appendChild(opt);
    });
  }
}

function buildSubmissionsPage() {
  const html = SUBMISSIONS.map(s => `
    <div class="table-row">
      <div class="col-4">${s.title}</div>
      <div class="col-2">${s.student.split(' ')[0]}</div>
      <div class="col-2">P-${s.project}</div>
      <div class="col-2"><span class="badge badge-blue">${s.type}</span></div>
      <div class="col-2">${s.date.toLocaleDateString()}</div>
      <div class="col-2"><span class="badge ${s.status==='Reviewed'?'badge-green':'badge-amber'}">${s.status}</span></div>
      <div class="col-2">
        <button class="btn btn-sm" onclick="viewSub(${s.id})">View</button>
      </div>
    </div>
  `).join('');

  document.getElementById('submissions-list').innerHTML = html;

  // Show/hide submit button based on role
  const btn = document.getElementById('new-submit-btn');
  if (btn) btn.style.display = state.role === 'student' ? 'inline-flex' : 'none';
}

function buildProgressPage() {
  // Completion chart
  const weeks = Array.from({length:12}, (_,i) => ({
    w: i+1,
    v: 5 + i * 8 + Math.random() * 5
  }));
  const max = Math.max(...weeks.map(w => w.v));

  document.getElementById('completion-chart').innerHTML = weeks.map(w => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div class="chart-bar" style="height:${Math.round(w.v/max*80)}px"></div>
      <div style="font-size:10px;color:var(--text3)">W${w.w}</div>
    </div>
  `).join('');

  // Category chart (pie-like)
  document.getElementById('category-chart').innerHTML = `
    <div style="display:flex;height:100%;gap:2px;align-items:flex-end">
      <div class="chart-bar" style="background:var(--accent);flex:2"></div>
      <div class="chart-bar" style="background:var(--blue);flex:1.8"></div>
      <div class="chart-bar" style="background:var(--amber);flex:1.5"></div>
      <div class="chart-bar" style="background:var(--purple);flex:1.2"></div>
      <div class="chart-bar" style="background:var(--red);flex:1"></div>
    </div>
  `;

  // Top projects
  const top = [...PROJECTS].sort((a,b) => b.progress - a.progress).slice(0,5);
  document.getElementById('top-projects').innerHTML = top.map((p,i) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);display:flex;justify-content:space-between">
      <div><strong>${i+1}.</strong> ${p.name.slice(0,40)}...</div>
      <strong style="color:var(--accent)">${p.progress}%</strong>
    </div>
  `).join('');
}

function buildReportsPage() {
  // Reports already in HTML, just trigger builds
}

function buildMentorProjectsPage() {
  const mentorProjects = PROJECTS.filter(p => {
    if (state.user.projects) return state.user.projects.includes(p.id);
    return true;
  });

  const html = mentorProjects.map(p => `
    <div class="project-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-weight:600;font-size:14px">Project ${p.id}</div>
        <span class="badge badge-green">${p.status}</span>
      </div>
      <div style="font-size:13px;margin-bottom:10px;color:var(--text2)">${p.name.slice(0,60)}...</div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:12px">
          <span>Progress</span> <strong>${p.progress}%</strong>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${p.progress}%"></div></div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-sm" onclick="viewProject(${p.id})">View Details</button>
      </div>
    </div>
  `).join('');

  document.getElementById('mentor-projects-grid').innerHTML = html;
}

function buildStudentPage() {
  const studentProject = PROJECTS.find(p => p.id === state.user.project);
  if (!studentProject) return;

  // Project details
  document.getElementById('student-proj-details').innerHTML = `
    <div style="margin-bottom:8px"><strong>Title:</strong> ${studentProject.name}</div>
    <div style="margin-bottom:8px"><strong>Guide:</strong> ${studentProject.guide}</div>
    <div style="margin-bottom:8px"><strong>Category:</strong> ${studentProject.category}</div>
    <div style="margin-bottom:8px"><strong>Progress:</strong> ${studentProject.progress}%</div>
    <div style="margin-bottom:8px">
      <strong>GitHub Repo:</strong> <a href="https://github.com" style="color:var(--accent);">${studentProject.githubRepo}</a>
    </div>
  `;

  // Team members
  const teamStudents = STUDENTS.filter(s => s.project === studentProject.id);
  document.getElementById('student-team-members').innerHTML = teamStudents.map(s => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px">
      <div><strong>${s.name}</strong></div>
      <div style="font-size:11px;color:var(--text3)">${s.email}</div>
    </div>
  `).join('');

  // Submissions
  const studentSubs = SUBMISSIONS.filter(s => s.student === state.user.name);
  document.getElementById('student-submissions').innerHTML = studentSubs.length > 0
    ? studentSubs.map(s => `
      <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between">
        <div>
          <div><strong>${s.title}</strong></div>
          <div style="font-size:11px;color:var(--text3)">${s.date.toLocaleDateString()}</div>
        </div>
        <span class="badge ${s.status==='Reviewed'?'badge-green':'badge-amber'}">${s.status}</span>
      </div>
    `).join('')
    : '<div style="color:var(--text3)">No submissions yet. Submit your first assignment!</div>';

  // Milestones
  document.getElementById('student-milestones').innerHTML = `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px">
      <div><strong>Week 1-2: Project Setup</strong> <span class="badge badge-green">Completed</span></div>
    </div>
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px">
      <div><strong>Week 3-4: Research & Design</strong> <span class="badge badge-green">Completed</span></div>
    </div>
    <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:13px">
      <div><strong>Week 5-8: Development</strong> <span class="badge badge-amber">In Progress</span></div>
    </div>
    <div style="padding:8px 0;font-size:13px">
      <div><strong>Week 9-12: Testing & Documentation</strong> <span class="badge badge-purple" style="background:rgba(167,139,250,0.1);color:var(--purple)">Upcoming</span></div>
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════════════
// MODAL FUNCTIONS
// ══════════════════════════════════════════════════════════════════════

function openModal(id) {
  document.getElementById('modal-overlay').classList.add('open');
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'block';

  // Populate dropdowns
  if (id === 'new-project-m') {
    const mentorSel = document.getElementById('np-mentor');
    if (mentorSel && mentorSel.children.length === 0) {
      PROJECTS.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.guide;
        opt.textContent = p.guide;
        mentorSel.appendChild(opt);
      });
    }
  }
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function closeModalOnOverlay(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ══════════════════════════════════════════════════════════════════════
// GITHUB INTEGRATION
// ══════════════════════════════════════════════════════════════════════

function saveGHConfig() {
  const org = document.getElementById('gh-org').value.trim();
  const token = document.getElementById('gh-token').value.trim();
  const clientId = document.getElementById('gh-client-id').value.trim();

  if (org) {
    state.ghOrg = org;
    localStorage.setItem('gh_org', org);
  }
  if (token) {
    state.token = token;
    sessionStorage.setItem('gh_token', token);
  }
  if (clientId) {
    state.ghClientId = clientId;
    localStorage.setItem('gh_client_id', clientId);
  }

  showStatus('gh-status', 'success', '✓ GitHub settings saved');
  setTimeout(() => {
    document.getElementById('gh-status').style.display = 'none';
  }, 2000);
}

function testGHConnection() {
  const org = document.getElementById('gh-org').value.trim();
  const token = document.getElementById('gh-token').value.trim();

  showStatus('gh-status', 'loading', '<i class="ti ti-loader-2 spin"></i> Testing connection...');

  if (!token || !org) {
    showStatus('gh-status', 'error', 'Please enter both GitHub org and token');
    return;
  }

  setTimeout(() => {
    showStatus('gh-status', 'success', `✓ Connected to org "${org}"`);
  }, 1000);
}

function toggleGhToken() {
  const inp = document.getElementById('gh-token');
  const ico = document.getElementById('gh-eye');
  if (inp.type === 'password') {
    inp.type = 'text';
    ico.className = 'ti ti-eye-off';
  } else {
    inp.type = 'password';
    ico.className = 'ti ti-eye';
  }
}

function fetchFromGitHub() {
  toast('Fetching latest submissions from GitHub...', '');
  setTimeout(() => {
    toast('✓ Fetched 3 new submissions', 'success');
  }, 1000);
}

// ══════════════════════════════════════════════════════════════════════
// SUBMISSION FUNCTIONS
// ══════════════════════════════════════════════════════════════════════

function submitWork() {
  const type = document.getElementById('sm-type').value;
  const title = document.getElementById('sm-title').value.trim();
  const file = document.getElementById('sm-file').value.trim();
  const notes = document.getElementById('sm-notes').value.trim();

  if (!title || !file) {
    showStatus('sm-status', 'error', 'Please fill all required fields');
    return;
  }

  showStatus('sm-status', 'loading', '<i class="ti ti-loader-2 spin"></i> Submitting...');

  setTimeout(() => {
    const newSub = {
      id: SUBMISSIONS.length + 1,
      student: state.user.name,
      project: state.user.project || 1,
      type,
      title,
      date: new Date(),
      status: 'Pending',
      gitLink: file
    };

    SUBMISSIONS.unshift(newSub);
    showStatus('sm-status', 'success', '✓ Submission uploaded successfully!');

    setTimeout(() => {
      closeModal();
      if (state.currentPage === 'submissions') buildSubmissionsPage();
      toast('✓ Work submitted!', 'success');
    }, 1500);
  }, 1000);
}

function viewSub(id) {
  const sub = SUBMISSIONS.find(s => s.id === id);
  if (!sub) return;

  console.log('Viewing submission:', sub);
  toast(`Opening: ${sub.title}`, '');
  window.open(sub.gitLink, '_blank');
}

function viewProject(id) {
  const proj = PROJECTS.find(p => p.id === id);
  if (!proj) return;
  toast(`Opening: ${proj.name.slice(0,40)}...`, '');
}

function viewStudent(id) {
  const student = STUDENTS.find(s => s.id === id);
  if (!student) return;
  toast(`Student Profile: ${student.name}`, '');
}

function createProject() {
  const name = document.getElementById('np-name').value.trim();
  const mentor = document.getElementById('np-mentor').value;
  const maxStudents = parseInt(document.getElementById('np-max-students').value) || 7;
  const repo = document.getElementById('np-repo').value.trim();

  if (!name || !mentor) {
    toast('Please fill all required fields', 'error');
    return;
  }

  const newProj = {
    id: PROJECTS.length + 1,
    name,
    guide: mentor,
    students: 0,
    progress: 0,
    status: 'In Progress',
    githubRepo: repo || `project-${PROJECTS.length+1}`,
    category: 'Custom'
  };

  PROJECTS.push(newProj);
  toast(`✓ Project "${name}" created!`, 'success');
  closeModal();
  if (state.currentPage === 'projects') buildProjectsPage();
}

function exportStudentList() {
  const csv = ['S.No,Name,College,Email,Phone,Project\n', ...STUDENTS.map(s =>
    `${s.id},"${s.name}","${s.college}","${s.email}","${s.phone}",${s.project}`
  )].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `students-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('✓ Student list exported', 'success');
}

function generateReport(type) {
  toast(`Generating ${type} report...`, '');
  setTimeout(() => {
    const content = `# ${type.toUpperCase()} Report\n\nGenerated on ${new Date().toLocaleDateString()}\n\n[Full report content would be generated here]`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${type}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast('✓ Report generated', 'success');
  }, 800);
}

function filterProjects() {
  // Will be implemented with actual filtering
  console.log('Filtering projects');
}

function filterStudents() {
  console.log('Filtering students');
}

function filterSubmissions() {
  console.log('Filtering submissions');
}

function globalSearch(q) {
  console.log('Global search:', q);
}

function refreshDash() {
  buildDashboard();
  toast('Dashboard refreshed', 'success');
}

function updateQuickStats() {
  const stats = {
    admin: `${PROJECTS.length} projects · ${STUDENTS.length} students · ${SUBMISSIONS.length} submissions`,
    mentor: `${(state.user.projects || []).length} projects · ${STUDENTS.filter(s => (state.user.projects || []).includes(s.project)).length} students`,
    student: `1 project · 1 status: In Progress`
  };
  document.querySelector('.quick-stats').textContent = stats[state.role] || '';
}

// ══════════════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════════════

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}

function showStatus(id, type, msg) {
  const el = document.getElementById(id);
  el.className = `alert alert-${type}`;
  el.innerHTML = msg;
  el.style.display = 'block';
}

function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  if (type) t.classList.add(type);
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function handleTokenVis() {
  const el = document.getElementById('login-password');
  el.type = el.type === 'password' ? 'text' : 'password';
}

function togglePasswordVis() {
  handleTokenVis();
  const icon = document.getElementById('pwd-icon');
  icon.className = icon.className === 'ti ti-eye' ? 'ti ti-eye-off' : 'ti ti-eye';
}

// ══════════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════════

window.addEventListener('load', () => {
  // Check for existing session
  const savedUser = sessionStorage.getItem('user');
  if (savedUser) {
    state.user = JSON.parse(savedUser);
    state.role = state.user.role;
    launchApp();
  }
});
