/**
 * VELLIA SOLAR PRIVATE — LUXURY LANDING PAGE SCRIPT
 * Veeluen Solutions — Interactions, Calculator, Dashboard & Lead Automation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimatedCounters();
  initDashboardTabs();
  initSavingsCalculator();
  initFaqAccordion();
  initLeadFormModal();
  initPhoneMask();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbarWrap = document.querySelector('.navbar-wrap');
  const menuBtn = document.querySelector('.menu-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrap.classList.add('scrolled');
    } else {
      navbarWrap.classList.remove('scrolled');
    }
  });

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. ANIMATED KPI COUNTERS (SCROLL REVEAL)
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const kpiSection = document.querySelector('.dashboard-kpis-grid');
  if (!kpiSection) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumber('kpi-leads', 482, 1800);
        animateNumber('kpi-propostas', 176, 1800);
        animateNumber('kpi-vendas', 64, 1800);
        animateCurrency('kpi-receita', 1280000, 2000);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(kpiSection);
}

function animateNumber(elementId, targetVal, duration) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeOutQuad * (targetVal - start) + start);
    el.textContent = current.toLocaleString('pt-BR');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = targetVal.toLocaleString('pt-BR');
    }
  }
  requestAnimationFrame(update);
}

function animateCurrency(elementId, targetVal, duration) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeOutQuad * (targetVal - start) + start);
    el.textContent = 'R$ ' + current.toLocaleString('pt-BR');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = 'R$ ' + targetVal.toLocaleString('pt-BR');
    }
  }
  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   3. DASHBOARD INTERACTIVE TABS
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  const tabPanels = document.querySelectorAll('.dash-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. FINANCIAL SAVINGS CALCULATOR (SEÇÃO 7)
   -------------------------------------------------------------------------- */
function initSavingsCalculator() {
  const slider = document.getElementById('calc-monthly-slider');
  const displayMonthly = document.getElementById('calc-display-monthly');
  const cost1Year = document.getElementById('calc-cost-1yr');
  const cost3Years = document.getElementById('calc-cost-3yr');
  const cost5Years = document.getElementById('calc-cost-5yr');
  const savings3Years = document.getElementById('calc-savings-total');

  const VELLIA_PRO_PRICE = 4997;

  if (!slider) return;

  function updateCalculator() {
    const monthly = parseInt(slider.value, 10);
    const val1Yr = monthly * 12;
    const val3Yr = monthly * 36;
    const val5Yr = monthly * 60;
    const netSavings3Yr = Math.max(0, val3Yr - VELLIA_PRO_PRICE);

    if (displayMonthly) displayMonthly.textContent = `R$ ${monthly.toLocaleString('pt-BR')}/mês`;
    if (cost1Year) cost1Year.textContent = `R$ ${val1Yr.toLocaleString('pt-BR')}`;
    if (cost3Years) cost3Years.textContent = `R$ ${val3Yr.toLocaleString('pt-BR')}`;
    if (cost5Years) cost5Years.textContent = `R$ ${val5Yr.toLocaleString('pt-BR')}`;
    if (savings3Years) savings3Years.textContent = `R$ ${netSavings3Yr.toLocaleString('pt-BR')}`;
  }

  slider.addEventListener('input', updateCalculator);
  updateCalculator();
}

/* --------------------------------------------------------------------------
   5. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-question-btn');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. LEAD FORM MODAL & WHATSAPP REDIRECT
   -------------------------------------------------------------------------- */
let selectedPlanGlobal = 'Solar Pro (Mais Indicado)';

function initLeadFormModal() {
  const modal = document.getElementById('lead-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const triggerBtns = document.querySelectorAll('[data-open-modal]');
  const form = document.getElementById('lead-capture-form');
  const planSelect = document.getElementById('lead-plan-select');
  const successBox = document.getElementById('lead-success-state');
  const waDirectBtn = document.getElementById('wa-direct-link-btn');

  // Open modal triggers
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan');
      if (plan) {
        selectedPlanGlobal = plan;
        if (planSelect) planSelect.value = plan;
      }
      if (modal) modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('lead-name')?.value.trim() || '';
      const company = document.getElementById('lead-company')?.value.trim() || '';
      const phone = document.getElementById('lead-phone')?.value.trim() || '';
      const city = document.getElementById('lead-city')?.value.trim() || '';
      const teamSize = document.getElementById('lead-team-size')?.value || '';
      const currentCrm = document.getElementById('lead-current-crm')?.value || '';
      const chosenPlan = planSelect?.value || selectedPlanGlobal;

      // Construct WhatsApp message
      const textMessage = `*SOLICITAÇÃO DE PROPOSTA — VELLIA SOLAR PRIVATE*\n\n` +
        `👤 *Nome:* ${name}\n` +
        `🏢 *Empresa:* ${company}\n` +
        `📍 *Cidade/UF:* ${city}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `👥 *Vendedores:* ${teamSize}\n` +
        `📊 *Usa CRM hoje:* ${currentCrm}\n` +
        `⭐ *Plano de Interesse:* ${chosenPlan}\n\n` +
        `Olá! Gostaria de agendar uma demonstração do sistema próprio Vellia Solar Private e entender os próximos passos da implantação.`;

      const encodedMessage = encodeURIComponent(textMessage);
      // Default official number for Veeluen Solutions / Vellia Solar Private
      const waNumber = '5511999999999'; 
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

      // Update success button
      if (waDirectBtn) {
        waDirectBtn.setAttribute('href', waUrl);
      }

      // Transition to success state
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';

      // Auto redirect after short delay or direct click
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1200);
    });
  }
}

/* --------------------------------------------------------------------------
   7. INPUT MASK FOR BRAZILIAN PHONE NUMBERS
   -------------------------------------------------------------------------- */
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.substring(0, 11);

      if (val.length > 10) {
        // (XX) XXXXX-XXXX
        val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (val.length > 6) {
        // (XX) XXXX-XXXX
        val = val.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (val.length > 2) {
        val = val.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (val.length > 0) {
        val = val.replace(/^(\d{0,2})$/, '($1');
      }

      e.target.value = val;
    });
  });
}
