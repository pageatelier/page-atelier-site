const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function updateHeader() {
  if (!header?.classList.contains("menu-open")) {
    header?.classList.toggle("scrolled", window.scrollY > 80);
  }
}

function setMenu(open) {
  if (!header || !toggle) return;

  header.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-lock", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");

  if (!open) updateHeader();
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

toggle?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  setMenu(!header.classList.contains("menu-open"));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("menu-open")) {
    setMenu(false);
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

  revealItems.forEach((el) => io.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}
