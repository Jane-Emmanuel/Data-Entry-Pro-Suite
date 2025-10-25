const businessNameInput = document.getElementById("businessName");
const enterBtn = document.getElementById("enterBtn");
const welcome = document.getElementById("welcome");
const dashboard = document.getElementById("dashboard");
const bizLabel = document.getElementById("bizLabel");
const logoutBtn = document.getElementById("logoutBtn");
const cardsContainer = document.getElementById("cardsContainer");
const moduleArea = document.getElementById("moduleArea");

const modules = [
  { name: "Expense Tracker", file: "modules/expense.html" },
  { name: "Inventory Manager", file: "modules/inventory.html" },
  { name: "Invoice Generator", file: "modules/invoice.html" },
  { name: "Customer CRM", file: "modules/crm.html" },
  { name: "Business KPI", file: "modules/kpi.html" },
  { name: "Data Entry Tracker", file: "modules/dataentry.html" }
];

function loadDashboard() {
  cardsContainer.innerHTML = "";
  modules.forEach(m => {
    const card = document.createElement("div");
    card.textContent = m.name;
    card.onclick = () => loadModule(m.file);
    cardsContainer.appendChild(card);
  });
}

function loadModule(path) {
  fetch(path).then(r => r.text()).then(html => {
    moduleArea.innerHTML = html;
  });
}

enterBtn.onclick = () => {
  const name = businessNameInput.value.trim();
  if(!name) return;
  localStorage.setItem("bizName", name);
  bizLabel.textContent = name;
  welcome.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadDashboard();
};

logoutBtn.onclick = () => {
  localStorage.removeItem("bizName");
  location.reload();
};

// Auto login if stored
const saved = localStorage.getItem("bizName");
if(saved){
  bizLabel.textContent = saved;
  welcome.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadDashboard();
}
