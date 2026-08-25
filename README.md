# E-commerce Website

A responsive storefront built with HTML, CSS, JavaScript, and Tailwind CSS. The project demonstrates a complete client-side shopping journey, from product discovery to cart interactions and customer contact.

## Features

- Product browsing and new-arrival views
- Individual product information pages
- Interactive shopping cart behavior
- Reusable navigation and footer components
- Responsive layouts for common screen sizes
- Contact form experience
- Multiple product color variants

## Tech stack

- HTML5
- CSS3
- JavaScript
- Tailwind CSS

## Project structure

```text
├── index.html               # Main entry page
├── home.html / home.css     # Storefront home
├── arrival.html             # New arrivals
├── productInfo.html         # Product details
├── cart.html / cart.js      # Shopping cart
├── ContactUs.html           # Contact experience
├── nav.js                   # Shared navigation
├── footer.js                # Shared footer
└── tailwind.config.js       # Tailwind configuration
```

## Run locally

Clone the repository and open `index.html` in a browser. For automatic reloads during development, serve the folder with a local development server such as the VS Code Live Server extension.

```bash
git clone https://github.com/marwann022/E-commerce-website.git
cd E-commerce-website
```

## Scope

This is a frontend learning project. Product data and cart state are handled in the browser; a production backend, database, authentication, and payment processing are outside the current scope.
