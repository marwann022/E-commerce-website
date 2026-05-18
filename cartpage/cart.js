document.addEventListener("DOMContentLoaded", () => {
  const TAX_RATE = 0.08; // 8% calculated tax rate

  // Global UI Selectors
  const cartContainer = document.getElementById("cart-items-container");
  const cartBadge = document.getElementById("cart-badge");
  const subtotalEl = document.getElementById("summary-subtotal");
  const taxEl = document.getElementById("summary-tax");
  const totalEl = document.getElementById("summary-total");

  // Recalculates the cart summary blocks
  function updateOrderSummary() {
    const items = document.querySelectorAll(".cart-item");
    let subtotal = 0;
    let totalItemsCount = 0;

    items.forEach((item) => {
      const price = parseFloat(item.getAttribute("data-price") || "0");
      const quantityEl = item.querySelector(".quantity");
      const quantity = quantityEl ? parseInt(quantityEl.textContent, 10) || 0 : 0;
      subtotal += price * quantity;
      totalItemsCount += quantity;
    });

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Update UI Elements text layout nodes
    if (subtotalEl) {
      subtotalEl.textContent = `$${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (taxEl) {
      taxEl.textContent = `$${tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (totalEl) {
      totalEl.textContent = `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (cartBadge) {
      cartBadge.textContent = String(totalItemsCount);
    }
  }

  // Handle click events within our container bounds cleanly
  if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {
      const target = e.target;
      const button = target instanceof Element ? target.closest("button") : null;
      if (!button) return;

      const itemCard = button.closest(".cart-item");
      if (!itemCard) return;

      const quantityEl = itemCard.querySelector(".quantity");
      const priceDisplayEl = itemCard.querySelector(".item-total-price");
      if (!quantityEl || !priceDisplayEl) return;

      const currentPrice = parseFloat(itemCard.getAttribute("data-price") || "0");
      let currentQty = parseInt(quantityEl.textContent, 10) || 0;

      // Branch action handlers
      if (button.classList.contains("plus-btn")) {
        currentQty++;
        quantityEl.textContent = String(currentQty);
        priceDisplayEl.textContent = `$${(currentPrice * currentQty).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        updateOrderSummary();
      } 
      else if (button.classList.contains("minus-btn")) {
        if (currentQty > 1) {
          currentQty--;
          quantityEl.textContent = String(currentQty);
          priceDisplayEl.textContent = `$${(currentPrice * currentQty).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
          updateOrderSummary();
        }
      } 
      else if (button.classList.contains("delete-btn")) {
        itemCard.remove();
        updateOrderSummary();
      }
    });
  }

  updateOrderSummary();
});