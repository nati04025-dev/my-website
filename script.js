const STORAGE_KEYS = {
  JOBS: "amg_holding_jobs_v1",
  APPLICANTS: "amg_holding_applicants_v1",
  ADMIN_AUTH: "amg_holding_admin_auth_v1",
};

const DEFAULT_JOBS = [
  {
    id: "job-1",
    title: "Junior Accountant",
    department: "Finance",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "19,000 - 28,000",
    deadline: "2026-12-31",
    status: "Active",
    description:
      "Assist with daily bookkeeping, ledger reconciliation, invoicing, and financial reporting at AMG Holding Business Group PLC. Bachelor's degree in Accounting or Finance preferred.",
  },
  {
    id: "job-2",
    title: "Accounts Receivable Officer",
    department: "Finance",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "20,000 - 28,000",
    deadline: "2026-12-28",
    status: "Active",
    description:
      "Track client invoices, collections, and ledger statements across AMG Holding subsidiaries.",
  },
  {
    id: "job-3",
    title: "Payroll & Benefits Specialist",
    department: "Finance",
    location: "Addis Ababa (Head Office)",
    type: "Full-time",
    salary: "22,000 - 30,000",
    deadline: "2026-12-26",
    status: "Active",
    description:
      "Process monthly payroll, tax filings, pension contributions, and employee financial records.",
  },
  {
    id: "job-4",
    title: "Cost & Budget Analyst",
    department: "Finance",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "24,000 - 34,000",
    deadline: "2026-12-29",
    status: "Active",
    description:
      "Prepare departmental budgets, variance analysis, and operational cost forecasts.",
  },
  {
    id: "job-5",
    title: "Treasury & Cash Officer",
    department: "Finance",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "21,000 - 29,000",
    deadline: "2026-12-27",
    status: "Active",
    description:
      "Manage daily bank reconciliations, cash flow monitoring, and payment authorizations.",
  },
  {
    id: "job-6",
    title: "Tax & Compliance Accountant",
    department: "Finance",
    location: "Addis Ababa (Head Office)",
    type: "Full-time",
    salary: "25,000 - 35,000",
    deadline: "2026-12-30",
    status: "Active",
    description:
      "Ensure VAT, withholding tax, and corporate regulatory compliance across group companies.",
  },
  {
    id: "job-7",
    title: "Internal Audit Associate",
    department: "Finance",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "23,000 - 32,000",
    deadline: "2026-12-25",
    status: "Active",
    description:
      "Support internal control reviews, branch audits, and risk mitigation reporting.",
  },
  {
    id: "job-8",
    title: "Senior Financial Officer",
    department: "Finance",
    location: "Addis Ababa",
    type: "Full-time",
    salary: "28,000 - 38,000",
    deadline: "2026-12-31",
    status: "Active",
    description:
      "Consolidate financial statements, financial modeling, and executive reporting.",
  },
];

let jobs = [];
let applicants = [];

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toastEl = document.getElementById("toast");
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 3000);
}

function loadData() {
  try {
    const savedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
    const savedApplicants = localStorage.getItem(STORAGE_KEYS.APPLICANTS);
    jobs = savedJobs ? JSON.parse(savedJobs) : [...DEFAULT_JOBS];
    applicants = savedApplicants ? JSON.parse(savedApplicants) : [];
    if (!Array.isArray(jobs) || jobs.length === 0) {
      jobs = [...DEFAULT_JOBS];
    }
    if (!savedJobs) saveData();
  } catch (_) {
    jobs = [...DEFAULT_JOBS];
    applicants = [];
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    localStorage.setItem(STORAGE_KEYS.APPLICANTS, JSON.stringify(applicants));
  } catch (_) {}
}

