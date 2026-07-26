/* ===================================================================
   AKSHAR HOME DECOR — site script
   Product catalog, category filters, cart (in-memory), and UI wiring.
   =================================================================== */

/* ---------- Icon library (inline SVG strings, stroke=currentColor) ---------- */
const ICONS = {
  door: `<svg class="icon" viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="8" width="32" height="48" rx="1"></rect><line x1="16" y1="20" x2="48" y2="20"></line><line x1="16" y1="44" x2="48" y2="44"></line><circle cx="41" cy="32" r="1.6" fill="currentColor"></circle></svg>`,
  frame: `<svg class="icon" viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="8" width="44" height="48" rx="1"></rect><rect x="16" y="14" width="32" height="36" rx="1"></rect></svg>`,
  handle: `<svg class="icon" viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="32" r="4"></circle><path d="M20 32 H40"></path><path d="M40 24 V40"></path></svg>`,
  ply: `<svg class="icon" viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="14" width="48" height="7"></rect><rect x="8" y="27" width="48" height="7" opacity="0.7"></rect><rect x="8" y="40" width="48" height="7" opacity="0.45"></rect></svg>`,
  kitchen: `<svg class="icon" viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 30 H58 V50 H6 Z"></path><line x1="6" y1="30" x2="6" y2="22"></line><line x1="58" y1="30" x2="58" y2="22"></line><line x1="6" y1="22" x2="58" y2="22"></line><line x1="20" y1="38" x2="20" y2="50"></line><line x1="38" y1="38" x2="38" y2="50"></line></svg>`,
  wardrobe: `<svg class="icon" viewBox="0 0 64 64" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="8" width="44" height="48" rx="1"></rect><line x1="32" y1="8" x2="32" y2="56"></line><circle cx="27" cy="32" r="1.4" fill="currentColor"></circle><circle cx="37" cy="32" r="1.4" fill="currentColor"></circle></svg>`,
};

/* ---------- Category tints (used as CSS custom props on card media) ---------- */
const TINTS = {
  doors:     ["#4a3620", "#241b10"],
  frames:    ["#3f4a3a", "#1c2018"],
  handles:   ["#5a4a24", "#241d0e"],
  plywood:   ["#3a3126", "#1c1811"],
  kitchen:   ["#3d4a45", "#191f1c"],
  wardrobes: ["#4a3a3a", "#201717"],
};

const CATEGORY_LABELS = {
  doors: "Doors",
  frames: "Door Frames",
  handles: "Handles & Hardware",
  plywood: "Plywood & Boards",
  kitchen: "Modular Kitchens",
  wardrobes: "Wardrobes & Laminates",
};

