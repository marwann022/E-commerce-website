document.addEventListener("DOMContentLoaded", () => {
  const priceSlider = document.getElementById("price-slider");
  const priceDisplay = document.getElementById("current-price-display");

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener("input", (e) => {
      const value = e.target.value;
      priceDisplay.textContent = `$${value}`;
      priceDisplay.classList.add("scale-105", "opacity-90");
      setTimeout(() => {
        priceDisplay.classList.remove("scale-105", "opacity-90");
      }, 100);
    });
  }

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const icon = btn.querySelector(".wishlist-icon");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      icon.classList.toggle("active");
      icon.classList.toggle("text-red-500");
      icon.classList.toggle("text-on-background");
      icon.classList.toggle("scale-110");

      const isActive = icon.classList.contains("active");

      if (isActive) {
        icon.style.fontVariationSettings = "'FILL' 1";
        setTimeout(() => icon.classList.remove("scale-110"), 200);
      } else {
        icon.style.fontVariationSettings = "'FILL' 0";
        icon.classList.remove("scale-110");
      }

      btn.setAttribute("aria-pressed", String(isActive));
      btn.setAttribute(
        "aria-label",
        isActive ? "Remove from wishlist" : "Add to wishlist"
      );
      btn.blur();
    });
  });

  const sizeButtons = document.querySelectorAll(".size-btn");
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((button) => {
        button.classList.remove("border-primary", "bg-primary/5", "text-primary");
        button.classList.add("border-outline-variant");
      });

      btn.classList.remove("border-outline-variant");
      btn.classList.add("border-primary", "bg-primary/5", "text-primary");
      btn.blur();
    });
  });


  const colorButtons = document.querySelectorAll(".color-btn");
  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      colorButtons.forEach((button) => {
        button.classList.remove("ring-2", "ring-primary", "scale-105");
        button.classList.add("ring-1", "ring-outline-variant");
      });

      btn.classList.remove("ring-1", "ring-outline-variant");
      btn.classList.add("ring-2", "ring-primary", "scale-105");
      btn.blur();
    });
  });
});