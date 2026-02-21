import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.howItWorks': 'How it Works',
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.demo': 'Demo',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',
    'nav.myProfile': 'My Profile',
    'nav.signOut': 'Sign Out',
    'nav.signUp': 'Sign Up',
    'nav.signIn': 'Sign In',
    
    // Landing Page
    'hero.aiPowered': 'AI-Powered',
    'hero.studioQuality': 'STUDIO QUALITY',
    'hero.pajamaComfort': 'Pajama Comfort',
    'hero.description': 'Create professional photos that meet standard requirements. No studio visit needed — snap, process, done.',
    'hero.watchDemo': 'Watch Demo',
    
    // Fun Showcase
    'showcase.happySnappers': 'Happy Snappers',
    'showcase.joinFun': 'Join the fun!',
    'showcase.startSnapping': 'Start snapping →',
    
    // How It Works
    'howItWorks.howItWorks': 'HOW IT WORKS',
    'howItWorks.title': 'THREE SIMPLE',
    'howItWorks.subtitle': 'Steps to perfection',
    'howItWorks.step1.title': 'TAKE YOUR PHOTO',
    'howItWorks.step1.desc': 'Use your device camera with smart face detection and real-time guidance',
    'howItWorks.step2.title': 'CHOOSE SIZE',
    'howItWorks.step2.desc': 'Select the size you need with standard requirements and specifications',
    'howItWorks.step3.title': 'GET YOUR PHOTOS',
    'howItWorks.step3.desc': 'Download instantly or get prints delivered to your door in any format you need',
    
    // Features
    'features.features': 'FEATURES',
    'features.title': 'AMAZING',
    'features.subtitle': 'Features',
    'features.description': 'Cutting-edge technology meets retro design. Everything you need for perfect photos.',
    'features.standardCompliance': 'STANDARD COMPLIANCE',
    'features.standardComplianceDesc': 'Photos meet all professional size requirements',
    'features.readyInMinutes': 'READY IN MINUTES',
    'features.readyInMinutesDesc': 'No waiting, no appointments needed. Get your photos instantly',
    'features.guaranteedAcceptance': 'GUARANTEED ACCEPTANCE',
    'features.guaranteedAcceptanceDesc': 'AI-verified to pass inspection with 99.8% success rate',
    'features.aiEnhancement': 'AI PHOTO ENHANCEMENT',
    'features.aiEnhancementDesc': 'Automatic lighting, color correction, and background removal',
    'features.instantDelivery': 'INSTANT DELIVERY',
    'features.instantDeliveryDesc': 'Download immediately or get prints delivered to your door',
    'features.securePrivate': 'SECURE & PRIVATE',
    'features.securePrivateDesc': 'Your photos are encrypted and deleted after processing',
    
    // CTA
    'cta.title': 'READY TO GET YOUR',
    'cta.subtitle': 'Perfect Photo?',
    'cta.description': 'Create professional photos in minutes. No appointment needed.',
    'cta.takePhotoNow': 'Take Your Photo Now',
    
    // About
    'about.about': 'ABOUT US',
    'about.title': 'MEET THE',
    'about.subtitle': 'Photo Team',
    'about.ourStory': 'Our Story',
    'about.description': 'We\'re passionate about making professional photos accessible to everyone. No studios, no appointments, just perfect photos every time.',
    'about.ourStoryDesc': 'We\'re passionate about making professional photos accessible to everyone. No studios, no appointments, just perfect photos every time.',
    'about.ourStory1': 'Founded in 2025, Sortak emerged from a simple frustration: why should getting a professional photo be complicated? We combined cutting-edge AI technology with retro-inspired design to create something truly unique.',
    'about.ourStory2': 'Today, we\'ve helped thousands of people get perfect professional photos with various photo sizes - all from the comfort of their homes.',
    'about.whyChoose': 'Why Choose Us?',
    'about.whyChooseUs': 'Why Choose Us?',
    'about.whyChooseDesc': 'We\'re not just another photo service. We\'re your gateway to professional ID photos with personality.',
    'about.whyChoose1': 'AI-powered perfection guarantee',
    'about.whyChoose2': '100% professional compliance rate',
    'about.whyChoose3': 'Retro style meets modern tech',
    'about.whyChoose4': '24/7 customer support',
    'about.whyChoose5': 'Eco-friendly digital-first approach',
    'about.happyCustomers': 'Happy Customers',
    'about.acceptanceRate': 'Acceptance Rate',
    'about.countries': 'Countries',
    'about.behindTheLens': 'Behind the Lens',
    'about.teamDesc': 'A diverse team of developers, designers, engineers, and Aura farmers.',
    'about.teamMember1': 'Seif Mohamed',
    'about.teamMember1Initials': 'SM',
    'about.teamMember2': 'Ahmed ELKeshawy',
    'about.teamMember2Initials': 'AK',
    'about.teamMember3': 'Yousef ELKady',
    'about.teamMember3Initials': 'YK',
    'about.teamMember4': 'Youssef Mokhles',
    'about.teamMember4Initials': 'YM',
    'about.teamMember5': 'Amr ELDeeb',
    'about.teamMember5Initials': 'AD',
    'about.teamMember6': 'Youssef Sadek',
    'about.teamMember6Initials': 'YS',
    
    // Contact
    'contact.nameRequired': 'Name is required',
    'contact.emailRequired': 'Email is required',
    'contact.emailInvalid': 'Please enter a valid email address',
    'contact.subjectRequired': 'Subject is required',
    'contact.messageRequired': 'Message is required',
    'contact.messageMinLength': 'Message must be at least 10 characters',
    'contact.successMessage': 'Message sent! We\'ll get back to you within 24 hours.',
    'contact.title': 'GET IN',
    'contact.subtitle': 'Touch',
    'contact.description': 'Have questions about our AI-powered photo service? We\'re here to help!',
    'contact.fullName': 'FULL NAME',
    'contact.emailAddress': 'EMAIL ADDRESS',
    'contact.subjectField': 'SUBJECT',
    'contact.messageField': 'MESSAGE',
    'contact.sendMessage': 'SEND MESSAGE',
    'contact.namePlaceholder': 'Enter your full name',
    'contact.emailPlaceholder': 'your@email.com',
    'contact.subjectPlaceholder': 'How can we help you?',
    'contact.messagePlaceholder': 'Tell us more about your question or feedback...',
    'contact.quickContact': 'QUICK CONTACT',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.hours': 'Hours',
    'contact.responseTime': 'RESPONSE TIME',
    'contact.emailSupport': 'Email Support',
    'contact.within24Hours': 'Within 24 hours',
    'contact.phoneSupport': 'Phone Support',
    'contact.businessHours': 'Business hours only',
    'contact.emergency': 'Emergency',
    'contact.prioritySupport': 'Priority support available',
    'contact.officeLocations': 'OFFICE LOCATIONS',
    'contact.northAmerica': 'North America',
    'contact.europe': 'Europe',
    'contact.asiaPacific': 'Asia Pacific',

    // Pricing
    'pricing.pricing': 'PRICING',
    'pricing.title': 'CHOOSE YOUR',
    'pricing.subtitle': 'Perfect Plan',
    'pricing.description': 'Professional photos at prices that make sense. No hidden fees, just perfect photos every time.',
    'pricing.basic': 'BASIC',
    'pricing.basicDesc': 'Perfect for single documents',
    'pricing.pro': 'PRO',
    'pricing.proDesc': 'Everything you need for professional results',
    'pricing.enterprise': 'ENTERPRISE',
    'pricing.enterpriseDesc': 'Unlimited photos for teams and businesses',
    'pricing.popular': 'Popular',
    'pricing.bestValue': 'Best Value',
    'pricing.business': 'Business',
    'pricing.basicPrice': '$9',
    'pricing.proPrice': '$19',
    'pricing.enterprisePrice': 'Custom',
    'pricing.perPhoto': '/photo',
    'pricing.included': 'Included:',
    'pricing.feature1': '1 Professional Photo',
    'pricing.feature2': 'Digital Download (JPEG/PNG)',
    'pricing.feature3': 'Basic Background Removal',
    'pricing.feature4': 'Email Delivery',
    'pricing.feature5': '24 Hour Processing',
    'pricing.proFeature1': '3 Professional Photos',
    'pricing.proFeature2': 'Digital + Print Ready Files',
    'pricing.proFeature3': 'Advanced Background Removal',
    'pricing.proFeature4': 'Instant Email + SMS Delivery',
    'pricing.proFeature5': 'Priority Processing (1 Hour)',
    'pricing.proFeature6': 'Color & Lighting Enhancement',
    'pricing.proFeature7': 'Multiple Formats (JPEG, PNG, PDF)',
    'pricing.enterpriseFeature1': 'Unlimited ID Photos',
    'pricing.enterpriseFeature2': 'Team Management Dashboard',
    'pricing.enterpriseFeature3': 'API Access & Integration',
    'pricing.enterpriseFeature4': 'White Label Options',
    'pricing.enterpriseFeature5': 'Custom Branding',
    'pricing.enterpriseFeature6': 'Priority Support',
    'pricing.enterpriseFeature7': 'Bulk Processing',
    'pricing.enterpriseFeature8': 'Advanced Analytics',
    'pricing.getStarted': 'GET STARTED',
    'pricing.goPro': 'GO PRO',
    'pricing.contactSales': 'CONTACT SALES',
    
    
    // Demo Page
    'demo.title': 'SEE HOW IT',
    'demo.subtitle': 'Works',
    'demo.description': 'Experience the magic of AI-powered professional photos. Watch our demo to see how easy it is to create studio-quality photos from the comfort of your home.',
    'demo.backToHome': 'Back to Home',
    'demo.clickToPlay': 'Click to Play Demo',
    'demo.demoComingSoon': 'Demo video coming soon!',
    'demo.stepsTitle': 'THREE SIMPLE',
    'demo.stepsSubtitle': 'Steps to Perfect Photos',
    'demo.readyToTry': 'Ready to Try?',
    'demo.readyToTryDesc': 'Start creating professional photos in minutes. No appointment needed.',
    'demo.getStartedNow': 'Get Started Now',
    'demo.testimonialsTitle': 'What Users',
    'demo.testimonialsSubtitle': 'Are Saying',
    
    // FAQ
    'faq.title': 'FREQUENTLY ASKED',
    'faq.subtitle': 'Questions',
    'faq.description': 'Find answers to common questions about our AI-powered ID photo service.',
    'faq.q1.question': 'How does AI-powered photo enhancement work?',
    'faq.q1.answer': 'Our AI technology automatically adjusts lighting, removes backgrounds, and optimizes your photo to meet standard requirements. It uses advanced algorithms to detect faces and ensure perfect positioning.',
    'faq.q2.question': 'What countries\' photo requirements do you support?',
    'faq.q2.answer': 'We support over 150 countries including USA, UK, Canada, Australia, Germany, France, and many more. Each photo size is optimized for specific country requirements.',
    'faq.q3.question': 'How quickly will I receive my photos?',
    'faq.q3.answer': 'Instant delivery! Once processed, your photos are available for immediate download. Print delivery takes 2-5 business days depending on your location.',
    'faq.q4.question': 'Is my data secure and private?',
    'faq.q4.answer': 'Absolutely! All photos are encrypted during processing and automatically deleted from our servers after 24 hours. We never store your personal information longer than necessary.',
    'faq.q5.question': 'Can I use photos taken with other cameras?',
    'faq.q5.answer': 'Yes! You can upload existing photos taken with any device. Our AI will optimize them to meet the required specifications for your photo size.',
    'faq.q6.question': 'What payment methods do you accept?',
    'faq.q6.answer': 'We accept all major credit cards, PayPal, and digital wallets. All payments are processed securely through encrypted channels.',
    'faq.q7.question': 'What if I\'m not satisfied with the results?',
    'faq.q7.answer': 'We offer a 100% satisfaction guarantee. If your photos don\'t meet requirements, we\'ll reprocess them for free or provide a full refund.',
    'faq.q8.question': 'Do you offer bulk discounts for multiple photos?',
    'faq.q8.answer': 'Yes! We offer competitive pricing for bulk orders. Contact our sales team for custom quotes on large volume orders.',
    'faq.stillNeedHelp': 'Still Need Help?',
    'faq.stillNeedHelpDesc': "Can't find what you're looking for? Our support team is here to help you get your perfect ID photo.",
    'faq.emailSupport': 'Email Support',
    'faq.callUs': 'Call Us',
    
    // Sign In
    'signin.welcome': 'WELCOME',
    'signin.subtitle': 'Sign in to your Sortak account to access your profile',
    'signin.back': 'Back',
    'signin.signinBadge': 'SIGN IN',
    'signin.emailAddress': 'EMAIL ADDRESS',
    'signin.password': 'PASSWORD',
    'signin.emailPlaceholder': 'your@email.com',
    'signin.passwordPlaceholder': 'Enter your password',
    'signin.rememberMe': 'Remember me',
    'signin.forgotPassword': 'Forgot password?',
    'signin.signinButton': 'Sign In',
    'signin.signingIn': 'Signing In...',
    'signin.noAccount': "Don't have an account?",
    'signin.createAccount': 'Create Account',
    'signin.resetPassword': 'Reset Password',
    'signin.resetDescription': 'Enter your email and we\'ll send you a reset link.',
    'signin.backToSignin': '← Back to sign in',
    'signin.sendReset': 'Send Reset Link',
    'signin.sending': 'Sending...',
    
    // Sign Up
    'signup.createYour': 'CREATE YOUR',
    'signup.account': 'Account',
    'signup.subtitle': 'Join Sortak and start creating professional photos',
    'signup.createBadge': 'SIGN UP',
    'signup.fullName': 'FULL NAME',
    'signup.emailAddress': 'EMAIL ADDRESS',
    'signup.password': 'PASSWORD',
    'signup.confirmPassword': 'CONFIRM PASSWORD',
    'signup.namePlaceholder': 'Enter your full name',
    'signup.emailPlaceholder': 'your@email.com',
    'signup.passwordPlaceholder': 'Create a strong password',
    'signup.confirmPlaceholder': 'Confirm your password',
    'signup.signupButton': 'Create Account',
    'signup.creating': 'Creating Account...',
    'signup.haveAccount': 'Already have an account?',
    'signup.signin': 'Sign in',
    'signup.agreement': 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
    'signup.terms': 'Terms of Service',
    'signup.privacy': 'Privacy Policy',

    // Profile
    'profile.welcome': 'WELCOME,',
    'profile.subtitle': 'View your order history and manage your Sortak account',
    'profile.createBadge': 'PROFILE',
    'profile.orderNumber': 'Order #',
    'profile.orderDate': 'Order Date',
    'profile.delivery': 'Delivery',
    'profile.total': 'Total',
    'profile.download': 'Download',
    'profile.processing': 'Processing',
    'profile.viewDetails': 'View Details',
    'profile.accountActions': 'Account Actions',
    'profile.newOrder': 'New Order',
    'profile.signOut': 'Sign Out',
    
    // General
    'loading': 'Loading...',
    'language': 'Language',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.howItWorks': 'كيف يعمل',
    'nav.features': 'المميزات',
    'nav.about': 'من نحن',
    'nav.pricing': 'الأسعار',
    'nav.demo': 'تجريبي',
    'nav.faq': 'الأسئلة',
    'nav.contact': 'اتصل',
    'nav.getStarted': 'ابدأ الآن',
    'nav.myProfile': 'ملفي الشخصي',
    'nav.signOut': 'تسجيل الخروج',
    'nav.signUp': 'إنشاء حساب',
    'nav.signIn': 'تسجيل الدخول',
    
    // Sign In
    'signin.welcome': 'مرحباً',
    'signin.subtitle': 'سجل الدخول إلى حساب Sortak للوصول إلى ملفك الشخصي',
    'signin.back': 'بعودتك',
    'signin.signinBadge': 'تسجيل الدخول',
    'signin.emailAddress': 'عنوان البريد الإلكتروني',
    'signin.password': 'كلمة المرور',
    'signin.emailPlaceholder': 'your@email.com',
    'signin.passwordPlaceholder': 'أدخل كلمة المرور',
    'signin.rememberMe': 'تذكرني',
    'signin.forgotPassword': 'نسيت كلمة المرور؟',
    'signin.signinButton': 'تسجيل الدخول',
    'signin.signingIn': 'جاري تسجيل الدخول...',
    'signin.noAccount': 'ليس لديك حساب؟',
    'signin.createAccount': 'إنشاء حساب',
    'signin.resetPassword': 'إعادة تعيين كلمة المرور',
    'signin.resetDescription': 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.',
    'signin.backToSignin': '← العودة لتسجيل الدخول',
    'signin.sendReset': 'إرسال رابط إعادة التعيين',
    'signin.sending': 'جاري الإرسال...',
    
    // Sign Up
    'signup.createYour': 'إنشاء',
    'signup.account': 'حساب',
    'signup.subtitle': 'انضم إلى Sortak وابدأ في إنشاء صور احترافية',
    'signup.createBadge': 'إنشاء حساب',
    'signup.fullName': 'الاسم الكامل',
    'signup.emailAddress': 'عنوان البريد الإلكتروني',
    'signup.password': 'كلمة المرور',
    'signup.confirmPassword': 'تأكيد كلمة المرور',
    'signup.namePlaceholder': 'أدخل اسمك بالكامل',
    'signup.emailPlaceholder': 'عنوان البريد الإلكتروني',
    'signup.passwordPlaceholder': 'أدخل كلمة سر',
    'signup.confirmPlaceholder': 'تأكيد كلمة السر',
    'signup.signupButton': 'إنشاء حساب',
    'signup.creating': 'جاري إنشاء الحساب...',
    'signup.haveAccount': 'لديك حساب بالفعل؟',
    'signup.signin': 'تسجيل الدخول',
    'signup.agreement': 'بإنشاء حساب، فإنك توافق على شروط الخدمة وسياسة الخصوصية.',
    'signup.terms': 'شروط الخدمة',
    'signup.privacy': 'سياسة الخصوصية',
    
    // Profile
    'profile.welcome': 'أهلاً بك,',
    'profile.subtitle': 'عرض تاريخ طلباتك وإدارة حساب Sortak الخاص بك',
    'profile.createBadge': 'الحساب الشخصي',
    'profile.orderNumber': 'رقم الطلب',
    'profile.orderDate': 'تاريخ الطلب',
    'profile.delivery': 'التسليم',
    'profile.total': 'المجموع',
    'profile.download': 'تحميل',
    'profile.processing': 'جاري التنفيذ',
    'profile.viewDetails': 'عرض التفاصيل',
    'profile.accountActions': 'إجراءات الحساب',
    'profile.newOrder': 'طلب جديد',
    'profile.signOut': 'تسجيل الخروج',
    
    // General
    'loading': 'جاري التحميل...',
    'language': 'اللغة',
    
    // Landing Page
    'hero.aiPowered': 'مدعوم بالذكاء الاصطناعي',
    'hero.studioQuality': 'جودة الاستوديو',
    'hero.pajamaComfort': 'راحة البيجاما',
    'hero.description': 'أنشئ صورًا احترافية تلبي المتطلبات القياسية. لا حاجة لزيارة الاستوديو — التقط، معالجة، انتهى.',
    'hero.watchDemo': 'شاهد العرض',
    
    // Fun Showcase
    'showcase.happySnappers': 'عملاء سعداء',
    'showcase.joinFun': 'انضم إلى المرح!',
    'showcase.startSnapping': '← ابدأ التصوير',
    
    // How It Works
    'howItWorks.howItWorks': 'كيف يعمل',
    'howItWorks.title': 'ثلاث خطوات',
    'howItWorks.subtitle': 'بسيطة للكمال',
    'howItWorks.step1.title': 'التقط صورتك',
    'howItWorks.step1.desc': 'استخدم كاميرا جهازك مع اكتشاف الوجه الذكي والإرشاد في الوقت الفعلي',
    'howItWorks.step2.title': 'اختر الحجم',
    'howItWorks.step2.desc': 'اختر الحجم الذي تحتاجه مع المتطلبات والمواصفات القياسية',
    'howItWorks.step3.title': 'احصل على صورك',
    'howItWorks.step3.desc': 'حمل فورًا أو احصل على مطبوعات توصل إلى بابك في أي تنسيق تحتاجه',
    
    // Features
    'features.features': 'المميزات',
    'features.title': 'مميزات',
    'features.subtitle': 'رائعة',
    'features.description': 'تقنية متطورة تلبي التصميم الريترو. كل ما تحتاجه للحصول على صور مثالية.',
    'features.standardCompliance': 'الامتثال القياسي',
    'features.standardComplianceDesc': 'الصور تلبي جميع متطلبات الحجم الاحترافية',
    'features.readyInMinutes': 'جاهز في دقائق',
    'features.readyInMinutesDesc': 'لا انتظار، لا حاجة للمواعيد. احصل على صورك فورًا',
    'features.guaranteedAcceptance': 'قبول مضمون',
    'features.guaranteedAcceptanceDesc': 'متحقق من الذكاء الاصطناعي لاجتياز الفحص بنجاح 99.8%',
    'features.aiEnhancement': 'تحسين الصورة بالذكاء الاصطناعي',
    'features.aiEnhancementDesc': 'إضاءة تلقائية، تصحيح الألوان، وإزالة الخلفية',
    'features.instantDelivery': 'توصيل فوري',
    'features.instantDeliveryDesc': 'حمل فورًا أو احصل على مطبوعات توصل إلى بابك',
    'features.securePrivate': 'آمن وخاص',
    'features.securePrivateDesc': 'صورك مشفرة وحذفها بعد المعالجة',
    
    // CTA
    'cta.title': 'هل أنت مستعد للحصول على',
    'cta.subtitle': 'صورتك المثالية؟',
    'cta.description': 'أنشئ صورًا احترافية في دقائق. لا حاجة للمواعيد.',
    'cta.takePhotoNow': 'التقط صورتك الآن',
    
    // About
    'about.about': 'من نحن',
    'about.title': 'تعرف على',
    'about.subtitle': 'فريق التصوير',
    'about.ourStory': 'قصتنا',
    'about.description': 'لدينا شغف لجعل الصور الاحترافية في متناول الجميع. بدون استديو أو مواعيد, فقط صور مثالية كل مرة.',
    'about.ourStoryDesc': 'لدينا شغف لجعل الصور الاحترافية في متناول الجميع. بدون استديو أو مواعيد, فقط صور مثالية كل مرة.',
    'about.ourStory1': 'تأسست في 2025, Sortak بدأت من تساؤل بسيط: لماذا يجب أن يكون الحصول على صور احترافية أمراً معقداً؟ لذلك استطعنا الجمع بينأحدث تقنيات الذكاء الاصطناعي وتصميم الريترو لابتكار شيئاً فريداً.',
    'about.ourStory2': 'إلى اليوم, ساعدنا الآلاف للحصول على صورهم الاحترافية المثالية مع تنوع أحجام الصور - دون ترك منازلهم.',
    'about.whyChoose': 'لماذا نحن؟',
    'about.whyChooseUs': 'لماذا نحن؟',
    'about.whyChooseDesc': 'لسنا مجرد خدمة صور أخرى. نحن بوابتك للصور المعرفية الاحترافية مع شخصية.',
    'about.whyChoose1': 'كمال مدعوم بالذكاء الاصطناعي في كل مرة',
    'about.whyChoose2': 'ضمان امتثال بنسبة 100%',
    'about.whyChoose3': 'الأسلوب الريترو يلتقي بالتقنية الحديثة',
    'about.whyChoose4': 'دعم العملاء على مدار الساعة',
    'about.whyChoose5': 'نهج رقمي صديق للبيئة',
    'about.happyCustomers': 'العملاء السعداء',
    'about.acceptanceRate': 'نسبة القبول',
    'about.countries': 'بلاد',
    'about.behindTheLens': 'خلف العدسة',
    'about.teamDesc': 'فريق متنوع من المطورين والمصممين والأساطير.',
    'about.teamMember1': 'سيف محمد',
    'about.teamMember1Initials': 'س م',
    'about.teamMember2': 'أحمد القيشاوي',
    'about.teamMember2Initials': 'أق',
    'about.teamMember3': 'يوسف القاضي',
    'about.teamMember3Initials': 'ي ق',
    'about.teamMember4': 'يوسف مخلص',
    'about.teamMember4Initials': 'ي م',
    'about.teamMember5': 'عمرو الديب',
    'about.teamMember5Initials': 'ع م',
    'about.teamMember6': 'يوسف صادق',
    'about.teamMember6Initials': 'ي ص',
    
    // Contact
    'contact.nameRequired': 'الاسم مطلوب',
    'contact.emailRequired': 'البريد الإلكتروني مطلوب',
    'contact.emailInvalid': 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    'contact.subjectRequired': 'الموضوع مطلوب',
    'contact.messageRequired': 'الرسالة مطلوبة',
    'contact.messageMinLength': 'يجب أن تكون الرسالة 10 أحرف على الأقل',
    'contact.successMessage': 'تم إرسال الرسالة! سنعود إليك خلال 24 ساعة.',
    'contact.title': 'تواصل',
    'contact.subtitle': 'معنا',
    'contact.description': 'هل لديك أسئلة حول خدمة الصور المعرفية المدعومة بالذكاء الاصطناعي؟ نحن هنا للمساعدة!',
    'contact.fullName': 'الاسم الكامل',
    'contact.emailAddress': 'عنوان البريد الإلكتروني',
    'contact.subjectField': 'الموضوع',
    'contact.messageField': 'الرسالة',
    'contact.sendMessage': 'إرسال رسالة',
    'contact.namePlaceholder': 'أدخل اسمك الكامل',
    'contact.emailPlaceholder': 'your@email.com',
    'contact.subjectPlaceholder': 'كيف يمكننا مساعدتك؟',
    'contact.messagePlaceholder': 'أخبرنا بالمزيد حول سؤالك أو ملاحظاتك...',
    'contact.quickContact': 'تواصل السريع',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'الهاتف',
    'contact.hours': 'الساعات',
    'contact.responseTime': 'وقت الاستجابة',
    'contact.emailSupport': 'دعم البريد الإلكتروني:',
    'contact.within24Hours': 'خلال 24 ساعة',
    'contact.phoneSupport': 'دعم الهاتف:',
    'contact.businessHours': 'ساعات العمل فقط',
    'contact.emergency': 'الطوارئ:',
    'contact.prioritySupport': 'دعم الأولوية متاح',
    'contact.officeLocations': 'مواقع المكاتب',
    'contact.northAmerica': 'أمريكا الشمالية',
    'contact.europe': 'أوروبا',
    'contact.asiaPacific': 'آسيا والمحيط الهادئ',
    
    // Pricing
    'pricing.pricing': 'الأسعار',
    'pricing.title': 'اختر خطتك',
    'pricing.subtitle': 'المثالية',
    'pricing.description': 'صور معرفية احترافية بأسعار معقولة. لا توجد رسوم خفية، فقط صور مثالية في كل مرة.',
    'pricing.basic': 'أساسي',
    'pricing.basicDesc': 'مثالي للمستندات الواحدة',
    'pricing.pro': 'احترافي',
    'pricing.proDesc': 'كل ما تحتاجه للنتائج الاحترافية',
    'pricing.enterprise': 'مؤسسي',
    'pricing.enterpriseDesc': 'صور غير محدودة للفرق والشركات',
    'pricing.popular': 'شائع',
    'pricing.bestValue': 'أفضل قيمة',
    'pricing.business': 'الأعمال',
    'pricing.basicPrice': '$9',
    'pricing.proPrice': '$19',
    'pricing.enterprisePrice': 'حسب الطلب',
    'pricing.perPhoto': '/صورة',
    'pricing.included': 'مضمن:',
    'pricing.feature1': '1 صورة معرفية احترافية',
    'pricing.feature2': 'تحميل رقمي (JPEG/PNG)',
    'pricing.feature3': 'إزالة أساسية للخلفية',
    'pricing.feature4': 'التسليم عبر البريد الإلكتروني',
    'pricing.feature5': 'معالجة خلال 24 ساعة',
    'pricing.proFeature1': '3 صور معرفية احترافية',
    'pricing.proFeature2': 'ملفات رقمية + جاهزة للطباعة',
    'pricing.proFeature3': 'إزالة متقدمة للخلفية',
    'pricing.proFeature4': 'تسليم فوري عبر البريد الإلكتروني + SMS',
    'pricing.proFeature5': 'معالجة أولوية (ساعة واحدة)',
    'pricing.proFeature6': 'تحسين الألوان والإضاءة',
    'pricing.proFeature7': 'صيغ متعددة (JPEG, PNG, PDF)',
    'pricing.enterpriseFeature1': 'صور معرفية غير محدودة',
    'pricing.enterpriseFeature2': 'لوحة تحكم الفريق',
    'pricing.enterpriseFeature3': 'الوصول إلى API والتكامل',
    'pricing.enterpriseFeature4': 'خيارات العلامة البيضاء',
    'pricing.enterpriseFeature5': 'علامة تجارية مخصصة',
    'pricing.enterpriseFeature6': 'دعم الأولوية',
    'pricing.enterpriseFeature7': 'المعالجة بالجملة',
    'pricing.enterpriseFeature8': 'تحليلات متقدمة',
    'pricing.getStarted': 'ابدأ الآن',
    'pricing.goPro': 'ابدأ الاحتراف',
    'pricing.contactSales': 'اتصل بالمبيعات',
    
    // Demo Page
    'demo.title': 'شاهد كيف',
    'demo.subtitle': 'يعمل',
    'demo.description': 'جرب سحر الصور الاحترافية المدعومة بالذكاء الاصطناعي. شاهد عرضنا لترى مدى سهولة إنشاء صور جودة الاستوديو من راحة منزلك.',
    'demo.backToHome': 'العودة للرئيسية',
    'demo.clickToPlay': 'انقر لتشغيل العرض',
    'demo.demoComingSoon': 'الفيديو التجريبي قريبًا!',
    'demo.stepsTitle': 'ثلاث خطوات',
    'demo.stepsSubtitle': 'بسيطة للصور المثالية',
    'demo.readyToTry': 'هل أنت مستعد للتجربة؟',
    'demo.readyToTryDesc': 'ابدأ في إنشاء صور احترافية في دقائق. لا حاجة للمواعيد.',
    'demo.getStartedNow': 'ابدأ الآن',
    'demo.testimonialsTitle': 'ماذا يقول',
    'demo.testimonialsSubtitle': 'المستخدمون',
    
    // FAQ
    'faq.title': 'أسئلة',
    'faq.subtitle': 'شائعة',
    'faq.description': 'ابحث عن إجابات للأسئلة الشائعة حول خدمة الصور المعرفية المدعومة بالذكاء الاصطناعي.',
    'faq.q1.question': 'كيف يعمل تحسين الصور المدعوم بالذكاء الاصطناعي؟',
    'faq.q1.answer': 'تقنية الذكاء الاصطناعي لدينا تقوم تلقائياً بضبط الإضاءة وإزالة الخلفيات وتحسين صورتك لتلبية المتطلبات القياسية. تستخدم خوارزميات متقدمة للكشف عن الوجوه وضمان الوضع المثالي.',
    'faq.q2.question': 'ما متطلبات الصور للدول التي تدعمونها؟',
    'faq.q2.answer': 'ندعم أكثر من 150 دولة بما في ذلك الولايات المتحدة والمملكة المتحدة وكندا وأستراليا وألمانيا وفرنسا والعديد من الدول الأخرى. يتم تحسين حجم كل صورة لمتطلبات الدولة المحددة.',
    'faq.q3.question': 'كم سرعة استلامي للصور؟',
    'faq.q3.answer': 'تسليم فوري! بمجرد المعالجة، تكون صورك متاحة للتنزيل الفوري. يستغرق التسليم المطبوع من 2-5 أيام عمل حسب موقعك.',
    'faq.q4.question': 'هل بياناتي آمنة وخاصة؟',
    'faq.q4.answer': 'بالتأكيد! يتم تشفير جميع الصور أثناء المعالجة وحذفها تلقائياً من خوادمنا بعد 24 ساعة. لا نخزن معلوماتك الشخصية لفترة أطول من اللازم.',
    'faq.q5.question': 'هل يمكنني استخدام صور ملتقطة بكاميرات أخرى؟',
    'faq.q5.answer': 'نعم! يمكنك رفع صور موجودة ملتقطة بأي جهاز. سيقوم الذكاء الاصطناعي لدينا بتحسينها لتلبية المواصفات المطلوبة لحجم صورتك.',
    'faq.q6.question': 'ما طرق الدفع التي تقبلونها؟',
    'faq.q6.answer': 'نقبل جميع بطاقات الائتمان الرئيسية وPayPal والمحافظ الرقمية. تتم معالجة جميع المدفوعات بأمان عبر قنوات مشفرة.',
    'faq.q7.question': 'ماذا لو لم أكن راضياً عن النتائج؟',
    'faq.q7.answer': 'نقدم ضمان رضا بنسبة 100%. إذا لم تكن صورك تلبي المتطلبات، سنعيد معالجتها مجاناً أو نقدم استرداداً كاملاً.',
    'faq.q8.question': 'هل تقدمون خصومات للطلبات الكبيرة؟',
    'faq.q8.answer': 'نعم! نقدم أسعاراً تنافسية للطلبات الكبيرة. اتصل بفريق المبيعات لدينا للحصول على عروض أسعار مخصصة للطلبات ذات الحجم الكبير.',
    'faq.stillNeedHelp': 'هل تحتاج مساعدة؟',
    'faq.stillNeedHelpDesc': 'لا تجد ما تبحث عنه؟ فريق الدعم لدينا هنا لمساعدتك في الحصول على صورتك المعرفية المثالية.',
    'faq.emailSupport': 'دعم البريد الإلكتروني',
    'faq.callUs': 'اتصل بنا',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage or default to English
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'ar')) return saved;
    
    // Default to English instead of browser language detection
    return 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body class for RTL styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