/* ---------- Product catalog ---------- */
const PRODUCTS = [
  { id:"dr-01", name:"Solid Sheesham Wood Door", cat:"doors", icon:"door", price:18500, unit:"per door", desc:"Solid-core sheesham wood, hand-finished with a natural matt polish." },
  { id:"dr-02", name:"Premium Flush Door", cat:"doors", icon:"door", price:4500, unit:"per door", desc:"Laminated flush door with a moisture-resistant core, ready to fit." },
  { id:"dr-03", name:"Designer Membrane Door", cat:"doors", icon:"door", price:7200, unit:"per door", desc:"PVC membrane finish over engineered wood — termite and water resistant." },
  { id:"fr-01", name:"Teak Door Frame (Chowkat)", cat:"frames", icon:"frame", price:6200, unit:"per frame", desc:"Seasoned teak wood frame, cut and sized to your door opening." },
  { id:"fr-02", name:"Sal Wood Door Frame", cat:"frames", icon:"frame", price:3800, unit:"per frame", desc:"Sturdy sal wood frame, a budget-friendly choice for interior doors." },
  { id:"hd-01", name:"Brass Mortise Handle Set", cat:"handles", icon:"handle", price:1850, unit:"per set", desc:"Solid brass mortise lock and lever set with a warm antique finish." },
  { id:"hd-02", name:"Antique Brass Door Handle", cat:"handles", icon:"handle", price:950, unit:"per pair", desc:"Classic pull handles in an aged-brass finish, sold as a pair." },
  { id:"hd-03", name:"Steel Door Hinges (Pack of 4)", cat:"handles", icon:"handle", price:420, unit:"per pack", desc:"Heavy-duty stainless steel hinges, ball-bearing action." },
  { id:"pw-01", name:"19mm Waterproof Plywood", cat:"plywood", icon:"ply", price:3200, unit:"8x4 ft sheet", desc:"BWP-grade marine plywood, ideal for kitchens and wet areas." },
  { id:"pw-02", name:"12mm BWP Plywood", cat:"plywood", icon:"ply", price:2100, unit:"8x4 ft sheet", desc:"Boiling-water-proof plywood for wardrobes, partitions and shutters." },
  { id:"pw-03", name:"Decorative Laminate Sheet", cat:"plywood", icon:"ply", price:1150, unit:"per sheet", desc:"Scratch-resistant decorative laminate in a wide range of finishes." },
  { id:"kt-01", name:"L-Shape Modular Kitchen", cat:"kitchen", icon:"kitchen", price:1450, unit:"per sq.ft, starting", desc:"Full L-shape modular set-up with soft-close cabinets and a granite top." },
  { id:"kt-02", name:"Straight Modular Kitchen", cat:"kitchen", icon:"kitchen", price:1250, unit:"per sq.ft, starting", desc:"Compact single-wall layout, built to measure for smaller kitchens." },
  { id:"wd-01", name:"3-Door Modular Wardrobe", cat:"wardrobes", icon:"wardrobe", price:32000, unit:"per unit", desc:"Floor-to-ceiling wardrobe with laminate shutters and internal shelving." },
  { id:"wd-02", name:"Sliding Wardrobe (2-Door)", cat:"wardrobes", icon:"wardrobe", price:26500, unit:"per unit", desc:"Space-saving sliding shutters with a mirror panel on one door." },
];

/* ---------- Cart (in-memory) ---------- */
let cart = {}; // id -> qty

function money(n){
  return "₹" + n.toLocaleString("en-IN");
}

function cartCount(){
  return Object.values(cart).reduce((a,b)=>a+b, 0);
}
function cartSubtotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const p = PRODUCTS.find(p=>p.id===id);
    return sum + (p ? p.price*qty : 0);
  },0);
}

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  updateCartCount();
}
function setQty(id, qty){
  if(qty <= 0){ delete cart[id]; }
  else{ cart[id] = qty; }
  renderCart();
  updateCartCount();
}
function removeFromCart(id){
  delete cart[id];
  renderCart();
  updateCartCount();
}

function updateCartCount(){
  const el = document.getElementById("cartCount");
  if(!el) return;
  const c = cartCount();
  el.textContent = c;
  el.style.display = c > 0 ? "flex" : "none";
}

