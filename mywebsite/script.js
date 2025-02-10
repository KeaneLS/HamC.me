document.addEventListener('DOMContentLoaded', () => {
    // Get current page name - more robust detection
    const currentPage = window.location.pathname.split('/').pop() || 'objects.html';
    console.log('Current page:', currentPage); // Debug log

    // Animation elements - only initialize if we're on the home page
    if (currentPage === 'objects.html') {
        const overlay = document.querySelector('.animation-overlay');
        const typingText = document.querySelector('.typing-text');
        
        // Typing animation
        async function typeText() {
            const text = "Hello, I'm Keane.";
            let displayText = "";
            
            for (let i = 0; i < text.length; i++) {
                if (i === 5) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                displayText += text[i];
                typingText.textContent = displayText + (i < text.length - 1 ? '_' : '');
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1000);
        }
        
        typingText.style.opacity = '1';
        typeText();
    }

    // Smooth scrolling function
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            window.scrollTo({
                behavior: 'smooth',
                top: element.offsetTop - 60
            });
        }
    }

    // Navigation function
    function navigateToPage(page) {
        console.log('Navigating to:', page); // Debug log
        window.location.href = page;
    }

    // Header navigation - handle all buttons
    document.querySelectorAll('header button').forEach(button => {
        button.addEventListener('click', () => {
            // Get the class name of the clicked button
            const buttonClass = Array.from(button.classList)[0];
            console.log('Button clicked:', buttonClass); // Debug log
            
            // Handle home button
            if (buttonClass === 'home') {
                if (currentPage === 'objects.html') {
                    smoothScroll('.greeting');
                } else {
                    navigateToPage('objects.html');
                }
                return;
            }
            
            // Handle contact button
            if (buttonClass === 'contact') {
                if (currentPage === 'objects.html') {
                    smoothScroll('footer');
                } else {
                    navigateToPage('objects.html#footer');
                }
                return;
            }
            
            // Handle all other section buttons
            const targetPage = `${buttonClass}.html`;
            if (currentPage !== targetPage) {
                navigateToPage(targetPage);
            }
        });
    });

    // Only run home page specific code if we're on objects.html
    if (currentPage === 'objects.html') {
        // See more button
        const seeMoreButton = document.querySelector('.see-more');
        if (seeMoreButton) {
            seeMoreButton.addEventListener('click', () => {
                smoothScroll('.projects');
            });
        }

        // Big project buttons
        const sections = ['graphic-design', 'video-editing', 'paid-promotions', 'programming'];
        sections.forEach(section => {
            const bigButton = document.querySelector(`.big-${section}`);
            if (bigButton) {
                bigButton.addEventListener('click', () => {
                    navigateToPage(`${section}.html`);
                });
            }
        });
    }

    // Handle hash links when page loads
    if (window.location.hash === '#footer') {
        setTimeout(() => {
            smoothScroll('footer');
        }, 100);
    }

    // Add active state to current page's header button
    const currentSection = currentPage.replace('.html', '');
    const activeButton = document.querySelector(`header .${currentSection}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
});
