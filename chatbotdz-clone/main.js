// ===========================
// CHATBOT DZ - MAIN.JS
// ===========================

// ── Sticky Header ──────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger Menu ─────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Language Switch ────────────────────────
document.getElementById('btnAr').addEventListener('click', function () {
  this.classList.add('active');
  document.getElementById('btnFr').classList.remove('active');
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';
});
document.getElementById('btnFr').addEventListener('click', function () {
  this.classList.add('active');
  document.getElementById('btnAr').classList.remove('active');
  // Simple FR toggle placeholder – extend with i18n as needed
  document.documentElement.lang = 'fr';
});

// ── Fade-In on Scroll (Intersection Observer) ──
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings that appear at the same time
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add stagger delays to grid children
document.querySelectorAll('.features-grid .feature-card, .integrations-grid .int-card, .pricing-grid .pricing-card').forEach((el, i) => {
  el.dataset.delay = i * 80;
});

fadeEls.forEach(el => observer.observe(el));

// ── Counter Animation ──────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('ar-DZ');
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── FAQ Accordion ──────────────────────────
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = btn.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-q.open').forEach(q => {
    q.classList.remove('open');
    q.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
  });

  // Open clicked (if it was closed)
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ── Chat Bot Demo ──────────────────────────
const botResponses = {
  'كم سعر الشحن': 'الشحن مجاني على الطلبات فوق 3000 دج 🚚 وإلا 200 دج فقط في جميع أنحاء الجزائر!',
  'واش عندكم': 'نعم عندنا مجموعة كاملة! 😊 شوف الكتالوج من هنا أو اخبرني بالمنتج اللي تبحث عليه.',
  'كيفاش نرجع': 'الإرجاع مقبول خلال 7 أيام من الاستلام. تواصل معنا مباشرة وسنرتب كل شيء! 👍',
  'فين متجركم': 'متجرنا 100% أونلاين 💻 نوصلك لأي ولاية في الجزائر خلال 24-48 ساعة!',
  'وقت التوصيل': 'التوصيل في 24-48 ساعة للعواصم وولايات الشمال، و3-5 أيام للجنوب 📦',
  'default': 'شكراً على سؤالك! فريقنا سيرد عليك في أقرب وقت. للاستفسار العاجل تواصل معنا مباشرة 😊'
};

function getBotReply(text) {
  for (const [key, reply] of Object.entries(botResponses)) {
    if (key !== 'default' && text.includes(key)) return reply;
  }
  return botResponses.default;
}

function appendMsg(text, type) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingIndicator';
  div.textContent = '...';
  div.style.opacity = '0.6';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function sendMessage(text) {
  if (!text.trim()) return;
  appendMsg(text, 'user');
  showTyping();
  setTimeout(() => {
    removeTyping();
    appendMsg(getBotReply(text), 'bot');
  }, 900 + Math.random() * 500);
}

document.getElementById('chatSend').addEventListener('click', () => {
  const input = document.getElementById('chatInput');
  sendMessage(input.value);
  input.value = '';
});

document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const input = e.target;
    sendMessage(input.value);
    input.value = '';
  }
});

function sendSugg(btn) {
  sendMessage(btn.textContent);
}

// ── Active Nav link on scroll ──────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.background = '';
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.background = 'var(--blue-light)';
      a.style.color = 'var(--blue)';
    }
  });
});

// ── Editor Save/Preview buttons ───────────
document.querySelector('.ed-save')?.addEventListener('click', function () {
  this.textContent = '✅ تم الحفظ!';
  setTimeout(() => this.textContent = '💾 حفظ', 1800);
});
document.querySelector('.ed-preview')?.addEventListener('click', () => {
  document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' });
});
