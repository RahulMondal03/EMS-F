/* theme.js — light/dark theme, shared across every page.
   Loaded early in <head> so the saved theme applies before paint. */
(function () {
  var KEY = "vc_theme";
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === "dark" || saved === "light") {
    document.documentElement.setAttribute("data-theme", saved);
  }

  window.VC = window.VC || {};
  window.VC.getTheme = function () {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  };
  window.VC.toggleTheme = function () {
    var next = window.VC.getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    document.dispatchEvent(new CustomEvent("vc-theme-change", { detail: next }));
    return next;
  };
})();
