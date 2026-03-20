'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'

type Language = 'en' | 'fr' | 'sw'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isLoading: boolean
  availableLanguages: { code: Language; name: string; nativeName: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language configuration
export const availableLanguages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English' },
  { code: 'fr' as Language, name: 'French', nativeName: 'Français' },
  { code: 'sw' as Language, name: 'Swahili', nativeName: 'Kiswahili' },
]

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.delete': 'Delete',
    'general.edit': 'Edit',
    'general.add': 'Add',
    'general.search': 'Search',
    'general.loading': 'Loading...',
    'general.success': 'Success',
    'general.error': 'Error',
    'general.settings': 'Settings',
    'general.home': 'Home',
    'general.back': 'Back',
    'general.download': 'Download',
    'general.downloadResume': 'Download Resume',
    'general.viewResume': 'View Resume',
    'general.learnMore': 'Learn More',
    'general.getInTouch': 'Get in Touch',
    'general.readMore': 'Read More',
    'general.submit': 'Submit',
    'general.send': 'Send',
    'general.sendMessage': 'Send Message',
    'general.name': 'Name',
    'general.email': 'Email',
    'general.message': 'Message',
    'general.phone': 'Phone',
    'general.address': 'Address',
    'general.company': 'Company',
    'general.website': 'Website',
    'general.date': 'Date',
    'general.location': 'Location',
    'general.type': 'Type',
    'general.status': 'Status',
    'general.description': 'Description',
    'general.title': 'Title',
    'general.content': 'Content',
    'general.image': 'Image',
    'general.video': 'Video',
    'general.link': 'Link',
    'general.category': 'Category',
    'general.tags': 'Tags',
    'general.year': 'Year',
    'general.month': 'Month',
    'general.day': 'Day',
    'general.hours': 'Hours',
    'general.minutes': 'Minutes',
    'general.seconds': 'Seconds',
    'general.today': 'Today',
    'general.yesterday': 'Yesterday',
    'general.thisWeek': 'This Week',
    'general.thisMonth': 'This Month',
    'general.thisYear': 'This Year',
    'general.all': 'All',
    'general.none': 'None',
    'general.select': 'Select',
    'general.selectLanguage': 'Select Language',
    'general.changeLanguage': 'Change Language',
    'general.language': 'Language',
    'general.welcome': 'Welcome',
    'general.ourServices': 'Our Services',
    'general.ourProjects': 'Our Projects',
    'general.ourTeam': 'Our Team',
    'general.contactUs': 'Contact Us',
    'general.subscribe': 'Subscribe',
    'general.subscribeNewsletter': 'Subscribe to Newsletter',
    'general.followUs': 'Follow Us',
    'general.copyright': 'Copyright',
    'general.allRightsReserved': 'All Rights Reserved',
    'general.privacyPolicy': 'Privacy Policy',
    'general.termsOfService': 'Terms of Service',
    'general.cookies': 'Cookies',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.resume': 'Resume',
    'nav.certifications': 'Certifications',
    'nav.services': 'Services',
    'nav.testimonials': 'Testimonials',
    'nav.portfolio': 'Portfolio',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.careers': 'Careers',
    'nav.support': 'Support',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.greeting': 'Hello, I am',
    'hero.title': 'Professional Portfolio',
    'hero.subtitle': 'Building digital experiences that matter',
    'hero.description': 'Transforming ideas into elegant solutions with cutting-edge technology and creative design.',
    'hero.cta.primary': 'View My Work',
    'hero.cta.secondary': 'Contact Me',
    'hero.yearsExperience': 'Years of Experience',
    'hero.projectsCompleted': 'Projects Completed',
    'hero.happyClients': 'Happy Clients',
    'hero.awardsWon': 'Awards Won',
    
    // About Section
    'about.title': 'About Me',
    'about.subtitle': 'Passionate about creating digital experiences',
    'about.description': 'I am a dedicated professional with expertise in building modern web applications and digital solutions.',
    'about.personalInfo': 'Personal Information',
    'about.bio': 'Biography',
    'about.mission': 'Mission',
    'about.vision': 'Vision',
    'about.values': 'Values',
    
    // Skills Section
    'skills.title': 'My Skills',
    'skills.subtitle': 'Technologies I work with',
    'skills.frontend': 'Frontend Development',
    'skills.backend': 'Backend Development',
    'skills.database': 'Database',
    'skills.devops': 'DevOps',
    'skills.tools': 'Tools & Platforms',
    'skills.softSkills': 'Soft Skills',
    'skills.years': 'years',
    'skills.experienceLevel': 'Experience Level',
    'skills.beginner': 'Beginner',
    'skills.intermediate': 'Intermediate',
    'skills.advanced': 'Advanced',
    'skills.expert': 'Expert',
    
    // Experience Section
    'experience.title': 'Work Experience',
    'experience.subtitle': 'My professional journey',
    'experience.present': 'Present',
    'experience.responsibilities': 'Responsibilities',
    'experience.achievements': 'Achievements',
    
    // Education Section
    'education.title': 'Education',
    'education.subtitle': 'Academic background',
    'education.degree': 'Degree',
    'education.field': 'Field of Study',
    'education.graduated': 'Graduated',
    'education.gpa': 'GPA',
    'education.honors': 'Honors',
    
    // Projects Section
    'projects.title': 'My Projects',
    'projects.subtitle': 'Featured work',
    'projects.all': 'All Projects',
    'projects.viewProject': 'View Project',
    'projects.viewLive': 'View Live',
    'projects.viewCode': 'View Code',
    'projects.technologies': 'Technologies Used',
    'projects.client': 'Client',
    'projects.duration': 'Duration',
    
    // Services Section
    'services.title': 'Services',
    'services.subtitle': 'What I offer',
    'services.webDevelopment': 'Web Development',
    'services.webDevelopmentDesc': 'Custom websites and web applications built with modern technologies.',
    'services.mobileDevelopment': 'Mobile Development',
    'services.mobileDevelopmentDesc': 'Native and cross-platform mobile applications.',
    'services.uiuxDesign': 'UI/UX Design',
    'services.uiuxDesignDesc': 'User-centered design that enhances user experience.',
    'services.consulting': 'Consulting',
    'services.consultingDesc': 'Technical consultation for your projects.',
    'services.maintenance': 'Maintenance',
    'services.maintenanceDesc': 'Ongoing support and maintenance services.',
    'services.training': 'Training',
    'services.trainingDesc': 'Technical training and workshops.',
    
    // Testimonials Section
    'testimonials.title': 'Testimonials',
    'testimonials.subtitle': 'What clients say',
    'testimonials.verified': 'Verified Client',
    
    // Blog Section
    'blog.title': 'Latest Articles',
    'blog.subtitle': 'Insights and thoughts',
    'blog.readMore': 'Read Article',
    'blog.allPosts': 'All Posts',
    'blog.popular': 'Popular',
    'blog.recent': 'Recent',
    'blog.categories': 'Categories',
    
    // Contact Section
    'contact.title': 'Get In Touch',
    'contact.subtitle': "Let's work together",
    'contact.description': 'Have a project in mind or want to collaborate? Feel free to reach out.',
    'contact.form.title': 'Send a Message',
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Your Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Message sent successfully!',
    'contact.form.error': 'Failed to send message. Please try again.',
    'contact.info.title': 'Contact Information',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Phone',
    'contact.info.address': 'Address',
    'contact.info.available': 'Available for freelance work',
    'contact.info.responseTime': 'Usually responds within 24 hours',
    
    // Footer
    'footer.about': 'About',
    'footer.quickLinks': 'Quick Links',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterDesc': 'Subscribe to get updates on new projects and articles.',
    'footer.newsletterPlaceholder': 'Enter your email',
    'footer.subscribe': 'Subscribe',
    'footer.followUs': 'Follow Us',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.backToTop': 'Back to Top',
    
    // 404
    '404.title': 'Page Not Found',
    '404.description': 'The page you are looking for does not exist.',
    '404.goHome': 'Go to Home',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.settings': 'Settings',
    'admin.users': 'Users',
    'admin.analytics': 'Analytics',
    'admin.media': 'Media Library',
    'admin.projects': 'Projects',
    'admin.blog': 'Blog',
    'admin.pages': 'Pages',
    'admin.websiteEditor': 'Website Editor',
    'admin.appearance': 'Appearance',
    'admin.language': 'Language',
    'admin.profile': 'Profile',
    'admin.logout': 'Logout',
    
    // Settings
    'settings.general': 'General',
    'settings.seo': 'SEO',
    'settings.social': 'Social',
    'settings.advanced': 'Advanced',
    'settings.siteTitle': 'Site Title',
    'settings.siteTagline': 'Site Tagline',
    'settings.siteDescription': 'Site Description',
    'settings.defaultLanguage': 'Default Language',
    
    // Currently Tracking
    'tracking.title': 'Currently Tracking',
    'tracking.subtitle': 'Real-time market data',
    'tracking.lastUpdated': 'Last Updated',
    'tracking.price': 'Price',
    'tracking.change': 'Change',
    'tracking.high': 'High',
    'tracking.low': 'Low',
    'tracking.volume': 'Volume',
    'tracking.marketCap': 'Market Cap',
    'tracking.rank': 'Rank',
    'tracking.viewAll': 'View All',
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email',
    'validation.minLength': 'Minimum {min} characters required',
    'validation.maxLength': 'Maximum {max} characters allowed',
  },
  fr: {
    // General
    'general.save': 'Enregistrer',
    'general.cancel': 'Annuler',
    'general.delete': 'Supprimer',
    'general.edit': 'Modifier',
    'general.add': 'Ajouter',
    'general.search': 'Rechercher',
    'general.loading': 'Chargement...',
    'general.success': 'Succès',
    'general.error': 'Erreur',
    'general.settings': 'Paramètres',
    'general.home': 'Accueil',
    'general.back': 'Retour',
    'general.download': 'Télécharger',
    'general.downloadResume': 'Télécharger le CV',
    'general.viewResume': 'Voir le CV',
    'general.learnMore': 'En Savoir Plus',
    'general.getInTouch': 'Me Contacter',
    'general.readMore': 'Lire Plus',
    'general.submit': 'Soumettre',
    'general.send': 'Envoyer',
    'general.sendMessage': 'Envoyer le Message',
    'general.name': 'Nom',
    'general.email': 'Email',
    'general.message': 'Message',
    'general.phone': 'Téléphone',
    'general.address': 'Adresse',
    'general.company': 'Entreprise',
    'general.website': 'Site Web',
    'general.date': 'Date',
    'general.location': 'Lieu',
    'general.type': 'Type',
    'general.status': 'Statut',
    'general.description': 'Description',
    'general.title': 'Titre',
    'general.content': 'Contenu',
    'general.image': 'Image',
    'general.video': 'Vidéo',
    'general.link': 'Lien',
    'general.category': 'Catégorie',
    'general.tags': 'Étiquettes',
    'general.year': 'Année',
    'general.month': 'Mois',
    'general.day': 'Jour',
    'general.hours': 'Heures',
    'general.minutes': 'Minutes',
    'general.seconds': 'Secondes',
    'general.today': "Aujourd'hui",
    'general.yesterday': 'Hier',
    'general.thisWeek': 'Cette Semaine',
    'general.thisMonth': 'Ce Mois',
    'general.thisYear': 'Cette Année',
    'general.all': 'Tout',
    'general.none': 'Aucun',
    'general.select': 'Sélectionner',
    'general.selectLanguage': 'Sélectionner la Langue',
    'general.changeLanguage': 'Changer la Langue',
    'general.language': 'Langue',
    'general.welcome': 'Bienvenue',
    'general.ourServices': 'Nos Services',
    'general.ourProjects': 'Nos Projets',
    'general.ourTeam': 'Notre Équipe',
    'general.contactUs': 'Contactez-nous',
    'general.subscribe': "S'abonner",
    'general.subscribeNewsletter': "S'abonner à la Newsletter",
    'general.followUs': 'Suivez-nous',
    'general.copyright': 'Droits d\'auteur',
    'general.allRightsReserved': 'Tous Droits Réservés',
    'general.privacyPolicy': 'Politique de Confidentialité',
    'general.termsOfService': "Conditions d'Utilisation",
    'general.cookies': 'Cookies',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.projects': 'Projets',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.skills': 'Compétences',
    'nav.experience': 'Expérience',
    'nav.education': 'Éducation',
    'nav.resume': 'CV',
    'nav.certifications': 'Certifications',
    'nav.services': 'Services',
    'nav.testimonials': 'Témoignages',
    'nav.portfolio': 'Portfolio',
    'nav.pricing': 'Tarifs',
    'nav.faq': 'FAQ',
    'nav.careers': 'Carrières',
    'nav.support': 'Support',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.dashboard': 'Tableau de Bord',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.greeting': 'Bonjour, je suis',
    'hero.title': 'Portfolio Professionnel',
    'hero.subtitle': 'Créer des expériences numériques qui comptent',
    'hero.description': 'Transformer des idées en solutions élégantes avec des technologies de pointe et un design créatif.',
    'hero.cta.primary': 'Voir Mes Projets',
    'hero.cta.secondary': 'Me Contacter',
    'hero.yearsExperience': "Années d'Expérience",
    'hero.projectsCompleted': 'Projets Terminés',
    'hero.happyClients': 'Clients Satisfaits',
    'hero.awardsWon': 'Récompenses Gagnées',
    
    // About Section
    'about.title': 'À Propos de Moi',
    'about.subtitle': 'Passionné par la création d\'expériences numériques',
    'about.description': 'Je suis un professionnel dédié avec expertise dans la création d\'applications web modernes et de solutions numériques.',
    'about.personalInfo': 'Informations Personnelles',
    'about.bio': 'Biographie',
    'about.mission': 'Mission',
    'about.vision': 'Vision',
    'about.values': 'Valeurs',
    
    // Skills Section
    'skills.title': 'Mes Compétences',
    'skills.subtitle': 'Technologies avec lesquelles je travaille',
    'skills.frontend': 'Développement Frontend',
    'skills.backend': 'Développement Backend',
    'skills.database': 'Base de Données',
    'skills.devops': 'DevOps',
    'skills.tools': 'Outils et Plateformes',
    'skills.softSkills': 'Compétences Douces',
    'skills.years': 'ans',
    'skills.experienceLevel': "Niveau d'Expérience",
    'skills.beginner': 'Débutant',
    'skills.intermediate': 'Intermédiaire',
    'skills.advanced': 'Avancé',
    'skills.expert': 'Expert',
    
    // Experience Section
    'experience.title': 'Expérience Professionnelle',
    'experience.subtitle': 'Mon parcours professionnel',
    'experience.present': 'Présent',
    'experience.responsibilities': 'Responsabilités',
    'experience.achievements': 'Réalisations',
    
    // Education Section
    'education.title': 'Éducation',
    'education.subtitle': 'Formation académique',
    'education.degree': 'Diplôme',
    'education.field': 'Domaine d\'Étude',
    'education.graduated': 'Diplômé',
    'education.gpa': 'Moyenne',
    'education.honors': 'Honneurs',
    
    // Projects Section
    'projects.title': 'Mes Projets',
    'projects.subtitle': 'Travail en vedette',
    'projects.all': 'Tous les Projets',
    'projects.viewProject': 'Voir le Projet',
    'projects.viewLive': 'Voir en Direct',
    'projects.viewCode': 'Voir le Code',
    'projects.technologies': 'Technologies Utilisées',
    'projects.client': 'Client',
    'projects.duration': 'Durée',
    
    // Services Section
    'services.title': 'Services',
    'services.subtitle': 'Ce que je propose',
    'services.webDevelopment': 'Développement Web',
    'services.webDevelopmentDesc': 'Sites web et applications web personnalisés construits avec des technologies modernes.',
    'services.mobileDevelopment': 'Développement Mobile',
    'services.mobileDevelopmentDesc': 'Applications mobiles natives et multiplateformes.',
    'services.uiuxDesign': 'Design UI/UX',
    'services.uiuxDesignDesc': 'Design centré sur l\'utilisateur pour améliorer l\'expérience utilisateur.',
    'services.consulting': 'Conseil',
    'services.consultingDesc': 'Conseil technique pour vos projets.',
    'services.maintenance': 'Maintenance',
    'services.maintenanceDesc': 'Services de support et de maintenance continus.',
    'services.training': 'Formation',
    'services.trainingDesc': 'Formations techniques et ateliers.',
    
    // Testimonials Section
    'testimonials.title': 'Témoignages',
    'testimonials.subtitle': 'Ce que disent les clients',
    'testimonials.verified': 'Client Vérifié',
    
    // Blog Section
    'blog.title': 'Derniers Articles',
    'blog.subtitle': 'Réflexions et perspectives',
    'blog.readMore': 'Lire l\'Article',
    'blog.allPosts': 'Tous les Articles',
    'blog.popular': 'Populaire',
    'blog.recent': 'Récent',
    'blog.categories': 'Catégories',
    
    // Contact Section
    'contact.title': 'Me Contacter',
    'contact.subtitle': 'Travaillons ensemble',
    'contact.description': 'Vous avez un projet en tête ou souhaitez collaborer? N\'hésitez pas à me contacter.',
    'contact.form.title': 'Envoyer un Message',
    'contact.form.name': 'Votre Nom',
    'contact.form.email': 'Votre Email',
    'contact.form.subject': 'Sujet',
    'contact.form.message': 'Votre Message',
    'contact.form.submit': 'Envoyer le Message',
    'contact.form.sending': 'Envoi en cours...',
    'contact.form.success': 'Message envoyé avec succès!',
    'contact.form.error': 'Échec de l\'envoi du message. Veuillez réessayer.',
    'contact.info.title': 'Informations de Contact',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Téléphone',
    'contact.info.address': 'Adresse',
    'contact.info.available': 'Disponible pour des missions freelance',
    'contact.info.responseTime': 'Généralement répond sous 24 heures',
    
    // Footer
    'footer.about': 'À Propos',
    'footer.quickLinks': 'Liens Rapides',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterDesc': 'Abonnez-vous pour recevoir des mises à jour sur les nouveaux projets et articles.',
    'footer.newsletterPlaceholder': 'Entrez votre email',
    'footer.subscribe': "S'abonner",
    'footer.followUs': 'Suivez-nous',
    'footer.contact': 'Contact',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': "Conditions d'Utilisation",
    'footer.backToTop': 'Retour en Haut',
    
    // 404
    '404.title': 'Page Non Trouvée',
    '404.description': 'La page que vous recherchez n\'existe pas.',
    '404.goHome': 'Retour à l\'Accueil',
    
    // Admin
    'admin.dashboard': 'Tableau de Bord',
    'admin.settings': 'Paramètres',
    'admin.users': 'Utilisateurs',
    'admin.analytics': 'Analytiques',
    'admin.media': 'Médiathèque',
    'admin.projects': 'Projets',
    'admin.blog': 'Blog',
    'admin.pages': 'Pages',
    'admin.websiteEditor': 'Éditeur de Site',
    'admin.appearance': 'Apparence',
    'admin.language': 'Langue',
    'admin.profile': 'Profil',
    'admin.logout': 'Déconnexion',
    
    // Settings
    'settings.general': 'Général',
    'settings.seo': 'SEO',
    'settings.social': 'Social',
    'settings.advanced': 'Avancé',
    'settings.siteTitle': 'Titre du Site',
    'settings.siteTagline': 'Slogan du Site',
    'settings.siteDescription': 'Description du Site',
    'settings.defaultLanguage': 'Langue par Défaut',
    
    // Currently Tracking
    'tracking.title': 'Suivi en Direct',
    'tracking.subtitle': 'Données de marché en temps réel',
    'tracking.lastUpdated': 'Dernière Mise à Jour',
    'tracking.price': 'Prix',
    'tracking.change': 'Variation',
    'tracking.high': 'Haut',
    'tracking.low': 'Bas',
    'tracking.volume': 'Volume',
    'tracking.marketCap': 'Capitalisation',
    'tracking.rank': 'Rang',
    'tracking.viewAll': 'Voir Tout',
    
    // Validation
    'validation.required': 'Ce champ est requis',
    'validation.email': 'Veuillez entrer un email valide',
    'validation.minLength': 'Minimum {min} caractères requis',
    'validation.maxLength': 'Maximum {max} caractères autorisés',
  },
  sw: {
    // General
    'general.save': 'Hifadhi',
    'general.cancel': 'Ghairi',
    'general.delete': 'Futa',
    'general.edit': 'Hariri',
    'general.add': 'Ongeza',
    'general.search': 'Tafuta',
    'general.loading': 'Inapakia...',
    'general.success': 'Mafanikio',
    'general.error': 'Hitilafu',
    'general.settings': 'Mipangilio',
    'general.home': 'Mwanzo',
    'general.back': 'Rudi',
    'general.download': 'Pakua',
    'general.downloadResume': 'Pakua CV',
    'general.viewResume': 'Tazama CV',
    'general.learnMore': 'Jifunze Zaidi',
    'general.getInTouch': 'Wasiliana Nami',
    'general.readMore': 'Soma Zaidi',
    'general.submit': 'Wasilisha',
    'general.send': 'Tuma',
    'general.sendMessage': 'Tuma Ujumbe',
    'general.name': 'Jina',
    'general.email': 'Barua pepe',
    'general.message': 'Ujumbe',
    'general.phone': 'Simu',
    'general.address': 'Anwani',
    'general.company': 'Kampuni',
    'general.website': 'Tovuti',
    'general.tarehe': 'Tarehe',
    'general.location': 'Mahali',
    'general.type': 'Aina',
    'general.status': 'Hali',
    'general.description': 'Maelezo',
    'general.title': 'Kichwa',
    'general.content': 'Yaliyomo',
    'general.image': 'Picha',
    'general.video': 'Video',
    'general.link': 'Kiungo',
    'general.category': 'Jamii',
    'general.tags': 'Lebo',
    'general.year': 'Mwaka',
    'general.month': 'Mwezi',
    'general.day': 'Siku',
    'general.hours': 'Saa',
    'general.minutes': 'Dakika',
    'general.seconds': 'Sekunde',
    'general.today': 'Leo',
    'general.yesterday': 'Jana',
    'general.thisWeek': 'Wiki hii',
    'general.thisMonth': 'Mwezi huu',
    'general.thisYear': 'Mwaka huu',
    'general.all': 'Yote',
    'general.none': 'Hakuna',
    'general.select': 'Chagua',
    'general.selectLanguage': 'Chagua Lugha',
    'general.changeLanguage': 'Badilisha Lugha',
    'general.language': 'Lugha',
    'general.welcome': 'Karibu',
    'general.ourServices': 'Huduma Zetu',
    'general.ourProjects': 'Miradi Yetu',
    'general.ourTeam': 'Timu Yetu',
    'general.contactUs': 'Wasiliana Nasi',
    'general.subscribe': 'Jisajili',
    'general.subscribeNewsletter': 'Jisajili kwa Jarida',
    'general.followUs': 'Tufuate',
    'general.copyright': 'Hakimiliki',
    'general.allRightsReserved': 'Haki Zote Zimehifadhiwa',
    'general.privacyPolicy': 'Sera ya Faragha',
    'general.termsOfService': 'Sheria za Huduma',
    'general.cookies': 'Kuki',
    
    // Navigation
    'nav.home': 'Mwanzo',
    'nav.about': 'Kuhusu',
    'nav.projects': 'Miradi',
    'nav.blog': 'Blogu',
    'nav.contact': 'Wasiliano',
    'nav.skills': 'Ujuzi',
    'nav.experience': 'Uzoefu',
    'nav.education': 'Elimu',
    'nav.resume': 'CV',
    'nav.certifications': 'Vyeti',
    'nav.services': 'Huduma',
    'nav.testimonials': 'Maoni',
    'nav.portfolio': 'Portfolio',
    'nav.pricing': 'Bei',
    'nav.faq': 'Maswali',
    'nav.careers': 'Kazi',
    'nav.support': 'Msaada',
    'nav.login': 'Ingia',
    'nav.logout': 'Toka',
    'nav.dashboard': 'Dashibodi',
    'nav.admin': 'Admin',
    
    // Hero Section
    'hero.greeting': 'Habari, mimi ni',
    'hero.title': 'Portfolio ya Kipropeshenali',
    'hero.subtitle': 'Kujenga uzoefu wa kidigitali unaochangia',
    'hero.description': 'Kubadilisha mawazo katika suluhisho la kustahi kwa teknolojia ya hali ya juu na usanifu wa ubunifu.',
    'hero.cta.primary': 'Tazama Kazi Zangu',
    'hero.cta.secondary': 'Wasiliana Nami',
    'hero.yearsExperience': 'Miaka ya Uzoefu',
    'hero.projectsCompleted': 'Miradi Iliyokamilika',
    'hero.happyClients': 'Wateja Wenye Furaha',
    'hero.awardsWon': 'Tuzo Zilizoshinda',
    
    // About Section
    'about.title': 'Kuhusu Mimì',
    'about.subtitle': 'Ninapenda kuunda uzoefu wa kidigitali',
    'about.description': 'Mimi ni mtaalamu aliyejitolea wenye utaalamu katika kujenga programu za wavuti za kisasa na suluhisho za kidigitali.',
    'about.personalInfo': 'Taarifa za Kibinafsi',
    'about.bio': 'Wasifu',
    'about.mission': 'Dhima',
    'about.vision': 'Maono',
    'about.values': 'Maadili',
    
    // Skills Section
    'skills.title': 'Ujuzi Wangu',
    'skills.subtitle': 'Teknologia ninazofanya kazi nazo',
    'skills.frontend': 'Maendeleo ya Mbele',
    'skills.backend': 'Maendeleo ya Nyuma',
    'skills.database': 'Hifadhidata',
    'skills.devops': 'DevOps',
    'skills.tools': 'Vifaa na Jukwaa',
    'skills.softSkills': 'Ujuzi wa Kiroho',
    'skills.years': 'miaka',
    'skills.experienceLevel': 'Kiwango cha Uzoefu',
    'skills.beginner': 'Mwanzo',
    'skills.intermediate': 'Kati',
    'skills.advanced': 'Juavu',
    'skills.expert': 'Mtaalamu',
    
    // Experience Section
    'experience.title': 'Uzoefu wa Kazi',
    'experience.subtitle': 'Safari yangu ya kazi',
    'experience.present': 'Hadi sasa',
    'experience.responsibilities': 'Jukumu',
    'experience.achievements': 'Mafanikio',
    
    // Education Section
    'education.title': 'Elimu',
    'education.subtitle': 'Mazingira ya kimasomo',
    'education.degree': 'Degree',
    'education.field': 'Nyanja ya Masomo',
    'education.graduated': 'Kuhitimu',
    'education.gpa': 'Wastani',
    'education.honors': 'Heshima',
    
    // Projects Section
    'projects.title': 'Miradi Yangu',
    'projects.subtitle': 'Kazi Iliyochaguliwa',
    'projects.all': 'Miradi Yote',
    'projects.viewProject': 'Tazama Mradi',
    'projects.viewLive': 'Tazama Moja kwa Moja',
    'projects.viewCode': 'Tazama Msimbo',
    'projects.technologies': 'Teknologia Zilizotumika',
    'projects.client': 'Mteja',
    'projects.duration': 'Muda',
    
    // Services Section
    'services.title': 'Huduma',
    'services.subtitle': 'Ninachotoa',
    'services.webDevelopment': 'Maendeleo ya Wavuti',
    'services.webDevelopmentDesc': 'Tovuti maalum na programu za wavuti zilizojengwa kwa teknolojia za kisasa.',
    'services.mobileDevelopment': 'Maendeleo ya Simu',
    'services.mobileDevelopmentDesc': 'Programu za simu za asili na za chujio.',
    'services.uiuxDesign': 'Ubuni wa UI/UX',
    'services.uiuxDesignDesc': 'Ubuni wa kuzingatia mtumiaji unaoboresha uzoefu wa mtumiaji.',
    'services.consulting': 'Ushauri',
    'services.consultingDesc': 'Ushauri wa kiufundi kwa miradi yako.',
    'services.maintenance': 'Matengenezo',
    'services.maintenanceDesc': 'Huduma za usaidizi na matengenezo ya continuing.',
    'services.training': ' mafunzo',
    'services.trainingDesc': 'Mafunzo ya kiufundi na warsha.',
    
    // Testimonials Section
    'testimonials.title': 'Maoni',
    'testimonials.subtitle': 'Wateja wanasema nini',
    'testimonials.verified': 'Mteja Aliyethibitishwa',
    
    // Blog Section
    'blog.title': 'Makala Mapya',
    'blog.subtitle': 'Maono na mawazo',
    'blog.readMore': 'Soma Makala',
    'blog.allPosts': 'Machapisho Yote',
    'blog.popular': 'Maarufu',
    'blog.recent': 'Hivi karibuni',
    'blog.categories': 'Vikundi',
    
    // Contact Section
    'contact.title': 'Wasiliana Nami',
    'contact.subtitle': 'Tufanye kazi pamoja',
    'contact.description': 'Una mradi akilini au unataka kushirika? Wasiliana nami.',
    'contact.form.title': 'Tuma Ujumbe',
    'contact.form.name': 'Jina Lako',
    'contact.form.email': 'Barua Pepe Yako',
    'contact.form.subject': 'Mada',
    'contact.form.message': 'Ujumbe Wako',
    'contact.form.submit': 'Tuma Ujumbe',
    'contact.form.sending': 'Inatuma...',
    'contact.form.success': 'Ujumbe umetumwa kwa mafanikio!',
    'contact.form.error': 'Imeshindwa kutuma ujombe. Tafadhali jaribu tena.',
    'contact.info.title': 'Taarifa za Wasiliano',
    'contact.info.email': 'Barua pepe',
    'contact.info.phone': 'Simu',
    'contact.info.address': 'Anwani',
    'contact.info.available': 'Inapatikana kazi za freelance',
    'contact.info.responseTime': 'Kawaida hujibu ndani ya saa 24',
    
    // Footer
    'footer.about': 'Kuhusu',
    'footer.quickLinks': 'Viungo vya Haraka',
    'footer.newsletter': 'Jarida',
    'footer.newsletterDesc': 'Jisajili kupata sasisho kuhusu miradi na makala mpya.',
    'footer.newsletterPlaceholder': 'Ingiza barua pepe yako',
    'footer.subscribe': 'Jisajili',
    'footer.followUs': 'Tufuate',
    'footer.contact': 'Wasiliano',
    'footer.privacy': 'Sera ya Faragha',
    'footer.terms': 'Sheria za Huduma',
    'footer.backToTop': 'Rudi Juu',
    
    // 404
    '404.title': 'Ukurasa Haupatikani',
    '404.description': 'Ukurasa unao.tafuta haupo.',
    '404.goHome': 'Kwenye Mwanzo',
    
    // Admin
    'admin.dashboard': 'Dashibodi',
    'admin.settings': 'Mipangilio',
    'admin.users': 'Watumiaji',
    'admin.analytics': 'Uchanganuzi',
    'admin.media': 'Maktaba ya Vyombo',
    'admin.projects': 'Miradi',
    'admin.blog': 'Blogu',
    'admin.pages': 'Masahafa',
    'admin.websiteEditor': 'Mhariri wa Tovuti',
    'admin.appearance': 'Mwonekano',
    'admin.language': 'Lugha',
    'admin.profile': 'Wasifu',
    'admin.logout': 'Toka',
    
    // Settings
    'settings.general': 'Mkuu',
    'settings.seo': 'SEO',
    'settings.social': 'Kijamii',
    'settings.advanced': 'Juavu',
    'settings.siteTitle': 'Kichwa cha Tovuti',
    'settings.siteTagline': 'Kauli Mbiu ya Tovuti',
    'settings.siteDescription': 'Maelezo ya Tovuti',
    'settings.defaultLanguage': 'Luga ya Msingi',
    
    // Currently Tracking
    'tracking.title': 'Kufuatilia Sasa',
    'tracking.subtitle': 'Data za soko la wakati halisi',
    'tracking.lastUpdated': 'Mwisho wa Kusasisha',
    'tracking.price': 'Bei',
    'tracking.change': 'Mabadiliko',
    'tracking.high': 'Juu',
    'tracking.low': 'Chini',
    'tracking.volume': 'Kiwango',
    'tracking.marketCap': 'Soko la Thamani',
    'ladirangi': 'Cheo',
    'tracking.viewAll': 'Tazama Yote',
    
    // Validation
    'validation.required': 'Sehemu hii inahitajika',
    'validation.email': 'Tafadhali ingiza barua pepe halali',
    'validation.minLength': 'Herufi {min} za chini zinahitajika',
    'validation.maxLength': 'Herufi {max} za juu zinaruhusiwa',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now())

  // BroadcastChannel for instant cross-tab communication - created once
  const broadcastRef = useRef<BroadcastChannel | null>(typeof window !== 'undefined' ? new BroadcastChannel('language-changes') : null)

  useEffect(() => {
    // Listen for language changes from other tabs
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data && event.data.type === 'language-change') {
        const newLang = event.data.language as Language
        if (translations[newLang]) {
          setLanguageState(newLang)
          localStorage.setItem('portfolio-language', newLang)
          setLastUpdated(Date.now())
        }
      }
    }

    broadcastRef.current?.addEventListener('message', handleBroadcast)
    return () => broadcastRef.current?.removeEventListener('message', handleBroadcast)
  }, [])

  useEffect(() => {
    // Load language from global settings first, then localStorage as fallback
    const loadLanguage = async () => {
      try {
        // First try to get from global settings API (freshest value)
        const response = await fetch('/api/global-settings?_t=' + Date.now())
        if (response.ok) {
          const settings = await response.json()
          if (settings.defaultLanguage && translations[settings.defaultLanguage as Language]) {
            setLanguageState(settings.defaultLanguage as Language)
            localStorage.setItem('portfolio-language', settings.defaultLanguage)
            setLastUpdated(Date.now())
            setIsLoading(false)
            return
          }
        }
        
        // Fallback to localStorage
        const stored = localStorage.getItem('portfolio-language') as Language
        if (stored && translations[stored]) {
          setLanguageState(stored)
        } else {
          // Default to English
          setLanguageState('en')
        }
      } catch (error) {
        console.error('Error loading language:', error)
        // Default to English on error
        setLanguageState('en')
      } finally {
        setIsLoading(false)
      }
    }

    loadLanguage()
    
    // Poll for language changes every 5 seconds to detect admin changes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/global-settings?_t=' + Date.now())
        if (response.ok) {
          const settings = await response.json()
          if (settings.defaultLanguage && translations[settings.defaultLanguage as Language]) {
            const stored = localStorage.getItem('portfolio-language') as Language
            if (stored !== settings.defaultLanguage) {
              setLanguageState(settings.defaultLanguage as Language)
              localStorage.setItem('portfolio-language', settings.defaultLanguage)
              setLastUpdated(Date.now())
            }
          }
        }
      } catch (error) {
        // Ignore polling errors
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('portfolio-language', lang)
    setLastUpdated(Date.now())
    // Broadcast to other tabs
    broadcastRef.current?.postMessage({ type: 'language-change', language: lang })
  }, [])

  // Create a stable translation function that depends on language and lastUpdated
  const t = useCallback((key: string): string => {
    return translations[language][key] || key
  }, [language, lastUpdated])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
