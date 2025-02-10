// Update the portfolio button click handler
document.querySelector('.enter-portfolio').addEventListener('click', () => {
    const tourContainer = document.querySelector('.tour-container');
    const mainContainer = document.querySelector('.container');
    
    // Add fade-out class to tour container
    tourContainer.classList.add('fade-out');
    
    // Show main container with delay
    setTimeout(() => {
        mainContainer.style.display = 'flex';
        
        requestAnimationFrame(() => {
            mainContainer.classList.add('visible');
            
            // Make slider visible immediately
            const slider = document.querySelector('.thumbnail-slider');
            slider.classList.add('visible');
            
            // Sequence the other animations
            setTimeout(() => {
                document.querySelector('.logo-header').classList.add('visible');
                setTimeout(() => {
                    document.querySelector('.nav-menu').classList.add('visible');
                    setTimeout(() => {
                        document.querySelector('.about-section').classList.add('visible');
                        setTimeout(() => {
                            document.querySelector('.contact-section').classList.add('visible');
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
            
            // Hide tour container after transition
            setTimeout(() => {
                tourContainer.style.display = 'none';
            }, 1500);
        });
    }, 800);
}); 