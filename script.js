// Solar System Interactive Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Force scroll to top on page load/refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    // Initialize all functionality
    initScrollAnimations();
    initNavigation();
    initOrbitMap();
    initParallax();
    initMobileMenu();
    initRealTimePlanets();
    initRandomizeFacts(); // Losowa kolejność ciekawostek
    initScrollNavigation();
    initEventUpdates();
});

// NOWY SYSTEM PLANET W HERO - losowe pozycje startowe
function initRealTimePlanets() {
    console.log('🪐 Inicjalizacja NOWEGO systemu planet w hero sekcji...');
    
    // Znajdź wszystkie orbity planet w hero
    const heroOrbits = document.querySelectorAll("#hero-solar-system .hero-orbit");
    console.log(`🔍 Znaleziono ${heroOrbits.length} orbit planet w hero sekcji`);
    
    heroOrbits.forEach((orbit, index) => {
        const planetName = orbit.getAttribute('data-planet');
        const randomDeg = Math.floor(Math.random() * 360);
        
        // Pobierz duration z CSS computed styles
        const computedStyle = window.getComputedStyle(orbit);
        const duration = computedStyle.animationDuration || '30s';
        
        // Oblicz delay na podstawie losowej pozycji
        const durationMs = parseFloat(duration) * 1000;
        const randomDelay = -(randomDeg / 360) * durationMs;
        
        // Ustaw losowy delay dla orbit
        orbit.style.animationDelay = `${randomDelay}ms`;
        
        console.log(`🪐 ${planetName}: losowa pozycja ${randomDeg}°, delay: ${randomDelay}ms, duration: ${duration}`);
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe planet cards
    document.querySelectorAll('.planet-card').forEach(card => {
        observer.observe(card);
    });

    // Observe other elements for fade-in animations
    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });
}

// NOWA NAWIGACJA - przepisana od zera
function initNavigation() {
    console.log('🚀 Inicjalizacja nawigacji...');
    
    // Mapa sekcji z ich offsetami (uwzględniając fixed navbar)
    const navbarHeight = 80; // wysokość fixed navbar
    const sectionOffsets = {
        '#hero': 0,
        '#sun-section': navbarHeight + 40,
        '#planets': navbarHeight + 40,
        '#mercury-section': navbarHeight + 40,
        '#venus-section': navbarHeight + 40,
        '#earth-section': navbarHeight + 40,
        '#mars-section': navbarHeight + 40,
        '#jupiter-section': navbarHeight + 40,
        '#saturn-section': navbarHeight + 40,
        '#uranus-section': navbarHeight + 40,
        '#neptune-section': navbarHeight + 40,
        '#orbit-map': navbarHeight + 20,
        '#events': navbarHeight + 20,
        '#facts': navbarHeight + 20
    };
    
    // Znajdź wszystkie linki nawigacyjne
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(`📍 Znaleziono ${navLinks.length} linków nawigacyjnych`);
    
    // Funkcja do przewijania do sekcji
    function scrollToSection(targetId) {
        console.log(`🎯 Próba przewinięcia do: ${targetId}`);
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) {
            console.error(`❌ Nie znaleziono sekcji: ${targetId}`);
            console.log('📋 Dostępne sekcje:', Array.from(document.querySelectorAll('[id]')).map(el => `#${el.id}`));
            return;
        }
        
        let scrollPosition;
        
        if (targetId === '#hero') {
            scrollPosition = 0;
        } else {
            const elementRect = targetElement.getBoundingClientRect();
            const elementTop = elementRect.top + window.pageYOffset;
            const offset = sectionOffsets[targetId] || 100;
            scrollPosition = Math.max(0, elementTop - offset);
        }
        
        console.log(`📍 Przewijam do ${targetId}, pozycja: ${scrollPosition}, offset: ${sectionOffsets[targetId] || 100}`);
        
        // Smooth scroll z fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback dla starszych przeglądarek
            window.scrollTo(0, scrollPosition);
        }
    }
    
    // Funkcja do podświetlania aktywnego linku
    function setActiveLink(activeLink) {
        // Usuń aktywność ze wszystkich linków
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            link.classList.add('text-gray-300');
        });
        
        // Dodaj aktywność do wybranego linku
        if (activeLink) {
            activeLink.classList.remove('text-gray-300');
            activeLink.classList.add('nav-active');
            console.log(`✨ Podświetlono: ${activeLink.getAttribute('href')}`);
        }
    }
    
    // Dodaj event listenery do wszystkich linków nawigacyjnych
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log(`🖱️ Kliknięto: ${targetId}`);
            
            // Przewiń do sekcji
            scrollToSection(targetId);
            
            // Podświetl aktywny link
            setActiveLink(this);
        });
    });
    
    // Dodaj event listenery do linków w dropdown
    const dropdownLinks = document.querySelectorAll('.group a[href^="#"]');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log(`🖱️ Kliknięto dropdown: ${targetId}`);
            
            // Przewiń do sekcji
            scrollToSection(targetId);
        });
    });
    
    // Automatyczne podświetlanie będzie ustawione przez initScrollNavigation()
    console.log('☀️ Automatyczne podświetlanie nawigacji będzie zarządzane przez scroll');
    
    // Obsługa przycisku strzałki w hero
    const scrollDownBtn = document.getElementById('scroll-down-btn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            scrollToSection('#sun-section');
        });
    }
    
    // Obsługa przycisku "Rozpocznij podróż"
    const startJourneyBtn = document.getElementById('start-journey-btn');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            scrollToSection('#sun-section');
        });
    }
    
    // Test - sprawdź czy wszystkie sekcje istnieją
    console.log('🔍 Sprawdzanie dostępności sekcji:');
    Object.keys(sectionOffsets).forEach(sectionId => {
        const element = document.querySelector(sectionId);
        if (element) {
            console.log(`✅ ${sectionId} - OK`);
        } else {
            console.error(`❌ ${sectionId} - BRAK!`);
        }
    });
    
    console.log('✅ Nawigacja zainicjalizowana pomyślnie!');
}

