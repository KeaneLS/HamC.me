// Smooth scrolling for in-page links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
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
  const logoHeader = document.querySelector('.logo-header');
  const navMenu = document.querySelector('.nav-menu');
  const galleryRows = document.querySelectorAll('.gallery-row');
  const contactSection = document.querySelector('.contact-section');

  // Set up the observer for tour sections
  let tourTransitioning = false;
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

  // Function that runs the intro/tour animation sequence
  function runIntroAnimation() {
    setTimeout(() => {
      // Animate the "See What I'm About" text
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
          setTimeout(() => {
            introContainer.classList.add('fade-out');
            introContainer.addEventListener('transitionend', () => {
              introContainer.style.display = 'none';
              // Show the tour container
              tourContainer.style.display = 'block';
              const aboutText = document.querySelector('.about-text');
              // Remove any inline opacity so that CSS transitions apply
              aboutText.style.removeProperty('opacity');
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
  }

  // Run the initial animation sequence
  runIntroAnimation();

  // Function to replay the entire intro and tour animation sequence exactly as on first load
  function replayIntroAnimation() {
    // Force scroll to top for consistency
    window.scrollTo(0, 0);

    // Reset the intro container
    introContainer.style.display = 'flex';
    introContainer.classList.remove('fade-out');
    typingText.textContent = '';
    typingText.style.opacity = '0';
    typingText.style.transform = 'translateY(20px)';

    // Reset the tour container and its children
    tourContainer.classList.remove('fade-out');
    tourContainer.style.display = 'none';
    // Remove the "visible" and "scroll" classes from each tour section (so their animations fire again)
    document.querySelectorAll('.tour-section').forEach(section => {
      section.classList.remove('visible');
    });
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
      aboutText.classList.remove('visible');
      aboutText.style.removeProperty('opacity');
    }
    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
      scrollPrompt.style.opacity = '0';
      scrollPrompt.textContent = '';
      scrollPrompt.style.display = '';
    }

    // Reset the main container and its sequential children
    mainContainer.style.display = 'none';
    mainContainer.classList.remove('visible');
    logoHeader.classList.remove('visible');
    navMenu.classList.remove('visible');
    galleryRows.forEach(row => {
      row.classList.remove('visible');
      row.classList.remove('scroll'); // remove the scrolling animation class
    });
    contactSection.classList.remove('visible');

    // Reset the tourTransitioning flag and reattach observer to tour sections
    tourTransitioning = false;
    document.querySelectorAll('.tour-section').forEach(section => {
      section.classList.remove('visible');
      tourObserver.observe(section);
    });

    // Run the intro/tour animation again
    runIntroAnimation();
  }

  // "About" navigation link click event to replay the entire tour animation sequence exactly as on first load
  document.getElementById('about-nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    replayIntroAnimation();
  });

  // "Enter Portfolio" button click event (for transitioning to the main page)
  document.querySelector('.enter-portfolio').addEventListener('click', () => {
    tourTransitioning = true;
    tourObserver.disconnect();

    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
      aboutText.style.transition = 'none';
      aboutText.style.opacity = '0';
    }
    const scrollPrompt = document.querySelector('.scroll-prompt');
    if (scrollPrompt) {
      scrollPrompt.style.transition = 'none';
      scrollPrompt.style.opacity = '0';
      scrollPrompt.style.display = 'none';
    }

    tourContainer.classList.add('fade-out');
    tourContainer.addEventListener('transitionend', () => {
      setTimeout(() => {
        tourContainer.style.display = 'none';
      }, 1000);
    }, { once: true });

    setTimeout(() => {
      window.scrollTo(0, 0);
      mainContainer.style.display = 'flex';
      mainContainer.classList.remove('visible');
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
              galleryRows.forEach(row => {
                const firstInner = row.querySelector('.inner');
                const computedGap = getComputedStyle(row).gap;
                const gapValue = parseFloat(computedGap) || 0;
                const scrollDistance = firstInner.offsetWidth + gapValue;
                row.style.setProperty('--scroll-distance', scrollDistance + 'px');
              });
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
  document.getElementById('logo-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // "Contact" navigation link: scroll to the contact footer
  document.getElementById('contact-nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
