const tailwindConfig = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#f9f9ff",
        "inverse-surface": "#293040",
        "on-background": "#141b2b",
        "surface-variant": "#dce2f7",
        "on-primary-fixed-variant": "#5516be",
        "outline-variant": "#cbc3d7",
        "on-tertiary-fixed-variant": "#653e00",
        "inverse-on-surface": "#edf0ff",
        "secondary-container": "#fd56a7",
        "surface-container-lowest": "#ffffff",
        "on-secondary": "#ffffff",
        "secondary-fixed": "#ffd9e4",
        "on-error": "#ffffff",
        "tertiary-container": "#a36700",
        error: "#ba1a1a",
        outline: "#7b7486",
        tertiary: "#825100",
        "on-surface": "#141b2b",
        "on-secondary-fixed": "#3e0022",
        "surface-container-low": "#f1f3ff",
        "on-primary-container": "#fffbff",
        "on-secondary-container": "#600037",
        "on-tertiary-fixed": "#2a1700",
        "surface-container": "#e9edff",
        "surface-container-high": "#e1e8fd",
        "secondary-fixed-dim": "#ffb0cd",
        "on-secondary-fixed-variant": "#8c0053",
        "tertiary-fixed": "#ffddb8",
        "on-tertiary": "#ffffff",
        "surface-bright": "#f9f9ff",
        "primary-container": "#8455ef",
        "primary-fixed-dim": "#d0bcff",
        "inverse-primary": "#d0bcff",
        "surface-dim": "#d3daef",
        "on-error-container": "#93000a",
        "on-primary": "#ffffff",
        "tertiary-fixed-dim": "#ffb95f",
        "on-surface-variant": "#494454",
        "primary-fixed": "#e9ddff",
        "on-tertiary-container": "#fffbff",
        surface: "#f9f9ff",
        secondary: "#b4136d",
        "error-container": "#ffdad6",
        "surface-tint": "#6d3bd7",
        "on-primary-fixed": "#23005c",
        "surface-container-highest": "#dce2f7",
        primary: "#6b38d4",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        unit: "8px",
        "margin-mobile": "16px",
        "container-max": "1280px",
        gutter: "24px",
        "margin-desktop": "40px",
      },
      fontFamily: {
        "headline-md": ["Inter"],
        "label-sm": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Inter"],
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "display-lg": ["Inter"],
        "display-lg-mobile": ["Inter"],
      },
      fontSize: {
        "headline-md": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }],
        "label-md": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.01em",
            fontWeight: "500",
          },
        ],
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "display-lg-mobile": [
          "36px",
          {
            lineHeight: "44px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
      },
    },
  },
};

window.tailwind = window.tailwind || {};
window.tailwind.config = tailwindConfig;

// --- UI Interaction Logic ---
document.addEventListener('DOMContentLoaded', () => {
  // --- Thumbnail Gallery Logic ---
  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.thumbnail-btn');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const imgSrc = thumb.querySelector('img').src;
      
      mainImage.style.opacity = '0.5';
      setTimeout(() => {
        mainImage.src = imgSrc;
        mainImage.style.opacity = '1';
      }, 150);

      thumbnails.forEach(t => {
        t.classList.remove('border-primary');
        t.classList.add('border-transparent', 'hover:border-primary', 'hover:opacity-80');
      });
      thumb.classList.remove('border-transparent', 'hover:border-primary', 'hover:opacity-80');
      thumb.classList.add('border-primary');
    });
  });

  // --- Quantity Logic ---
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyValue = document.getElementById('qty-value');
  let quantity = 1;

  qtyMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyValue.textContent = quantity;
    }
  });

  qtyPlus.addEventListener('click', () => {
    if (quantity < 10) {
      quantity++;
      qtyValue.textContent = quantity;
    }
  });

  // --- Color Selection Logic ---
  const colorBtns = document.querySelectorAll('.color-btn');
  let selectedColor = 'black';

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.dataset.color;
      
      colorBtns.forEach(c => {
        c.classList.remove('border-primary', 'ring-2', 'ring-offset-2');
        c.classList.add('border-transparent', 'hover:border-outline-variant');
      });
      btn.classList.remove('border-transparent', 'hover:border-outline-variant');
      btn.classList.add('border-primary', 'ring-2', 'ring-offset-2');
    });
  });

  // --- Model Selection Logic ---
  const modelBtns = document.querySelectorAll('.model-btn');
  const priceDisplay = document.getElementById('product-price');
  let selectedModel = 'Standard';
  let currentPrice = 299.00;

  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedModel = btn.dataset.model;
      currentPrice = parseFloat(btn.dataset.price);
      
      priceDisplay.style.opacity = '0';
      setTimeout(() => {
        priceDisplay.textContent = `$${currentPrice.toFixed(2)}`;
        priceDisplay.style.opacity = '1';
      }, 150);

      modelBtns.forEach(m => {
        m.classList.remove('border-primary', 'bg-primary/5', 'text-primary');
        m.classList.add('border-outline-variant', 'text-on-surface-variant', 'hover:border-primary', 'hover:text-primary');
      });
      btn.classList.remove('border-outline-variant', 'text-on-surface-variant', 'hover:border-primary', 'hover:text-primary');
      btn.classList.add('border-primary', 'bg-primary/5', 'text-primary');
    });
  });

  // --- Tab Switching Logic ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabBtns.forEach(t => {
        t.classList.remove('border-primary', 'text-primary');
        t.classList.add('border-transparent', 'text-on-surface-variant', 'hover:text-primary');
      });
      btn.classList.remove('border-transparent', 'text-on-surface-variant', 'hover:text-primary');
      btn.classList.add('border-primary', 'text-primary');

      tabContents.forEach(content => {
        if (content.id === `tab-${targetTab}`) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // --- Add to Cart Logic ---
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const addToCartText = document.getElementById('add-to-cart-text');
  const cartBadge = document.getElementById('cart-badge');
  let cartCount = 2; // Initial hardcoded state

  addToCartBtn.addEventListener('click', () => {
    if (addToCartBtn.disabled) return;
    
    addToCartBtn.disabled = true;
    addToCartText.textContent = "Adding...";
    addToCartBtn.classList.add('opacity-80');

    setTimeout(() => {
      cartCount += quantity;
      cartBadge.textContent = cartCount;
      
      cartBadge.classList.add('scale-150');
      setTimeout(() => cartBadge.classList.remove('scale-150'), 300);

      addToCartText.textContent = "Added to Cart";
      addToCartBtn.classList.remove('bg-primary', 'text-on-primary');
      addToCartBtn.classList.add('bg-tertiary-container', 'text-on-tertiary-container');
      
      setTimeout(() => {
        addToCartText.textContent = "Add to Cart";
        addToCartBtn.classList.remove('bg-tertiary-container', 'text-on-tertiary-container', 'opacity-80');
        addToCartBtn.classList.add('bg-primary', 'text-on-primary');
        addToCartBtn.disabled = false;
      }, 2000);
      
    }, 600);
  });
});
