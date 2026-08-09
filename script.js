// ===== Portfolio site behavior =====
// Minimal, dependency-free: mobile nav toggle + subtle scroll reveal.

document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initScrollReveal();
    initActiveNavLink();
    initLanguageToggle();
});

// ===== Mobile navigation toggle =====
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Subtle scroll-reveal for section content =====
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('in-view'); });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
}

// ===== Highlight current section in nav while scrolling =====
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        });
    }, { rootMargin: '-50% 0px -45% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
}

// ===== EN / FR language toggle =====
const translations = {
    en: {
        'nav-work': 'Work',
        'nav-background': 'Background',
        'nav-contact': 'Contact',
        'nav-cv': 'CV',
        'hero-title': 'XR &amp; Behavioral <span class="accent">Research Prototyping</span>',
        'hero-text': 'Experimental design, Unity development, and data analysis for behavioral, HCI, and immersive research.',
        'hero-btn-work': 'View selected work',
        'hero-btn-contact': 'Contact me',
        'capabilities-eyebrow': 'What I do',
        'cap1-title': 'XR / VR research prototyping',
        'cap1-desc': 'Building Unity-based VR/XR applications to run controlled experiments — stimulus presentation, interaction design, and precise behavioral logging inside immersive environments.',
        'cap2-title': 'Behavioral experiment implementation',
        'cap2-desc': 'Turning an experimental protocol into working software — trial structure, timing, randomization, response collection, and reliable data capture.',
        'cap3-title': 'Experimental design &amp; research methods',
        'cap3-desc': 'Shaping a research question into a testable design — task structure, controls, sampling, and methodology grounded in cognitive science.',
        'cap4-title': 'Data analysis &amp; scientific workflows',
        'cap4-desc': 'From experimental output to interpretable results — cleaning and structuring behavioral datasets, statistical analysis, visualization, and reproducible workflows in R, Python or MATLAB.',
        'work-eyebrow': 'Selected research work',
        'work-heading': 'Projects combining methodology and implementation',
        'work-lede': 'Three research projects spanning virtual reality, clinical assessment, and spatial audio perception.',
        'field-problem': 'Problem',
        'field-built': 'Built',
        'field-contribution': 'Contribution',
        'field-status': 'Status',
        'pubs-toggle': 'Publications (3)',
        'pub-view': 'View on Google Scholar',
        'proj1-title': 'VR Diagnostic Tasks for Unilateral Spatial Neglect',
        'proj1-problem': 'Standard paper-based neuropsychological tests for spatial neglect (bells test, baking tray test, line bisection) have limited ecological validity and coarse, manual scoring.',
        'proj1-built': 'VR replicas and ecological versions of all three clinical tasks in Unity, with automatic spatial-exploration tracking and result visualization for clinicians.',
        'proj1-contribution': 'Designed and implemented the VR applications (Unity/C#) — 3D environments, interaction scripting, and the data-collection pipeline for clinical analysis.',
        'proj2-title': 'HRTF Adaptation for Spatial Audio in VR',
        'proj2-problem': 'Non-individualized Head-Related Transfer Functions (HRTFs) reduce sound-localization accuracy in VR, and measuring individual HRTFs is impractical outside specialized labs.',
        'proj2-built': 'A VR-based HRTF selection method and an active, feedback-driven training protocol, evaluated through pre/post sound-localization studies.',
        'proj2-contribution': 'Designed the HRTF selection and adaptation protocols and implemented them in Unity with spatial audio processing.',
        'proj3-title': 'Sonification of 3D Shapes',
        'proj3-problem': 'Conveying the geometric properties of a 3D shape through sound alone, without visual access to the object.',
        'proj3-built': 'An auditory display exploring the use of timbre and spatialization to represent geometric properties of 3D shapes.',
        'proj3-status': 'Ongoing independent research project — literature synthesis, design of auditory mappings, a 3D-shape processing and sound-synthesis pipeline, and preparation of perceptual experiments.',
        'background-eyebrow': 'Background',
        'background-heading': 'Research background',
        'background-p1': 'I have a background in cognitive psychology and human-computer interaction. My research has covered the full research cycle — literature review, research-question development, experimental design, implementation, participant studies, data analysis, and scientific writing.',
        'background-p2': 'I hold a Master\'s degree in Cognitive Psychology from Paris Descartes University, where I researched adaptation to non-individual Head-Related Transfer Functions for spatial audio in VR. I then undertook PhD studies in Human-Computer Interaction at the Conservatoire National des Arts et Métiers (CNAM) in Paris — discontinued before completion — researching the use of virtual reality for neuropsychological assessment and rehabilitation, focused on diagnosing Unilateral Spatial Neglect and developing new therapeutic approaches.',
        'research-areas-label': 'Research areas',
        'tag-spatial-cognition': 'Spatial cognition',
        'tag-vr-xr': 'VR / XR experimentation',
        'tag-neuro-assessment': 'Neuropsychological assessment',
        'tag-multisensory': 'Multisensory interaction',
        'tag-auditory-motor': 'Auditory-motor adaptation',
        'tag-avatar': 'Avatar &amp; body perception',
        'fact1-label': 'Scientific publications &amp; conference papers in VR-based neuropsychological assessment and spatial audio perception',
        'fact2-label': 'Research projects spanning the full experimental cycle, from question to implementation',
        'fact3-label': 'Cognitive Psychology, Paris Descartes University',
        'fact4-label': 'Studies in Human-Computer Interaction, CNAM Paris — discontinued before completion',
        'tools-eyebrow': 'Tools &amp; methods',
        'tool-exp-design': 'Experimental design',
        'tool-statistics': 'Statistics',
        'contact-eyebrow': 'Availability',
        'contact-p1': 'I\'m open to short research, prototyping, or experimental-development assignments, as well as freelance consulting work.',
        'contact-p2': 'I\'m also interested in research positions, collaborations, and PhD opportunities.',
        'contact-location-title': 'Location',
        'contact-location-text': 'Rennes / Paris, France — available remote'
    },
    fr: {
        'nav-work': 'Travaux',
        'nav-background': 'Parcours',
        'nav-contact': 'Contact',
        'nav-cv': 'CV',
        'hero-title': '<span class="accent"> Prototypage </span> en recherche  comportementale &amp; XR',
        'hero-text': 'Conception expérimentale, développement Unity et analyse de données pour la recherche comportementale, IHM et immersive.',
        'hero-btn-work': 'Voir mes projets',
        'hero-btn-contact': 'Me contacter',
        'capabilities-eyebrow': 'Ce que je fais',
        'cap1-title': 'Prototypage de recherche XR / RV',
        'cap1-desc': 'Développement d\'applications RV/XR sous Unity pour mener des expériences contrôlées — présentation de stimuli, conception d\'interactions et enregistrement précis du comportement en environnement immersif.',
        'cap2-title': 'Implémentation d\'expériences comportementales',
        'cap2-desc': 'Transformer un protocole expérimental en logiciel fonctionnel — structure des essais, minutage, randomisation, collecte des réponses et capture fiable des données.',
        'cap3-title': 'Conception expérimentale &amp; méthodologie de recherche',
        'cap3-desc': 'Transformer une question de recherche en protocole testable — structure des tâches, contrôles, échantillonnage et méthodologie ancrée en sciences cognitives.',
        'cap4-title': 'Analyse de données &amp; workflows scientifiques',
        'cap4-desc': 'Des données expérimentales à des résultats interprétables — nettoyage et structuration de jeux de données comportementales, analyse statistique, visualisation et workflows reproductibles en R, Python ou MATLAB.',
        'work-eyebrow': 'Projets de recherche sélectionnés',
        'work-heading': 'Des projets alliant méthodologie et implémentation',
        'work-lede': 'Trois projets de recherche couvrant la réalité virtuelle, l\'évaluation clinique et la perception audio spatiale.',
        'field-problem': 'Problème',
        'field-built': 'Réalisation',
        'field-contribution': 'Contribution',
        'field-status': 'Statut',
        'pubs-toggle': 'Publications (3)',
        'pub-view': 'Voir sur Google Scholar',
        'proj1-title': 'Tâches de diagnostic en RV pour la négligence spatiale unilatérale',
        'proj1-problem': 'Les tests neuropsychologiques papier-crayon classiques pour la négligence spatiale (test des cloches, plateau de cuisson, bissection de ligne) ont une validité écologique limitée et une notation manuelle peu précise.',
        'proj1-built': 'Répliques en RV et versions écologiques des trois tâches cliniques sous Unity, avec suivi automatique de l\'exploration spatiale et visualisation des résultats pour les cliniciens.',
        'proj1-contribution': 'Conception et développement des applications RV (Unity/C#) — environnements 3D, scripts d\'interaction et pipeline de collecte de données pour l\'analyse clinique.',
        'proj2-title': 'Adaptation aux HRTF pour l\'audio spatial en RV',
        'proj2-problem': 'Les fonctions de transfert relatives à la tête (HRTF) non individualisées réduisent la précision de la localisation sonore en RV, et la mesure de HRTF individuelles est peu praticable hors des laboratoires spécialisés.',
        'proj2-built': 'Une méthode de sélection de HRTF en RV et un protocole d\'entraînement actif avec retour, évalués par des études de localisation sonore avant/après.',
        'proj2-contribution': 'Conception des protocoles de sélection et d\'adaptation des HRTF, implémentés sous Unity avec traitement audio spatial.',
        'proj3-title': 'Sonification de formes 3D',
        'proj3-problem': 'Transmettre les propriétés géométriques d\'une forme 3D par le son seul, sans accès visuel à l\'objet.',
        'proj3-built': 'Un dispositif auditif explorant l\'usage du timbre et de la spatialisation pour représenter les propriétés géométriques de formes 3D.',
        'proj3-status': 'Projet de recherche indépendant en cours — synthèse de la littérature, conception de correspondances auditives, pipeline de traitement de formes 3D et de synthèse sonore, et préparation d\'expériences perceptives.',
        'background-eyebrow': 'Parcours',
        'background-heading': 'Parcours de recherche',
        'background-p1': 'J\'ai une formation en psychologie cognitive et en interaction homme-machine. Mes recherches ont couvert l\'ensemble du cycle de recherche — revue de littérature, définition de la question de recherche, conception expérimentale, implémentation, études participants, analyse de données et rédaction scientifique.',
        'background-p2': 'Je suis titulaire d\'un Master en Psychologie Cognitive de l\'Université Paris Descartes, où j\'ai étudié l\'adaptation aux fonctions de transfert relatives à la tête (HRTF) non individuelles pour l\'audio spatial en RV. J\'ai ensuite entamé un doctorat en interaction homme-machine au Conservatoire National des Arts et Métiers (CNAM) à Paris — interrompu avant son achèvement — portant sur l\'utilisation de la réalité virtuelle pour l\'évaluation neuropsychologique et la réhabilitation, avec un focus sur le diagnostic de la négligence spatiale unilatérale et le développement de nouvelles approches thérapeutiques.',
        'research-areas-label': 'Domaines de recherche',
        'tag-spatial-cognition': 'Cognition spatiale',
        'tag-vr-xr': 'Expérimentation RV / XR',
        'tag-neuro-assessment': 'Évaluation neuropsychologique',
        'tag-multisensory': 'Interaction multisensorielle',
        'tag-auditory-motor': 'Adaptation audio-motrice',
        'tag-avatar': 'Perception de l\'avatar &amp; du corps',
        'fact1-label': 'Publications scientifiques &amp; actes de conférence en évaluation neuropsychologique en RV et perception audio spatiale',
        'fact2-label': 'Projets de recherche couvrant l\'ensemble du cycle expérimental, de la question à l\'implémentation',
        'fact3-label': 'Psychologie cognitive, Université Paris Descartes',
        'fact4-label': 'Études en interaction homme-machine, CNAM Paris — interrompues avant leur achèvement',
        'tools-eyebrow': 'Outils &amp; méthodes',
        'tool-exp-design': 'Conception expérimentale',
        'tool-statistics': 'Statistiques',
        'contact-eyebrow': 'Disponibilité',
        'contact-p1': 'Je suis ouvert à des missions courtes de recherche, de prototypage ou de développement expérimental, ainsi qu\'à du conseil freelance.',
        'contact-p2': 'Je suis également intéressé par des postes de recherche, des collaborations et des opportunités de doctorat.',
        'contact-location-title': 'Localisation',
        'contact-location-text': 'Rennes / Paris, France — disponible à distance'
    }
};

function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        const key = el.getAttribute('data-i18n');
        const value = translations[lang] && translations[lang][key];
        if (value !== undefined) el.innerHTML = value;
    });

    const cvLink = document.getElementById('cvLink');
    if (cvLink) {
        cvLink.setAttribute('href', lang === 'fr'
            ? 'Images/Tristan-Gael Bara CV 2025.pdf'
            : 'Images/Tristan-Gael Bara Eng CV 2025.pdf');
    }

    const toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = lang === 'fr' ? 'EN' : 'FR';

    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore storage errors */ }
}

function initLanguageToggle() {
    const toggle = document.getElementById('langToggle');
    if (!toggle) return;

    let saved = 'en';
    try { saved = localStorage.getItem('lang') || 'en'; } catch (e) { /* ignore storage errors */ }
    if (saved !== 'fr') saved = 'en';
    applyLanguage(saved);

    toggle.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('lang') === 'fr' ? 'fr' : 'en';
        applyLanguage(current === 'fr' ? 'en' : 'fr');
    });
}
