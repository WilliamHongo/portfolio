document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    
    let currentIndex = 0; // Start with the first card active
    const totalCards = cards.length;
    
    function updateCarousel() {
        cards.forEach((card, index) => {
            card.className = 'card';
            
            if (index === currentIndex) {
                card.classList.add('active');
            }
            
            let offset = index - currentIndex;
            
            // Handle wrapping for visual continuity
            if (offset < -2) {
                offset += totalCards;
            } else if (offset > 2) {
                offset -= totalCards;
            }
            
            // Position cards based on offset
            const translateX = offset * 250; // Adjust spacing between cards
            card.style.transform = `translateX(${translateX}px) scale(${index === currentIndex ? 1 : 0.8})`;
            card.style.zIndex = index === currentIndex ? 10 : 5 - Math.abs(offset);
            card.style.opacity = Math.abs(offset) > 2 ? 0 : 1 - (Math.abs(offset) * 0.2);
        });
    }
    
    // Initialize carousel
    updateCarousel();
    
    // Event listeners for prev/next buttons
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    });
    
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    });
    
    // Optional: Add auto-scroll functionality
    // setInterval(function() {
    //     currentIndex = (currentIndex + 1) % totalCards;
    //     updateCarousel();
    // }, 5000);
});
