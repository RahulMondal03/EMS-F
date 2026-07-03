/* ============================================================
   data.js — single source of truth for the whole demo.
   Data lives in localStorage so it survives page navigation
   and reloads during the presentation. Call EMS.resetDemo()
   from the console to restore the seed data at any time.
   ============================================================ */

const EMS = (() => {

  const STORE_KEY = "ems_data_v1";

  /* ---------- Seed data (used on first load / after reset) ---------- */
  function seedData() {
    return {
      admin: { email: "admin@voltgrid.com", password: "admin123", name: "Grid Admin" },

      customers: [
        { id: "C1001", name: "Anita Menon",  email: "anita@example.com",  phone: "9876543210",
          address: "12 Palm Grove, Kochi", meterNo: "MTR-58291", password: "anita123" },
        { id: "C1002", name: "Ravi Kumar",   email: "ravi@example.com",   phone: "9812345678",
          address: "44 Lake View, Trivandrum", meterNo: "MTR-77410", password: "ravi123" },
      ],

      employees: [
        { id: "E501", name: "Suresh Nair", email: "suresh@voltgrid.com", phone: "9900112233",
          dept: "Field Operations", password: "suresh123" },
        { id: "E502", name: "Priya Das",   email: "priya@voltgrid.com",  phone: "9900445566",
          dept: "Billing Support",  password: "priya123" },
      ],

      policies: [
        { id: "P1", name: "Domestic — Slab A (0–200 units)", ratePerUnit: 4.5,
          description: "Standard household tariff for monthly usage up to 200 units." },
        { id: "P2", name: "Domestic — Slab B (201–500 units)", ratePerUnit: 6.25,
          description: "Household tariff for monthly usage between 201 and 500 units." },
        { id: "P3", name: "Green Rooftop Rebate", ratePerUnit: 3.75,
          description: "Discounted rate for homes with registered rooftop solar panels." },
      ],

      bills: [
        { id: "B9001", customerId: "C1001", month: "May 2026",  units: 182, amount: 819.0,
          dueDate: "2026-06-15", status: "Paid" },
        { id: "B9002", customerId: "C1001", month: "June 2026", units: 214, amount: 1237.5,
          dueDate: "2026-07-15", status: "Unpaid" },
        { id: "B9003", customerId: "C1002", month: "June 2026", units: 158, amount: 711.0,
          dueDate: "2026-07-15", status: "Unpaid" },
      ],

      complaints: [
        { id: "K7001", customerId: "C1002", type: "Power outage",
          description: "Frequent power cuts in Lake View area every evening after 7 pm.",
          status: "Open", assignedTo: null, createdAt: "2026-06-28 10:14",
          updates: [ { at: "2026-06-28 10:14", what: "Complaint registered", note: "" } ] },
      ],

      payments: [
        { id: "T3001", billId: "B9001", customerId: "C1001", amount: 819.0,
          method: "Card", date: "2026-06-10 18:22" },
      ],

      nextIds: { customer: 1003, employee: 503, policy: 4, bill: 9004, complaint: 7002, payment: 3002 },
    };
  }

  /* ---------- Load / save ---------- */
  function load() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
    const fresh = seedData();
    localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
    return fresh;
  }

  function save(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  function resetDemo() {
    localStorage.removeItem(STORE_KEY);
    sessionStorage.clear();
    location.reload();
  }

  /* ---------- Small utilities ---------- */
  const now = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const money = (n) => "₹" + Number(n).toFixed(2);

  const nextId = (kind, prefix) => {
    const d = load();
    const id = prefix + d.nextIds[kind];
    d.nextIds[kind] += 1;
    save(d);
    return id;
  };

  /* ---------- Session (who is logged in) ---------- */
  function setSession(role, id, name) {
    sessionStorage.setItem("ems_session", JSON.stringify({ role, id, name }));
  }
  function getSession() {
    const raw = sessionStorage.getItem("ems_session");
    return raw ? JSON.parse(raw) : null;
  }
  function logout(toLogin) {
    sessionStorage.removeItem("ems_session");
    location.href = toLogin;
  }
  /* Redirect to login if the visitor is not signed in with the right role. */
  function requireRole(role, loginPage) {
    const s = getSession();
    if (!s || s.role !== role) { location.href = loginPage; return null; }
    return s;
  }

  /* ---------- Auth ---------- */
  function loginCustomer(email, password) {
    return load().customers.find(c => c.email === email && c.password === password) || null;
  }
  function loginEmployee(email, password) {
    return load().employees.find(e => e.email === email && e.password === password) || null;
  }
  function loginAdmin(email, password) {
    const a = load().admin;
    return (a.email === email && a.password === password) ? a : null;
  }

  /* ---------- Customers ---------- */
  const getCustomers   = () => load().customers;
  const findCustomer   = (id) => load().customers.find(c => c.id === id) || null;
  const customerByMail = (email) => load().customers.find(c => c.email === email) || null;

  function addCustomer(cust) {
    const d = load();
    cust.id = "C" + d.nextIds.customer;
    cust.meterNo = cust.meterNo || ("MTR-" + Math.floor(10000 + Math.random() * 89999));
    d.nextIds.customer += 1;
    d.customers.push(cust);
    save(d);
    return cust;
  }
  function removeCustomer(id) {
    const d = load();
    d.customers = d.customers.filter(c => c.id !== id);
    save(d);
  }

  /* ---------- Employees ---------- */
  const getEmployees = () => load().employees;
  const findEmployee = (id) => load().employees.find(e => e.id === id) || null;

  function addEmployee(emp) {
    const d = load();
    emp.id = "E" + d.nextIds.employee;
    d.nextIds.employee += 1;
    d.employees.push(emp);
    save(d);
    return emp;
  }
  function removeEmployee(id) {
    const d = load();
    d.employees = d.employees.filter(e => e.id !== id);
    /* unassign this employee from any open complaints */
    d.complaints.forEach(k => { if (k.assignedTo === id && k.status !== "Resolved") { k.assignedTo = null; k.status = "Open"; } });
    save(d);
  }

  /* ---------- Policies ---------- */
  const getPolicies = () => load().policies;

  function addPolicy(p) {
    const d = load();
    p.id = "P" + d.nextIds.policy;
    d.nextIds.policy += 1;
    d.policies.push(p);
    save(d);
  }
  function updatePolicy(id, fields) {
    const d = load();
    const p = d.policies.find(x => x.id === id);
    if (p) Object.assign(p, fields);
    save(d);
  }
  function removePolicy(id) {
    const d = load();
    d.policies = d.policies.filter(p => p.id !== id);
    save(d);
  }

  /* ---------- Bills & payments ---------- */
  const getBills = () => load().bills;
  const billsForCustomer = (customerId) => load().bills.filter(b => b.customerId === customerId);
  const findBill = (id) => load().bills.find(b => b.id === id) || null;

  /* Marks a bill as paid and records the transaction. Returns the payment. */
  function payBill(billId, method) {
    const d = load();
    const bill = d.bills.find(b => b.id === billId);
    if (!bill || bill.status === "Paid") return null;
    bill.status = "Paid";
    const payment = {
      id: "T" + d.nextIds.payment,
      billId: bill.id,
      customerId: bill.customerId,
      amount: bill.amount,
      method,
      date: now(),
    };
    d.nextIds.payment += 1;
    d.payments.push(payment);
    save(d);
    return payment;
  }

  /* ---------- Complaints ---------- */
  const getComplaints = () => load().complaints;
  const findComplaint = (id) => load().complaints.find(k => k.id === id) || null;
  const complaintsForCustomer = (cid) => load().complaints.filter(k => k.customerId === cid);
  const complaintsForEmployee = (eid) => load().complaints.filter(k => k.assignedTo === eid);

  function addComplaint(customerId, type, description) {
    const d = load();
    const k = {
      id: "K" + d.nextIds.complaint,
      customerId, type, description,
      status: "Open", assignedTo: null, createdAt: now(),
      updates: [{ at: now(), what: "Complaint registered", note: "" }],
    };
    d.nextIds.complaint += 1;
    d.complaints.push(k);
    save(d);
    return k;
  }

  /* Admin action: hand a complaint to an employee. */
  function assignComplaint(complaintId, employeeId) {
    const d = load();
    const k = d.complaints.find(x => x.id === complaintId);
    const e = d.employees.find(x => x.id === employeeId);
    if (!k || !e) return;
    k.assignedTo = employeeId;
    k.status = "Assigned";
    k.updates.push({ at: now(), what: "Assigned to " + e.name, note: "" });
    save(d);
  }

  /* Employee action: move the complaint along its lifecycle. */
  function updateComplaintStatus(complaintId, status, note) {
    const d = load();
    const k = d.complaints.find(x => x.id === complaintId);
    if (!k) return;
    k.status = status;
    k.updates.push({ at: now(), what: "Status changed to " + status, note: note || "" });
    save(d);
  }

  /* Turn a status string into the matching badge CSS class. */
  const badgeClass = (status) => status.toLowerCase().replace(/\s+/g, "-");

  /* ---------- Public API ---------- */
  return {
    resetDemo, now, money, badgeClass,
    setSession, getSession, logout, requireRole,
    loginCustomer, loginEmployee, loginAdmin,
    getCustomers, findCustomer, customerByMail, addCustomer, removeCustomer,
    getEmployees, findEmployee, addEmployee, removeEmployee,
    getPolicies, addPolicy, updatePolicy, removePolicy,
    getBills, billsForCustomer, findBill, payBill,
    getComplaints, findComplaint, complaintsForCustomer, complaintsForEmployee,
    addComplaint, assignComplaint, updateComplaintStatus,
  };
})();
