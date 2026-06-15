document.addEventListener('DOMContentLoaded', () => {
  
  let products = [];
  
  // Fetch products from Backend API
  fetch('/api/products')
    .then(res => res.json())
    .then(data => {
      products = data;
      // SORT PRODUCTS: Low to High based on numericPrice
      products.sort((a, b) => a.numericPrice - b.numericPrice);
      renderProducts(products);
    })
    .catch(err => console.error('Error fetching products:', err));

  let cartItems = [];
  const cartBadge = document.getElementById('cart-badge');
  const toastContainer = document.getElementById('toast-container');
  
  // Cart DOM Elements
  const cartIcon = document.querySelector('.cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('checkout-btn');

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>🛒</span> ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function renderCart() {
    cartBadge.textContent = cartItems.length;
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 20px;">Your cart is empty.</p>';
      cartTotalPrice.textContent = '₹0';
      return;
    }

    let total = 0;
    cartItems.forEach((item, index) => {
      total += item.numericPrice;
      const cartItemHTML = `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price">${item.price}</div>
          </div>
          <button class="remove-item" data-index="${index}">REMOVE</button>
        </div>
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    cartTotalPrice.textContent = '₹' + total.toLocaleString('en-IN');

    // Add remove listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        cartItems.splice(index, 1);
        renderCart();
      });
    });
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      cartItems.push(product);
      renderCart();
      
      cartBadge.classList.add('pop');
      setTimeout(() => cartBadge.classList.remove('pop'), 300);
      showToast(`Added <strong>${product.name}</strong> to your Cart`);
    }
  }

  // Cart Sidebar Event Listeners
  if (cartIcon && cartSidebar && closeCartBtn) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      cartSidebar.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
      cartSidebar.classList.remove('open');
    });
  }

  // Checkout Logic
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutTotalPriceDisplay = document.getElementById('checkout-total-price');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      // Calculate total
      const totalPrice = cartItems.reduce((acc, item) => acc + item.numericPrice, 0);
      checkoutTotalPriceDisplay.textContent = '₹' + totalPrice.toLocaleString('en-IN');
      
      // Close cart sidebar and open checkout modal
      cartSidebar.classList.remove('open');
      checkoutModal.classList.add('active');
    });
  }

  if (closeCheckoutBtn && checkoutModal) {
    closeCheckoutBtn.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
    });
    window.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const totalPrice = cartItems.reduce((acc, item) => acc + item.numericPrice, 0);
      const currentUser = localStorage.getItem('khalif_user') ? JSON.parse(localStorage.getItem('khalif_user')).userId : null;

      const shippingDetails = {
        name: document.getElementById('chk-name').value,
        phone: document.getElementById('chk-phone').value,
        address: document.getElementById('chk-address').value,
        city: document.getElementById('chk-city').value,
        pin: document.getElementById('chk-pin').value
      };

      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser, items: cartItems, totalPrice, shippingDetails, paymentMethod })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Error placing order: ' + data.error);
        } else {
          let successMsg = 'Order Confirmed! Your Order ID is: ' + data.orderId;
          if (paymentMethod === 'Online') {
            successMsg += '\n\n✅ Online Payment Mock Successful!';
          }
          alert(successMsg + '\nThank you for shopping with Khalif ARBA.');
          
          cartItems = [];
          renderCart();
          checkoutModal.classList.remove('active');
          checkoutForm.reset();
        }
      })
      .catch(err => {
        console.error('Checkout error:', err);
        alert('An error occurred during checkout.');
      });
    });
  }

  // Render Products
  const productGrid = document.getElementById('product-grid');
  const searchInput = document.getElementById('product-search');

  function renderProducts(productsList) {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    if (productsList.length === 0) {
      productGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; color: var(--text-secondary); margin-top: 40px; font-size: 1.2rem;">No products found matching your search.</p>';
      return;
    }

    productsList.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = `product-card animate-fade-in delay-${(index % 3) + 1}`;
      
      let tagHtml = product.tag ? `<div class="product-tag">${product.tag}</div>` : '';

      card.innerHTML = `
        <div class="product-image-container">
          ${tagHtml}
          <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/product.png'" />
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-notes">${product.notes}</p>
          <div class="product-rating">${product.rating}</div>
          <div class="product-pricing">
            <span class="product-mrp">${product.mrp}</span>
            <span class="product-price">${product.price}</span>
          </div>
        </div>
        <button class="add-to-cart-btn" data-id="${product.id}">ADD TO CART</button>
      `;
      
      productGrid.appendChild(card);
    });

    // Re-attach listeners to new buttons
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        addToCart(id);
      });
    });
  }

  // Initial Render
  renderProducts(products);

  // Live Search Logic (Sorting matches to top)
  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      // Scroll down so the user can see the products shuffling
      const collectionsSection = document.getElementById('collections');
      if (collectionsSection && window.scrollY < collectionsSection.offsetTop - 150) {
        window.scrollTo({ top: collectionsSection.offsetTop - 80, behavior: 'smooth' });
      }
    });

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      
      if (!searchTerm) {
        // Reset to original numericPrice sort
        const defaultSorted = [...products].sort((a, b) => a.numericPrice - b.numericPrice);
        renderProducts(defaultSorted);
        return;
      }

      const sortedProducts = [...products].sort((a, b) => {
        const aMatch = a.name.toLowerCase().includes(searchTerm) || a.notes.toLowerCase().includes(searchTerm);
        const bMatch = b.name.toLowerCase().includes(searchTerm) || b.notes.toLowerCase().includes(searchTerm);
        
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        // If both match or neither match, sort by price
        return a.numericPrice - b.numericPrice;
      });
      
      renderProducts(sortedProducts);
    });
  }

  // Hamburger Menu Logic
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Modal Logic
  const loginBtn = document.getElementById('nav-login-btn');
  const loginModal = document.getElementById('login-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const authForm = document.getElementById('auth-form');

  if (loginBtn && loginModal && closeModalBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.classList.remove('active');
      }
    });
  }

  // Auth Form Submit
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Attempt Login
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error && data.error === 'Invalid credentials') {
          // If login fails, try Registering them (auto-signup)
          return fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          .then(res => res.json())
          .then(regData => {
            if (regData.error) throw new Error(regData.error);
            localStorage.setItem('khalif_user', JSON.stringify({ userId: regData.userId, email }));
            alert('Account created successfully! Welcome!');
            loginModal.classList.remove('active');
            loginBtn.textContent = 'My Account';
          });
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          // Successful login
          localStorage.setItem('khalif_user', JSON.stringify({ userId: data.userId, email: data.email }));
          alert('Logged in successfully! Welcome back.');
          loginModal.classList.remove('active');
          loginBtn.textContent = 'My Account';
        }
      })
      .catch(err => {
        alert(err.message || 'Authentication failed');
      });
    });
  }

  // Check login on load
  if (localStorage.getItem('khalif_user') && loginBtn) {
    loginBtn.textContent = 'My Account';
  }
});
