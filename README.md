# 👟 SoleStyle — Premium Footwear E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo%20Online-brightgreen?style=for-the-badge&logo=githubpages&logoColor=white)](https://mohamedhussain4690.github.io/footwear_ecommerce/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/MohamedHussain4690/footwear_ecommerce)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#technologies-used)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#technologies-used)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#technologies-used)

> **SoleStyle** is a modern, responsive single-page e-commerce web application engineered for browsing, filtering, and ordering footwear. Built with a mobile-first philosophy, smooth micro-interactions, client-side state persistence, and automated CI/CD deployment via GitHub Pages.

---

## 🌐 Live Demo

Explore the deployed application in real-time:

👉 **[Launch SoleStyle Live Store](https://mohamedhussain4690.github.io/footwear_ecommerce/)**

---

## 👤 Developer Profile

* **Developer:** **Mohamed Hussain N**
* **Education:** B.E. in Computer Science & Engineering (4th Year / 7th Sem), *Aalim Muhammed Salegh College of Engineering*, Chennai
* **Domain Focus:** Artificial Intelligence, Machine Learning & Modern Web Engineering
* **GitHub:** [@MohamedHussain4690](https://github.com/MohamedHussain4690)
* **Email:** [mhhussain4690@gmail.com](mailto:mhhussain4690@gmail.com)

---

## 🌟 Key Features

### 🛍️ 1. Dynamic Catalog & Category Filtering
* **Instant Category Filtering:** Effortlessly filter products between **All**, **Men**, **Women**, and **Kids** with zero page reloads.
* **Category Hero Cards:** Clickable banner cards that auto-scroll to the products section and apply the category filter.
* **Card Micro-Interactions:** Image hover zooms, badge overlays (*Sale*, *New*, *Trending*, *Best Seller*), star ratings, and action shortcuts (Wishlist, Quick View, Cart).

### 🛒 2. Interactive Shopping Cart Experience
* **Off-Canvas Slide-Over Drawer:** Smooth slide-in cart sidebar with background backdrop blur.
* **Real-Time Price & Order Breakdown:**
  * Auto-calculated **Subtotal**.
  * Dynamic **Free Shipping** threshold (Free shipping on orders over ₹100, otherwise ₹9.99 flat).
  * 10% calculated **Tax**.
  * Total calculation updated automatically upon quantity adjustment.
* **In-Grid Quantity Stepper:** When an item is added to the cart, the product card button dynamically switches to a `- [qty] +` stepper for quick adjustments directly on the product grid.
* **Empty Cart State:** Intuitive empty cart view with call-to-action to continue shopping.

### 👤 3. Comprehensive User Profile Management
* **Personal Information Tab:** Edit user profile attributes (Name, Email, Phone, Address, City, Postal Code, Country, DOB) with instant validation.
* **Instant Avatar Upload:** Upload custom profile pictures from the local file system using the asynchronous `FileReader` API, stored persistently as base64 data.
* **Order History Tab:** Inspect past order receipts with timestamps, status tags (*Delivered*, *Shipped*, *Processing*), individual item totals, and grand total breakdown.
* **Settings & Preferences Tab:** Toggle switch controls for Email Notifications, SMS Alerts, Order Updates, and Marketing Emails.
* **Danger Zone:** Secure account wipe utility to reset all profile data and orders.

### ⏱️ 4. Promotional Flash Sale & Countdown Timer
* **7-Day Rolling Countdown:** Dynamic countdown timer tracking *Days*, *Hours*, *Minutes*, and *Seconds* for seasonal promotional events.
* **Visual Deals Showcase:** Callout card with deal badges and call-to-action buttons.

### 🔔 5. Feedback & Usability
* **Animated Toast Notifications:** Non-intrusive feedback popups for actions like adding items to cart, modifying quantities, saving profile settings, or placing orders.
* **Responsive Mobile Navigation:** Hamburger drawer menu optimized for smartphones and tablets.
* **Newsletter Subscription:** Interactive subscription form with toast feedback.

---

## 🛠️ Technologies Used & Practical Applications

| Technology | Purpose & Practical Implementation |
| :--- | :--- |
| **HTML5** | Provides clean, semantic page structure (`<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<dialog>`), ensuring high web accessibility (a11y) standards and SEO-friendly document hierarchy. |
| **Tailwind CSS (v4)** | Powers utility-first responsive styling, dynamic flexbox/grid layouts, color schemes, transitions, and media queries without bloated CSS stylesheets. |
| **Vanilla JavaScript (ES6+)** | Handles all interactive UI state, DOM manipulation, event handling, cart calculations (`map`, `filter`, `reduce`), and client-side business logic without heavy frontend framework dependencies. |
| **Web Storage API (`localStorage`)** | Enables persistence for user profiles, order histories, and notification preferences, preserving data across browser restarts and page refreshes. |
| **Font Awesome 6.4.0** | Supplies scalable vector iconography for intuitive UI indicators (shopping cart, badges, social media links, navigation controls, user avatar triggers). |
| **Google Fonts (Poppins)** | High-legibility typography designed for clean e-commerce presentation and visual hierarchy. |
| **GitHub Actions (CI/CD)** | Automates the static deployment workflow, compiling and publishing repository assets directly to GitHub Pages upon each commit to `main`. |
| **Modular API Architecture (`api.js`)** | Pre-architected client abstraction layer with token-based Bearer auth, built for seamless plug-and-play integration with Node.js/Express, Django, or cloud backend services. |

---

## 📁 Repository Structure

```text
footwear_ecommerce/
├── .github/
│   └── workflows/
│       └── static.yml       # GitHub Actions workflow for automated Pages deployment
├── api.js                   # REST API client service layer (Auth, Cart, Orders, Profile)
├── index.html               # Main single-page application markup & modal structures
├── README.md                # Comprehensive project documentation
├── script.js                # Core application logic, DOM controllers, cart & state store
└── styles.css               # Custom keyframe animations, scrollbars, and toggle switches
```

---

## 🚀 Getting Started & Local Development

No complex build tools or package managers are required to run this project locally.

### Prerequisites
* Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari)
* Git installed on your system

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohamedHussain4690/footwear_ecommerce.git
   cd footwear_ecommerce
   ```

2. **Run locally:**
   * **Option A: Direct Open**
     Simply double-click `index.html` or open it directly in your web browser.
   
   * **Option B: Using a Lightweight Local Server (Recommended)**
     Using Python:
     ```bash
     python -m http.server 8000
     ```
     Using Node.js (`npx serve`):
     ```bash
     npx serve .
     ```
     Then navigate to `http://localhost:8000` in your browser.

---

## 🔮 Future Enhancements & Roadmap

- [ ] **Cart State Persistence:** Synchronize active cart state with `localStorage` so unfinished carts persist between sessions.
- [ ] **Live Backend Integration:** Connect `api.js` to a Python/Django REST Framework or Node.js/Express backend with MongoDB/PostgreSQL.
- [ ] **Payment Gateway Integration:** Incorporate Razorpay or Stripe checkout sandbox for real-time transaction processing.
- [ ] **Interactive Search Modal:** Implement live search filtering across footwear titles, categories, and price ranges.
- [ ] **Product Reviews & Ratings:** Allow authenticated users to leave reviews and star ratings.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Contact & Acknowledgements

Developed by **Mohamed Hussain N**  
For feedback, collaborations, or inquiries:
* **GitHub:** [@MohamedHussain4690](https://github.com/MohamedHussain4690)
* **Email:** [mhhussain4690@gmail.com](mailto:mhhussain4690@gmail.com)
* **Live Site:** [https://mohamedhussain4690.github.io/footwear_ecommerce/](https://mohamedhussain4690.github.io/footwear_ecommerce/)
