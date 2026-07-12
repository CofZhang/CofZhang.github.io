const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const pageId = document.body.dataset.page;

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll("[data-nav-id]").forEach((link) => {
  if (link.dataset.navId === pageId) {
    link.classList.add("is-active");
  }
});

if (navToggle && siteNav) {
  function setNavOpen(isOpen) {
    siteNav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  navToggle.addEventListener("click", () => {
    setNavOpen(!siteNav.classList.contains("is-open"));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      setNavOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });
}

document.querySelectorAll("[data-print]").forEach((button) => {
  button.addEventListener("click", () => window.print());
});

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const email = button.dataset.copyEmail;
    const defaultLabel = button.dataset.copyLabel || button.textContent;
    const doneLabel = button.dataset.copyDone || "Copied";
    try {
      await navigator.clipboard.writeText(email);
      button.textContent = doneLabel;
      setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1800);
    } catch (error) {
      window.location.href = `mailto:${email}`;
    }
  });
});
