/* admin/login.js — sign the administrator in. */

document.getElementById("loginBtn").addEventListener("click", () => {
  const ok = V.validate([
    { id: "email",    checks: [[V.required, "Email is required"], [V.email, "Enter a valid email"]] },
    { id: "password", checks: [[V.required, "Password is required"]] },
  ]);
  if (!ok) return;

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const admin = EMS.loginAdmin(email, password);
  if (!admin) {
    const alert = document.getElementById("alert");
    alert.textContent = "Incorrect admin credentials.";
    alert.classList.add("show");
    return;
  }

  EMS.setSession("admin", "admin", admin.name);
  location.href = "dashboard.html";
});

V.liveClear(["email", "password"]);
