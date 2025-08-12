/* =========================================================
   Anubhav Silas – Site script (global, multi-page)
   - Theme toggle (persistent)
   - Active nav highlighting
   - Optional mobile hamburger
   - Song list toggles
   - Reveal on scroll (progressive enhancement)
   ========================================================= */

/* -------------------- THEME -------------------- */
// Persisted in localStorage under "theme": "light" | "dark"
(function initTheme() {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(STORAGE_KEY);

  // Default = dark (matches your design). Apply saved theme if any.
  if (saved === "light") root.classList.add("light");

  // Wire up any toggle buttons: <button data-theme-toggle>
  function toggleTheme() {
    root.classList.toggle("light");
    localStorage.setItem(STORAGE_KEY, root.classList.contains("light") ? "light" : "dark");
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
    btn.addEventListener("click", toggleTheme);
  });

  // Power-user hotkey: press "t" to toggle theme
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t") toggleTheme();
  });
})();

/* -------------------- ACTIVE NAV -------------------- */
// Sets aria-current="page" based on the current file name
(function highlightActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".topnav .links a");

  links.forEach(a => {
    try {
      const href = a.getAttribute("href");
      // For hash/relative links, normalize like the path
      const target = (href || "").split("/").pop() || "index.html";
      if (target === path) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    } catch (_) {}
  });
})();

/* -------------------- HAMBURGER (optional) -------------------- */
// Works if you add a button.hamburger and use .links for the menu
(function mobileMenu() {
  const btn = document.querySelector(".hamburger");
  const menu = document.querySelector(".topnav .links");
  if (!btn || !menu) return; // no-op if not present

  function toggle() {
    const open = menu.getAttribute("data-open") === "true";
    menu.setAttribute("data-open", String(!open));
    btn.setAttribute("aria-expanded", String(!open));
  }

  btn.addEventListener("click", toggle);
  // Close menu when a link is clicked (useful on small screens)
  menu.addEventListener("click", e => {
    if (e.target.closest("a")) {
      menu.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();

/* -------------------- SONG LIST TOGGLES -------------------- */
// Robust: find the list inside the same .album-card (not nextElementSibling)
(function songToggles() {
  document.querySelectorAll(".toggle-songs").forEach((btn) => {
    const card = btn.closest(".album-card");
    const list = card ? card.querySelector(".song-list") : null;
    if (!list) return;

    // Start hidden (HTML or CSS can also set [hidden]; we normalize here)
    if (!list.hasAttribute("hidden")) list.setAttribute("hidden", "");

    btn.addEventListener("click", () => {
      const isHidden = list.hasAttribute("hidden");
      if (isHidden) {
        list.removeAttribute("hidden");
        btn.textContent = "Hide Songs ▲";
        btn.setAttribute("aria-expanded", "true");
      } else {
        list.setAttribute("hidden", "");
        btn.textContent = "View Songs ▼";
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });
})();



/* -------------------- REVEAL ON SCROLL -------------------- */
// Adds `.in` when elements enter the viewport.
// (Add optional CSS like: [data-reveal]{opacity:.001;transform:translateY(12px);transition:.4s}
// [data-reveal].in{opacity:1;transform:none})
(function revealOnScroll() {
  const items = document.querySelectorAll(
    "[data-reveal], .album-card, .feature-item, .video-grid iframe"
  );
  if (!("IntersectionObserver" in window) || items.length === 0) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  items.forEach(el => io.observe(el));
})();

/* -------------------- EXTERNAL LINKS SAFETY -------------------- */
// Ensure target=_blank links also have rel=noopener
(function hardenExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    const rel = (a.getAttribute("rel") || "").split(/\s+/);
    if (!rel.includes("noopener")) rel.push("noopener");
    if (!rel.includes("noreferrer")) rel.push("noreferrer");
    a.setAttribute("rel", rel.join(" ").trim());
  });
})();
