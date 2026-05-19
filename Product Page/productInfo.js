// --- Advanced UI Interaction Logic & Animations (ES6+) ---

class ProductPageExperience {
  constructor() {
    // Cache DOM elements
    this.dom = {
      mainImage: document.getElementById('main-image'),
      thumbnails: document.querySelectorAll('.thumbnail-btn'),
      qty: {
        minus: document.getElementById('qty-minus'),
        plus: document.getElementById('qty-plus'),
        value: document.getElementById('qty-value')
      },
      colorBtns: document.querySelectorAll('.color-btn'),
      modelBtns: document.querySelectorAll('.model-btn'),
      priceDisplay: document.getElementById('product-price'),
      tabs: {
        btns: document.querySelectorAll('.tab-btn'),
        contents: document.querySelectorAll('.tab-content')
      },
      cart: {
        btn: document.getElementById('add-to-cart-btn'),
        text: document.getElementById('add-to-cart-text'),
        badge: document.getElementById('cart-badge')
      },
      review: {
        openBtn: document.getElementById('write-review-btn'),
        modal: document.getElementById('review-modal'),
        backdrop: document.getElementById('review-modal-backdrop'),
        content: document.getElementById('review-modal-content'),
        closeBtn: document.getElementById('close-review-modal'),
        form: document.getElementById('review-form'),
        stars: document.querySelectorAll('#rating-stars span'),
        ratingInput: document.getElementById('rating-value'),
        submitBtn: document.getElementById('submit-review-btn')
      }
    };

    // Global State
    this.state = {
      quantity: 1,
      selectedColor: 'black',
      selectedModel: 'Standard',
      price: 299.00,
      cartCount: 2
    };

    // Initialization
    this.initGallery();
    this.initQuantity();
    this.initSelectors();
    this.initTabs();
    this.initCart();
    this.initReviewModal();
  }

