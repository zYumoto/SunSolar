const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");
const year = document.getElementById("year");
const form = document.getElementById("simulacaoForm");
const revealItems = document.querySelectorAll(".section-reveal");
const progress = document.querySelector(".scroll-progress");
const assistantToggle = document.querySelector(".assistant-toggle");
const assistantPanel = document.querySelector(".assistant-panel");
const assistantClose = document.querySelector(".assistant-close");
const assistantAnswer = document.getElementById("assistantAnswer");
const assistantQuestions = document.querySelectorAll(".assistant-questions button");

const assistantAnswers = {
  economia: {
    title: "Economia estimada",
    text: "A economia costuma chegar a até 95% da conta, dependendo do consumo, tarifa, área disponível e dimensionamento do sistema.",
  },
  payback: {
    title: "Retorno do investimento",
    text: "Em muitos projetos residenciais e comerciais, o payback fica entre 2 e 6 anos. A simulação ajuda a estimar esse prazo com seus dados reais.",
  },
  processo: {
    title: "Processo completo",
    text: "A Solsun analisa sua conta, dimensiona o sistema, prepara o projeto, conduz a aprovação com a concessionária e executa a instalação.",
  },
  documentos: {
    title: "Dados necessários",
    text: "Para começar, normalmente basta enviar uma conta de energia recente, endereço da instalação e dados de contato do titular.",
  },
  manutencao: {
    title: "Baixa manutenção",
    text: "Sistemas fotovoltaicos têm baixa manutenção. O ideal é prever limpezas periódicas e inspeções preventivas para manter a performance.",
  },
};

year.textContent = new Date().getFullYear();

function updateProgress() {
  if (!progress) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}

function closeMenu() {
  menu?.classList.remove("is-open");
  toggle?.classList.remove("is-active");
  toggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function closeAssistant() {
  assistantPanel?.classList.remove("is-open");
  assistantPanel?.setAttribute("aria-hidden", "true");
  assistantToggle?.setAttribute("aria-expanded", "false");
}

function openAssistant() {
  assistantPanel?.classList.add("is-open");
  assistantPanel?.setAttribute("aria-hidden", "false");
  assistantToggle?.setAttribute("aria-expanded", "true");
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
  if (event.key === "Escape") {
    closeMenu();
    closeAssistant();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    closeAssistant();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

assistantToggle?.addEventListener("click", () => {
  const isOpen = assistantPanel?.classList.contains("is-open");
  if (isOpen) {
    closeAssistant();
  } else {
    openAssistant();
  }
});

assistantClose?.addEventListener("click", closeAssistant);

assistantQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.answer;
    const answer = assistantAnswers[key];
    if (!answer || !assistantAnswer) return;

    assistantQuestions.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    assistantAnswer.innerHTML = `<strong>${answer.title}</strong><p>${answer.text}</p>`;
  });
});

assistantQuestions[0]?.classList.add("is-active");

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

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
