# VoltGrid — Electricity Management System (demo)

A front-end-only demo built with plain HTML, CSS and JavaScript.
No frameworks, no build step, no backend — data lives in `localStorage`
via the shared store in `js/data.js`.

## Run it
Open `index.html` in a browser. (For best results serve the folder,
e.g. `python -m http.server`, but double-clicking works too.)

## Demo credentials
| Role     | Email                 | Password  |
|----------|-----------------------|-----------|
| Customer | anita@example.com     | anita123  |
| Customer | ravi@example.com      | ravi123   |
| Employee | suresh@voltgrid.com   | suresh123 |
| Employee | priya@voltgrid.com    | priya123  |
| Admin    | admin@voltgrid.com    | admin123  |

## Demo script (complaint lifecycle)
1. **Customer** logs in → *New complaint* → submit.
2. **Admin** logs in → *Complaints* → pick an employee in the "Assign to" dropdown.
3. **Employee** logs in → queue shows the complaint → *Update* → set "Resolved" with a note.
4. **Customer** opens *My complaints* → sees the full timeline, note included.

Payments: *Bills → Pay now → Card or UPI → success receipt* (bill flips to Paid).

## Reset the demo data
Open the browser console and run: `EMS.resetDemo()`