// RANDOMIZACJA CIEKAWOSTEK - losowa kolejność przy każdym załadowaniu
function initRandomizeFacts() {
    console.log('🎲 Randomizacja kolejności ciekawostek...');
    
    const track = document.querySelector('.facts-scroll-track');
    if (!track) {
        console.error('❌ Nie znaleziono .facts-scroll-track');
        return;
    }
    
    // Pobierz wszystkie ciekawostki
    const factItems = Array.from(track.children);
    if (factItems.length === 0) {
        console.error('❌ Brak ciekawostek do randomizacji');
        return;
    }
    
    // Funkcja Fisher-Yates shuffle
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Wymieszaj ciekawostki
    const shuffledFacts = shuffleArray(factItems);
    
    // Wyczyść track
    track.innerHTML = '';
    
    // Dodaj z powrotem w nowej kolejności
    shuffledFacts.forEach((fact, index) => {
        // Dla mobile (pierwsza ciekawostka) - usuń onclick
        if (window.innerWidth <= 768 && index === 0) {
            fact.removeAttribute('onclick');
            fact.style.cursor = 'default';
        }
        track.appendChild(fact);
    });
    
    console.log('✨ Ciekawostki zostały wymieszane!');
    console.log('🏆 Pierwsza ciekawostka:', shuffledFacts[0].querySelector('h3')?.textContent || 'Nieznana');
}

