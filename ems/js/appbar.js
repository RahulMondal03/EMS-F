/* appbar.js — shared top navigation bar.
   A page drops <div id="appbar" data-role="customer|employee|admin"></div>
   where the header should go; this fills it in. The active link is
   detected from the current filename, so pages don't hard-code it.

   Must load after theme.js and before the page's own script (which
   sets #whoName / #whoMeta and wires #logoutBtn). */
(function () {
  var mount = document.getElementById("appbar");
  if (!mount) return;

  var role = mount.getAttribute("data-role") || "customer";

  var NAV = {
    customer: [
      ["dashboard.html", "Dashboard"],
      ["viewPayBill.html", "Bills"],
      ["registerComplaint.html", "Complaints"],
    ],
    employee: [
      ["dashboard.html", "My work"],
      ["customerLookup.html", "Customer lookup"],
    ],
    admin: [
      ["dashboard.html", "Dashboard"],
      ["policyManagement.html", "Policies"],
      ["customerManagement.html", "Customers"],
      ["employeeManagement.html", "Employees"],
      ["complaintManagement.html", "Complaints"],
    ],
  };
  var LABEL = { customer: "Customer", employee: "Employee", admin: "Admin" };
  var META  = { customer: "", employee: "", admin: "Administrator" };

  var current = location.pathname.split("/").pop() || "dashboard.html";
  if (current === "complaintStatus.html") current = "registerComplaint.html";

  var links = (NAV[role] || []).map(function (item) {
    var active = item[0] === current ? ' class="active"' : "";
    return '<a href="' + item[0] + '"' + active + ">" + item[1] + "</a>";
  }).join("");

  var dark = !!(window.VC && VC.getTheme && VC.getTheme() === "dark");

  mount.className = "topbar";
  mount.innerHTML =
    '<div class="brand"><span class="bolt">⚡</span>' +
      '<span>Volt Connect<small>' + LABEL[role] + '</small></span></div>' +
    '<nav>' + links + '</nav>' +
    '<div class="flex">' +
      '<div class="who"><strong id="whoName"></strong>' +
        '<span id="whoMeta">' + META[role] + '</span></div>' +
      '<button id="themeToggle" class="btn btn-ghost btn-sm" ' +
        'aria-label="Toggle dark mode" title="Toggle dark mode">' +
        (dark ? "☀️" : "🌙") + '</button>' +
      '<button id="logoutBtn" class="btn btn-ghost btn-sm">Log out</button>' +
    '</div>';

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = window.VC.toggleTheme();
      toggle.textContent = next === "dark" ? "☀️" : "🌙";
    });
  }
})();
