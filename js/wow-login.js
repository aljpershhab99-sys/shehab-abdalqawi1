/* =========================================
   WOW Login Interactions (safe - login only)
========================================= */
(() => {
  const form = document.querySelector("#loginForm");
  if (!form) return; // runs only on login page

  const email = document.querySelector("#lEmail");
  const pass = document.querySelector("#lPassword");
  const status = document.querySelector("#loginStatus");

  // ---- Password eye toggle
  const wrap = pass?.closest(".input-wrap");
  const eyeBtn = wrap?.querySelector(".icon-btn");

  if (eyeBtn && pass) {
    eyeBtn.addEventListener("click", () => {
      const isHidden = pass.type === "password";
      pass.type = isHidden ? "text" : "password";
      eyeBtn.setAttribute("aria-pressed", String(isHidden));
      eyeBtn.textContent = isHidden ? "🙈" : "👁";
    });
  }

  // ---- Tiny tilt on the card (if exists)
  const card = document.querySelector(".auth-card.glow");
  if (card) {
    card.addEventListener("mousemove", (e) => {
      const b = card.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width;
      const py = (e.clientY - b.top) / b.height;
      const rx = (py - 0.5) * -6;
      const ry = (px - 0.5) * 8;
      card.style.transform =
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  }

  // ---- Helpers
  const setStatus = (msg, ok = false) => {
    if (!status) return;
    status.textContent = msg;
    status.style.color = ok ? "rgba(180,255,220,.9)" : "rgba(255,210,210,.9)";
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(v).trim());

  const shake = () => {
    form.classList.remove("shake");
    void form.offsetWidth; // restart animation
    form.classList.add("shake");
    setTimeout(() => form.classList.remove("shake"), 450);
  };

  // ---- Submit (demo)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const eVal = email?.value.trim() || "";
    const pVal = pass?.value || "";

    if (!isEmail(eVal)) {
      setStatus("Please enter a valid email.");
      shake();
      email?.focus();
      return;
    }

    if (pVal.length < 6) {
      setStatus("Password must be at least 6 characters.");
      shake();
      pass?.focus();
      return;
    }

    // demo success
    localStorage.setItem("atlas_demo_login", JSON.stringify({ email: eVal, at: Date.now() }));
    setStatus("✅ Login success (demo).", true);

    // small delay then go home (optional)
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 650);
  });
})();
