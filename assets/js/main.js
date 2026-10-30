/* CMV SARL – interactions du site */

document.addEventListener("DOMContentLoaded", () => {
  /* Année automatique */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Menu mobile */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("menuToggle");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    toggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Présélection du service depuis les boutons */
  const serviceSelect = document.getElementById("service");
  document.querySelectorAll("[data-service]").forEach((el) => {
    el.addEventListener("click", () => {
      const wanted = el.dataset.service;
      if ([...serviceSelect.options].some((o) => o.value === wanted || o.text === wanted)) {
        serviceSelect.value = wanted;
      }
    });
  });

  /* Filtres du portfolio */
  const filters = document.querySelectorAll(".filter");
  const works = document.querySelectorAll(".work");
  filters.forEach((btn) => btn.addEventListener("click", () => {
    filters.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    works.forEach((w) => { w.hidden = btn.dataset.filter !== "all" && w.dataset.cat !== btn.dataset.filter; });
  }));

  /* Coordonnées pilotées par la configuration */
  const waBtn = document.getElementById("whatsappBtn");
  const phoneBtn = document.getElementById("phoneBtn");
  const note = document.getElementById("contactNote");
  const footerContact = document.getElementById("footerContact");
  const footerLines = [];

  if (CONFIG.whatsappNumber) {
    waBtn.href = "https://wa.me/" + CONFIG.whatsappNumber;
    waBtn.target = "_blank";
    waBtn.rel = "noopener";
  } else {
    waBtn.setAttribute("aria-disabled", "true");
    waBtn.style.opacity = ".5";
    waBtn.addEventListener("click", (e) => e.preventDefault());
  }
  if (CONFIG.phoneNumber) {
    phoneBtn.href = "tel:" + CONFIG.phoneNumber.replace(/\s/g, "");
    footerLines.push(`<li><a href="${phoneBtn.href}">${CONFIG.phoneNumber}</a></li>`);
  } else {
    phoneBtn.setAttribute("aria-disabled", "true");
    phoneBtn.style.opacity = ".5";
    phoneBtn.addEventListener("click", (e) => e.preventDefault());
  }
  const showItem = (id, value, isLink) => {
    const li = document.getElementById(id);
    if (!value) return;
    li.hidden = false;
    if (isLink) { const a = li.querySelector("a"); a.href = "mailto:" + value; a.textContent = value; }
    else li.querySelector("span").textContent = value;
  };
  showItem("addressItem", CONFIG.address);
  showItem("hoursItem", CONFIG.hours);
  showItem("emailItem", CONFIG.email, true);
  if (CONFIG.email) footerLines.push(`<li><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></li>`);
  if (CONFIG.address) footerLines.push(`<li>${CONFIG.address}</li>`);
  if (footerLines.length) footerContact.innerHTML = footerLines.join("");
  if (CONFIG.whatsappNumber || CONFIG.phoneNumber || CONFIG.email) note.hidden = true;

  /* Réseaux sociaux et liens légaux (uniquement si renseignés) */
  const socials = document.getElementById("socials");
  CONFIG.socials.forEach((s) => {
    const a = document.createElement("a");
    a.href = s.url; a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", s.label);
    a.innerHTML = `<i class="${s.icon}" aria-hidden="true"></i>`;
    socials.appendChild(a);
  });
  const legal = [];
  if (CONFIG.legalUrl) legal.push(`<a href="${CONFIG.legalUrl}">Mentions légales</a>`);
  if (CONFIG.privacyUrl) legal.push(`<a href="${CONFIG.privacyUrl}">Politique de confidentialité</a>`);
  document.getElementById("legalLinks").innerHTML = legal.join(" | ");

  /* Formulaire : validation puis préparation de l'envoi réel */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  const rules = {
    nom: (v) => v.trim().length >= 3 ? "" : "Saisissez votre nom complet (3 caractères minimum).",
    tel: (v) => /^\+?[0-9\s().-]{8,18}$/.test(v.trim()) ? "" : "Saisissez un numéro de téléphone valide (8 chiffres minimum).",
    email: (v) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Saisissez une adresse e-mail valide ou laissez ce champ vide.",
    service: (v) => v ? "" : "Choisissez un service.",
    besoin: (v) => v.trim().length >= 10 ? "" : "Décrivez votre besoin en 10 caractères minimum."
  };

  const check = (name) => {
    const input = form.elements[name];
    const msg = rules[name](input.value);
    document.getElementById("err-" + name).textContent = msg;
    input.closest(".field").classList.toggle("invalid", Boolean(msg));
    input.setAttribute("aria-invalid", String(Boolean(msg)));
    return !msg;
  };
  Object.keys(rules).forEach((n) => form.elements[n].addEventListener("blur", () => check(n)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.className = "form-status";
    const results = Object.keys(rules).map(check);
    if (results.includes(false)) {
      status.textContent = "Veuillez corriger les champs signalés.";
      form.querySelector("[aria-invalid='true']").focus();
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const text = [
      "Bonjour CMV SARL,",
      `Nom : ${d.nom.trim()}`,
      `Téléphone : ${d.tel.trim()}`,
      d.email.trim() ? `E-mail : ${d.email.trim()}` : "",
      `Service : ${d.service}`,
      `Besoin : ${d.besoin.trim()}`
    ].filter(Boolean).join("\n");

    if (CONFIG.whatsappNumber) {
      window.open("https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      status.textContent = "WhatsApp s'ouvre avec votre demande. Appuyez sur Envoyer dans WhatsApp pour la transmettre.";
      status.classList.add("ok");
    } else if (CONFIG.email) {
      window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Demande : " + d.service) + "&body=" + encodeURIComponent(text);
      status.textContent = "Votre application e-mail s'ouvre avec la demande. Envoyez-la pour la transmettre.";
      status.classList.add("ok");
    } else {
      status.textContent = "Votre demande n'a pas été envoyée : aucun canal de réception n'est encore configuré sur ce site.";
    }
  });


  /* Apparition discrète des sections */
  const targets = document.querySelectorAll(".section-head, .card, .why, .work");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    targets.forEach((t) => { t.classList.add("reveal"); io.observe(t); });
  }
});
