document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
      duration: 800,   // زمان انیمیشن
      once: true,     
      easing: 'ease-out-cubic'
    });
  });

/* ================= Navbar Scroll =================
   تغییر ظاهر نوبار هنگام اسکرول صفحه
*/
const nav = document.querySelector(".navbar");
window.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", window.scrollY > 50)
);


/* ================= Theme Toggle =================
   مدیریت لایت مود و دارک مود + ذخیره در localStorage
*/
const toggle = document.getElementById("themeToggle");
const icon = toggle.querySelector("i");

const saved = localStorage.getItem("theme") || "light";
document.body.classList.add(saved + "-mode");
icon.className = saved === "dark" ? "fas fa-sun" : "fas fa-moon";

toggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  const dark = document.body.classList.contains("dark-mode");
  icon.className = dark ? "fas fa-sun" : "fas fa-moon";
  localStorage.setItem("theme", dark ? "dark" : "light");
};


/* ================= Section Reveal =================
   نمایش سکشن‌ها هنگام ورود به دید کاربر
*/
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add("show"));
}, {
  threshold: .2
});

document.querySelectorAll("section").forEach(s => observer.observe(s));


/* ================= Mobile Menu =================
   باز و بسته شدن منوی موبایل
*/
const mobileMenu = document.getElementById("mobileMenu");
document.getElementById("mobileBtn").onclick = () => mobileMenu.classList.add("show");
mobileMenu.querySelector(".close-btn").onclick = () => mobileMenu.classList.remove("show");


/* ================= About Counters =================
   انیمیشن افزایش اعداد در بخش About (فقط یک‌بار)
*/
const counters = document.querySelectorAll('.count');
let started = false;

window.addEventListener('scroll', () => {
  const about = document.querySelector('#about');
  const pos = about.getBoundingClientRect().top;

  if (pos < window.innerHeight - 150 && !started) {
    counters.forEach(counter => {
      let target = +counter.dataset.target;
      let current = 0;
      let step = target / 80;

      const update = () => {
        current += step;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target + '+';
        }
      };
      update();
    });
    started = true;
  }
});


/* ================= Certificate Lightbox =================
   نمایش تصاویر گواهینامه به‌صورت بزرگ (Lightbox)
*/
const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
document.body.appendChild(lightbox);

const images = document.querySelectorAll('.cert-img');
images.forEach(img => {
  img.addEventListener('click', () => {
    const imgClone = img.cloneNode();
    lightbox.innerHTML = '';
    lightbox.appendChild(imgClone);
    lightbox.classList.add('active');
  });
});

lightbox.addEventListener('click', () => {
  lightbox.classList.remove('active');
});


/* ================= About Typing Effect =================
   افکت تایپ شدن متن در بخش About
*/
(() => {
  const heading = document.getElementById("aboutType");
  const words = heading.querySelectorAll("[data-word]");
  let index = 0;

  words.forEach(w => w.textContent = "");

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    typeWords();
  }, {
    threshold: 0.6
  });

  observer.observe(heading);

  const BASE_SPEED = 55;
  const VARIANCE = 15;

  function delay() {
    return BASE_SPEED + Math.random() * VARIANCE;
  }

  function typeWords() {
    if (index >= words.length) return;

    const el = words[index];
    const text = el.dataset.word;
    let char = 0;

    function typeChar() {
      if (char < text.length) {
        el.textContent += text.charAt(char);
        char++;
        setTimeout(typeChar, delay());
      } else {
        if (el.classList.contains("highlight")) {
          setTimeout(() => el.classList.add("active"), 120);
        }
        index++;
        setTimeout(typeWords, 260);
      }
    }

    typeChar();
  }
})();


/* ================= Services Active State =================
   مشخص کردن سرویس فعال هنگام کلیک
*/
document.querySelectorAll('.service-item').forEach(item => {
  item.onclick = () => {
    document.querySelectorAll('.service-item')
      .forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  }
});


/* ================= Skills Toggle =================
   سوییچ بین دسته‌بندی مهارت‌ها
*/
const toggleButtons = document.querySelectorAll(".toggle-btn");
const skillGrids = document.querySelectorAll(".skills-grid");

toggleButtons.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    toggleButtons.forEach(b => b.classList.remove("active"));
    skillGrids.forEach(g => g.classList.remove("active"));

    btn.classList.add("active");
    skillGrids[i].classList.add("active");
  });
});


/* ================= Skills Progress Ring =================
   انیمیشن دایره‌ای درصد مهارت‌ها
*/
const skills = document.querySelectorAll(".skill");

const ringObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const skill = entry.target;
    const percentEl = skill.querySelector(".percent");
    const circle = skill.querySelector(".progress-ring__circle");

    const target = parseInt(percentEl.textContent);
    const radius = 52;
    const circumference = 2 * Math.PI * radius;

    if (target >= 85) skill.dataset.level = "high";
    else if (target >= 65) skill.dataset.level = "mid";
    else skill.dataset.level = "low";

    let start = null;

    function animate(time) {
      if (!start) start = time;
      const progress = Math.min((time - start) / 1200, 1);
      const value = Math.floor(progress * target);

      percentEl.textContent = value + "%";
      circle.style.strokeDashoffset =
        circumference - (value / 100) * circumference;

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    ringObserver.unobserve(skill);
  });
}, {
  threshold: 0.45
});

skills.forEach(skill => ringObserver.observe(skill));


// scrool bar animation 
document.addEventListener("DOMContentLoaded", () => {

  const sections = document.querySelectorAll(".sr-section");

  const srObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const section = entry.target;
        section.classList.add("sr-active");

        const items = section.querySelectorAll(".sr-item");

        // Mobile or Desktop
        const isMobile = window.innerWidth < 768;

        items.forEach((el, i) => {
          if (isMobile) {
            // mobile: stagger item by item
            el.style.transitionDelay = `${i * 120}ms`;
          } else {
            // desktop: all in same row at same time (row stagger minimal)
            el.style.transitionDelay = `${Math.floor(i / 3) * 120}ms`;
          }
          el.classList.add("sr-active");
        });

        observer.unobserve(section);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  sections.forEach(sec => srObserver.observe(sec));
});

/* ================= Projects Background Bubbles =================
   ایجاد حباب‌های متحرک پس‌زمینه صفحه پروژه‌ها
*/
const page = document.querySelector('.projects-page');

for (let i = 0; i < 30; i++) {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  const size = Math.random() * 100 + 40;
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';
  bubble.style.left = Math.random() * 100 + 'vw';
  bubble.style.animationDuration = (Math.random() * 20 + 10) + 's';
  bubble.style.animationDelay = Math.random() * 10 + 's';
  page.appendChild(bubble);
};