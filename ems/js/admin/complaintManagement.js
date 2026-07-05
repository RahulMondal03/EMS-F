/* admin/complaintManagement.js — assign complaints to employees. */

const session = EMS.requireRole("admin", "login.html");
if (session) {

  document.getElementById("whoName").textContent = session.name;
  document.getElementById("logoutBtn").addEventListener("click", () => EMS.logout("login.html"));

  const rows = document.getElementById("complaintRows");

  function render() {
    const complaints = EMS.getComplaints().slice().reverse();
    const employees  = EMS.getEmployees();

    rows.innerHTML = complaints.map(k => {
      const c = EMS.findCustomer(k.customerId);
      const assignee = k.assignedTo ? EMS.findEmployee(k.assignedTo) : null;

      /* Unassigned + unresolved → show an assign dropdown.
         Otherwise show who is (or was) handling it.           */
      let assignCell;
      if (k.status === "Open") {
        const options = employees.map(e =>
          `<option value="${e.id}">${e.name} · ${e.dept}</option>`).join("");
        assignCell = `
          <select data-assign="${k.id}">
            <option value="">Choose employee…</option>
            ${options}
          </select>`;
      } else {
        assignCell = assignee ? assignee.name : "—";
      }

      return `
        <tr>
          <td><strong>${k.id}</strong></td>
          <td>${c ? c.name : k.customerId}</td>
          <td>${k.type}</td>
          <td style="max-width:280px;">${k.description}</td>
          <td><span class="badge ${EMS.badgeClass(k.status)}">${k.status}</span></td>
          <td>${assignCell}</td>
        </tr>`;
    }).join("") ||
    `<tr class="empty"><td colspan="6">No complaints in the system.</td></tr>`;
  }

  /* Assign as soon as an employee is picked from a dropdown. */
  rows.addEventListener("change", (e) => {
    const select = e.target.closest("select[data-assign]");
    if (!select || !select.value) return;
    EMS.assignComplaint(select.dataset.assign, select.value);
    render();
  });

  render();
}
