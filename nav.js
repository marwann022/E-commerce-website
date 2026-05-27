document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the current page filename from the URL (defaults to 'home.html' if empty)
    const currentPath = window.location.pathname.split("/").pop() || "home.html";

    // 2. Define standard Tailwind configuration style states for clean execution
    const activeClasses = "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1";
    const inactiveClasses = "text-on-surface-variant dark:text-outline-variant hover:text-primary border-b-2 border-transparent pb-1";

    // 3. Generate individual link styling dynamically based on what page matches
    const homeStyle = currentPath === "home.html" ? activeClasses : inactiveClasses;
    const arrivalStyle = currentPath === "arrival.html" ? activeClasses : inactiveClasses;
    const cartStyle = currentPath === "cart.html" ? activeClasses : inactiveClasses;
    const contactStyle = currentPath === "ContactUs.html" ? activeClasses : inactiveClasses;

    // 4. Query storage for the current authenticated user session
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "null");
    const displayName = currentUser ? (currentUser.name || `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim()) : "";
    const displayFirstName = displayName ? displayName.split(" ")[0] : "";

    const navbar = `
    <header class="bg-surface/80 dark:bg-background/80 backdrop-blur-md docked full-width top-0 sticky z-50 shadow-sm dark:shadow-none">
      <div class="flex flex-col w-full max-w-container-max mx-auto px-margin-desktop py-4">
        <div class="flex flex-wrap items-center justify-between gap-3">

          <div class="text-3xl font-bold tracking-tight text-on-background dark:text-inverse-on-surface select-none">
            <a href="home.html">AURA</a>
          </div>  

          <nav class="hidden md:flex items-center space-x-8">
            <a class="${homeStyle} transition-colors text-label-md font-label-md" href="home.html">
              Home
            </a>

            <a class="${arrivalStyle} transition-colors text-label-md font-label-md" href="arrival.html">
              New Arrivals
            </a>

            <a class="${cartStyle} transition-colors text-label-md font-label-md" href="cart.html">
              Cart
            </a>

            <a class="${contactStyle} transition-colors text-label-md font-label-md" href="ContactUs.html">
              Contact Us
            </a>
          </nav>

          <div class="flex items-center space-x-6">

            <div class="hidden lg:block relative">
              <input
                class="bg-white border-solid border-gray-300 rounded-full px-6 py-2 text-label-md focus:ring-2 focus:ring-primary/20 w-64 outline-none"
                placeholder="Search products..."
                type="text"
              >
            </div>

            <div class="flex items-center space-x-4">

              <!-- User Profile Integration Wrapper -->
              <div class="relative flex items-center gap-2">
                ${currentUser ? `
                  <span class="hidden sm:inline-block text-label-md font-medium text-on-surface-variant max-w-[120px] truncate select-none">
                    Hi, ${displayFirstName}
                  </span>
                  
                  <button id="nav-profile-btn" class="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition duration-300 scale-100 active:scale-95 cursor-pointer flex items-center justify-center p-1 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 select-none" aria-label="User Account">
                    <i data-lucide="user" class="w-5 h-5"></i>
                  </button>
                  
                  <!-- Premium Glassmorphism Dropdown -->
                  <div id="nav-profile-dropdown" class="hidden absolute right-0 top-12 z-50">
                    <div class="w-64 bg-white/95 dark:bg-inverse-surface/95 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-5 shadow-[0_16px_36px_rgba(0,0,0,0.1)] flex flex-col gap-4">
                      <div class="flex flex-col gap-1">
                        <p class="text-label-md font-bold text-on-background truncate">${displayName}</p>
                        <p class="text-xs text-outline truncate">${currentUser.email}</p>
                      </div>
                      <div class="h-[1px] w-full bg-outline-variant/30"></div>
                      <a href="cart.html" class="flex items-center gap-3 text-label-md text-on-surface-variant hover:text-primary transition-colors py-1">
                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                        My Shopping Cart
                      </a>
                      <button id="nav-logout-btn" class="w-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white py-2.5 rounded-2xl text-label-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer mt-1">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        Sign Out
                      </button>
                    </div>
                  </div>
                ` : `
                  <button id="nav-login-btn" class="bg-primary hover:bg-primary/90 text-on-primary font-semibold text-label-md px-5 py-2 rounded-full transition-all duration-300 scale-100 active:scale-95 shadow-sm hover:shadow-md whitespace-nowrap block cursor-pointer" title="Sign In" aria-label="Sign In">
                    Login
                  </button>
                `}
              </div>

              <button class="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition duration-300 scale-100 active:scale-95 cursor-pointer flex items-center justify-center" aria-label="Wishlist">
                <i data-lucide="heart" class="w-5 h-5"></i>
              </button>

              <a href="cart.html" class="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition duration-300 scale-100 active:scale-95 cursor-pointer flex items-center justify-center" aria-label="Shopping Bag">
                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
              </a>

            </div>
          </div>

        </div>
      </div>
    </header>
  `;

    const navContainer = document.getElementById("navbar");
    if (navContainer) {
      navContainer.innerHTML = navbar;
      navContainer.className = "sticky top-0 z-50";
    }

    // Trigger Lucide parsing for dynamically injected nav icons
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }

    // 5. Setup interaction event handlers for user dropdown
    if (currentUser) {
      const profileBtn = document.getElementById("nav-profile-btn");
      const profileDropdown = document.getElementById("nav-profile-dropdown");
      const logoutBtn = document.getElementById("nav-logout-btn");

      if (profileBtn && profileDropdown) {
        // Toggle dropdown
        profileBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          profileDropdown.classList.toggle("hidden");
        });

        // Close when clicking elsewhere
        document.addEventListener("click", (e) => {
          if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
            profileDropdown.classList.add("hidden");
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("isLoggedIn");
          sessionStorage.removeItem("currentUser");
          sessionStorage.removeItem("isLoggedIn");
          window.location.replace("home.html");
        });
      }
    }

    const loginBtn = document.getElementById("nav-login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        window.location.replace("login.html");
      });
    }
});