  // --- Thumbnail Gallery ---
  initGallery() {
    const { thumbnails, mainImage } = this.dom;
    
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Prevent click if already active or is a placeholder/video button without img
        const img = thumb.querySelector('img');
        if (thumb.classList.contains('border-primary') || !img) return;

        const newSrc = img.src;

        // Smooth Image Swap Animation using Web Animations API
        mainImage.animate([
          { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
          { opacity: 0.5, transform: 'scale(0.98)', filter: 'blur(4px)' },
          { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }
        ], { duration: 450, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

        // Change source right in the middle of the transition
        setTimeout(() => mainImage.src = newSrc, 200);

        // Update thumbnail active states visually
        thumbnails.forEach(t => {
          t.classList.replace('border-primary', 'border-transparent');
          t.classList.add('hover:border-primary', 'hover:opacity-80');
        });
        
        thumb.classList.replace('border-transparent', 'border-primary');
        thumb.classList.remove('hover:border-primary', 'hover:opacity-80');
      });
    });
  }

  // --- Quantity Selector ---
  initQuantity() {
    const { minus, plus, value } = this.dom.qty;

    const animateNumber = (direction) => {
      // Slides the number in from top or bottom depending on direction
      value.animate([
        { transform: `translateY(${direction === 'up' ? '10px' : '-10px'})`, opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ], { duration: 250, easing: 'ease-out' });
    };

    minus.addEventListener('click', () => {
      if (this.state.quantity > 1) {
        this.state.quantity--;
        value.textContent = this.state.quantity;
        animateNumber('down');
      }
    });

    plus.addEventListener('click', () => {
      if (this.state.quantity < 10) {
        this.state.quantity++;
        value.textContent = this.state.quantity;
        animateNumber('up');
      }
    });
  }

  // --- Color & Model Selection ---
  initSelectors() {
    const { colorBtns, modelBtns } = this.dom;

    // Color Selection
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedColor = btn.dataset.color;
        
        colorBtns.forEach(c => {
          c.classList.remove('border-primary', 'ring-2', 'ring-offset-2');
          c.classList.add('border-transparent', 'hover:border-outline-variant');
        });
        
        btn.classList.remove('border-transparent', 'hover:border-outline-variant');
        btn.classList.add('border-primary', 'ring-2', 'ring-offset-2');
        
        // Satisfying Pop Animation
        btn.animate([
          { transform: 'scale(0.85)' },
          { transform: 'scale(1.15)' },
          { transform: 'scale(1)' }
        ], { duration: 400, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }); // bouncy easing
      });
    });

    // Model & Dynamic Price Selection
    modelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedModel = btn.dataset.model;
        const newPrice = parseFloat(btn.dataset.price);

        // Price counter rolling animation
        this.animatePrice(this.state.price, newPrice);
        this.state.price = newPrice;

        modelBtns.forEach(m => {
          m.classList.remove('border-primary', 'bg-primary/5', 'text-primary');
          m.classList.add('border-outline-variant', 'text-on-surface-variant', 'hover:border-primary', 'hover:text-primary');
        });

        btn.classList.remove('border-outline-variant', 'text-on-surface-variant', 'hover:border-primary', 'hover:text-primary');
        btn.classList.add('border-primary', 'bg-primary/5', 'text-primary');
      });
    });
  }

  // Advanced Price Rolling Animation
  animatePrice(start, end) {
    const { priceDisplay } = this.dom;
    const duration = 500;
    const startTime = performance.now();

    const updatePrice = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo easing function for premium feel
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = start + (end - start) * easeProgress;
      
      priceDisplay.textContent = `$${currentVal.toFixed(2)}`;

      if (progress < 1) {
        requestAnimationFrame(updatePrice);
      } else {
        priceDisplay.textContent = `$${end.toFixed(2)}`;
        // Color flash effect upon hitting target
        priceDisplay.animate([
          { color: '#8455ef' }, 
          { color: '' }
        ], { duration: 400 });
      }
    };
    
    requestAnimationFrame(updatePrice);
  }

  // --- Tab Switching ---
  initTabs() {
    const { btns, contents } = this.dom.tabs;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = `tab-${btn.dataset.tab}`;
        
        // Button style updates
        btns.forEach(t => {
          t.classList.remove('border-primary', 'text-primary');
          t.classList.add('border-transparent', 'text-on-surface-variant', 'hover:text-primary');
        });
        
        btn.classList.remove('border-transparent', 'text-on-surface-variant', 'hover:text-primary');
        btn.classList.add('border-primary', 'text-primary');

        // Smooth Content Crossfade
        contents.forEach(content => {
          if (content.id === targetId) {
            content.classList.remove('hidden');
            content.animate([
              { opacity: 0, transform: 'translateY(15px)' },
              { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 400, easing: 'ease-out', fill: 'forwards' });
          } else {
            content.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- Add to Cart (Flying Arc & Ripple Animation) ---
  initCart() {
    const { btn, text, badge } = this.dom.cart;
    const { mainImage } = this.dom;

    btn.addEventListener('click', (e) => {
      if (btn.disabled) return;

      btn.disabled = true;
      text.textContent = "Processing...";
      
      this.createRipple(e, btn);

      // Trigger the spectacular flying product arc animation
      this.createFlyingItem(mainImage, badge, () => {
        
        // Updates state on flight finish
        this.state.cartCount += this.state.quantity;
        badge.textContent = this.state.cartCount;
        
        // Success Badge Pop
        badge.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.8)', backgroundColor: '#6b38d4' },
          { transform: 'scale(1)' }
        ], { duration: 500, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });

        // Update button visual state to reflect success
        text.textContent = "Successfully Added";
        btn.classList.replace('bg-primary', 'bg-on-background');
        btn.classList.replace('text-on-primary', 'text-background');
        
        // Cooldown reset
        setTimeout(() => {
          text.textContent = "Add to Cart";
          btn.classList.replace('bg-on-background', 'bg-primary');
          btn.classList.replace('text-background', 'text-on-primary');
          btn.disabled = false;
        }, 2500);
      });
    });
  }

  // Micro-interaction: Material-style Ripple
  createRipple(e, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    
    // Fallback coordinates if event didn't have clientX/Y (e.g., keyboard activation)
    const x = e.clientX ? e.clientX - rect.left - radius : rect.width / 2 - radius;
    const y = e.clientY ? e.clientY - rect.top - radius : rect.height / 2 - radius;

    Object.assign(circle.style, {
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${x}px`,
      top: `${y}px`,
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      transform: 'scale(0)',
      pointerEvents: 'none',
      zIndex: 10
    });

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(circle);

    const animation = circle.animate([
      { transform: 'scale(0)', opacity: 1 },
      { transform: 'scale(3)', opacity: 0 }
    ], { duration: 600, easing: 'ease-out' });

    animation.onfinish = () => circle.remove();
  }

  // Macro-interaction: Flying Product to Cart Arc
  createFlyingItem(sourceImg, targetEl, onComplete) {
    const flyingImg = sourceImg.cloneNode();
    const sourceRect = sourceImg.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    Object.assign(flyingImg.style, {
      position: 'fixed',
      left: `${sourceRect.left}px`,
      top: `${sourceRect.top}px`,
      width: `${sourceRect.width}px`,
      height: `${sourceRect.height}px`,
      borderRadius: '12px',
      zIndex: '99999',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      pointerEvents: 'none',
      objectFit: 'cover'
    });
    
    document.body.appendChild(flyingImg);

    // Calculate arc coordinates
    const startX = sourceRect.left;
    const startY = sourceRect.top;
    const endX = targetRect.left;
    const endY = targetRect.top;

    // Use Web Animations API with multiple keyframes for an arc effect
    const animation = flyingImg.animate([
      { 
        transform: `translate(0, 0) scale(1) rotate(0deg)`, 
        opacity: 1 
      },
      { 
        transform: `translate(${(endX - startX) * 0.4}px, -150px) scale(0.4) rotate(15deg)`, 
        opacity: 0.9 // Arc apex (flies slightly upward before dropping)
      },
      { 
        transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.05) rotate(45deg)`, 
        opacity: 0 
      }
    ], { 
      duration: 850, 
      easing: 'cubic-bezier(0.5, 0, 0.2, 1)' 
    });

    animation.onfinish = () => {
      flyingImg.remove();
      if(onComplete) onComplete();
    };
  }

  // --- Review Modal Logic ---
  initReviewModal() {
    if (!this.dom.review.openBtn) return;
    
    const { openBtn, modal, backdrop, content, closeBtn, form, stars, ratingInput, submitBtn } = this.dom.review;

    const openModal = () => {
      modal.classList.remove('hidden');
      // trigger reflow
      void modal.offsetWidth;
      modal.classList.remove('opacity-0');
      content.classList.remove('scale-95');
    };

    const closeModal = () => {
      modal.classList.add('opacity-0');
      content.classList.add('scale-95');
      setTimeout(() => modal.classList.add('hidden'), 300);
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    // Star Rating Logic
    let currentRating = 5;
    
    const updateStars = (rating) => {
      stars.forEach((star, idx) => {
        if (idx < rating) {
          star.style.fontVariationSettings = "'FILL' 1";
          star.classList.add('text-tertiary');
        } else {
          star.style.fontVariationSettings = "'FILL' 0";
          star.classList.remove('text-tertiary');
        }
      });
    };
    
    // Initial setup
    updateStars(currentRating);

    stars.forEach(star => {
      star.addEventListener('mouseenter', (e) => {
        updateStars(parseInt(e.target.dataset.value));
      });
      
      star.addEventListener('mouseleave', () => {
        updateStars(currentRating);
      });
      
      star.addEventListener('click', (e) => {
        currentRating = parseInt(e.target.dataset.value);
        ratingInput.value = currentRating;
        updateStars(currentRating);
        
        // Pop animation
        e.target.animate([
          { transform: 'scale(0.8)' },
          { transform: 'scale(1.3)' },
          { transform: 'scale(1)' }
        ], { duration: 300, easing: 'ease-out' });
      });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      this.createRipple(e, submitBtn);
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      // Simulate API Call
      setTimeout(() => {
        submitBtn.textContent = "Review Submitted!";
        submitBtn.classList.replace('bg-primary', 'bg-on-background');
        submitBtn.classList.replace('text-on-primary', 'text-background');
        
        setTimeout(() => {
          closeModal();
          // Reset form
          form.reset();
          currentRating = 5;
          updateStars(currentRating);
          ratingInput.value = 5;
          submitBtn.textContent = originalText;
          submitBtn.classList.replace('bg-on-background', 'bg-primary');
          submitBtn.classList.replace('text-background', 'text-on-primary');
          submitBtn.disabled = false;
        }, 1500);
      }, 1000);
    });
  }
}

// Bootstrap the application on load
document.addEventListener('DOMContentLoaded', () => {
  new ProductPageExperience();
});
