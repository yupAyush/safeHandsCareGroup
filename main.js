document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Header & Scroll Top button ---
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  // --- Scroll to Top Action ---
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Mobile Menu Toggle (Right Drawer) ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Highlight Active Navbar Item Based on URL ---
  const navItems = document.querySelectorAll('.nav-item');
  const path = window.location.pathname;
  let page = path.substring(path.lastIndexOf('/') + 1);
  
  if (page === '' || page === '/') {
    page = 'index.html';
  }

  navItems.forEach(item => {
    item.classList.remove('active');
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      // Exact matching or home matching
      if (href === page || (page === 'index.html' && href === 'index.html')) {
        item.classList.add('active');
      }
    }
  });

  // --- Contact Form Submission & Toast ---
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-control[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--primary-pink)';
        } else {
          input.style.borderColor = 'var(--border-color)';
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        .then(async (response) => {
          let json = await response.json();
          if (response.status === 200) {
            if (formToast) {
              formToast.textContent = 'Your message has been sent successfully. We will get back to you shortly.';
              formToast.classList.add('show');
              contactForm.reset();
              
              setTimeout(() => {
                formToast.classList.remove('show');
              }, 4000);
            }
          } else {
            console.error(json);
            alert(json.message || 'Something went wrong. Please try again.');
          }
        })
        .catch(error => {
          console.error(error);
          alert('Form submission failed. Please check your internet connection and try again.');
        })
        .finally(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        });
      }
    });

    // Reset input borders when user types
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = 'var(--border-color)';
      });
    });
  }
});
