// panneau deroulant
document.addEventListener('DOMContentLoaded', () => {
    const servicesLink = document.querySelector('nav ul li a[href="services.html"]');
    const servicesDropdown = document.createElement('div');
    servicesDropdown.classList.add('services-dropdown');
    
    servicesDropdown.innerHTML = `
        <ul>
            <li><a href="billetterie.html">Billetterie</a></li>
            <li><a href="recherche.html">Pour vous reperer</a></li>
        </ul>
    `;
    
    servicesLink.parentElement.appendChild(servicesDropdown);
});

// Carrousel des animaux emblématiques
class Carousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelector('.carousel-slides');
        this.slideElements = container.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;
        this.totalSlides = this.slideElements.length;
        
        // Création des points de navigation
        this.createDots();
        
        // Ajout des événements
        this.bindEvents();
        
        // Démarrage du défilement automatique
        this.startAutoPlay();
        
        // Mise à jour initiale
        this.updateCarousel();
    }
    
    createDots() {
        const dotsContainer = this.container.querySelector('.carousel-dots');
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        this.dots = dotsContainer.querySelectorAll('.carousel-dot');
    }
    
    bindEvents() {
        // Boutons précédent/suivant
        this.container.querySelector('.prev').addEventListener('click', () => this.prevSlide());
        this.container.querySelector('.next').addEventListener('click', () => this.nextSlide());
        
        // Pause du défilement automatique au survol
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Gestion du swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    updateCarousel() {
        // Déplacer le carrousel
        const offset = -this.currentSlide * 100;
        this.slides.style.transform = `translateX(${offset}%)`;
        
        // Mettre à jour les points de navigation
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        if (startX - endX > threshold) {
            this.nextSlide();
        } else if (endX - startX > threshold) {
            this.prevSlide();
        }
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// Initialisation du carrousel lors du chargement du document
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        new Carousel(carouselContainer);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Gestion de la FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fermer toutes les autres questions ouvertes
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').classList.remove('active');
                }
            });
            
            // Basculer la question courante
            item.classList.toggle('active');
            question.classList.toggle('active');
        });
    });
});
