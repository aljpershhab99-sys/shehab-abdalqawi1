// ===== SAFE MODE (prevents blank pages) =====
window.addEventListener("error", (e) => {
  console.log("JS Error:", e.message);
});

/* js/main.js */
(function () {
  // Enable JS mode for reveal fallback
  document.documentElement.classList.remove("no-js");

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // -----------------------
  // Active link highlight
  // -----------------------
  const path = location.pathname.split("/").pop();
  $$(".nav a[data-page]").forEach(a => {
    if (a.getAttribute("data-page") === path) a.classList.add("active");
  });

  // -----------------------
  // Mobile menu
  // -----------------------
  const burger = $("#burger");
  const mobileMenu = $("#mobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  }

  // -----------------------
  // Reveal animation (safe)
  // -----------------------
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    }, { threshold: 0.12 });

    $$(".reveal").forEach(el => io.observe(el));
  } else {
    // fallback: show everything
    $$(".reveal").forEach(el => el.classList.add("show"));
  }

  // -----------------------
  // Fix paths automatically
  // -----------------------
  const isInPages = location.pathname.includes("/pages/");
  const prefix = isInPages ? "../" : "";

  function fixPath(p){
    if (!p) return p;
    if (p.startsWith("http")) return p;
    if (p.startsWith("../") || p.startsWith("./")) return p;
    return prefix + p;
  }

  // -----------------------
  // Modal
  // -----------------------
  const modal = $("#modal");
  const modalTitle = $("#modalTitle");
  const modalImg = $("#modalImg");
  const modalText = $("#modalText");
  const modalList = $("#modalList");
  const modalClose = $("#modalClose");

  function openModal(item){
    if (!modal) return;
    modalTitle.textContent = item.title || item.name || "Details";
    modalImg.src = fixPath(item.image);
    modalText.textContent = item.subtitle || item.country || "Explore details";
    modalList.innerHTML = "";

    const bullets = item.facts || item.highlights || [];
    bullets.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      modalList.appendChild(li);
    });

    modal.classList.add("open");
  }

  function closeModal(){
    modal?.classList.remove("open");
  }

  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // -----------------------
  // Render cards (Cities/Islands/Universities)
  // -----------------------
  function renderCards(list, container, type){
    container.innerHTML = "";

    list.forEach(item => {
      const card = document.createElement("article");
      card.className = "card reveal";

      const imgSrc = fixPath(item.image);

      const detailsHref =
        type === "city"
          ? `${prefix}data/city-details.html?id=${item.id}`
          : type === "island"
            ? `${prefix}data/island-details.html?id=${item.id}`
            : `#`;

      card.innerHTML = `
        <img src="${imgSrc}" alt="${item.title || item.name}" loading="lazy">
        <div class="card-body">
          <h4>${item.title || item.name}</h4>
          <p>${item.subtitle || item.country || "Explore details"}</p>
        </div>
        <div class="card-actions">
          <button class="btn primary" data-open>Details</button>
          ${type === "uni" ? "" : `<a class="btn" href="${detailsHref}">View</a>`}
        </div>
      `;

      container.appendChild(card);

      if (io) io.observe(card);
      else card.classList.add("show");

      card.querySelector("[data-open]")?.addEventListener("click", (ev) => {
        ev.preventDefault();
        openModal(item);
      });
    });
  }

  // -----------------------
  // Cities page
  // -----------------------
  const citiesGrid = $("#citiesGrid");
  if (citiesGrid) {
    const data = window.AETHERIA_DATA?.cities || [];
    const q = $("#q");
    const sort = $("#sort");
    const count = $("#count");

    function apply(){
      let out = [...data];
      const term = (q?.value || "").trim().toLowerCase();
      if (term) out = out.filter(x => (x.title + " " + x.subtitle).toLowerCase().includes(term));

      if (sort?.value === "az") out.sort((a,b) => a.title.localeCompare(b.title));
      if (sort?.value === "za") out.sort((a,b) => b.title.localeCompare(a.title));

      if (count) count.textContent = `${out.length} results`;
      renderCards(out, citiesGrid, "city");
    }

    q?.addEventListener("input", apply);
    sort?.addEventListener("change", apply);
    apply();
  }

  // -----------------------
  // Islands page
  // -----------------------
  const islandsGrid = $("#islandsGrid");
  if (islandsGrid) {
    const data = window.AETHERIA_DATA?.islands || [];
    const q2 = $("#q");
    const sort2 = $("#sort");
    const count2 = $("#count");

    function apply(){
      let out = [...data];
      const term = (q2?.value || "").trim().toLowerCase();
      if (term) out = out.filter(x => (x.title + " " + x.subtitle).toLowerCase().includes(term));

      if (sort2?.value === "az") out.sort((a,b) => a.title.localeCompare(b.title));
      if (sort2?.value === "za") out.sort((a,b) => b.title.localeCompare(a.title));

      if (count2) count2.textContent = `${out.length} results`;
      renderCards(out, islandsGrid, "island");
    }

    q2?.addEventListener("input", apply);
    sort2?.addEventListener("change", apply);
    apply();
  }

  // -----------------------
  // University page
  // -----------------------
  const uniGrid = $("#uniGrid");
  if (uniGrid) {
    const data = window.AETHERIA_DATA?.universities || [];
    const q = $("#q");
    const filter = $("#filter");
    const count = $("#count");

    if (filter) {
      const countries = [...new Set(data.map(x => x.country))].sort();
      countries.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        filter.appendChild(opt);
      });
    }

    function apply(){
      let out = [...data];
      const term = (q?.value || "").trim().toLowerCase();
      if (term) out = out.filter(x => x.name.toLowerCase().includes(term));
      if (filter?.value) out = out.filter(x => x.country === filter.value);

      if (count) count.textContent = `${out.length} results`;

      renderCards(out.map(u => ({
        id: u.id,
        title: u.name,
        subtitle: u.country,
        image: u.image,
        facts: u.highlights
      })), uniGrid, "uni");
    }

    q?.addEventListener("input", apply);
    filter?.addEventListener("change", apply);
    apply();
  }

  // -----------------------
  // Toast
  // -----------------------
  window.showToast = function (msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2400);
  };

})();
// =========================
// WOW Contact UX (safe + optional)
// =========================
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return; // runs only on contact page

  const nameEl = document.getElementById("cName");
  const emailEl = document.getElementById("cEmail");
  const subjectEl = document.getElementById("cSubject");
  const msgEl = document.getElementById("cMessage");
  const statusEl = document.getElementById("contactStatus");
  const sendBtn = form.querySelector('button[type="submit"]');

  // 1) Auto-grow textarea
  if (msgEl) {
    const grow = () => {
      msgEl.style.height = "auto";
      msgEl.style.height = Math.min(msgEl.scrollHeight, 260) + "px";
    };
    ["input", "change"].forEach(ev => msgEl.addEventListener(ev, grow));
    grow();
  }

  // 2) Remember name/email locally (nice UX)
  try {
    const saved = JSON.parse(localStorage.getItem("aetheria_contact_prefill") || "{}");
    if (saved?.name && nameEl && !nameEl.value) nameEl.value = saved.name;
    if (saved?.email && emailEl && !emailEl.value) emailEl.value = saved.email;
  } catch {}

  const savePrefill = () => {
    try {
      localStorage.setItem("aetheria_contact_prefill", JSON.stringify({
        name: nameEl?.value?.trim() || "",
        email: emailEl?.value?.trim() || ""
      }));
    } catch {}
  };

  nameEl?.addEventListener("input", savePrefill);
  emailEl?.addEventListener("input", savePrefill);

  // 3) Loading state + mini confetti on success
  const setLoading = (on) => {
    if (!sendBtn) return;
    sendBtn.disabled = !!on;
    sendBtn.dataset.oldText ||= sendBtn.textContent.trim();
    sendBtn.textContent = on ? "Sending..." : sendBtn.dataset.oldText;
    sendBtn.style.opacity = on ? ".85" : "1";
  };

  const confettiMini = () => {
    // lightweight confetti without libs
    const wrap = document.createElement("div");
    wrap.style.position = "fixed";
    wrap.style.inset = "0";
    wrap.style.pointerEvents = "none";
    wrap.style.zIndex = "9999";
    document.body.appendChild(wrap);

    const N = 28;
    for (let i = 0; i < N; i++) {
      const p = document.createElement("span");
      p.style.position = "absolute";
      p.style.left = (50 + (Math.random() * 20 - 10)) + "vw";
      p.style.top = "12vh";
      p.style.width = (6 + Math.random() * 6) + "px";
      p.style.height = (10 + Math.random() * 12) + "px";
      p.style.borderRadius = "3px";
      p.style.opacity = "0.9";
      p.style.transform = `translate(${(Math.random()*200-100)}px, 0) rotate(${Math.random()*180}deg)`;
      p.style.background = Math.random() > 0.5 ? "rgba(201,168,106,.85)" : "rgba(112,183,255,.85)";
      p.style.filter = "blur(.1px)";
      p.style.transition = "transform 900ms ease, opacity 900ms ease";
      wrap.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translate(${(Math.random()*520-260)}px, ${420 + Math.random()*220}px) rotate(${360 + Math.random()*360}deg)`;
        p.style.opacity = "0";
      });
    }

    setTimeout(() => wrap.remove(), 950);
  };

  // Hook submit: only adds UX. Actual validation+save is in validation.js
  form.addEventListener("submit", () => {
    setLoading(true);

    // wait a bit to let validation.js set status
    setTimeout(() => {
      setLoading(false);

      const ok = statusEl && statusEl.classList.contains("ok");
      if (ok) confettiMini();

      // also keep prefill updated
      savePrefill();
    }, 450);
  }, true);
})();
