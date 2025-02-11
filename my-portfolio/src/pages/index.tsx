// pages/index.tsx
import React, { useEffect } from 'react';
import Head from 'next/head';

const Home: React.FC = () => {
  useEffect(() => {
    // Always start at the top
    window.scrollTo(0, 0);

    const text = "See What I'm About";
    const typingText = document.querySelector('.typing-text') as HTMLElement;
    const introContainer = document.querySelector('.intro-container') as HTMLElement;
    const tourContainer = document.querySelector('.tour-container') as HTMLElement;
    const mainContainer = document.querySelector('.container') as HTMLElement;
    const logoHeader = document.querySelector('.logo-header') as HTMLElement;
    const navMenu = document.querySelector('.nav-menu') as HTMLElement;
    const galleryRows = document.querySelectorAll('.gallery-row');
    const contactSection = document.querySelector('.contact-section') as HTMLElement;

    // Global flag for gallery clickability
    let galleryClickable = false;

    // For results animation
    let resultsAnimationStarted = false;
    const initialSubscribers = 38012;
    const initialViews = 13046787;
    let subscriberCount = initialSubscribers;
    let viewCount = initialViews;
    let subscriberInterval: number;
    let viewInterval: number;

    let tourTransitioning = false;
    const tourObserverOptions = { threshold: 0.1, rootMargin: '-50px' };
    const tourObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (tourTransitioning) return;
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.querySelectorAll('.tour-slide-image').forEach((img: Element) => {
            img.classList.add('visible');
          });
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

    function runIntroAnimation() {
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
            setTimeout(() => {
              introContainer.classList.add('fade-out');
              introContainer.addEventListener('transitionend', () => {
                introContainer.style.display = 'none';
                tourContainer.style.display = 'block';
                const tourLogo = document.querySelector('.tour-logo') as HTMLElement;
                if (tourLogo) {
                  tourLogo.style.display = '';
                }
                const aboutText = document.querySelector('.about-text') as HTMLElement;
                if (aboutText) {
                  aboutText.style.removeProperty('opacity');
                  aboutText.classList.add('visible');
                }
                const resultsDesc = document.querySelector('.results-description');
                if (resultsDesc) {
                  resultsDesc.innerHTML = "";
                }
                setTimeout(() => {
                  const scrollPrompt = document.querySelector('.scroll-prompt') as HTMLElement;
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
      const aboutText = document.querySelector('.about-text') as HTMLElement;
      if (aboutText) {
        aboutText.classList.remove('visible');
        aboutText.style.removeProperty('opacity');
      }
      const scrollPrompt = document.querySelector('.scroll-prompt') as HTMLElement;
      if (scrollPrompt) {
        scrollPrompt.style.opacity = '0';
        scrollPrompt.textContent = '';
        scrollPrompt.style.display = '';
      }
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
    const aboutNavLink = document.getElementById('about-nav-link');
    if (aboutNavLink) {
      aboutNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        replayIntroAnimation();
      });
    }
    const enterPortfolio = document.querySelector('.enter-portfolio');
    if (enterPortfolio) {
      enterPortfolio.addEventListener('click', () => {
        tourTransitioning = true;
        tourObserver.disconnect();
        const tourLogo = document.querySelector('.tour-logo') as HTMLElement;
        if (tourLogo) {
          tourLogo.style.display = 'none';
        }
        const aboutText = document.querySelector('.about-text') as HTMLElement;
        if (aboutText) {
          aboutText.style.transition = 'none';
          aboutText.style.opacity = '0';
        }
        const scrollPrompt = document.querySelector('.scroll-prompt') as HTMLElement;
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
                    const firstInner = row.querySelector('.inner') as HTMLElement;
                    const computedGap = getComputedStyle(row).gap;
                    const gapValue = parseFloat(computedGap) || 0;
                    const scrollDistance = firstInner.offsetWidth + gapValue;
                    (row as HTMLElement).style.setProperty('--scroll-distance', scrollDistance + 'px');
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
    }
    const logoBtn = document.getElementById('logo-btn');
    if (logoBtn) {
      logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    const contactNavLink = document.getElementById('contact-nav-link');
    if (contactNavLink) {
      contactNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    document.querySelectorAll('.gallery-row img').forEach(img => {
      img.addEventListener('click', (e) => {
        if (!galleryClickable) return;
        const target = e.target as HTMLImageElement;
        createModal(target.src);
      });
    });
    function createModal(src: string) {
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
    function typeSegments(segments: { text: string, isNumber: boolean, className?: string }[], callback: () => void) {
      let segIndex = 0;
      function typeNextSegment() {
        if (segIndex >= segments.length) {
          if (callback) callback();
          return;
        }
        const seg = segments[segIndex];
        const span = document.createElement('span');
        if(seg.isNumber) { 
          span.className = "number " + (seg.className ? seg.className : "subscriber-number");
        }
        const resultsDescription = document.querySelector('.results-description');
        if (resultsDescription) {
          resultsDescription.appendChild(span);
        }
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
    function startResultsAnimation() {
      const titleEl = document.querySelector('.results-title') as HTMLElement;
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
          setTimeout(() => {
            startResultsDescription();
          }, 500);
        }
      }, 100);
    }
    function startResultsDescription() {
      const descEl = document.querySelector('.results-description');
      if (descEl) {
        descEl.innerHTML = "";
      }
      const segments = [
        { text: "Well, across two channels I've amassed ", isNumber: false },
        { text: "38,012", isNumber: true, className: "subscriber-number" },
        { text: " subscribers and ", isNumber: false },
        { text: "13,046,787", isNumber: true, className: "view-number" },
        { text: " views.", isNumber: false }
      ];
      typeSegments(segments, startLiveCounters);
    }
    function startLiveCounters() {
      subscriberInterval = window.setInterval(() => {
        subscriberCount++;
        const subElem = document.querySelector('.subscriber-number');
        if(subElem) subElem.textContent = subscriberCount.toLocaleString();
      }, 10000);
      viewInterval = window.setInterval(() => {
        viewCount++;
        const viewElem = document.querySelector('.view-number');
        if(viewElem) viewElem.textContent = viewCount.toLocaleString();
      }, 3000);
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title>HamC's Portfolio</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/centerlogo.png" type="image/png" />
      </Head>
      <div>
        {/* Intro Section */}
        <div className="intro-container">
          <div className="intro-logo">
            <img src="/HamClogo.png" alt="Logo" />
          </div>
          <div className="intro-text">
            <span className="typing-text"></span>
          </div>
        </div>

        {/* Guided Tour Container */}
        <div className="tour-container" style={{ display: 'none' }}>
          <section className="tour-section about-tour">
            <div className="tour-content">
              <img src="/logo.png" alt="Logo" className="tour-logo" />
              <div className="about-spacer"></div>
              <p className="about-text">
                Hey, I'm Keane Lee-Shanok—though for the past decade, I've been known online as HamC.
                I'm a programmer at heart, but under this alias, I've also explored my passion for content creation
                in photo editing, 3D rendering, and video editing. These creative outlets have shaped me into the
                programmer I am today, and I'm excited for you to see what I've built.
              </p>
              <div className="scroll-prompt-spacing"></div>
              <p className="scroll-prompt"></p>
            </div>
          </section>

          <section className="tour-section tour-slide">
            <div className="tour-content">
              <h2 className="tour-title">Humble Beginnings</h2>
              <img src="/beginnings.jpg" alt="Humble Beginnings" className="tour-slide-image" />
              <p className="tour-description">
                This was my old thumbnail style that I used when I was around <strong className="highlight-blue">11 years old</strong>, and it's clear evidence that everyone starts somewhere! As you can see, I was no artist. However, this era of content creation taught me a lot. I would render my models using rigs and my own lighting fixtures in <strong className="highlight-blue">Blender</strong> and it's thanks to this that I have the foundational understanding of Blender that I do now. Thankfully, this style didn't last too long...
              </p>
            </div>
          </section>

          <section className="tour-section tour-slide">
            <div className="tour-content">
              <h2 className="tour-title">Finding My Groove</h2>
              <img src="/groove.webp" alt="Finding My Groove" className="tour-slide-image" />
              <p className="tour-description">
                This is where I started experimenting with making aesthetic looking text in <strong className="highlight-blue">Photoshop</strong>. Though I'd deem this style outdated for today's standards, this was pretty effective and I was getting my first couple <strong className="highlight-blue">thousands</strong> of views on my videos!
              </p>
            </div>
          </section>

          <section className="tour-section tour-slide">
            <div className="tour-content">
              <h2 className="tour-title">Awkward Stage</h2>
              <img src="/awkward.jpg" alt="Awkward Stage" className="tour-slide-image" />
              <p className="tour-description">
                I'd regained my interest in making Minecraft styled thumbnails for my videos, but there was just something... missing. At this time I was taking in game screenshots of my character and then adding effects in <strong className="highlight-blue">Photoshop</strong>, but something was off. I hadn't found my style just yet. However, as time went on, this was soon to change...
              </p>
            </div>
          </section>

          <section className="tour-section tour-slide">
            <div className="tour-content">
              <h2 className="tour-title">Endgame</h2>
              <img src="/win.jpg" alt="Endgame" className="tour-slide-image" />
              <p className="tour-description">
                I did it, I found my modern style! Of course I'm always open to learning more and making my thumbnails even better, but this general style has stuck with me for quite some time, and has certainly performed the best on Youtube. I render <strong className="highlight-blue">3D images</strong> of Minecraft gameplay with <strong className="highlight-blue">Replaymod</strong> via <strong className="highlight-blue">Fabric</strong> and upscale them through <strong className="highlight-blue">FFmpeg</strong> for the most optimal Youtube thumbnail quality. Then I apply a series of blending effects in <strong className="highlight-blue">Photoshop</strong> and make any further adjustments in <strong className="highlight-blue">Paint.NET</strong>. I can confidently say that nowadays, it isn't just simple screenshots anymore!
              </p>
            </div>
          </section>

          <section className="tour-section tour-results">
            <div className="tour-content">
              <h2 className="results-title">But what are the <span className="highlight">results</span>?</h2>
              <p className="results-description"></p>
            </div>
          </section>

          <section className="tour-section tour-end">
            <div className="tour-content">
              <h3>Welcome to My Portfolio</h3>
              <p>Now that you know my story, explore my work...</p>
              <button className="enter-portfolio">Enter Portfolio</button>
            </div>
          </section>
        </div>

        {/* Main Website Container */}
        <div className="container" style={{ display: 'none' }}>
          <section className="landing-section">
            <header className="top-header-area">
              <div className="logo-header" id="logo-btn">
                <div className="logo">
                  <img src="/HamClogo.png" alt="Logo" />
                </div>
              </div>
              <nav className="nav-menu">
                <ul>
                  <li><a href="#" id="about-nav-link">About</a></li>
                  <li><a href="#" id="contact-nav-link">Contact</a></li>
                </ul>
              </nav>
            </header>
            <div className="space2"></div>
            <div className="gallery-container">
              <div className="gallery-row row-1">
                <div className="inner">
                  <img src="/one.jpg" alt="Background" />
                  <img src="/two.jpg" alt="Background" />
                  <img src="/three.jpg" alt="Background" />
                  <img src="/four.jpg" alt="Background" />
                  <img src="/five.jpg" alt="Background" />
                  <img src="/six.jpg" alt="Background" />
                </div>
                <div className="inner">
                  <img src="/one.jpg" alt="Background" />
                  <img src="/two.jpg" alt="Background" />
                  <img src="/three.jpg" alt="Background" />
                  <img src="/four.jpg" alt="Background" />
                  <img src="/five.jpg" alt="Background" />
                  <img src="/six.jpg" alt="Background" />
                </div>
              </div>
              <div className="spacer"></div>
              <div className="gallery-row row-2">
                <div className="inner">
                  <img src="/seven.jpg" alt="Background" />
                  <img src="/eight.jpg" alt="Background" />
                  <img src="/nine.jpg" alt="Background" />
                  <img src="/ten.jpg" alt="Background" />
                  <img src="/eleven.jpg" alt="Background" />
                  <img src="/twelve.jpg" alt="Background" />
                </div>
                <div className="inner">
                  <img src="/seven.jpg" alt="Background" />
                  <img src="/eight.jpg" alt="Background" />
                  <img src="/nine.jpg" alt="Background" />
                  <img src="/ten.jpg" alt="Background" />
                  <img src="/eleven.jpg" alt="Background" />
                  <img src="/twelve.jpg" alt="Background" />
                </div>
              </div>
            </div>
          </section>
          <footer id="contact" className="contact-section">
            <h2>Contact Me</h2>
            <div className="contact-info">
              <p>kleeshan@uwaterloo.ca</p>
              <p>Youtube Channels:</p>
              <div className="social-links">
                <a href="https://www.youtube.com/@HamCOsu" target="_blank" className="social-link">Main Channel</a>
                <a href="https://www.youtube.com/@HamCUHC" target="_blank" className="social-link">Second Channel</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;