function renderCart(){
  const wrap = document.getElementById("drawerItems");
  const foot = document.getElementById("drawerFoot");
  if(!wrap) return;
  const ids = Object.keys(cart);

  if(ids.length === 0){
    wrap.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>
        <p>Your cart is empty.<br>Browse the catalog to add materials.</p>
      </div>`;
    if(foot) foot.style.display = "none";
    return;
  }
  if(foot) foot.style.display = "flex";

  wrap.innerHTML = ids.map(id=>{
    const p = PRODUCTS.find(p=>p.id===id);
    const qty = cart[id];
    const tint = TINTS[p.cat];
    return `
      <div class="cart-line" data-id="${p.id}">
        <div class="cart-line-media" style="background:linear-gradient(155deg, ${tint[0]}, ${tint[1]})">${ICONS[p.icon]}</div>
        <div class="cart-line-body">
          <div class="cart-line-top">
            <h4>${p.name}</h4>
            <button class="cart-line-remove" onclick="removeFromCart('${p.id}')">Remove</button>
          </div>
          <div class="qty-row">
            <div class="qty-controls">
              <button onclick="setQty('${p.id}', ${qty-1})" aria-label="Decrease quantity">−</button>
              <span>${qty}</span>
              <button onclick="setQty('${p.id}', ${qty+1})" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-line-price">${money(p.price*qty)}</div>
          </div>
        </div>
      </div>`;
  }).join("");

  const amt = document.getElementById("subtotalAmt");
  if(amt) amt.textContent = money(cartSubtotal());
}

/* ---------- Drawer + modal open/close ---------- */
function openCart(){
  document.getElementById("overlay").classList.add("open");
  document.getElementById("drawer").classList.add("open");
}
function closeCart(){
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("drawer").classList.remove("open");
}
function openModal(){
  document.getElementById("orderModal").classList.add("open");
}
function closeModal(){
  document.getElementById("orderModal").classList.remove("open");
}

function placeOrder(){
  if(cartCount() === 0) return;
  const orderId = "AHD-" + Math.floor(100000 + Math.random()*900000);
  document.getElementById("orderId").textContent = "Reference No. " + orderId;
  cart = {};
  renderCart();
  updateCartCount();
  closeCart();
  openModal();
}

/* ---------- Catalog rendering + filtering ---------- */
function renderCatalog(filter){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  const items = filter === "all" ? PRODUCTS : PRODUCTS.filter(p=>p.cat===filter);

  grid.innerHTML = items.map(p=>{
    const tint = TINTS[p.cat];
    return `
      <article class="card">
        <div class="card-media" style="--tint-a:${tint[0]}; --tint-b:${tint[1]}">
          <span class="card-cat">${CATEGORY_LABELS[p.cat]}</span>
          <span class="card-hole"></span>
          ${ICONS[p.icon]}
        </div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <div class="card-tear">
            <div class="price">${money(p.price)}<span class="unit">${p.unit}</span></div>
            <button class="add-btn" data-id="${p.id}" onclick="handleAdd(this,'${p.id}')">Add to cart</button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function handleAdd(btn, id){
  addToCart(id);
  const original = btn.textContent;
  btn.textContent = "Added ✓";
  btn.classList.add("added");
  setTimeout(()=>{ btn.textContent = original; btn.classList.remove("added"); }, 1100);
}

function initFilters(){
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach(chip=>{
    chip.addEventListener("click", ()=>{
      chips.forEach(c=>c.classList.remove("active"));
      chip.classList.add("active");
      renderCatalog(chip.dataset.filter);
    });
  });
}

/* ---------- Nav mobile toggle ---------- */
function initNav(){
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if(!toggle || !links) return;
  toggle.addEventListener("click", ()=> links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a=> a.addEventListener("click", ()=> links.classList.remove("open")));
}

/* ---------- Hero door animation trigger ---------- */
function initDoor(){
  const scene = document.getElementById("doorScene");
  if(!scene) return;
  requestAnimationFrame(()=> setTimeout(()=> scene.classList.add("opened"), 250));
}

/* ---------- Wire up on load ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  renderCatalog("all");
  initFilters();
  initNav();
  initDoor();
  updateCartCount();
  renderCart();

  const cartBtn = document.getElementById("cartBtn");
  if(cartBtn) cartBtn.addEventListener("click", openCart);
  const overlay = document.getElementById("overlay");
  if(overlay) overlay.addEventListener("click", closeCart);
  const drawerClose = document.getElementById("drawerClose");
  if(drawerClose) drawerClose.addEventListener("click", closeCart);
  const checkoutBtn = document.getElementById("checkoutBtn");
  if(checkoutBtn) checkoutBtn.addEventListener("click", placeOrder);
  const modalClose = document.getElementById("modalClose");
  if(modalClose) modalClose.addEventListener("click", closeModal);
  const modalBg = document.querySelector("#orderModal .modal-bg");
  if(modalBg) modalBg.addEventListener("click", closeModal);
});
