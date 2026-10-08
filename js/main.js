(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const revealItems = document.querySelectorAll(".service-list li");
  if (revealItems.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealItems.forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
      io.observe(el);
    });
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const aircraft = String(data.get("aircraft") || "").trim();
      const body = String(data.get("body") || "").trim();
      const subject = encodeURIComponent(`Kinney Aviation service request — ${aircraft}`);
      const message = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nAircraft & location: ${aircraft}\n\n${body}`
      );
      window.location.href = `mailto:contact@kinneyaviation.example?subject=${subject}&body=${message}`;
    });
  }
})();
