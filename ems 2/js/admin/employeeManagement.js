/* admin/employeeManagement.js — team list + add / remove employees. */

const session = EMS.requireRole("admin", "login.html");
if (session) {

  document.getElementById("whoName").textContent = session.name;
  document.getElementById("logoutBtn").addEventListener("click", () => EMS.logout("login.html"));

  const rows  = document.getElementById("employeeRows");
  const alert = document.getElementById("alert");

  function render() {
    rows.innerHTML = EMS.getEmployees().map(emp => {
      /* how many unresolved complaints this employee is holding */
      const active = EMS.complaintsForEmployee(emp.id)
                        .filter(k => k.status !== "Resolved").length;
      return `
        <tr>
          <td><strong>${emp.id}</strong></td>
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.dept}</td>
          <td>${active ? `<span class="badge in-progress">${active} open</span>` : `<span class="muted">free</span>`}</td>
          <td><button class="btn btn-danger btn-sm" data-del="${emp.id}">Remove</button></td>
        </tr>`;
    }).join("") ||
    `<tr class="empty"><td colspan="6">No employees yet.</td></tr>`;
  }

  rows.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-del]");
    if (btn && confirm("Remove this employee? Their open complaints return to the unassigned queue.")) {
      EMS.removeEmployee(btn.dataset.del);
      render();
    }
  });

  document.getElementById("addBtn").addEventListener("click", () => {
    const ok = V.validate([
      { id: "ename",     checks: [[V.required, "Name is required"]] },
      { id: "eemail",    checks: [[V.required, "Email is required"], [V.email, "Enter a valid email"]] },
      { id: "ephone",    checks: [[V.required, "Mobile number is required"], [V.phone, "Enter a valid 10-digit mobile"]] },
      { id: "epassword", checks: [[V.required, "Password is required"], [V.minLen(6), "Use at least 6 characters"]] },
    ]);
    if (!ok) return;

    const emp = EMS.addEmployee({
      name:  document.getElementById("ename").value.trim(),
      email: document.getElementById("eemail").value.trim(),
      phone: document.getElementById("ephone").value.trim(),
      dept:  document.getElementById("edept").value,
      password: document.getElementById("epassword").value,
    });

    alert.innerHTML = `Added <strong>${emp.name}</strong> (${emp.id}).`;
    alert.classList.add("show");
    ["ename", "eemail", "ephone", "epassword"].forEach(id => document.getElementById(id).value = "");
    render();
  });

  V.liveClear(["ename", "eemail", "ephone", "epassword"]);
  render();
}