// Funkcja automatycznego podświetlania nawigacji podczas scrollowania
function initScrollNavigation() {
    let ticking = false;
    let lastScrollTime = 0;
    
    function updateActiveNavOnScroll() {
        const scrollPosition = window.pageYOffset + 120; // offset dla navbar
        let currentSection = '#hero'; // domyślnie
        
        // Funkcja do obliczania rzeczywistej pozycji elementu w dokumencie
        function getElementTop(element) {
            let top = 0;
            while (element) {
                top += element.offsetTop;
                element = element.offsetParent;
            }
            return top;
        }
        
        // Lista sekcji w kolejności od góry do dołu
        const sections = [
            { id: '#hero', element: document.querySelector('#hero') },
            { id: '#sun-section', element: document.querySelector('#sun-section') },
            { id: '#planets', element: document.querySelector('#planets') },
            { id: '#mercury-section', element: document.querySelector('#mercury-section') },
            { id: '#venus-section', element: document.querySelector('#venus-section') },
            { id: '#earth-section', element: document.querySelector('#earth-section') },
            { id: '#mars-section', element: document.querySelector('#mars-section') },
            { id: '#jupiter-section', element: document.querySelector('#jupiter-section') },
            { id: '#saturn-section', element: document.querySelector('#saturn-section') },
            { id: '#uranus-section', element: document.querySelector('#uranus-section') },
            { id: '#neptune-section', element: document.querySelector('#neptune-section') },
            { id: '#orbit-map', element: document.querySelector('#orbit-map') },
            { id: '#events', element: document.querySelector('#events') },
            { id: '#facts', element: document.querySelector('#facts') }
        ];
        
        // Znajdź aktualną sekcję - sprawdzaj od końca do początku
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.element) {
                const sectionTop = getElementTop(section.element);
                
                if (scrollPosition >= sectionTop - 150) {
                    currentSection = section.id;
                    break;
                }
            }
        }
        
        // Debug: sprawdź czy facts section jest wykrywana
        if (currentSection === '#facts') {
            console.log(`📍 Scroll: ${scrollPosition}, Aktywna sekcja: ${currentSection} - FACTS DETECTED!`);
        }
        
        // Podświetl odpowiedni link
        const navLinks = document.querySelectorAll('.nav-link');
        const planetsButton = document.querySelector('.nav-link[href="#planets"], .group button.nav-link');
        
        // Lista sekcji planet
        const planetSections = [
            '#sun-section', '#mercury-section', '#venus-section', 
            '#earth-section', '#mars-section', '#jupiter-section', 
            '#saturn-section', '#uranus-section', '#neptune-section'
        ];
        
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            link.classList.add('text-gray-300');
            
            if (link.getAttribute('href') === currentSection) {
                link.classList.remove('text-gray-300');
                link.classList.add('nav-active');
                
                // Debug: sprawdź czy facts link jest podświetlany
                if (currentSection === '#facts') {
                    console.log(`✨ Facts navigation link activated!`);
                }
            }
        });
        
        // Podświetl "Planety" jeśli jesteśmy na którejś z planet
        if (planetsButton) {
            planetsButton.classList.remove('nav-active');
            if (planetSections.includes(currentSection)) {
                planetsButton.classList.remove('text-gray-300');
                planetsButton.classList.add('nav-active');
                console.log(`🪐 Planets button activated for section: ${currentSection}`);
            } else {
                planetsButton.classList.add('text-gray-300');
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        const now = Date.now();
        if (!ticking && now - lastScrollTime > 50) { // throttle do 20fps
            requestAnimationFrame(() => {
                updateActiveNavOnScroll();
                lastScrollTime = now;
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Dodaj event listener na scroll
    window.addEventListener('scroll', requestTick);
    
    // Uruchom raz na starcie
    updateActiveNavOnScroll();
    
    console.log('📍 Automatyczne podświetlanie nawigacji włączone');
}

// Funkcja automatycznej aktualizacji wydarzeń
function initEventUpdates() {
    console.log('📅 Inicjalizacja automatycznych aktualizacji wydarzeń...');
    
    // Funkcja do obliczania dni do wydarzenia
    function getDaysUntilEvent(dateString) {
        if (dateString === 'daily') return 0;
        
        const eventDate = new Date(dateString);
        const today = new Date();
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    // Funkcja do formatowania daty
    function formatEventDate(dateString, daysUntil) {
        if (dateString === 'daily') return 'Codziennie o różnych godzinach';
        
        const eventDate = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const formattedDate = eventDate.toLocaleDateString('pl-PL', options);
        
        if (daysUntil < 0) {
            return `${formattedDate} (minęło)`;
        } else if (daysUntil === 0) {
            return `${formattedDate} (dziś!)`;
        } else if (daysUntil === 1) {
            return `${formattedDate} (jutro!)`;
        } else if (daysUntil <= 7) {
            return `${formattedDate} (za ${daysUntil} dni)`;
        } else if (daysUntil <= 30) {
            return `${formattedDate} (za ${daysUntil} dni)`;
        } else {
            return formattedDate;
        }
    }
    
    // Funkcja do aktualizacji statusu wydarzenia
    function updateEventStatus() {
        const eventCards = document.querySelectorAll('.event-card[data-date]');
        
        eventCards.forEach(card => {
            const dateString = card.getAttribute('data-date');
            const daysUntil = getDaysUntilEvent(dateString);
            const dateElement = card.querySelector('.text-cosmic-blue');
            
            if (dateElement) {
                dateElement.textContent = formatEventDate(dateString, daysUntil);
                
                // Dodaj specjalne style dla nadchodzących wydarzeń
                card.classList.remove('event-soon', 'event-today', 'event-past');
                
                if (daysUntil < 0) {
                    card.classList.add('event-past');
                    card.style.opacity = '0.6';
                } else if (daysUntil === 0) {
                    card.classList.add('event-today');
                    card.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.5)';
                } else if (daysUntil <= 7 && daysUntil > 0) {
                    card.classList.add('event-soon');
                    card.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.4)';
                } else {
                    card.style.opacity = '1';
                    card.style.boxShadow = '';
                }
            }
        });
        
        console.log('📅 Wydarzenia zaktualizowane');
    }
    
    // Aktualizuj wydarzenia na starcie
    updateEventStatus();
    
    // Aktualizuj wydarzenia co godzinę
    setInterval(updateEventStatus, 3600000); // 1 godzina = 3600000ms
    
    // Aktualizuj wydarzenia o północy
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
        updateEventStatus();
        // Następnie aktualizuj codziennie o północy
        setInterval(updateEventStatus, 24 * 60 * 60 * 1000); // 24 godziny
    }, msUntilMidnight);
    
    console.log('✅ Automatyczne aktualizacje wydarzeń włączone');
}


// NOWA MAPA ORBIT - rzeczywiste pozycje planet w czasie rzeczywistym
function initOrbitMap() {
    console.log('🌌 Inicjalizacja NOWEJ mapy orbit z rzeczywistymi pozycjami...');
    
    // Dokładne okresy orbitalne planet (w dniach ziemskich)
    const orbitalPeriods = {
        mercury: 87.969,
        venus: 224.701,
        earth: 365.256,
        mars: 686.98,
        jupiter: 4332.59,
        saturn: 10759.22,
        uranus: 30688.5,
        neptune: 60182
    };
    
    // Pozycje planet na 1 stycznia 2025 (w stopniach od perihel)
    const initialPositions = {
        mercury: 45,
        venus: 180,
        earth: 100,
        mars: 270,
        jupiter: 15,
        saturn: 320,
        uranus: 50,
        neptune: 358
    };
    
    // Data referencyjna (1 stycznia 2025)
    const referenceDate = new Date('2025-01-01T00:00:00Z');
    
    function calculateRealPlanetPosition(planetName) {
        const now = new Date();
        const daysSinceReference = (now - referenceDate) / (1000 * 60 * 60 * 24);
        
        const period = orbitalPeriods[planetName];
        const initialPos = initialPositions[planetName];
        
        // Oblicz aktualną pozycję kątową
        const currentAngle = (initialPos + (daysSinceReference / period) * 360) % 360;
        
        return currentAngle;
    }
    
    function updateRealPlanetPositions() {
        console.log('🔄 Aktualizacja rzeczywistych pozycji planet...');
        
        // Znajdź wszystkie planety w nowej mapie
        const planets = document.querySelectorAll('.real-planet');
        
        planets.forEach(planet => {
            const planetName = planet.getAttribute('data-planet');
            const orbitRadius = parseInt(planet.getAttribute('data-orbit-radius'));
            const displayName = planet.getAttribute('data-name');
            
            if (orbitalPeriods[planetName]) {
                // Oblicz rzeczywistą pozycję
                const angle = calculateRealPlanetPosition(planetName);
                const angleRad = (angle * Math.PI) / 180;
                
                // Oblicz pozycję X, Y na orbicie
                const x = orbitRadius * Math.cos(angleRad);
                const y = orbitRadius * Math.sin(angleRad);
                
                // Ustaw pozycję planety
                planet.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                
                console.log(`🪐 ${displayName}: ${angle.toFixed(1)}° (${x.toFixed(1)}, ${y.toFixed(1)})`);
            }
        });
        
        // Aktualizuj datę
        updateDateTime();
        
        // Zaplanuj następną aktualizację za 24 godziny
        setTimeout(updateRealPlanetPositions, 24 * 60 * 60 * 1000);
    }
    
    function updateDateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = `Aktualna data: ${dateTimeString}`;
        }
    }
    
    // Rozpocznij aktualizację
    updateDateTime();
    updateRealPlanetPositions();
    
    console.log('✅ Nowa mapa orbit zainicjalizowana!');
}