function renderAdminDashboard() {
  const kpiTotalJobs = document.getElementById("kpiTotalJobs");
  const kpiActiveJobs = document.getElementById("kpiActiveJobs");
  const kpiTotalApplicants = document.getElementById("kpiTotalApplicants");
  const kpiPendingApplicants = document.getElementById("kpiPendingApplicants");
  const adminJobsTableBody = document.getElementById("adminJobsTableBody");
  const applicantsTableBody = document.getElementById("applicantsTableBody");

  if (kpiTotalJobs) kpiTotalJobs.textContent = String(jobs.length);
  if (kpiActiveJobs) {
    kpiActiveJobs.textContent = String(jobs.filter((j) => j.status === "Active").length);
  }
  if (kpiTotalApplicants) kpiTotalApplicants.textContent = String(applicants.length);
  if (kpiPendingApplicants) {
    kpiPendingApplicants.textContent = String(
      applicants.filter((a) => a.status === "Pending").length
    );
  }

  if (adminJobsTableBody) {
    adminJobsTableBody.innerHTML = jobs
      .map((job) => {
        const count = applicants.filter((a) => a.jobId === job.id).length;
        const isClosed = job.status === "Closed";
        return `
          <tr>
            <td><strong>${escapeHtml(job.title)}</strong></td>
            <td>${escapeHtml(job.department)}</td>
            <td>${escapeHtml(job.location)}</td>
            <td>${escapeHtml(job.deadline)}</td>
            <td>${count}</td>
            <td>
              <span class="status-pill ${isClosed ? "closed" : ""}">
                ${escapeHtml(job.status)}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button type="button" class="btn btn-outline btn-sm" onclick="toggleJobStatus('${escapeHtml(job.id)}')">
                  ${isClosed ? "Reopen" : "Close"}
                </button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteJob('${escapeHtml(job.id)}')">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  if (applicantsTableBody) {
    const searchTerm = (
      document.getElementById("searchApplicantInput")?.value || ""
    )
      .trim()
      .toLowerCase();
    const statusFilter =
      document.getElementById("filterStatusSelect")?.value || "ALL";

    const filteredApplicants = applicants.filter((a) => {
      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      const matchesSearch =
        !searchTerm ||
        a.fullName.toLowerCase().includes(searchTerm) ||
        a.email.toLowerCase().includes(searchTerm) ||
        a.phone.toLowerCase().includes(searchTerm) ||
        a.jobTitle.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });

    if (filteredApplicants.length === 0) {
      applicantsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="muted">No applications submitted yet.</td>
        </tr>
      `;
    } else {
      applicantsTableBody.innerHTML = filteredApplicants
        .map(
          (a) => `
          <tr>
            <td><strong>${escapeHtml(a.fullName)}</strong></td>
            <td>${escapeHtml(a.phone)}<br /><span class="muted">${escapeHtml(a.email)}</span></td>
            <td>${escapeHtml(a.education)}</td>
            <td>${escapeHtml(a.jobTitle)}</td>
            <td>${escapeHtml(a.experience)} yrs</td>
            <td>${escapeHtml(a.socialContact)}</td>
            <td>${escapeHtml(a.dateApplied)}</td>
            <td>
              <select onchange="updateApplicantStatus('${escapeHtml(a.id)}', this.value)">
                ${["Pending", "Shortlisted", "Interview", "Hired", "Rejected"]
                  .map(
                    (st) =>
                      `<option value="${st}" ${a.status === st ? "selected" : ""}>${st}</option>`
                  )
                  .join("")}
              </select>
            </td>
          </tr>
        `
        )
        .join("");
    }
  }
}

window.toggleJobStatus = function (jobId) {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return;
  job.status = job.status === "Active" ? "Closed" : "Active";
  saveData();
  renderAdminDashboard();
  showToast(`Job "${job.title}" marked as ${job.status}.`);
};

window.deleteJob = function (jobId) {
  jobs = jobs.filter((j) => j.id !== jobId);
  saveData();
  renderAdminDashboard();
  showToast("Job vacancy deleted.");
};

window.updateApplicantStatus = function (appId, newStatus) {
  const app = applicants.find((a) => a.id === appId);
  if (!app) return;
  app.status = newStatus;
  saveData();
  renderAdminDashboard();
  showToast(`Applicant status updated to ${newStatus}.`);
};

function initAdminApp() {
  const currentYearEl = document.getElementById("currentYear");
  if (currentYearEl) currentYearEl.textContent = String(new Date().getFullYear());

  const jobDeadlineInput = document.getElementById("jobDeadline");
  if (jobDeadlineInput && !jobDeadlineInput.value) {
    jobDeadlineInput.value = "2026-12-31";
  }

  loadData();

  const adminLoginCard = document.getElementById("adminLoginCard");
  const adminDashboard = document.getElementById("adminDashboard");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const loginError = document.getElementById("loginError");
  const logoutAdminBtn = document.getElementById("logoutAdminBtn");
  const resetDemoDataBtn = document.getElementById("resetDemoDataBtn");
  const postJobForm = document.getElementById("postJobForm");
  const searchApplicantInput = document.getElementById("searchApplicantInput");
  const filterStatusSelect = document.getElementById("filterStatusSelect");

  function showDashboard() {
    if (adminLoginCard) adminLoginCard.classList.add("hidden");
    if (adminDashboard) adminDashboard.classList.remove("hidden");
    renderAdminDashboard();
  }

  function showLogin() {
    if (adminDashboard) adminDashboard.classList.add("hidden");
    if (adminLoginCard) adminLoginCard.classList.remove("hidden");
  }

  if (sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === "true") {
    showDashboard();
  } else {
    showLogin();
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("adminUsername")?.value.trim();
      const p = document.getElementById("adminPassword")?.value;
      if (u === "admin" && p === "amg2026") {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
        if (loginError) loginError.classList.add("hidden");
        showDashboard();
        showToast("Welcome to AMG Holding HR Dashboard.");
      } else if (loginError) {
        loginError.classList.remove("hidden");
      }
    });
  }

  if (logoutAdminBtn) {
    logoutAdminBtn.addEventListener("click", () => {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
