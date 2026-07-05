/* customer/registerComplaint.js — combined page:
   file a new complaint (left) and track existing ones (right). */

const session = EMS.requireRole("customer", "login.html");
if (session) {

  const me = EMS.findCustomer(session.id);
  document.getElementById("whoName").textContent = me.name;
  document.getElementById("whoMeta").textContent = "Meter " + me.meterNo;
  document.getElementById("logoutBtn").addEventListener("click", () => EMS.logout("login.html"));

  const list = document.getElementById("complaintList");

  /* Render the customer's complaints (newest first) into the right column. */
  function renderComplaints() {
    const complaints = EMS.complaintsForCustomer(me.id).slice().reverse();

    if (!complaints.length) {
      list.innerHTML = `
        <div class="glass center" style="padding:36px;">
          <h3>No complaints yet</h3>
          <p class="muted mt-1">Use the form to file your first one.</p>
        </div>`;
      return;
    }

    list.innerHTML = complaints.map(k => {
      const assignee = k.assignedTo ? EMS.findEmployee(k.assignedTo) : null;
      const timeline = k.updates.map(u => `
        <li>
          <div class="t-when">${u.at}</div>
          <div class="t-what">${u.what}</div>
          ${u.note ? `<div class="t-note">“${u.note}”</div>` : ""}
        </li>`).join("");

      return `
        <div class="glass">
          <div class="card-head">
            <div>
              <h3>${k.id} · ${k.type}</h3>
              <p class="muted">Raised ${k.createdAt}${assignee ? " · handled by " + assignee.name : ""}</p>
            </div>
            <span class="badge ${EMS.badgeClass(k.status)}">${k.status}</span>
          </div>
          <p style="font-size:0.92rem;">${k.description}</p>
          <ul class="timeline mt-2">${timeline}</ul>
        </div>`;
    }).join("");
  }

  renderComplaints();

  document.getElementById("submitBtn").addEventListener("click", () => {
    const ok = V.validate([
      { id: "type",        checks: [[V.required, "Choose a complaint type"]] },
      { id: "description", checks: [[V.required, "Please describe the issue"], [V.minLen(15), "A little more detail helps the team (15+ characters)"]] },
    ]);
    if (!ok) return;

    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value.trim();

    const complaint = EMS.addComplaint(me.id, type, description);

    /* Confirm inline, clear the form, and refresh the list on the right. */
    const alert = document.getElementById("alert");
    alert.innerHTML = `Complaint <strong>${complaint.id}</strong> registered.`;
    alert.classList.add("show");
    document.getElementById("type").value = "";
    document.getElementById("description").value = "";

    renderComplaints();
  });

  V.liveClear(["type", "description"]);
}
