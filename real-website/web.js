// Smooth scrolling for in-page links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Always start at the top
  window.scrollTo(0, 0);

  const text = "See What I'm About";
  const typingText = document.querySelector('.typing-text');
  const introContainer = document.querySelector('.intro-container');
  const tourContainer = document.querySelector('.tour-container');
  const mainContainer = document.querySelector('.container');

  // Elements for main page fade-in sequence
  const logoHeader = document.querySelector('.logo-header');
  const navMenu = document.querySelector('.nav-menu');
  const galleryRows = document.querySelectorAll('.gallery-row');
  const contactSection = document.querySelector('.contact-section');

  // Typing animation in the intro
  setTimeout(() => {
    typingText.style.transition = 'all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1)';
    typingText.style.opacity = '1';
    typingText.style.transform = 'translateY(0)';
    
    let i = 0;
    const typeWriter = setInterval(() => {
      if (i < text.length) {
        typingText.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeWriter);
        // After a pause, fade out the intro
        setTimeout(() => {
          introContainer.classList.add('fade-out');
          introContainer.addEventListener('transitionend', () => {
            introContainer.style.display = 'none';
            // Show the tour container
            tourContainer.style.display = 'block';
            // Reveal the tour about text
            const aboutText = document.querySelector('.about-text');
            aboutText.classList.add('visible');
            // Type out the scroll prompt
            setTimeout(() => {
              const scrollPrompt = document.querySelector('.scroll-prompt');
              const promptText = 'Keep scrolling to explore!';
              let j = 0;
              const typePrompt = setInterval(() => {
                if (j < promptText.length) {
                  scrollPrompt.style.opacity = '1';
                  scrollPrompt.textContent += promptText.charAt(j);
                  j++;
                } else {
                  clearInterval(typePrompt);
                }
              }, 100);
            }, 2000);
          }, { once: true });
        }, 1500);
      }
    }, 120);
  }, 2000);

  // Flag to prevent re-triggering animations during tour exit
  let tourTransitioning = false;

  // Observer for tour sections to fade in as they enter view
  const tourObserverOptions = { threshold: 0.1, rootMargin: '-50px' };
  const tourObserver = new IntersectionObserver((entries) => {
    if (tourTransitioning) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const media = entry.target.querySelector('.tour-media');
        if (media) {
          setTimeout(() => {
            media.classList.add('visible');
          }, 500);
        }
      }
    });
  }, tourObserverOptions);
  document.querySelectorAll('.tour-section').forEach(section => {
    tourObserver.observe(section);
  });

  // "Enter Portfolio" button click event
  document.querySelector('.enter-portfolio').addEventListener('click', () => {
    tourTransitioning = true;
    tourObserver.disconnect();

    // Immediately hide the about-text to prevent its reanimation
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
      aboutText.style.transition = 'none';
      aboutText.style.opacity = '0';
    }
    
    // Immediately hide the scroll prompt to prevent its reanimation
    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
      scrollPrompt.style.transition = 'none';
      scrollPrompt.style.opacity = '0';
      scrollPrompt.style.display = 'none';
    }

    // Fade out the tour container and hide it when done
    tourContainer.classList.add('fade-out');
    tourContainer.addEventListener('transitionend', () => {
      setTimeout(() => {
        tourContainer.style.display = 'none';
      }, 1000);
    }, { once: true });
    
    // After a short delay, scroll to the top and show the main container
    setTimeout(() => {
      window.scrollTo(0, 0);
      mainContainer.style.display = 'flex';
      requestAnimationFrame(() => {
        mainContainer.classList.add('visible');
        // Sequential fade in: header, then nav, then gallery rows, then contact footer
        setTimeout(() => {
          logoHeader.classList.add('visible');
          setTimeout(() => {
            navMenu.classList.add('visible');
            let rowDelay = 1000;
            galleryRows.forEach((row, idx) => {
              setTimeout(() => {
                row.classList.add('visible');
              }, rowDelay * (idx + 1));
            });
            setTimeout(() => {
              contactSection.classList.add('visible');
              // Calculate scroll distance for each gallery row (first copy width + gap)
              galleryRows.forEach(row => {
                const firstInner = row.querySelector('.inner');
                const computedGap = getComputedStyle(row).gap;
                const gapValue = parseFloat(computedGap) || 0;
                const scrollDistance = firstInner.offsetWidth + gapValue;
                row.style.setProperty('--scroll-distance', scrollDistance + 'px');
              });
              // Start the infinite scrolling animation
              galleryRows.forEach(row => {
                row.classList.add('scroll');
              });
            }, rowDelay * galleryRows.length + 1000);
          }, 500);
        }, 500);
      });
    }, 800);
  });

  // Logo click: scroll to the top of the main page
  const logoBtn = document.getElementById('logo-btn');
  logoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // "Contact" nav link: scroll to the contact footer
  const contactNavLink = document.getElementById('contact-nav-link');
  contactNavLink.addEventListener('click', (e) => {
    e.preventDefault();
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
