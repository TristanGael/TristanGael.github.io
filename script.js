// ===== PORTFOLIO WEBSITE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initDarkMode();
    initLanguageToggle();
    initTypingEffect(); // Start the typing effect on page load
    initScrollEffects();
    initAnimations();
    initContactForm();
    initProjectCardInteractions();
    enablePortfolioImageLinks();
    initPerformanceOptimizations();
    initHamburgerMenu();

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link to a section
            if (href.includes('#')) {
                const parts = href.split('#');
                const page = parts[0];
                const targetId = parts[1];
                
                // If we're on the same page or it's a relative anchor
                if (!page || page === '' || window.location.pathname.includes(page.replace('.html', ''))) {
                    e.preventDefault();
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // For cross-page navigation, let the browser handle it normally
                    // This will navigate to index.html#section and the browser will scroll to the anchor
                    return true;
                }
            }
        });
    });
});

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for project cards
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.animationPlayState = 'running';
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .contact-item');
    animateElements.forEach(el => observer.observe(el));

    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }, 10));
    }

    // Progress indicator (optional)
    createProgressIndicator();
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Animate skill bars (if you want to add progress bars later)
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.3 });

    skillCategories.forEach(category => {
        category.style.transform = 'translateY(20px)';
        category.style.opacity = '0';
        category.style.transition = 'all 0.6s ease-out';
        skillObserver.observe(category);
    });
    
    // Sound wave animation for hero line when circles are hovered
    initHeroLineAnimation();
    // Floating elements positions are defined in CSS; no JS placement needed.

    // Button hover effects
    enhanceButtonInteractions();
}

// positionFloatingTargets removed — positions are defined once in CSS (styles.css)

// ===== CONTACT FORM ENHANCEMENTS =====
function initContactForm() {
    const contactButtons = document.querySelectorAll('a[href^="mailto:"]');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Track interaction (analytics placeholder)
            trackEvent('contact', 'email_click', 'hero_cta');
        });
    });

    // Social links tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.className.split(' ').find(cls => 
                ['github', 'linkedin', 'researchgate', 'scholar'].includes(cls)
            );
            trackEvent('social', 'click', platform);
        });
    });
}

// ===== TYPING EFFECT =====
let typingTimeout;
let isTypingActive = false;

function initTypingEffect() {
    const titleSub = document.querySelector('.title-sub');
    if (!titleSub) return;

    // Get current language and texts
    function getCurrentTypingTexts() {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        return translations[currentLang]['typing-texts'];
    }

    let texts = getCurrentTypingTexts();
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 50;
    const deletingSpeed = 50;
    const delayBetweenTexts = 2000;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (!isDeleting) {
            titleSub.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                setTimeout(() => {
                    isDeleting = true;
                }, delayBetweenTexts);
            }
        } else {
            titleSub.textContent = currentText.substring(0, charIndex);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }
        
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        if (isTypingActive) {
            typingTimeout = setTimeout(typeText, speed);
        }
    }

    // Start typing effect after initial animation
    isTypingActive = true;
    typingTimeout = setTimeout(typeText, 3000);
}

function restartTypingEffect() {
    // Stop current typing effect
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    isTypingActive = false;
    
    // Restart typing effect
    setTimeout(() => {
        initTypingEffect();
    }, 100);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
    // Lazy loading for images (when you add them)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize animations for performance
    optimizeAnimations();
}

