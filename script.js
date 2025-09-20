// menu mobile
const toggle=document.querySelector('.nav__toggle');
const links=document.querySelector('.nav__links');
toggle?.addEventListener('click',()=>{
  const open=links.classList.toggle('show');
  toggle.setAttribute('aria-expanded',open?'true':'false');
});

// ano no footer
document.getElementById('year').textContent=new Date().getFullYear();

// scroll suave
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id).scrollIntoView({behavior:'smooth'});
      links.classList.remove('show');
      toggle?.setAttribute('aria-expanded','false');
    }
  });
});

// formulário abre WhatsApp
const form = document.getElementById('simulacaoForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const msg = `Olá Solsun! Quero simulação.%0A
Nome: ${encodeURIComponent(data.nome)}%0A
Telefone: ${encodeURIComponent(data.telefone)}%0A
Email: ${encodeURIComponent(data.email || '')}%0A
Consumo: ${encodeURIComponent(data.kwh)} kWh/mês%0A
Cidade: ${encodeURIComponent(data.cidade)}%0A
Estado: ${encodeURIComponent(data.estado)}`;
  
  window.open(`https://wa.me/5513981122966?text=${msg}`, '_blank');
});



// scrollspy vantagens
const bands=document.querySelectorAll('.band');
const pillMap=new Map([...document.querySelectorAll('.vant-pill')].map(p=>[p.getAttribute('href').replace('#',''),p]));
const obs=new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const id=en.target.id;
      document.querySelectorAll('.vant-pill').forEach(x=>x.classList.remove('active'));
      pillMap.get(id)?.classList.add('active');
    }
  });
},{threshold:0.51});
bands.forEach(b=>obs.observe(b));


