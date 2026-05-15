const root = document.documentElement;
const themeButtons = [...document.querySelectorAll("[data-theme-choice]")];
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function resolveTheme(choice) {
  if (choice === "auto") {
    return darkQuery.matches ? "dark" : "light";
  }
  return choice;
}

function applyTheme(choice) {
  root.dataset.theme = choice;
  root.dataset.resolvedTheme = resolveTheme(choice);
  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.themeChoice === choice);
  });
}

const savedTheme = localStorage.getItem("academic-site-theme") || "auto";
applyTheme(savedTheme);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const choice = button.dataset.themeChoice;
    localStorage.setItem("academic-site-theme", choice);
    applyTheme(choice);
  });
});

darkQuery.addEventListener("change", () => {
  if (root.dataset.theme === "auto") {
    applyTheme("auto");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-22% 0px -62% 0px",
    threshold: [0.1, 0.25, 0.5],
  },
);

sections.forEach((section) => observer.observe(section));
