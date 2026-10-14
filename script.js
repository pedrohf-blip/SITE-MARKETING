'use strict';
/* ===== CONFIGURAÇÕES: edite aqui ===== */
const CONFIG = {
  whatsapp: '5519988375035',            // só números: 55 + 19 + número (ex.: 5519988375035)
  email: '',                          // ex.: contato@seudominio.com (vazio = não aparece)
  instagram: '',                      // ex.: https://instagram.com/seuperfil (vazio = não aparece)
  local: 'Atendimento online'         // ou o nome da sua cidade
};
const MSGS = {
  geral: 'Olá! Vim pelo site da Conexão Freelas e gostaria de solicitar um orçamento.',
  sites: 'Olá! Tenho interesse no serviço de criação de sites. Gostaria de solicitar um orçamento.',
  planilhas: 'Olá! Tenho interesse no serviço de planilhas e organização de dados. Gostaria de solicitar um orçamento.',
  freelancer: 'Olá! Tenho interesse nos serviços freelancer. Gostaria de solicitar um orçamento.'
};
const waLink = t => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(t)}`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Botões de WhatsApp */
$$('[data-wa]').forEach(a => {
  a.href = waLink(MSGS[a.dataset.wa] || MSGS.geral);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});
if (!/^55\d{10,11}$/.test(CONFIG.whatsapp)) console.warn('Conexão Freelas: configure o número real do WhatsApp em CONFIG.whatsapp (script.js).');

/* Contatos opcionais */
if (CONFIG.email) { const m = $('#mail'); m.href = 'mailto:' + CONFIG.email; m.textContent = CONFIG.email; $('[data-contact=email]').hidden = false; }
if (CONFIG.instagram) { const i = $('#insta'); i.href = CONFIG.instagram; i.textContent = 'Instagram'; $('[data-contact=instagram]').hidden = false; }
$('#local').textContent = 'Atendimento: ' + CONFIG.local;
$('#ano').textContent = new Date().getFullYear();

/* Menu mobile */
const btn = $('.menu-btn'), nav = $('#nav');
const setMenu = open => { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); };
btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* Filtros do portfólio */
$$('.chip').forEach(c => c.addEventListener('click', () => {
  $$('.chip').forEach(x => { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', x === c); });
  $$('.proj').forEach(p => { p.hidden = c.dataset.filter !== 'todos' && p.dataset.cat !== c.dataset.filter; });
}));

/* Link da seção atual */
const links = $$('.nav a[href^="#"]:not(.btn)');
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* Entrada suave ao rolar */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), { threshold: .12 });
  $$('.card, .sec h2').forEach(el => { el.classList.add('rv'); rv.observe(el); });
}

/* Formulário: valida e abre o WhatsApp (não há servidor) */
const form = $('#form'), status = $('#status');
const rules = {
  nome: v => v.trim().length >= 2 || 'Informe seu nome.',
  contato: v => v.trim().length >= 5 || 'Informe um WhatsApp ou e-mail para retorno.',
  servico: v => v !== '' || 'Escolha um serviço.',
  desc: v => v.trim().length >= 10 || 'Descreva o projeto em pelo menos 10 caracteres.'
};
form.addEventListener('submit', e => {
  e.preventDefault();
  let first = null;
  for (const k in rules) {
    const f = form.elements[k], r = rules[k](f.value), err = $('#e-' + (k === 'contato' ? 'contato' : k));
    err.textContent = r === true ? '' : r;
    f.setAttribute('aria-invalid', r !== true);
    if (r !== true && !first) first = f;
  }
  if (first) { status.style.color = 'var(--bad)'; status.textContent = 'Corrija os campos destacados.'; first.focus(); return; }
  const d = Object.fromEntries(new FormData(form));
  const txt = `Olá! Meu nome é ${d.nome.trim()}.\nServiço: ${d.servico}\nProjeto: ${d.desc.trim()}\nContato: ${d.contato.trim()}`;
  status.style.color = 'var(--ok)'; status.textContent = 'Tudo certo! Abrindo o WhatsApp com sua mensagem.';
  window.open(waLink(txt), '_blank', 'noopener,noreferrer');
});