// ===== UTILITY FUNCTIONS =====

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create progress indicator
function createProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-indicator';
    progressBar.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(progressBar);

    const progressBarFill = progressBar.querySelector('.progress-bar');
    
    window.addEventListener('scroll', throttle(function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBarFill.style.width = scrolled + '%';
    }, 10));

    // Add CSS for progress indicator
    const style = document.createElement('style');
    style.textContent = `
        .progress-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(96, 165, 250, 0.2);
            z-index: 9999;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}


// Sound wave animation for hero line
// Sound wave animation for hero line
function initHeroLineAnimation() {
    // Listen to any element with the .target class so all floating circles can trigger the wave
    const circles = document.querySelectorAll('.target');
    const heroLine = document.querySelector('.hero-line');
    
    if (!heroLine) return;
    
    circles.forEach(circle => {
        circle.addEventListener('mouseenter', function() {
            // Add wave animation class
            heroLine.classList.add('wave-active');
            
            // Remove class after animation completes
            setTimeout(() => {
                heroLine.classList.remove('wave-active');
            }, 1200); // 1.2 seconds
        });
    });
}

// Enhance button interactions
function enhanceButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Optimize animations for performance
function optimizeAnimations() {
    // Pause animations when elements are not visible
    const animatedElements = document.querySelectorAll('.project-card');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            } else {
                entry.target.style.animationPlayState = 'paused';
            }
        });
    }, { threshold: 0 });

    animatedElements.forEach(el => animationObserver.observe(el));
}

// Analytics placeholder function
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
    
    // Example: Google Analytics integration
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         event_category: category,
    //         event_label: label
    //     });
    // }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Focus management for mobile menu
function manageFocus() {
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navMenu && navMenu.classList.contains('active')) {
        navLinks[0]?.focus();
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
    // Could implement error reporting here
});

// ===== SERVICE WORKER REGISTRATION (for PWA features) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you create a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// ===== HAMBURGER MENU =====
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// ===== DARK MODE TOGGLE =====
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.setAttribute('aria-label', 'Toggle light mode');
    
    // Add to nav-menu instead of nav-container
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.appendChild(darkModeToggle);
    }
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        this.setAttribute('aria-label', isLight ? 'Toggle dark mode' : 'Toggle light mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// ===== LANGUAGE TOGGLE =====
const translations = {
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-portfolio': 'Portfolio',
        'nav-contact': 'Contact',
        
        // Hero Section
        'hero-title': 'Tristan-Gael Bara',
        'hero-subtitle': 'Research & VR Specialist',        
        'hero-learn-more': 'Learn More',
        'hero-cta': 'Get in Touch',
        
        // Typing Effect
        'typing-texts': [
            'Research & VR Specialist',
            'Cognitive Psychology Expert',
            'Unity Developer',            
            'HCI Researcher'
        ],
        
        // About Section
        'about-title': 'About Me',
        'about-subtitle': '',
        'about-intro-1': 'I am a researcher and developer with a background in Cognitive Psychology and Human–Computer Interaction. My expertise lies in designing and implementing virtual reality applications for clinical and research purposes. My work aims to advance our understanding of human cognition and behavior through immersive, reproducible, and data-driven environments.',
        'about-intro-2': 'I hold a Master\'s degree in Cognitive Psychology from the Paris Descartes University during which I researched the adaptation to non-individual Head-Related Transfer Functions for spatial audio in VR. I was a PhD student at the Conservatoire National des Arts et Métiers (CNAM) in Paris, specialized in Human-Computer Interaction. My research explored the use of virtual reality for neuropsychological assessment and rehabilitation, focusing on creating immersive and interactive environments to diagnose a neuropsychological disorder called Unilateral Spatial Neglect, and develop innovative therapeutic approaches.',
        'about-expertise': 'Research Expertise',
        'about-tools': 'Tools & Technologies',
        'about-core-competencies': 'Core Competencies',
        'about-core-research': 'Research & Analysis',
        'about-core-methodology': 'Research Methodology',
        'about-core-statistics': 'Statistical Analysis',        
        'about-core-visualization': 'Data Visualization',
        'about-core-writing': 'Scientific Writing',
        'about-core-tools': 'Tools',
        'about-core-unity': 'Unity',
        'about-core-matlab': 'Matlab',
        'about-core-r': 'R',        
        'about-core-blender': 'Blender',
        'about-core-programming': 'Programming',
        'about-core-csharp': 'C#, .Net, Blazor',
        'about-core-python': 'Python',
        'about-core-js': 'JavaScript, HTML/CSS',
        'about-core-cpp': 'C++',
        'about-core-languages': 'Languages',
        'about-core-english': 'English (Near-fluent)',
        'about-core-french': 'French (Native)',
        
        // Portfolio Section
        'portfolio-title': 'Portfolio',
        'portfolio-subtitle': '',
        
        // Project Cards
        'project-vr-title': 'VR Diagnostic Tasks for USN',
        'project-vr-description': 'Virtual reality tasks for diagnosing Unilateral Spatial Neglect in patients, featuring interactive immersive environments and precise tracking capabilities.',
        'project-hrtf-title': 'HRTF Adaptation',
        'project-hrtf-description': 'Research project focusing on non-individual Head-Related Transfer Function adaptation for personalized spatial audio experiences in virtual environments.',
        'project-sonification-title': 'Sonification of 3D shapes',
        'project-sonification-description': 'Research project focusing on the sonification of 3D shapes. Explored the use of timbre and spatialization to convey geometric properties through sound.',
        
        // Contact Section
        'contact-title': 'Contact',
        'contact-subtitle': 'Let\'s discuss your next project',
        'contact-email-title': 'Email',
        'contact-location-title': 'Location',
        'contact-location': 'Rennes, Paris - Available for remote work',
        'contact-seeking-title': 'Seeking',
        'contact-seeking': 'Research positions in VR, spatial audio, cognitive science, or UX research roles',
        'contact-linkedin': 'LinkedIn',
        'contact-scholar': 'Google Scholar',

        // VR Diagnostic Tool Page
        'vr-title': 'VR Diagnostic Tasks for USN',
        'vr-subtitle': '',
        'vr-context-title': 'Context',
        'vr-context-p1': 'Unilateral Spatial Neglect (USN) is a complex neuropsychological disorder characterized by the inability to detect, orient towards, or respond to stimuli presented on the side contralateral to a brain lesion. Traditional paper-and-pencil diagnostic tools lack sensitivity and ecological validity.',
        'vr-goals-title': 'Goals',
        'vr-goals-p1': 'This project aimed to develop and validate a series of virtual reality diagnostic tasks for USN. The goal was to create immersive and interactive environments that mimic real-world scenarios to provide a more accurate and comprehensive assessment of spatial deficits.',
        'vr-contribution-title': 'Contribution',
                'vr-contribution-p1': 'I designed and developed the VR application using Unity 3D, focusing on creating engaging tasks, collecting precise data (e.g., eye tracking, head tracking, hand trajectories), and an intuitive user interface for both clinicians and patients.',
        'vr-replica-title': 'VR replica',
        'vr-eco-title': 'Ecological version',
        'vr-bells-replica-p1': 'The VR Bells Test replicates the traditional paper-and-pencil version in a virtual environment. The bells and the distractors are projected on a cylindrical screen. The patient is asked to find the bells. To do that the patient has to point a laser with the controller and press to select the bell. On selection a circle appears around the bell. The system records not only the number and the position of the bells or distractors selected, but also the complete spatial exploration of the patient. The application provides a detailed analysis of the performance, and a 2d visualization of the exploration. The strength of this application lies in testing far space neglect (opposed to near space neglect in the paper version), and in the precision and richness of the data collected.',
        'vr-bells-replica-caption1': 'Demonstration of the VR Bells Test showing patient interaction and spatial exploration tracking',
        'vr-bells-replica-caption2': 'Visualization of the VR Bells Test results showing selected bells in order',
        'vr-bells-eco-p1': 'The ecological version of the VR Bells Test offers enhanced real-world relevance by integrating the assessment into naturalistic environments and scenarios. Unlike the traditional replica that maintains the abstract nature of the original paper-and-pencil test, this ecological adaptation embeds the task within meaningful contexts that patients might encounter in daily life.',
        'vr-bells-eco-p2': 'This approach increases ecological validity and provides more meaningful insights into how spatial neglect affects real-world functioning. The immersive environment allows for assessment of spatial attention in contexts that are more representative of everyday activities, potentially revealing deficits that might not be apparent in traditional clinical testing scenarios.',
        'vr-bells-eco-caption': 'Ecological version of the VR test showing a more naturalistic environment for spatial attention assessment',
        'vr-baking-replica-p1': 'The VR Baking Tray Test is an ecological adaptation of a traditional neuropsychological assessment for detecting spatial neglect. In this virtual environment, patients are presented with a kitchen scene where they must place objects (such as cookies or pastries) onto a baking tray. This test evaluates spatial awareness and attention in a more realistic, everyday context.',
        'vr-baking-replica-p2': 'The strength of this VR adaptation lies in its ecological validity - it simulates real-world activities that patients encounter in daily life. The system tracks hand movements, object placement patterns, and spatial distribution of actions, providing detailed insights into functional spatial abilities that traditional paper-and-pencil tests cannot capture.',
        'vr-baking-replica-caption': 'Demonstration of the VR Baking Tray Test',
        'vr-baking-eco-p1': 'The ecological version of the VR Baking Tray Test enhances realism by incorporating more naturalistic kitchen environments and varied task scenarios. This advanced adaptation moves beyond the basic replica to create authentic cooking situations that better reflect real-world spatial challenges patients face in their daily activities.',
        'vr-baking-eco-p2': 'This ecological approach provides deeper insights into functional spatial abilities by presenting tasks within meaningful contexts. The enhanced environmental complexity and realistic interactions offer a more comprehensive assessment of how spatial neglect affects everyday kitchen activities and food preparation tasks.',
        'vr-baking-eco-caption': 'Ecological version of the VR Baking Tray Test showing enhanced realistic kitchen environment',
        'vr-baking-eco-caption-normal': 'Normal performance pattern',
        'vr-baking-eco-caption-patient': 'Patient with spatial neglect',
        'vr-bisection-replica-p1': 'The VR Bisection Task is a digital adaptation of the traditional line bisection test, a fundamental assessment tool for detecting spatial neglect. In this virtual environment, patients are presented with lines of varying lengths and orientations that they must bisect as accurately as possible using VR controllers or hand tracking.',
        'vr-bisection-replica-p2': 'This VR implementation offers several advantages over traditional paper-and-pencil versions, including precise measurement of bisection accuracy, reaction times, and movement patterns. The system can present lines in different spatial planes and orientations, providing a more comprehensive assessment of spatial attention deficits across various visual field regions.',
        'vr-bisection-replica-caption': 'VR Bisection Task interface showing line bisection assessment in virtual environment',
        'vr-pubs-title': 'Scientific Publications',
        'vr-view-pub': 'View on Google Scholar',
        'vr-back-button': 'Back to Portfolio',

        // HRTF Adaptation Page
        'hrtf-title': 'HRTF Adaptation Research',
        'hrtf-subtitle': '',
        'hrtf-context-title': 'Context',
        'hrtf-context-p1': 'Head-Related Transfer Functions (HRTFs) are crucial for creating realistic spatial audio experiences in virtual environments. However, individualized HRTFs require complex and time-consuming measurements in specialized acoustic facilities. Non-individual HRTFs, while more accessible, often result in poor spatial audio perception due to individual anatomical differences.',
        'hrtf-goals-title': 'Goals',
        'hrtf-goals-p1': 'This research project explores methods for adapting non-individual HRTFs to improve spatial audio perception without requiring individual measurements. The goal is to develop short training protocols that can enhance the effectiveness of generic HRTFs, making high-quality spatial audio more accessible for VR applications, gaming, and assistive technologies.',
        'hrtf-contribution-title': 'Contribution',
        'hrtf-contribution-p1': 'I developed the HRTF selection methods and the adaptation methods using Unity 3D and specialized audio processing libraries.',
        'hrtf-selection-title': 'Non-individualized HRTF Selection',
        'hrtf-selection-p1': 'A first study we conducted revealed that individual differences in the adaptation capacity to non-individual HRTFs was significant and possibly explained by the distance between the user own HRTFs and the non-indivualized HRTFs used in training. To compensate for that, we added a selection phase designed to identify and select the most suitable non-individualized HRTFs for each user.',
        'hrtf-selection-p2': 'The selection test involved 8 differents set of HRTFs. Participants were immersed in a virtual environment where they were visually presented with the expected path of the sound source. They then had to listen and grade the different HRTF sets based on the match between the expected path and the perceived path of the sound source. Three different path were used: a horizontal circle around the user, a vertical circle aroud the user, and a path moving from the front to the back of the user. The HRTFs set with the highest average score was selected for the subsequent adaptation training and localization task.',
        'hrtf-selection-caption': 'Figure 1: HRTF Selection Tested positions and path',
        'hrtf-adaptation-title': 'Adaptation Methods',
        'hrtf-adaptation-p1': 'The adaptation methods was designed to foster perceptual learning through active listening and feedback in immersive virtual environments. The task was a simple spatial exploration task where the particiants had to actively search and locate an invisible target around them. To do that they had a permanent audio feedback indicating the distance to the target, in the form of a sound pulsing faster as they got closer to the target. In the audiovisual version of the task, they also had a visual feedback, in the form of a glowing orb at the position of the hand changing color depending on the distance to the target.',
        'hrtf-studies-title': 'Perceptual Studies',
        'hrtf-studies-p1': 'The localization task was designed to measure the localization accuracy before and after the adaptation training. The participants simply had to point with their hand the position of a sound source.',
        'hrtf-pubs-title': 'Scientific Publications',
        'hrtf-view-pub': 'View on Google Scholar',
        'hrtf-back-button': 'Back to Portfolio'
    },
    fr: {
        // Navigation
        'nav-home': 'Accueil',
        'nav-about': 'À propos',
        'nav-portfolio': 'Portfolio',
        'nav-contact': 'Contact',
        
        // Hero Section
        'hero-title': 'Tristan-Gael Bara',
        'hero-subtitle': 'Chercheur en IHM',        
        'hero-learn-more': 'En Savoir Plus',
        'hero-cta': 'Me Contacter',
        
        // Typing Effect
        'typing-texts': [
            'Psychologie Cognitive',
            'Réalité Virtuelle',            
            'Développeur Unity',            
            'Chercheur en IHM'
        ],
        
        // About Section
        'about-title': 'À propos',
        'about-subtitle': '',
        'about-intro-1': 'Je suis un chercheur et développeur spécialisé en Psychologie Cognitive et en Interactions Homme-Machine. Mon expertise réside dans la conception et l\'implémentation d\'applications de réalité virtuelle à des fins cliniques et de recherche. Mon travail vise à faire progresser notre compréhension de la cognition et du comportement humains grâce à des environnements immersifs, reproductibles et permettant la récolte et l\'analyse de données.',
        'about-intro-2': 'Je détiens un Master de recherche en Psychologie Cognitive de l\'Université Paris Descartes, durant lequel j\'ai réalisé des travaux de recherche sur l\'adaptation aux fonctions de transfert non-individuelles pour l\'audio spatial en RV. J\'ai été doctorant au Conservatoire National des Arts et Métiers (CNAM) à Paris, spécialisé en Interaction Homme-Machine. Ma recherche a exploré la création d\'entraînements multisensoriels en réalité virtuelle, et tout particulièrement leur application au développement de jeux thérapeutiques pour le diagnostic et la réhabilitation d\'un trouble neuropsychologique appelé Négligence Spatiale Unilatérale.',
        'about-expertise': 'Expertise de recherche',
        'about-tools': 'Outils et technologies',
        'about-core-competencies': 'Compétences clés',
        'about-core-research': 'Recherche & Analyse',
        'about-core-methodology': 'Méthodologie scientifique',
        'about-core-statistics': 'Analyse Statistique',        
        'about-core-visualization': 'Visualisation de Données',
        'about-core-writing': 'Rédaction Scientifique',
        'about-core-tools': 'Outils',
        'about-core-unity': 'Unity',
        'about-core-matlab': 'Matlab',
        'about-core-r': 'R',       
        'about-core-blender': 'Blender',
        'about-core-programming': 'Programmation',
        'about-core-csharp': 'C#, .Net, Blazor',
        'about-core-python': 'Python',
        'about-core-js': 'JavaScript, HTML/CSS',
        'about-core-cpp': 'C++',
        'about-core-languages': 'Langues',
        'about-core-english': 'Anglais (niveau avancé)',
        'about-core-french': 'Français (Natif)',
        
        // Portfolio Section
        'portfolio-title': 'Portfolio',
        'portfolio-subtitle': '',
        
        // Project Cards
        'project-vr-title': 'Réalité Virtuelle & Diagnostic de la NSU',
        'project-vr-description': 'Tâches de réalité virtuelle pour diagnostiquer la Négligence Spatiale Unilatérale chez les patients, avec des environnements immersifs interactifs.',
        'project-hrtf-title': 'Adaptation aux HRTF',
        'project-hrtf-description': 'Projet de recherche axé sur l\'adaptation à des fonctions de transfert non-individuelles pour des expériences audio spatiales personnalisées.',
        'project-sonification-title': 'Sonification de formes 3D',
        'project-sonification-description': 'Exploration de l\'utilisation du timbre et de la spatialisation pour la sonification de formes 3D, afin de transmettre les propriétés géométriques par le son.',
        
        // Contact Section
        'contact-title': 'Contact',
        'contact-subtitle': '',
        'contact-email-title': 'Email',
        'contact-location-title': 'Localisation',
        'contact-location': 'Rennes, Paris - Disponible en télétravail',
        'contact-seeking-title': 'Recherche',
        'contact-seeking': 'Postes de recherche en VR, audio spatial, sciences cognitives ou UX',
        'contact-linkedin': 'LinkedIn',
        'contact-scholar': 'Google Scholar',

        // VR Diagnostic Tool Page
        'vr-title': 'Tâches de Diagnostic en RV pour la NSU',
        'vr-subtitle': '',
        'vr-context-title': 'Contexte',
        'vr-context-p1': 'La Négligence Spatiale Unilatérale (NSU) est un trouble neuropsychologique complexe qui se manifeste par une incapacité à détecter, s\'orienter vers ou répondre à des stimuli présentés du côté opposé à une lésion cérébrale. Les outils de diagnostic traditionnels (papier-crayon) manquent de sensibilité et de pertinence écologique.',
        'vr-goals-title': 'Objectifs',
        'vr-goals-p1': 'Ce projet visait à développer et valider une série de tâches de diagnostic en réalité virtuelle pour la NSU. L\'objectif était de créer des environnements immersifs et interactifs qui imitent des scénarios du monde réel pour fournir une évaluation plus précise et complète des déficits spatiaux.',
        'vr-contribution-title': 'Contribution',
        'vr-contribution-p1': 'J\'ai conçu et développé l\'application de RV en utilisant Unity 3D, en me concentrant sur la création de tâches engageantes, la collecte de données précises (par exemple, suivi du regard, suivi de la tête, trajectoires de la main) et une interface utilisateur intuitive pour les cliniciens et les patients.',
        'vr-replica-title': 'Réplique RV',
        'vr-eco-title': 'Version écologique',
        'vr-bells-replica-p1': 'Le test des cloches en RV réplique la version traditionnelle papier-crayon dans un environnement virtuel. Les cloches et les distracteurs sont projetés sur un écran cylindrique. Le patient doit trouver les cloches. Pour ce faire, le patient doit pointer un laser avec le contrôleur et appuyer pour sélectionner la cloche. Lors de la sélection, un cercle apparaît autour de la cloche. Le système enregistre non seulement le nombre et la position des cloches ou des distracteurs sélectionnés, mais aussi l\'exploration spatiale complète du patient. L\'application fournit une analyse détaillée des performances et une visualisation 2D de l\'exploration. La force de cette application réside dans le test de la négligence de l\'espace lointain (par opposition à la négligence de l\'espace proche dans la version papier), ainsi que dans la précision et la richesse des données collectées.',
        'vr-bells-replica-caption1': 'Démonstration du test des cloches en RV montrant l\'interaction du patient et le suivi de l\'exploration spatiale',
        'vr-bells-replica-caption2': 'Visualisation des résultats du test des cloches en RV montrant les cloches sélectionnées dans l\'ordre',
        'vr-bells-eco-p1': 'La version écologique du test des cloches en RV offre une pertinence accrue pour le monde réel en intégrant l\'évaluation dans des environnements et des scénarios naturalistes. Contrairement à la réplique traditionnelle qui conserve la nature abstraite du test papier-crayon original, cette adaptation écologique intègre la tâche dans des contextes significatifs que les patients peuvent rencontrer dans la vie quotidienne.',
        'vr-bells-eco-p2': 'Cette approche augmente la validité écologique et fournit des informations plus significatives sur la manière dont la négligence spatiale affecte le fonctionnement dans le monde réel. L\'environnement immersif permet d\'évaluer l\'attention spatiale dans des contextes plus représentatifs des activités quotidiennes, révélant potentiellement des déficits qui pourraient ne pas être apparents dans les scénarios de tests cliniques traditionnels.',
        'vr-bells-eco-caption': 'Version écologique du test en RV montrant un environnement plus naturaliste pour l\'évaluation de l\'attention spatiale',
        'vr-baking-replica-p1': 'Le test du plateau de cuisson en RV est une adaptation écologique d\'une évaluation neuropsychologique traditionnelle pour détecter la négligence spatiale. Dans cet environnement virtuel, les patients sont présentés avec une scène de cuisine où ils doivent placer des objets (tels que des biscuits ou des pâtisseries) sur un plateau de cuisson. Ce test évalue la conscience spatiale et l\'attention dans un contexte quotidien plus réaliste.',
        'vr-baking-replica-p2': 'La force de cette adaptation en RV réside dans sa validité écologique - elle simule des activités du monde réel que les patients rencontrent dans la vie quotidienne. Le système suit les mouvements de la main, les schémas de placement des objets et la distribution spatiale des actions, fournissant des informations détaillées sur les capacités spatiales fonctionnelles que les tests papier-crayon traditionnels ne peuvent pas capturer.',
        'vr-baking-replica-caption': 'Démonstration du test du plateau de cuisson en RV',
        'vr-baking-eco-p1': 'La version écologique du test du plateau de cuisson en RV améliore le réalisme en intégrant des environnements de cuisine plus naturalistes et des scénarios de tâches variés. Cette adaptation avancée va au-delà de la simple réplique pour créer des situations de cuisine authentiques qui reflètent mieux les défis spatiaux du monde réel auxquels les patients sont confrontés dans leurs activités quotidiennes.',
        'vr-baking-eco-p2': 'Cette approche écologique fournit des informations plus approfondies sur les capacités spatiales fonctionnelles en présentant des tâches dans des contextes significatifs. La complexité environnementale accrue et les interactions réalistes offrent une évaluation plus complète de la manière dont la négligence spatiale affecte les activités de cuisine quotidiennes et les tâches de préparation des aliments.',
        'vr-baking-eco-caption': 'Version écologique du test du plateau de cuisson en RV montrant un environnement de cuisine réaliste amélioré',
        'vr-baking-eco-caption-normal': 'Schéma de performance normale',
        'vr-baking-eco-caption-patient': 'Patient atteint de négligence spatiale',
        'vr-bisection-replica-p1': 'La tâche de bissection en RV est une adaptation numérique du test de bissection de ligne traditionnel, un outil d\'évaluation fondamental pour détecter la négligence spatiale. Dans cet environnement virtuel, les patients sont présentés avec des lignes de différentes longueurs et orientations qu\'ils doivent bissecter aussi précisément que possible à l\'aide de contrôleurs de RV ou du suivi des mains.',
        'vr-bisection-replica-p2': 'Cette implémentation en RV offre plusieurs avantages par rapport aux versions papier-crayon traditionnelles, notamment une mesure précise de la précision de la bissection, des temps de réaction et des schémas de mouvement. Le système peut présenter des lignes dans différents plans spatiaux et orientations, offrant une évaluation plus complète des déficits d\'attention spatiale dans diverses régions du champ visuel.',
        'vr-bisection-replica-caption': 'Interface de la tâche de bissection en RV montrant l\'évaluation de la bissection de ligne dans un environnement virtuel',
        'vr-pubs-title': 'Publications Scientifiques',
        'vr-view-pub': 'Voir sur Google Scholar',
        'vr-back-button': 'Retour au Portfolio',

        // HRTF Adaptation Page
        'hrtf-title': 'Recherche sur l\'Adaptation aux HRTF',
        'hrtf-subtitle': '',
        'hrtf-context-title': 'Contexte',
        'hrtf-context-p1': 'Les fonctions de transfert relatives à la tête (HRTF) sont cruciales pour créer des expériences audio spatiales réalistes dans les environnements virtuels. Cependant, les HRTF individualisées nécessitent des mesures complexes et longues dans des installations acoustiques spécialisées. Les HRTF non individualisées, bien que plus accessibles, entraînent souvent une mauvaise perception audio spatiale en raison des différences anatomiques individuelles.',
        'hrtf-goals-title': 'Objectifs',
        'hrtf-goals-p1': 'Ce projet de recherche explore des méthodes pour adapter les HRTF non individualisées afin d\'améliorer la perception audio spatiale sans nécessiter de mesures individuelles. L\'objectif est de développer des protocoles d\'entraînement courts qui peuvent améliorer l\'efficacité des HRTF génériques, rendant l\'audio spatial de haute qualité plus accessible pour les applications de RV, les jeux et les technologies d\'assistance.',
        'hrtf-contribution-title': 'Contribution',
        'hrtf-contribution-p1': 'J\'ai développé les méthodes de sélection des HRTF et les méthodes d\'adaptation en utilisant Unity 3D et des bibliothèques de traitement audio spécialisées.',
        'hrtf-selection-title': 'Sélection de HRTF non individualisées',
        'hrtf-selection-p1': 'Une première étude que nous avons menée a révélé que les différences individuelles dans la capacité d\'adaptation aux HRTF non individualisées étaient significatives et possiblement expliquées par la distance entre les propres HRTF de l\'utilisateur et les HRTF non individualisées utilisées lors de l\'entraînement. Pour compenser cela, nous avons ajouté une phase de sélection conçue pour identifier et sélectionner les HRTF non individualisées les plus appropriées pour chaque utilisateur.',
        'hrtf-selection-p2': 'Le test de sélection impliquait 8 ensembles différents de HRTF. Les participants étaient immergés dans un environnement virtuel où le trajet attendu de la source sonore leur était présenté visuellement. Ils devaient ensuite écouter et noter les différents ensembles de HRTF en fonction de la correspondance entre le trajet attendu et le trajet perçu de la source sonore. Trois trajets différents ont été utilisés : un cercle horizontal autour de l\'utilisateur, un cercle vertical autour de l\'utilisateur et un trajet se déplaçant de l\'avant vers l\'arrière de l\'utilisateur. L\'ensemble de HRTF avec le score moyen le plus élevé était sélectionné pour l\'entraînement d\'adaptation et la tâche de localisation ultérieurs.',
        'hrtf-selection-caption': 'Figure 1 : Positions et trajets testés pour la sélection des HRTF',
        'hrtf-adaptation-title': 'Méthodes d\'Adaptation',
        'hrtf-adaptation-p1': 'La méthode d\'adaptation a été conçue pour favoriser l\'apprentissage perceptif par l\'écoute active et le retour d\'information dans des environnements virtuels immersifs. La tâche était une simple tâche d\'exploration spatiale où les participants devaient rechercher et localiser activement une cible invisible autour d\'eux. Pour ce faire, ils disposaient d\'un retour audio permanent indiquant la distance à la cible, sous la forme d\'un son pulsant plus rapidement à mesure qu\'ils se rapprochaient de la cible. Dans la version audiovisuelle de la tâche, ils avaient également un retour visuel, sous la forme d\'un orbe lumineux à la position de la main changeant de couleur en fonction de la distance à la cible.',
        'hrtf-studies-title': 'Études Perceptives',
        'hrtf-studies-p1': 'La tâche de localisation a été conçue pour mesurer la précision de la localisation avant et après l\'entraînement d\'adaptation. Les participants devaient simplement pointer avec leur main la position d\'une source sonore.',
        'hrtf-pubs-title': 'Publications Scientifiques',
        'hrtf-view-pub': 'Voir sur Google Scholar',
        'hrtf-back-button': 'Retour au Portfolio'
    }
};

function initLanguageToggle() {
    const languageToggle = document.createElement('button');
    languageToggle.className = 'language-toggle';
    languageToggle.innerHTML = '<img class="flag" src="Images/flag-uk.png" alt="English">'; // Start with UK flag
    languageToggle.setAttribute('aria-label', 'Toggle language');
    
    // Add to navbar (after dark mode toggle)
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.appendChild(languageToggle);
    }
    
    // Detect language: 1. localStorage, 2. browser preference, 3. default to 'en'
    let preferredLanguage = localStorage.getItem('language');
    if (!preferredLanguage) {
        preferredLanguage = navigator.language.startsWith('fr') ? 'fr' : 'en';
    }
    
    // Apply the determined language
    if (preferredLanguage === 'fr') {
        document.documentElement.setAttribute('lang', 'fr');
        languageToggle.innerHTML = '<img class="flag" src="Images/flag-france.png" alt="Français">';
        languageToggle.setAttribute('aria-label', 'Changer la langue');
        updateLanguage('fr', false); // Don't restart typing on initial load
    } else {
        document.documentElement.setAttribute('lang', 'en');
        updateCVLinks('en'); // Initialize CV links for English
    }
    
    languageToggle.addEventListener('click', function() {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'fr' : 'en';
        
        // Update flag and language
        if (newLang === 'fr') {
            this.innerHTML = '<img class="flag" src="Images/flag-france.png" alt="Français">';
            this.setAttribute('aria-label', 'Changer la langue');
        } else {
            this.innerHTML = '<img class="flag" src="Images/flag-uk.png" alt="English">';
            this.setAttribute('aria-label', 'Toggle language');
        }
        
        document.documentElement.setAttribute('lang', newLang);
        localStorage.setItem('language', newLang);
        updateLanguage(newLang);
    });
}

function updateLanguage(lang, restartTyping = true) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update CV links based on language
    updateCVLinks(lang);
    
    // Restart typing effect with new language
    if (restartTyping) {
        restartTypingEffect();
    }
}

// Update CV links based on language
function updateCVLinks(lang) {
    const cvLinks = document.querySelectorAll('.cv-link');
    const cvPath = lang === 'fr' 
        ? 'Images/Tristan-Gael Bara CV 2025.pdf' 
        : 'Images/Tristan-Gael Bara Eng CV 2025.pdf';
    
    cvLinks.forEach(link => {
        link.href = cvPath;
    });
}

// ===== PROJECT CARD INTERACTIONS =====
function initProjectCardInteractions() {
    // VR Diagnostic Tool card click handler
    const vrDiagnosticCard = document.getElementById('vr-diagnostic-card');
    
    if (vrDiagnosticCard) {
        vrDiagnosticCard.addEventListener('click', function(e) {
            // Prevent default action if clicking on inner links
            if (e.target.closest('.project-link')) {
                return;
            }
            
            // Open VR Diagnostic Tool page in same tab
            window.location.href = 'vr-diagnostic-tool.html';
            
            // Track the interaction
            trackEvent('portfolio', 'card_click', 'vr_diagnostic_tool');
        });
        
        // Add cursor pointer style to indicate it's clickable
        vrDiagnosticCard.style.cursor = 'pointer';
    }
    
    // HRTF Adaptation card click handler
    const hrtfAdaptationCard = document.getElementById('hrtf-adaptation-card');
    
    if (hrtfAdaptationCard) {
        hrtfAdaptationCard.addEventListener('click', function(e) {
            // Prevent default action if clicking on inner links
            if (e.target.closest('.project-link')) {
                return;
            }
            
            // Open HRTF Adaptation page in same tab
            window.location.href = 'hrtf-adaptation.html';
            
            // Track the interaction
            trackEvent('portfolio', 'card_click', 'hrtf_adaptation');
        });
        
        // Add cursor pointer style to indicate it's clickable
        hrtfAdaptationCard.style.cursor = 'pointer';
    }
}

// Ensure clicking the image in a portfolio card opens the dedicated page on mobile as well as desktop.
function enablePortfolioImageLinks() {
    document.querySelectorAll('.project-card').forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;
        // Get the card's link (assume first <a> inside card)
        const link = card.querySelector('a');
        if (!link) return;
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            // Only trigger if on mobile (width <= 768px)
            if (window.innerWidth <= 768) {
                window.location.href = link.href;
            }
        });
    });
}