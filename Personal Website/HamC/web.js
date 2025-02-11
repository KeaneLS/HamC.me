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

  // Global flag for gallery clickability (modal works only after fade in)
  let galleryClickable = false;

  // For results animation
  let resultsAnimationStarted = false;
  const initialSubscribers = 38012;
  const initialViews = 13046787;
  let subscriberCount = initialSubscribers;
  let viewCount = initialViews;
  let subscriberInterval;
  let viewInterval;

  // Set up the observer for tour sections
  let tourTransitioning = false;
  const tourObserverOptions = { threshold: 0.1, rootMargin: '-50px' };
  const tourObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (tourTransitioning) return;
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // For tour slides, also add "visible" to child images so they animate in.
        entry.target.querySelectorAll('.tour-slide-image').forEach(img => {
          img.classList.add('visible');
        });
        // If this is the results section and animation hasn't started, trigger it.
        if (entry.target.classList.contains('tour-results') && !resultsAnimationStarted) {
          startResultsAnimation();
          resultsAnimationStarted = true;
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
              // Reset the tour logo (for replay)
              const tourLogo = document.querySelector('.tour-logo');
              if (tourLogo) {
                tourLogo.style.display = '';
              }
              const aboutText = document.querySelector('.about-text');
              aboutText.style.removeProperty('opacity');
              aboutText.classList.add('visible');
              // Clear any previous results description
              const resultsDesc = document.querySelector('.results-description');
              if (resultsDesc) {
                resultsDesc.innerHTML = "";
              }
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

  runIntroAnimation();

  // Function to replay the entire intro and tour animation sequence exactly as on first load
  function replayIntroAnimation() {
    window.scrollTo(0, 0);
    introContainer.style.display = 'flex';
    introContainer.classList.remove('fade-out');
    typingText.textContent = '';
    typingText.style.opacity = '0';
    typingText.style.transform = 'translateY(20px)';

    tourContainer.classList.remove('fade-out');
    tourContainer.style.display = 'none';
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
    // Clear results description on replay
    const resultsDesc = document.querySelector('.results-description');
    if (resultsDesc) {
      resultsDesc.innerHTML = "";
    }

    mainContainer.style.display = 'none';
    mainContainer.classList.remove('visible');
    logoHeader.classList.remove('visible');
    navMenu.classList.remove('visible');
    galleryRows.forEach(row => {
      row.classList.remove('visible');
      row.classList.remove('scroll');
    });
    contactSection.classList.remove('visible');

    galleryClickable = false;
    resultsAnimationStarted = false;
    clearInterval(subscriberInterval);
    clearInterval(viewInterval);
    subscriberCount = initialSubscribers;
    viewCount = initialViews;

    tourTransitioning = false;
    document.querySelectorAll('.tour-section').forEach(section => {
      section.classList.remove('visible');
      tourObserver.observe(section);
    });

    runIntroAnimation();
  }

  document.getElementById('about-nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    replayIntroAnimation();
  });

  document.querySelector('.enter-portfolio').addEventListener('click', () => {
    tourTransitioning = true;
    tourObserver.disconnect();
    // Hide the tour logo so it doesn't show on the main page.
    const tourLogo = document.querySelector('.tour-logo');
    if (tourLogo) {
      tourLogo.style.display = 'none';
    }
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

    // Smooth fade-out for the tour container (no bump)
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
              galleryClickable = true;
            }, rowDelay * galleryRows.length + 1000);
          }, 500);
        }, 500);
      });
    }, 800);
  });

  document.getElementById('logo-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('contact-nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('.gallery-row img').forEach(img => {
    img.addEventListener('click', (e) => {
      if (!galleryClickable) return;
      createModal(e.target.src);
    });
  });

  function createModal(src) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const modalImageWrapper = document.createElement('div');
    modalImageWrapper.classList.add('modal-image-wrapper');
    
    const modalImage = document.createElement('img');
    modalImage.src = src;
    modalImageWrapper.appendChild(modalImage);
    
    const closeButton = document.createElement('button');
    closeButton.classList.add('modal-close');
    closeButton.textContent = 'Close';
    
    modalContent.appendChild(modalImageWrapper);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    requestAnimationFrame(() => {
      modalOverlay.classList.add('visible');
    });
    
    closeButton.addEventListener('click', () => {
      modalOverlay.classList.remove('visible');
      modalOverlay.addEventListener('transitionend', () => {
        modalOverlay.remove();
      }, { once: true });
    });
  }

  // Helper function to type an array of segments sequentially.
  function typeSegments(segments, callback) {
    let segIndex = 0;
    function typeNextSegment() {
      if (segIndex >= segments.length) {
        if (callback) callback();
        return;
      }
      const seg = segments[segIndex];
      const span = document.createElement('span');
      if(seg.isNumber) { 
        // Use the provided class name if available; otherwise default to subscriber-number
        span.className = "number " + (seg.className ? seg.className : "subscriber-number");
      }
      document.querySelector('.results-description').appendChild(span);
      let charIndex = 0;
      const interval = setInterval(() => {
        if (charIndex < seg.text.length) {
          span.innerHTML += seg.text.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(interval);
          segIndex++;
          setTimeout(typeNextSegment, 300);
        }
      }, 60);
    }
    typeNextSegment();
  }

  // Start the results animation when the tour-results section comes into view.
  function startResultsAnimation() {
    // Typewriter effect for the results title.
    const titleEl = document.querySelector('.results-title');
    const finalTitleHTML = 'But what are the <span class="highlight">results</span>?';
    const plainTitle = "But what are the results?";
    titleEl.textContent = "";
    let index = 0;
    const titleInterval = setInterval(() => {
      titleEl.textContent += plainTitle.charAt(index);
      index++;
      if (index === plainTitle.length) {
        clearInterval(titleInterval);
        titleEl.innerHTML = finalTitleHTML;
        // Wait 500ms, then start typing the description from the very beginning (left to right)
        setTimeout(() => {
          startResultsDescription();
        }, 500);
      }
    }, 100);
  }

  // Typewriter effect for the results description using segmented approach.
  function startResultsDescription() {
    const descEl = document.querySelector('.results-description');
    descEl.innerHTML = "";
    const segments = [
      { text: "Well, across two channel's I've amassed ", isNumber: false },
      { text: "38,012", isNumber: true, className: "subscriber-number" },
      { text: " subscribers and ", isNumber: false },
      { text: "13,046,787", isNumber: true, className: "view-number" },
      { text: " views.", isNumber: false }
    ];
    typeSegments(segments, startLiveCounters);
  }

  // Start live counters after typing the results description.
  function startLiveCounters() {
    subscriberInterval = setInterval(() => {
      subscriberCount++;
      const subElem = document.querySelector('.subscriber-number');
      if(subElem) subElem.textContent = subscriberCount.toLocaleString();
    }, 2000); // every 2 seconds
    viewInterval = setInterval(() => {
      viewCount++;
      const viewElem = document.querySelector('.view-number');
      if(viewElem) viewElem.textContent = viewCount.toLocaleString();
    }, 1000); // every 1 second
  }
});
