/* CMV SARL – page Boutique (la configuration est dans config.js, le catalogue dans products.js) */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  const fcfa = (n) => n.toLocaleString("fr-FR") + " FCFA";
  const grid = document.getElementById("shopGrid");
  const cart = {};
  const waLink = (t) => "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(t);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const icons = { materiel: "fa-plug", numerique: "fa-file-arrow-down" };

  const renderShop = (type) => {
    const list = PRODUCTS.filter((p) => type === "all" || p.type === type);
    grid.innerHTML = list.length ? list.map((p) => `
      <article class="product">
        <div class="product-img">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.nom)}" loading="lazy">` : `<i class="fa-solid ${icons[p.type]}" aria-hidden="true"></i>`}
          <span class="badge${p.exemple ? " ex" : ""}">${p.exemple ? "Exemple" : esc(p.categorie)}</span></div>
        <div class="product-body"><h3>${esc(p.nom)}</h3><p>${esc(p.description)}</p><p class="price">${fcfa(p.prix)}</p>
          <button class="btn btn-sm" data-buy="${p.id}">${p.type === "materiel" ? "Ajouter au panier" : "Acheter et télécharger"}</button></div>
      </article>`).join("") : '<p class="empty">Les premiers produits arrivent bientôt. Écrivez-nous sur WhatsApp pour connaître les disponibilités.</p>';
  };
  renderShop("all");
  const shopFilters = document.querySelectorAll("[data-shop]");
  shopFilters.forEach((b) => b.addEventListener("click", () => {
    shopFilters.forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    renderShop(b.dataset.shop);
  }));
  if (CONFIG.address) document.getElementById("shopAddress").textContent = "Notre adresse : " + CONFIG.address;

  const dlg = document.getElementById("cartDialog");
  const cartBtn = document.getElementById("cartBtn");
  const msg = document.getElementById("cartMsg");
  const lines = () => Object.entries(cart).map(([id, q]) => ({ p: PRODUCTS.find((x) => x.id === id), q }));
  const drawCart = () => {
    const l = lines();
    const count = l.reduce((s, x) => s + x.q, 0);
    document.getElementById("cartCount").textContent = count;
    cartBtn.hidden = !count;
    document.getElementById("cartItems").innerHTML = l.map(({ p, q }) => `<li><span>${esc(p.nom)}<br>${fcfa(p.prix)}</span>
      <span><button data-q="${p.id}" data-d="-1" aria-label="Retirer un">−</button> ${q} <button data-q="${p.id}" data-d="1" aria-label="Ajouter un">+</button></span></li>`).join("");
    document.getElementById("cartTotal").textContent = fcfa(l.reduce((s, x) => s + x.p.prix * x.q, 0));
    if (!count && dlg.open) dlg.close();
  };
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-buy]");
    if (!b) return;
    const p = PRODUCTS.find((x) => x.id === b.dataset.buy);
    if (p.type === "materiel") { cart[p.id] = (cart[p.id] || 0) + 1; drawCart(); b.textContent = "Ajouté ✓"; setTimeout(() => (b.textContent = "Ajouter au panier"), 1200); }
    else if (p.paymentLink) window.open(p.paymentLink, "_blank", "noopener");
    else if (CONFIG.whatsappNumber) window.open(waLink("Bonjour, je souhaite acheter : " + p.nom + " (" + fcfa(p.prix) + ")"), "_blank", "noopener");
  });
  cartBtn.addEventListener("click", () => { msg.textContent = ""; dlg.showModal(); });
  document.getElementById("cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (!b) return;
    cart[b.dataset.q] += Number(b.dataset.d);
    if (cart[b.dataset.q] <= 0) delete cart[b.dataset.q];
    drawCart();
  });
  const order = () => {
    const nom = document.getElementById("livNom").value.trim();
    const adr = document.getElementById("livAdresse").value.trim();
    if (nom.length < 3 || adr.length < 5) { msg.textContent = "Indiquez votre nom, votre téléphone et votre adresse de livraison."; return null; }
    const l = lines();
    return "Bonjour CMV SARL, je souhaite commander :\n" + l.map(({ p, q }) => `- ${q} x ${p.nom} (${fcfa(p.prix * q)})`).join("\n") +
      "\nTotal : " + document.getElementById("cartTotal").textContent + "\nClient : " + nom + "\nLivraison : " + adr;
  };
  document.getElementById("cartWa").addEventListener("click", () => { const t = order(); if (t) window.open(waLink(t), "_blank", "noopener"); });
  document.getElementById("cartPay").addEventListener("click", () => {
    if (!order()) return;
    if (CONFIG.cartPaymentLink) window.open(CONFIG.cartPaymentLink, "_blank", "noopener");
    else msg.textContent = "Le paiement en ligne n'est pas encore activé. Commandez par WhatsApp ou appelez le " + CONFIG.phoneNumber + ".";
  });


  /* Coordonnées */
  if (CONFIG.email) { const li = document.createElement("li"); li.innerHTML = `<i class="fa-regular fa-envelope" aria-hidden="true"></i> <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>`; document.getElementById("adresse").appendChild(li); }
  const wa = document.getElementById("shopWa"), tel = document.getElementById("shopTel");
  if (CONFIG.whatsappNumber) { wa.href = waLink("Bonjour CMV SARL, j'ai une question sur la boutique."); wa.target = "_blank"; wa.rel = "noopener"; }
  if (CONFIG.phoneNumber) { tel.href = "tel:" + CONFIG.phoneNumber; tel.lastChild.textContent = " Appeler " + CONFIG.phoneNumber; }
});
