/* js/wow-register.js */
(() => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const inputs = form.querySelectorAll(".input, textarea, select");

  // Small entrance animation
  form.classList.add("wow-form");
  inputs.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity .45s ease, transform .45s ease";
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 70 * (i + 1));
  });

  // Soft shake when validation shows errors
  form.addEventListener("submit", () => {
    setTimeout(() => {
      const hasError = form.querySelector(".error.show");
      if (!hasError) return;
      form.classList.remove("shake");
      void form.offsetWidth; // reflow
      form.classList.add("shake");
    }, 0);
  });
})();
