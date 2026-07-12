const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const pageId = document.body.dataset.page;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

if (finePointer && !reducedMotion) {
  const root = document.documentElement;
  const reactiveCards = document.querySelectorAll(
    [
      ".feature-card",
      ".project-card",
      ".skill-panel",
      ".case-study",
      ".timeline-item",
      ".contact-panel",
      ".resume-card",
      ".resume-block",
      ".research-list article",
    ].join(","),
  );
  const magneticTargets = document.querySelectorAll(
    ".button, .header-action, .language-switch a",
  );
  const heroFigure = document.querySelector(".profile-figure");

  document.addEventListener("pointermove", (event) => {
    root.style.setProperty("--mx", Math.round((event.clientX / window.innerWidth) * 100));
    root.style.setProperty("--my", Math.round((event.clientY / window.innerHeight) * 100));
    root.style.setProperty("--grid-x", `${Math.round(event.clientX * -0.018)}px`);
    root.style.setProperty("--grid-y", `${Math.round(event.clientY * -0.012)}px`);

    if (heroFigure) {
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * -8;
      heroFigure.style.transform = `perspective(1100px) rotateX(${y}deg) rotateY(${x}deg)`;
    }
  });

  reactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 5;
      const rotateX = (0.5 - (y / rect.height)) * 5;

      card.style.setProperty("--px", `${x}px`);
      card.style.setProperty("--py", `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
      card.style.removeProperty("--px");
      card.style.removeProperty("--py");
    });
  });

  magneticTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.16;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      target.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });
}
