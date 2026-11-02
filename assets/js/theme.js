/* Modo claro / oscuro. Se carga en <head> (sin "defer") para aplicar el tema antes de pintar:
   así no hay destello blanco al entrar en modo oscuro. Claro por defecto; se recuerda la elección. */
(function () {
  var KEY = "ivanz-theme", root = document.documentElement, t = null;
  try { t = localStorage.getItem(KEY); } catch (e) {}
  if (t !== "dark" && t !== "light") t = "light";
  root.setAttribute("data-theme", t);

  function paint(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#14110e" : "#ffffff");
    var b = document.getElementById("theme-toggle");
    if (b) {
      b.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      b.setAttribute("aria-label", theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      b.title = theme === "dark" ? "Modo claro" : "Modo oscuro";
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    paint(root.getAttribute("data-theme"));
    var b = document.getElementById("theme-toggle");
    if (!b) return;
    b.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.classList.add("theme-switching");
      paint(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      setTimeout(function () { root.classList.remove("theme-switching"); }, 350);
    });
  });
})();