// ===== FAQ Hierárquico =====
(function(){
  const fab = document.getElementById('faqFab');
  const box = document.getElementById('faqBox');
  const closeBtn = document.getElementById('faqClose');
  const listEl = document.getElementById('faqList');
  const ansWrap = document.getElementById('faqAnswer');
  const qEl = document.getElementById('faqQuestion');
  const aEl = document.getElementById('faqText');
  const backBtn = document.getElementById('faqBack');
  const crumbs = document.getElementById('faqCrumbs');

  // Árvore: Categoria -> Tópico/Pergunta -> (subtópico opcional) -> Resposta (string)
  const TREE = {
    "Economia & Payback": {
      "Quanto posso economizar?": "A economia típica varia de 50% a 95% da fatura, conforme consumo, irradiação local e tamanho do sistema.",
      "Qual o payback médio?": "Em residências, 2–6 anos. Em comércios/indústrias pode ser menor devido ao perfil de consumo.",
      "Conta zera?": "A tarifa mínima e alguns encargos permanecem; o sistema reduz muito a conta, mas raramente zera 100%."
    },
    "Financiamento": {
      "Posso financiar?": "Sim. Há linhas específicas; muitas vezes a parcela fica próxima da economia mensal obtida.",
      "Taxas e prazos": "Bancos oferecem 24–72 meses (ou mais). Taxas variam por perfil e instituição.",
      "O que preciso enviar?": "Conta de luz recente, dados do titular e endereço; para PJ, CNPJ e cadastral."
    },
    "Projeto & Dimensionamento": {
      "Qual espaço preciso no telhado?": "Em média 10–15 m² por kWp instalado (varia por módulo e estrutura).",
      "Como dimensionam o sistema?": "Usamos consumo (kWh), irradiação da região e área disponível para definir kWp e quantidade de módulos.",
      "Serve para residência e empresa?": "Sim. Projetamos para residências, comércios, indústrias e propriedades rurais."
    },
    "Instalação & Homologação": {
      "Quanto tempo leva?": "Projeto + homologação + instalação: ~20–60 dias, variando pela concessionária.",
      "Precisa de aprovação da concessionária?": "Sim. Abrimos o processo e cuidamos de toda a documentação para você.",
      "Documentos necessários": "Conta de luz, dados do titular e do imóvel; em empresas, CNPJ e dados cadastrais."
    },
    "Equipamentos": {
      "Vida útil dos painéis": "25+ anos. Garantia de performance típica até 25 anos.",
      "Garantia dos módulos": "10–12 anos contra defeitos + garantia de performance (ex.: >80% ao fim do período).",
      "Garantia do inversor": "Geralmente 5 anos; pode haver extensão para 7–10 anos conforme fabricante.",
      "On-grid vs Off-grid": {
        "O que é on-grid?": "Sistema conectado à rede, compensa energia via créditos; não exige baterias.",
        "O que é off-grid?": "Sistema com baterias, sem conexão à rede; indicado para locais remotos ou backup total."
      }
    },
    "Operação & Monitoramento": {
      "Funciona em dias nublados?": "Sim, mas gera menos; a produção varia com a irradiação e temperatura.",
      "Posso monitorar pelo celular?": "Sim. Aplicativo/web do inversor mostra geração e, em alguns casos, consumo.",
      "Uso de baterias": "Opcionais para backup/autonomia. Em on-grid comum, não são obrigatórias."
    },
    "Manutenção": {
      "É necessário fazer manutenção?": "Baixa manutenção: limpezas periódicas e inspeções anuais.",
      "Limpeza e periodicidade": "Depende da poeira/poluição local; em geral, 1–2 limpezas por ano bastam.",
      "Quem faz assistência?": "Nossa equipe técnica ou autorizadas do fabricante prestam suporte."
    },
    "Regulatório & Conta": {
      "Como funciona a compensação de energia?": "A energia excedente vira créditos que compensam consumos futuros conforme as regras da distribuidora.",
      "Haverá mudanças nas regras?": "O marco legal da GD traz regras escalonadas; analisamos seu caso conforme a data e a distribuidora.",
      "Impostos e bandeiras": "Créditos compensam energia; encargos e tarifas mínimas podem continuar conforme regulamento."
    },
    "Quero Simulação": {
      "Como pedir uma simulação?": "Informe consumo médio (kWh), cidade e contato. Clique no botão abaixo para enviar pelo WhatsApp."
    }
  };

  const path = []; // índices/labels escolhidos

  function setCrumbs() {
    if (!path.length) { crumbs.textContent = "Categorias"; return; }
    const parts = [];
    path.forEach((label, i) => {
      if (i < path.length - 1) {
        const a = document.createElement('a');
        a.textContent = label;
        a.addEventListener('click', () => { path.length = i + 1; render(); });
        parts.push(a);
        parts.push(document.createTextNode(" / "));
      } else {
        parts.push(document.createTextNode(label));
      }
    });
    crumbs.innerHTML = "";
    parts.forEach(el => crumbs.appendChild(el));
  }

  function getNode() {
    let node = TREE;
    for (const key of path) node = node[key];
    return node;
  }

  function renderList(node) {
    listEl.innerHTML = "";
    Object.keys(node).forEach(key => {
      const val = node[key];
      const item = document.createElement('button');
      item.className = 'faqitem';
      item.innerHTML = `<span>${key}</span><small>${typeof val === 'string' ? 'Resposta' : 'Abrir'}</small>`;
      item.addEventListener('click', () => {
        path.push(key);
        render();
      });
      listEl.appendChild(item);
    });
    listEl.hidden = false;
    ansWrap.hidden = true;
  }

  function renderAnswer(question, text) {
    qEl.textContent = question;
    aEl.textContent = text;
    listEl.hidden = true;
    ansWrap.hidden = false;
  }

  function render() {
    setCrumbs();
    const node = getNode();
    backBtn.disabled = path.length === 0;

    if (typeof node === 'string') {
      // estamos em uma folha (resposta)
      const question = path[path.length - 1];
      renderAnswer(question, node);
    } else {
      renderList(node);
    }
  }

  // abrir/fechar
  const toggle = (show) => {
    const willShow = show ?? !box.classList.contains('show');
    box.classList.toggle('show', willShow);
    box.setAttribute('aria-hidden', willShow ? 'false' : 'true');
    if (willShow) render();
  };
  fab?.addEventListener('click', () => toggle(true));
  closeBtn?.addEventListener('click', () => toggle(false));

  // voltar
  backBtn?.addEventListener('click', () => {
    if (!path.length) return;
    path.pop();
    render();
  });
})();
