// ==================== APP.JS ====================
// التطبيق الرئيسي لنظام المبيعات

let cart = [];
let allProducts = {};

// ===== DOM Elements =====
const productsContainer = document.getElementById('productsContainer');
const cartItemsList = document.getElementById('cartItems');
const barcodeInput = document.getElementById('barcodeInput');
const itemsCount = document.getElementById('itemsCount');
const totalPrice = document.getElementById('totalPrice');
const searchInput = document.getElementById('searchProducts');
const categoryFilter = document.getElementById('categoryFilter');
const clearCartBtn = document.getElementById('clearCartBtn');
const saveOrderBtn = document.getElementById('saveOrderBtn');
const printReceiptBtn = document.getElementById('printReceiptBtn');
const adminBtn = document.getElementById('adminBtn');

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  attachEventListeners();
});

// ===== Load Products from Firebase =====
async function loadProducts() {
  try {
    allProducts = await FirebaseOps.getAllProducts();
    renderProducts(allProducts);
    populateCategories();
  } catch (error) {
    console.error('خطأ في تحميل المنتجات:', error);
  }
}

// ===== Render Products =====
function renderProducts(products) {
  productsContainer.innerHTML = '';
  Object.entries(products).forEach(([id, product]) => {
    const productEl = document.createElement('button');
    productEl.className = 'product-item';
    productEl.innerHTML = `
      <div class="product-name">${product.name}</div>
      <div class="product-price">${product.price.toFixed(2)} ج.m</div>
    `;
    productEl.addEventListener('click', () => addToCart(id, product));
    productsContainer.appendChild(productEl);
  });
}

// ===== Add to Cart =====
function addToCart(productId, product) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id: productId, ...product, qty: 1 });
  }
  updateCartUI();
}

// ===== Remove from Cart =====
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

// ===== Update Cart UI =====
function updateCartUI() {
  cartItemsList.innerHTML = '';
  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item';
    cartItemEl.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <input type="number" class="cart-item-qty" value="${item.qty}" 
        onchange="updateQuantity('${item.id}', this.value)" min="1">
      <span class="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
      <button class="cart-item-delete" onclick="removeFromCart('${item.id}')">x</button>
    `;
    cartItemsList.appendChild(cartItemEl);
  });

  itemsCount.textContent = count;
  totalPrice.textContent = total.toFixed(2);
}

// ===== Update Quantity =====
function updateQuantity(productId, newQty) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    const qty = parseInt(newQty) || 1;
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      item.qty = qty;
      updateCartUI();
    }
  }
}

// ===== Barcode Input Handler =====
barcodeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const barcode = barcodeInput.value.trim();
    // ابحث عن منتج بهذا الباركود
    for (const [id, product] of Object.entries(allProducts)) {
      if (product.barcode === barcode) {
        addToCart(id, product);
        barcodeInput.value = '';
        return;
      }
    }
    alert('الباركود غير موجود');
    barcodeInput.value = '';
  }
});

// ===== Populate Categories =====
function populateCategories() {
  const categories = new Set();
  Object.values(allProducts).forEach(p => categories.add(p.category));
  categoryFilter.innerHTML = '<option value="">كل الأقسام</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// ===== Filter Products =====
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = Object.entries(allProducts).filter(([, product]) => {
    const matchName = product.name.toLowerCase().includes(searchTerm);
    const matchCategory = !category || product.category === category;
    return matchName && matchCategory;
  });

  renderProducts(Object.fromEntries(filtered));
}

// ===== Save Order =====
async function saveOrder() {
  if (cart.length === 0) {
    alert('السلة فارغة!');
    return;
  }

  const orderData = {
    items: cart,
    total: parseFloat(totalPrice.textContent),
    customerName: document.getElementById('customerName').value,
    notes: document.getElementById('orderNotes').value
  };

  try {
    await FirebaseOps.saveOrder(orderData);
    alert('تم حفظ الفاتورة بنجاح');
    cart = [];
    updateCartUI();
  } catch (error) {
    alert('خطأ: ' + error.message);
  }
}

// ===== Clear Cart =====
function clearCart() {
  cart = [];
  updateCartUI();
}

// ===== Attach Event Listeners =====
function attachEventListeners() {
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  clearCartBtn.addEventListener('click', clearCart);
  saveOrderBtn.addEventListener('click', saveOrder);
  adminBtn.addEventListener('click', () => {
    window.location.href = 'admin.html';
  });
  printReceiptBtn.addEventListener('click', () => {
    printReceipt(cart, totalPrice.textContent);
  });
}

// ===== Admin Navigation =====
adminBtn.addEventListener('click', () => {
  window.location.href = 'admin.html';
});
