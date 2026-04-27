const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");
const year = document.getElementById("year");
const form = document.getElementById("simulacaoForm");
const revealItems = document.querySelectorAll(".section-reveal");

year.textContent = new Date().getFullYear();

function closeMenu() {
  menu?.classList.remove("is-open");
  toggle?.classList.remove("is-active");
  toggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

toggle?.addEventListener("click", () => {
  const open = !menu.classList.contains("is-open");
  menu.classList.toggle("is-open", open);
  toggle.classList.toggle("is-active", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("menu-open", open);
});

document.addEventListener("click", (event) => {
  if (!menu?.classList.contains("is-open")) return;
  const clickedInsideMenu = menu.contains(event.target);
  const clickedToggle = toggle.contains(event.target);

  if (!clickedInsideMenu && !clickedToggle) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const message = [
    "Olá Solsun! Quero uma simulação gratuita de energia solar.",
    "",
    `Nome: ${data.nome}`,
    `Telefone: ${data.telefone}`,
    `E-mail: ${data.email || "Não informado"}`,
    `Consumo médio: ${data.kwh} kWh/mês`,
    `Cidade: ${data.cidade}`,
    `Estado: ${data.estado}`,
  ].join("\n");

  const url = `https://wa.me/5513981122966?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -70px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
