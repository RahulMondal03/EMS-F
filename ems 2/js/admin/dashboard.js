/* admin/dashboard.js — system-wide stats + unassigned complaints. */

const session = EMS.requireRole("admin", "login.html");
if (session) {

  document.getElementById("whoName").textContent = session.name;
  document.getElementById("logoutBtn").addEventListener("click", () => EMS.logout("login.html"));

  const complaints = EMS.getComplaints();
  const bills      = EMS.getBills();

  /* --- Stat cards --- */
  document.getElementById("statCustomers").textContent = EMS.getCustomers().length;
  document.getElementById("statEmployees").textContent = EMS.getEmployees().length;

  const open = complaints.filter(k => k.status !== "Resolved");
  document.getElementById("statOpen").textContent = open.length;
  document.getElementById("statOpenNote").textContent =
    complaints.filter(k => k.status === "Open").length + " unassigned";

  const collected = bills.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);
  const pending   = bills.filter(b => b.status === "Unpaid").reduce((s, b) => s + b.amount, 0);
  document.getElementById("statRevenue").textContent = EMS.money(collected);
  document.getElementById("statRevenueNote").textContent = EMS.money(pending) + " outstanding";

  /* --- Unassigned complaints table --- */
  const rows = document.getElementById("openRows");
  const unassigned = complaints.filter(k => k.status === "Open").slice().reverse();

  rows.innerHTML = unassigned.map(k => {
    const c = EMS.findCustomer(k.customerId);
    return `
      <tr>
        <td><strong>${k.id}</strong></td>
        <td>${c ? c.name : k.customerId}</td>
        <td>${k.type}</td>
        <td>${k.createdAt}</td>
        <td><span class="badge ${EMS.badgeClass(k.status)}">${k.status}</span></td>
      </tr>`;
  }).join("") ||
  `<tr class="empty"><td colspan="5">Nothing waiting — every complaint is assigned. 🎉</td></tr>`;
}