// Parallax scrolling effect
function initParallax() {
    const starsLayers = document.querySelectorAll('[class^="stars-layer"]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        starsLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.2;
            layer.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('nav .container');
    
    if (mobileMenuBtn && navContainer) {
        // Create mobile menu if it doesn't exist
        let mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobile-menu';
            mobileMenu.className = 'md:hidden fixed top-20 left-0 right-0 bg-space-dark/95 backdrop-blur-md border-b border-cosmic-purple/30 z-40 transform -translate-y-full opacity-0 transition-all duration-300';
            
            mobileMenu.innerHTML = `
                <div class="px-6 py-4 space-y-3">
                    <a href="#hero" class="block py-2 text-gray-300 hover:text-cosmic-gold transition-colors">Menu Główne</a>
                    <div class="border-t border-cosmic-purple/20 pt-3">
                        <p class="text-cosmic-gold font-semibold mb-2">Planety</p>
                        <a href="#sun-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Słońce</a>
                        <a href="#mercury-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Merkury</a>
                        <a href="#venus-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Wenus</a>
                        <a href="#earth-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Ziemia</a>
                        <a href="#mars-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Mars</a>
                        <a href="#jupiter-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Jowisz</a>
                        <a href="#saturn-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Saturn</a>
                        <a href="#uranus-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Uran</a>
                        <a href="#neptune-section" class="block py-1 pl-4 text-gray-300 hover:text-cosmic-gold transition-colors">Neptun</a>
                    </div>
                    <a href="#orbit-map" class="block py-2 text-gray-300 hover:text-cosmic-gold transition-colors border-t border-cosmic-purple/20 pt-3">Mapa Orbit</a>
                    <a href="#events" class="block py-2 text-gray-300 hover:text-cosmic-gold transition-colors">Wydarzenia</a>
                    <a href="#facts" class="block py-2 text-gray-300 hover:text-cosmic-gold transition-colors">Ciekawostki</a>
                </div>
            `;
            
            document.body.appendChild(mobileMenu);
        }
        
        let isMenuOpen = false;
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                mobileMenu.classList.remove('-translate-y-full', 'opacity-0');
                mobileMenu.classList.add('translate-y-0', 'opacity-100');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenu.classList.add('-translate-y-full', 'opacity-0');
                mobileMenu.classList.remove('translate-y-0', 'opacity-100');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Add click handlers to mobile menu links
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                
                // Close mobile menu
                isMenuOpen = false;
                mobileMenu.classList.add('-translate-y-full', 'opacity-0');
                mobileMenu.classList.remove('translate-y-0', 'opacity-100');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Scroll to section
                const scrollToSection = window.scrollToSectionGlobal || function(id) {
                    const element = document.querySelector(id);
                    if (element) {
                        const offset = 120;
                        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: Math.max(0, elementTop - offset),
                            behavior: 'smooth'
                        });
                    }
                };
                
                scrollToSection(targetId);
            }
        });
        
        console.log('📱 Mobile menu initialized');
    }
}

// Hero CTA button functionality - REMOVED (handled by initNavigation)

// Planet hover effects - REMOVED (handled by CSS)

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loading');
    setTimeout(function() {
        document.body.classList.remove('loading');
    }, 2000);
    
    // Scrolling facts używają statycznej struktury HTML
});


// Add intersection observer for performance
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Lazy loading for heavy animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements that need animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
});

// Easter egg: Konami code for special effect
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Special cosmic effect
        document.body.style.animation = 'cosmic-explosion 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        konamiCode = [];
    }
});

// Add cosmic explosion animation
const style = document.createElement('style');
style.textContent = `
    @keyframes cosmic-explosion {
        0% { filter: hue-rotate(0deg) brightness(1); }
        25% { filter: hue-rotate(90deg) brightness(1.5); }
        50% { filter: hue-rotate(180deg) brightness(2); }
        75% { filter: hue-rotate(270deg) brightness(1.5); }
        100% { filter: hue-rotate(360deg) brightness(1); }
    }
`;
document.head.appendChild(style);

// Removed duplicate initScrollingFacts call - now handled above
