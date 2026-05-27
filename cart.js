document.addEventListener("DOMContentLoaded", () => {
  const TAX_RATE = 0.08;

  const cartContainer = document.getElementById("cart-items-container");
  const cartBadge = document.getElementById("cart-badge");
  const subtotalEl = document.getElementById("summary-subtotal");
  const taxEl = document.getElementById("summary-tax");
  const totalEl = document.getElementById("summary-total");

  function updateOrderSummary() {
    const items = document.querySelectorAll(".cart-item");
    let subtotal = 0;
    let totalItemsCount = 0;

    items.forEach((item) => {
      const price = parseFloat(item.getAttribute("data-price"));
      const quantityElement = item.querySelector(".quantity");
      const quantity = quantityElement ? parseInt(quantityElement.textContent) : 0;
      
      subtotal += price * quantity;
      totalItemsCount += quantity;
    });

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (taxEl) taxEl.textContent = `$${tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    if (cartBadge) {
      cartBadge.textContent = totalItemsCount.toString();
    }
  }

  if (cartContainer) {
    cartContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const itemCard = button.closest(".cart-item");
      if (!itemCard) return;

      const quantityEl = itemCard.querySelector(".quantity");
      const currentPrice = parseFloat(itemCard.getAttribute("data-price"));
      const priceDisplayEl = itemCard.querySelector(".item-total-price");
      
      if (!quantityEl) return;
      let currentQty = parseInt(quantityEl.textContent);

      if (button.classList.contains("plus-btn")) {
        currentQty++;
        quantityEl.textContent = currentQty;
        if (priceDisplayEl) {
          priceDisplayEl.textContent = `$${(currentPrice * currentQty).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        updateOrderSummary();
      } 
      else if (button.classList.contains("minus-btn")) {
        if (currentQty > 1) {
          currentQty--;
          quantityEl.textContent = currentQty;
          if (priceDisplayEl) {
            priceDisplayEl.textContent = `$${(currentPrice * currentQty).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          }
          updateOrderSummary();
        }
      } 
      else if (button.classList.contains("delete-btn")) {
        itemCard.remove();
        updateOrderSummary();
      }
    });
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});