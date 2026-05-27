# InternTrack Pro — Cybersecurity Internship Management System
## Complete Setup & Deployment Guide

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Files Included](#files-included)
4. [Installation](#installation)
5. [GitHub Integration Setup](#github-integration-setup)
6. [Deployment Options](#deployment-options)
7. [Demo Credentials](#demo-credentials)
8. [Usage by Role](#usage-by-role)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**InternTrack Pro** is a comprehensive role-based internship management platform designed specifically for the **Cybersecurity Internship Program** with **26 projects** and **184 students** across multiple colleges.

### Key Highlights
- **Role-Based Access Control** (Admin, Mentor, Student)
- **GitHub Classroom Integration** for code submissions
- **Real-Time Progress Tracking** with analytics dashboards
- **Project Allocation Management** for all 26 cybersecurity projects
- **Student Performance Monitoring** with individual submissions tracking
- **Responsive Design** works on desktop, tablet, and mobile

---

## ✨ Features by Role

### 👨‍💼 **ADMIN (Program Coordinator)**
- View all 26 projects at a glance
- Manage all 184 students and their allocations
- Monitor faculty workload and progress
- Track all submissions across the program
- Generate comprehensive reports (weekly, by student, by project, final)
- Configure GitHub organization and OAuth
- View real-time analytics and metrics

### 👨‍🏫 **MENTOR (Faculty Guide)**
- View only the projects they are guiding
- Track their assigned students' progress
- Review and provide feedback on submissions
- Monitor student performance with individual metrics
- Access student contact information and colleges
- Submit guidance notes and evaluations
- View submissions for their projects

### 👨‍🎓 **STUDENT (Intern)**
- Access personal project details and team members
- View project description and objectives
- Submit assignments and code via GitHub
- Track personal progress and milestones
- View feedback from faculty mentors
- Access project resources and deadlines
- See team submission history

---

## 📦 Files Included

```
interntrack/
├── index-pro.html        # Main application (role-based UI)
├── styles.css            # Complete stylesheet with dark theme
├── app-pro.js            # Full JavaScript app logic & GitHub API
├── README.md             # Quick start guide
└── INTERNTRACK_PRO_GUIDE.md (this file)
```

### Project Data Included
- **26 Cybersecurity Projects** with:
  - Project descriptions and categories
  - Faculty guide assignments
  - Student allocations (184 total)
  - Progress tracking
  - GitHub repository links

---

## 🚀 Installation

### Option 1: Local Development (Easiest for Testing)
```bash
# 1. Extract files to a folder
cd interntrack

# 2. Start a local server (choose one based on your system)

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# Ruby
ruby -run -ehttpd . -p8000
```

Then open: **http://localhost:8000/index-pro.html**

### Option 2: Deploy to GitHub Pages (Free Hosting)
```bash
# 1. Create a new GitHub repository called "interntrack"
# 2. Clone it locally
git clone https://github.com/YOUR-USERNAME/interntrack.git
cd interntrack

# 3. Copy InternTrack Pro files into the folder
cp index-pro.html styles.css app-pro.js .

# 4. Push to GitHub
git add .
git commit -m "Initial InternTrack Pro deployment"
git push origin main

# 5. Enable GitHub Pages in repository settings
#    → Settings → Pages → Deploy from main branch

# Your site will be live at:
# https://YOUR-USERNAME.github.io/interntrack/
```

### Option 3: Deploy to Netlify (Recommended)
```bash
# 1. Create a GitHub repository with the files

# 2. Go to netlify.com → New site from Git

# 3. Connect your GitHub repo

# 4. Deploy settings:
#    - Build command: (leave empty)
#    - Publish directory: ./
#    - Branch: main

# 5. Your site is live instantly with auto-deploys on push
```

### Option 4: Deploy with Backend (For Production)
See the "Advanced: Backend Setup" section below for:
- Node.js + Express backend
- GitHub OAuth token exchange
- Student data persistence
- Email notifications

---

## 🔐 GitHub Integration Setup

### Step 1: Create a GitHub OAuth App
1. Go to **GitHub Settings → Developer settings → OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** InternTrack Pro
   - **Homepage URL:** `http://localhost:8000` (or your domain)
   - **Authorization callback URL:** `http://localhost:8000/index-pro.html`
4. Copy your **Client ID** (you'll need this)

### Step 2: Create a Personal Access Token
1. Go to **GitHub Settings → Developer settings → Personal access tokens**
2. Click **Generate new token**
3. Select scopes: `repo`, `read:org`, `read:user`
4. Copy the token (only shown once!)

### Step 3: Create a GitHub Organization for Classroom
1. Go to **GitHub.com**
2. Create new organization: `cybersec-internship-2025`
3. Invite all faculty members as owners

### Step 4: Configure in InternTrack Pro
1. **Sign in as Admin** using demo credentials
2. Go to **GitHub Settings** (gear icon in header)
3. Enter:
   - **GitHub Organization:** `cybersec-internship-2025`
   - **Personal Access Token:** (your PAT from Step 2)
   - **OAuth App Client ID:** (your Client ID from Step 1)
4. Click **Save Settings** → **Test Connection**

---

## 🌐 Deployment Options

### Quick Deploy Checklist
```
□ Files uploaded (index-pro.html, styles.css, app-pro.js)
□ Web server configured (if not using GitHub Pages/Netlify)
□ GitHub OAuth App created
□ Personal Access Token generated
□ GitHub organization created for classroom repos
□ Admin account configured with GitHub settings
□ Test login with demo credentials
□ Share login link with students and faculty
```

### Deploy Commands

**GitHub Pages:**
```bash
git add . && git commit -m "Update" && git push origin main
# Live at: https://username.github.io/interntrack
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Traditional Web Hosting (FTP):**
```bash
# Upload these 3 files via FTP:
# - index-pro.html
# - styles.css
# - app-pro.js
# to your web host's public_html folder
```

---

## 📝 Demo Credentials

Use these to test each role's functionality:

| Role | Email | Password | Projects |
|------|-------|----------|----------|
| **Admin** | `admin@interntrack.edu` | `Pass123` | All 26 |
| **Mentor** | `mentor@college.edu` | `Pass123` | Projects 1-4 |
| **Student** | `student@college.edu` | `Pass123` | Project 1 |

> **Security Note:** These are demo credentials only. In production, implement real authentication with encrypted passwords and multi-factor authentication.

---

## 💡 Usage by Role

### Admin Workflow
1. **Login** → `admin@interntrack.edu` / `Pass123`
2. **Dashboard** → See overall metrics
   - 26 projects, 184 students, progress overview
3. **Projects** → Manage all projects
   - Filter by status or faculty
   - Add new projects
4. **Students** → View all student records
   - Search by name/college/email
   - Filter by project or status
   - Export student list as CSV
5. **Submissions** → Track all submissions
   - Fetch from GitHub repos
   - View, review, and provide feedback
6. **Reports** → Generate various reports
   - Weekly summaries
   - Student performance
   - Project status
   - Final evaluations

### Mentor Workflow
1. **Login** → `mentor@college.edu` / `Pass123`
2. **My Projects** → See only assigned projects
3. **Students** → Filter to see their students
4. **Submissions** → Review student submissions
   - Link directly to GitHub code
   - Provide feedback inline
5. **Progress** → Monitor project metrics
   - See student participation
   - Track milestone completion

### Student Workflow
1. **Login** → `student@college.edu` / `Pass123`
2. **My Project** → View:
   - Project title and objectives
   - Faculty guide information
   - Team member list
   - GitHub repository link
3. **Submissions** → Submit work
   - Click "Submit Work" button
   - Paste GitHub repo link
   - Add notes and description
   - Track submission status
4. **Milestones** → See progress timeline
   - Week-by-week objectives
   - Completion status

---

## 🔧 GitHub Classroom Integration

### Setting Up Repositories for Submissions

**For Each Project:**

1. **Create a template repository** (optional but recommended)
   ```
   org-repo-name-template
   ├── README.md (project details)
   ├── docs/
   │   ├── ASSIGNMENT.md
   │   └── RESOURCES.md
   └── submissions/
       └── .gitkeep
   ```

2. **Create assignment repos** for each student/team
   - Naming: `cyber-proj1-team-mukhil` (student name/slug)
   - Students push their code here
   - Faculty review via GitHub web UI

3. **Link repos in InternTrack**
   - Admin enters org name
   - System auto-detects repos
   - Students see links in their dashboard

### Student Submission Flow
```
1. Student works on code locally
2. Student pushes to their team GitHub repo
3. Student logs into InternTrack
4. Clicks "Submit Work"
5. Pastes GitHub repo link: https://github.com/org/repo
6. Adds assignment type and notes
7. Clicks "Submit"
8. Faculty can review in GitHub
9. Faculty posts feedback in "Submissions" section
10. Student sees feedback in their dashboard
```

---

## 🚨 Troubleshooting

### Problem: "GitHub connection failed"
**Solution:**
- Check Personal Access Token is valid (not expired)
- Verify organization name spelling
- Ensure token has `repo` and `read:org` scopes
- Try re-saving settings

### Problem: "Student can't see projects"
**Solution:**
- Verify student email matches in database
- Check student project allocation
- Clear browser cache and reload
- Verify student role is selected at login

### Problem: "Submissions not appearing"
**Solution:**
- Ensure GitHub repos exist and are accessible
- Check Personal Access Token permissions
- Click "Fetch from GitHub" button to refresh
- Verify student pushed code to correct branch (main)

### Problem: "Modals not opening"
**Solution:**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser (Chrome/Firefox recommended)
- Clear cookies and session storage

### Problem: "Can't login"
**Solution:**
- Verify email and password match demo credentials exactly
- Check for typos (passwords are case-sensitive)
- Ensure browser supports JavaScript
- Try private/incognito mode to clear cookies

---

## 🔒 Security Considerations

### For Production Deployment

1. **Replace Demo Credentials**
   ```javascript
   // In app-pro.js, replace DEMO_USERS with real backend auth
   // Connect to your authentication service:
   // - Active Directory/LDAP
   // - OAuth 2.0 with your institution
   // - Custom REST API with hashed passwords
   ```

2. **Secure GitHub Token Storage**
   - Never store tokens in localStorage
   - Use a secure backend service to handle API calls
   - Implement OAuth token refresh

3. **Encrypt Sensitive Data**
   - Student emails and phone numbers
   - Submission content
   - Faculty feedback

4. **Implement Rate Limiting**
   - Prevent abuse of API endpoints
   - Throttle file uploads

5. **Add Access Control**
   - Verify admin role before allowing project creation
   - Prevent students from viewing other project details
   - Faculty can only see their assigned projects

6. **Enable HTTPS**
   - Required for GitHub OAuth
   - Use free SSL from Let's Encrypt

---

## 🎯 Quick Start (5 Minutes)

1. **Download files** (index-pro.html, styles.css, app-pro.js)
2. **Open index-pro.html** in browser
3. **Login with demo credentials:**
   - Admin: `admin@interntrack.edu` / `Pass123`
4. **Explore features:**
   - Dashboard → see all metrics
   - Projects → view 26 cybersecurity projects
   - Students → browse 184 students
   - Submissions → track submissions
5. **Configure GitHub (optional):**
   - Click gear icon → GitHub Settings
   - Enter your GitHub org and token
   - Click Test Connection

---

## 📞 Support & Customization

### Customizing Projects/Students
Edit the `PROJECTS` and `STUDENTS` arrays in `app-pro.js`:
```javascript
const PROJECTS = [
  {
    id: 1,
    name: 'Your Project Name',
    guide: 'Faculty Name',
    students: 5,
    // ... other properties
  }
];
```

### Adding More Features
- **Email notifications:** Integrate SendGrid/AWS SES
- **Real-time updates:** Add Firebase or Socket.io
- **Mobile app:** Build React Native version
- **Advanced analytics:** Add Tableau or Power BI

### Professional Deployment
For universities/enterprises:
- Deploy backend with Node.js + MongoDB
- Implement LDAP/AD integration
- Add audit logging and compliance reporting
- Custom branding and theming

---

## 📄 License & Attribution

InternTrack Pro is provided as-is for educational and non-commercial use.

For questions or customizations, refer to the inline code comments and documentation.

---

## ✅ Checklist for Launch

- [ ] All 3 files uploaded (index-pro.html, styles.css, app-pro.js)
- [ ] URL configured for GitHub OAuth callback
- [ ] GitHub organization created
- [ ] Personal Access Token generated and saved
- [ ] OAuth App Client ID saved
- [ ] Test login successful with admin account
- [ ] Test login successful with mentor account  
- [ ] Test login successful with student account
- [ ] Dashboard loads correctly
- [ ] All navigation links working
- [ ] Submissions page functional
- [ ] GitHub settings configured and tested
- [ ] Links shared with students and faculty
- [ ] Training session scheduled with users

---

**🎉 Ready to launch InternTrack Pro!**

Visit your deployed URL and share it with your internship program participants.

For ongoing support, check the code comments in `app-pro.js` for implementation details and customization options.
