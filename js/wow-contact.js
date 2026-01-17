/* js/wow-contact.js */
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("contactStatus");

  const fields = [
    { id: "cName", min: 2, msg: "Please enter your name." },
    { id: "cEmail", min: 5, msg: "Please enter a valid email." },
    { id: "cSubject", min: 3, msg: "Please write a short subject." },
    { id: "cMessage", min: 12, msg: "Message is too short — add more detail." },
  ];

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function setStatus(text, type) {
    if (!status) return;
    status.textContent = text;
    status.className = "hint " + (type || "");
  }

  function shake(el) {
    // شغّل الحركة حتى لو تكررت
    el.classList.remove("shake");
    // force reflow
    void el.offsetWidth;
    el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"), 420);
  }

  function setFieldError(input, message) {
    const field = input.closest(".field");
    const err = field ? field.querySelector(".error") : null;
    if (err) {
      err.textContent = message;
      err.classList.add("show");
    }
    input.classList.add("bad");
  }

  function clearFieldError(input) {
    const field = input.closest(".field");
    const err = field ? field.querySelector(".error") : null;
    if (err) err.classList.remove("show");
    input.classList.remove("bad");
  }

  // تنظيف الأخطاء أثناء الكتابة
  fields.forEach(({ id }) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => clearFieldError(input));
  });
console.log("wow-contact Loaded");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // clear previous
    setStatus("", "");
    fields.forEach(({ id }) => {
      const input = document.getElementById(id);
      if (input) clearFieldError(input);
    });

    let ok = true;
    let firstBad = null;

    for (const f of fields) {
      const input = document.getElementById(f.id);
      if (!input) continue;

      const v = (input.value || "").trim();

      if (f.id === "cEmail") {
        if (!isEmail(v)) {
          ok = false;
          firstBad ||= input;
          setFieldError(input, f.msg);
        }
      } else {
        if (v.length < f.min) {
          ok = false;
          firstBad ||= input;
          setFieldError(input, f.msg);
        }
      }
    }

    if (!ok) {
      // اهتزاز (الفورم + أول خانة غلط)
      shake(form);
      if (firstBad) {
        shake(firstBad);
        firstBad.focus({ preventScroll: false });
      }
      setStatus("Please fix the highlighted fields.", "err");
      return;
    }

    // Demo save (local only)
    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const subject = document.getElementById("cSubject").value.trim();
    const message = document.getElementById("cMessage").value.trim();

    const inbox = JSON.parse(localStorage.getItem("aetheria_inbox") || "[]");
    inbox.unshift({ name, email, subject, message, time: new Date().toISOString() });
    localStorage.setItem("aetheria_inbox", JSON.stringify(inbox));

    form.reset();
    setStatus("Message sent ✅ (demo saved locally)", "ok");
  });
})();
