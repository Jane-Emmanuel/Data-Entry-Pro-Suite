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

    // ✅ When Expense Module loads, initialize it:
    if (path === "modules/expense.html") initExpenseTracker();
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



/* ----------------------------------------------------
   ✅ EXPENSE TRACKER MODULE LOGIC
-----------------------------------------------------*/
function initExpenseTracker() {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  function renderExpenses() {
    const tableBody = document.querySelector("#expenseTable tbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    expenses.forEach((exp, index) => {
      tableBody.innerHTML += `
        <tr>
          <td>${exp.date}</td>
          <td>${exp.category}</td>
          <td>${exp.amount}</td>
          <td>${exp.notes}</td>
          <td><button class="delete-btn" data-index="${index}">X</button></td>
        </tr>
      `;
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = () => {
        expenses.splice(btn.dataset.index, 1);
        renderExpenses();
      };
    });
  }

  const form = document.querySelector("#expenseForm");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const expense = {
        date: document.querySelector("#expenseDate").value,
        category: document.querySelector("#expenseCategory").value,
        amount: document.querySelector("#expenseAmount").value,
        notes: document.querySelector("#expenseNotes").value || ""
      };

      expenses.push(expense);
      renderExpenses();
      form.reset();
    });
  }

  renderExpenses();
}
/* =============================
   INVENTORY MANAGER
============================= */

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

function renderInventory() {
  const tableBody = document.querySelector("#inventoryTable tbody");
  if (!tableBody) return; // Avoid errors before module loads

  tableBody.innerHTML = "";

  inventory.forEach((item, index) => {
    const totalValue = (item.qty * item.price).toFixed(2);

    tableBody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${totalValue}</td>
        <td>${item.notes}</td>
        <td><button class="delete-btn" onclick="deleteInventory(${index})">X</button></td>
      </tr>
    `;
  });

  localStorage.setItem("inventory", JSON.stringify(inventory));
}

document.addEventListener("submit", function(e) {
  if (e.target && e.target.id === "inventoryForm") {
    e.preventDefault();

    const item = {
      name: document.querySelector("#invName").value,
      qty: Number(document.querySelector("#invQty").value),
      price: Number(document.querySelector("#invPrice").value),
      notes: document.querySelector("#invNotes").value || ""
    };

    inventory.push(item);
    renderInventory();
    e.target.reset();
  }
});

function deleteInventory(index) {
  inventory.splice(index, 1);
  renderInventory();
}

renderInventory();
