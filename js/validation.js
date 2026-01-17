/* js/validation.js */
(function(){
  const $ = (s, root=document) => root.querySelector(s);

  function setError(el, msg){
    const field = el.closest(".field");
    const err = field?.querySelector(".error");
    if (!err) return;
    err.textContent = msg;
    err.classList.add("show");
    el.classList.add("shake");
    setTimeout(() => el.classList.remove("shake"), 380);
  }

  function clearError(el){
    const field = el.closest(".field");
    const err = field?.querySelector(".error");
    if (!err) return;
    err.classList.remove("show");
  }

  function isEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  // -----------------------
  // REGISTER
  // -----------------------
  const registerForm = $("#registerForm");
  if (registerForm){
    const name = $("#rName");
    const email = $("#rEmail");
    const pass = $("#rPass");
    const pass2 = $("#rPass2");
    const strength = $("#passStrength");

    function scorePassword(p){
      let s = 0;
      if (p.length >= 8) s += 1;
      if (/[A-Z]/.test(p)) s += 1;
      if (/[0-9]/.test(p)) s += 1;
      if (/[^A-Za-z0-9]/.test(p)) s += 1;
      return s;
    }

    pass?.addEventListener("input", () => {
      const s = scorePassword(pass.value);
      const label = ["Weak", "Okay", "Good", "Strong", "Excellent"][s] || "Weak";
      if (strength) strength.textContent = `Password strength: ${label}`;
    });

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      [name,email,pass,pass2].forEach(clearError);

      const n = name.value.trim();
      const em = email.value.trim().toLowerCase();
      const p = pass.value;
      const p2 = pass2.value;

      let ok = true;
      if (n.length < 3){ setError(name, "Write your full name."); ok=false; }
      if (!isEmail(em)){ setError(email, "Write a valid email."); ok=false; }
      if (p.length < 8){ setError(pass, "Password must be at least 8 characters."); ok=false; }
      if (p !== p2){ setError(pass2, "Passwords do not match."); ok=false; }
      if (!ok) return;

      const users = JSON.parse(localStorage.getItem("aetheria_users") || "[]");
      if (users.some(u => u.email === em)){
        setError(email, "This email is already registered.");
        return;
      }

      users.push({ name:n, email:em, pass:p });
      localStorage.setItem("aetheria_users", JSON.stringify(users));

      localStorage.setItem("aetheria_session", JSON.stringify({ email: em, name: n, at: Date.now() }));
      window.showToast?.("Account created. Welcome!");
      setTimeout(() => location.href = "../index.html", 700);
    });
  }

  // -----------------------
  // LOGIN
  // -----------------------
  const loginForm = $("#loginForm");
  if (loginForm){
    const email = $("#lEmail");
    const pass = $("#lPass");

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      [email,pass].forEach(clearError);

      const em = email.value.trim().toLowerCase();
      const p = pass.value;

      let ok = true;
      if (!isEmail(em)){ setError(email, "Write a valid email."); ok=false; }
      if (!p){ setError(pass, "Write your password."); ok=false; }
      if (!ok) return;

      const users = JSON.parse(localStorage.getItem("aetheria_users") || "[]");
      const found = users.find(u => u.email === em && u.pass === p);
      if (!found){
        setError(pass, "Email or password is incorrect.");
        return;
      }

      localStorage.setItem("aetheria_session", JSON.stringify({ email: em, name: found.name, at: Date.now() }));
      window.showToast?.("Welcome back!");
      setTimeout(() => location.href = "../index.html", 650);
    });
  }

  // -----------------------
  // CONTACT (WOW)
  // -----------------------
  const contactForm = $("#contactForm");
  const contactStatus = $("#contactStatus");
  if (contactForm && contactStatus){
    const name = $("#cName");
    const email = $("#cEmail");
    const subject = $("#cSubject");
    const msg = $("#cMessage");

    const setStatus = (text, type) => {
      contactStatus.className = "status " + (type || "");
      contactStatus.textContent = text;
      contactStatus.style.display = "block";
    };

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      [name,email,subject,msg].forEach(clearError);

      let ok = true;

      if (name.value.trim().length < 2){ setError(name, "Please enter your name."); ok=false; }
      if (!isEmail(email.value.trim())){ setError(email, "Please enter a valid email."); ok=false; }
      if (subject.value.trim().length < 3){ setError(subject, "Subject is too short."); ok=false; }
      if (msg.value.trim().length < 12){ setError(msg, "Message is too short — add more details."); ok=false; }

      if (!ok){
        setStatus("Fix the highlighted fields and try again.", "err");
        window.showToast?.("Check fields");
        return;
      }

      // Demo save in localStorage
      const inbox = JSON.parse(localStorage.getItem("aetheria_inbox") || "[]");
      inbox.unshift({
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: msg.value.trim(),
        time: new Date().toISOString()
      });
      localStorage.setItem("aetheria_inbox", JSON.stringify(inbox));

      contactForm.reset();
      setStatus("Message sent successfully ✅ Thank you!", "ok");
      window.showToast?.("Saved");
    });
  }

  // -----------------------
  // Show/Hide password
  // -----------------------
  document.querySelectorAll("[data-toggle-pass]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-toggle-pass");
      const input = document.getElementById(id);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });
})();
