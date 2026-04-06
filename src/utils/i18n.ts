// ─── Internationalization (i18n) for BridgeApp ──────────────────

export type LangCode = 'en' | 'zh' | 'zh-TW' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'hi' | 'pt' | 'ar' | 'vi' | 'tl' | 'ru' | 'it';

export interface LanguageOption {
  code: LangCode;
  label: string;
  nativeLabel: string;
  flag: string;
  speechCode: string; // BCP-47 for Web Speech API
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'zh', label: 'Chinese (Simplified)', nativeLabel: '简体中文', flag: '🇨🇳', speechCode: 'zh-CN' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', nativeLabel: '繁體中文', flag: '🇹🇼', speechCode: 'zh-TW' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵', speechCode: 'ja-JP' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷', speechCode: 'ko-KR' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', flag: '🇧🇷', speechCode: 'pt-BR' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt', flag: '🇻🇳', speechCode: 'vi-VN' },
  { code: 'tl', label: 'Tagalog', nativeLabel: 'Tagalog', flag: '🇵🇭', speechCode: 'fil-PH' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT' },
];

// ─── Translation keys ──────────────────────────────────────────
// Flat key structure: "screen.element"

type TranslationKeys = {
  // Common
  'common.save': string;
  'common.cancel': string;
  'common.delete': string;
  'common.edit': string;
  'common.close': string;
  'common.ok': string;
  'common.back': string;
  'common.search': string;
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  'common.required': string;
  'common.comingSoon': string;

  // Tab bar
  'tabs.games': string;
  'tabs.schedule': string;
  'tabs.sos': string;
  'tabs.chat': string;
  'tabs.help': string;
  'tabs.profile': string;

  // Auth screen
  'auth.appName': string;
  'auth.tagline': string;
  'auth.login': string;
  'auth.signup': string;
  'auth.fullName': string;
  'auth.email': string;
  'auth.password': string;
  'auth.confirmPassword': string;
  'auth.namePlaceholder': string;
  'auth.emailPlaceholder': string;
  'auth.passwordPlaceholder': string;
  'auth.confirmPlaceholder': string;
  'auth.createAccount': string;
  'auth.noAccount': string;
  'auth.hasAccount': string;
  'auth.secureFooter': string;
  'auth.missingInfo': string;
  'auth.fillFields': string;
  'auth.missingName': string;
  'auth.enterName': string;
  'auth.passwordMismatch': string;
  'auth.passwordMismatchMsg': string;
  'auth.weakPassword': string;
  'auth.weakPasswordMsg': string;
  'auth.loginFailed': string;
  'auth.signupFailed': string;

  // Games screen
  'games.title': string;
  'games.subtitle': string;
  'games.featured': string;
  'games.moreGames': string;
  'games.startPlaying': string;
  'games.challengeDesc': string;
  'games.chess': string;
  'games.chessDesc': string;
  'games.connectFour': string;
  'games.connectFourDesc': string;
  'games.poker': string;
  'games.pokerDesc': string;
  'games.ticTacToe': string;
  'games.checkers': string;
  'games.wordSearch': string;
  'games.trivia': string;
  'games.players': string;
  'games.strategy': string;
  'games.easy': string;
  'games.medium': string;
  'games.classic': string;
  'games.fun': string;
  'games.quick': string;
  'games.cards': string;
  'games.bluffing': string;

  // Schedule screen
  'schedule.title': string;
  'schedule.newEvent': string;
  'schedule.editEvent': string;
  'schedule.eventTitle': string;
  'schedule.eventTitlePlaceholder': string;
  'schedule.date': string;
  'schedule.datePlaceholder': string;
  'schedule.time': string;
  'schedule.timePlaceholder': string;
  'schedule.description': string;
  'schedule.descPlaceholder': string;
  'schedule.eventColor': string;
  'schedule.reminderNote': string;
  'schedule.todayEvents': string;
  'schedule.noEvents': string;
  'schedule.upcoming': string;
  'schedule.deleteEvent': string;
  'schedule.deleteConfirm': string;
  'schedule.saved': string;
  'schedule.titleRequired': string;

  // Chat screen
  'chat.title': string;
  'chat.connections': string;
  'chat.searchPlaceholder': string;
  'chat.onlineNow': string;
  'chat.noOneOnline': string;
  'chat.noConversations': string;
  'chat.startChatting': string;

  // Conversation screen
  'conversation.online': string;
  'conversation.offline': string;
  'conversation.typePlaceholder': string;

  // SOS screen
  'sos.title': string;
  'sos.subtitle': string;
  'sos.buttonText': string;
  'sos.holdHint': string;
  'sos.sending': string;
  'sos.sent': string;
  'sos.holdToSend': string;
  'sos.lastLocation': string;
  'sos.willAlert': string;
  'sos.noContacts': string;
  'sos.noContactsMsg': string;
  'sos.fullyAutomatic': string;
  'sos.automaticDesc': string;
  'sos.smsViaTwilio': string;
  'sos.emailViaGmail': string;
  'sos.emergencyServices': string;
  'sos.call911': string;
  'sos.crisis988': string;
  'sos.sosSent': string;
  'sos.sosIssues': string;
  'sos.sendError': string;
  'sos.sendErrorMsg': string;

  // Profile screen
  'profile.title': string;
  'profile.fullName': string;
  'profile.namePlaceholder': string;
  'profile.age': string;
  'profile.agePlaceholder': string;
  'profile.bio': string;
  'profile.bioPlaceholder': string;
  'profile.iAmA': string;
  'profile.senior': string;
  'profile.youth': string;
  'profile.saveProfile': string;
  'profile.saved': string;
  'profile.savedMsg': string;
  'profile.nameRequired': string;
  'profile.nameRequiredMsg': string;
  'profile.quickActions': string;
  'profile.emergencyContacts': string;
  'profile.emergencyContactsSub': string;
  'profile.gameStats': string;
  'profile.gameStatsSub': string;
  'profile.settings': string;
  'profile.settingsSub': string;
  'profile.language': string;
  'profile.languageSub': string;
  'profile.logOut': string;
  'profile.logOutConfirm': string;
  'profile.logOutMsg': string;
  'profile.changePhoto': string;
  'profile.camera': string;
  'profile.photoLibrary': string;

  // Emergency contacts
  'emergency.title': string;
  'emergency.subtitle': string;
  'emergency.noContacts': string;
  'emergency.noContactsDesc': string;
  'emergency.addFirst': string;
  'emergency.primary': string;
  'emergency.newContact': string;
  'emergency.editContact': string;
  'emergency.fullName': string;
  'emergency.namePlaceholder': string;
  'emergency.phone': string;
  'emergency.phonePlaceholder': string;
  'emergency.emailLabel': string;
  'emergency.emailPlaceholder': string;
  'emergency.relationship': string;
  'emergency.family': string;
  'emergency.spouse': string;
  'emergency.parent': string;
  'emergency.sibling': string;
  'emergency.friend': string;
  'emergency.caregiver': string;
  'emergency.doctor': string;
  'emergency.other': string;
  'emergency.namePhoneRequired': string;
  'emergency.removeContact': string;
  'emergency.removeConfirm': string;
  'emergency.infoText': string;

  // Help screen
  'help.title': string;
  'help.subtitle': string;
  'help.readAll': string;
  'help.stopReading': string;
  'help.quickTips': string;
  'help.tip1': string;
  'help.tip2': string;
  'help.tip3': string;
  'help.tip4': string;
  'help.sectionProfile': string;
  'help.sectionSOS': string;
  'help.sectionSchedule': string;
  'help.sectionChat': string;
  'help.sectionGames': string;
  'help.sectionVoice': string;
  'help.sectionAccount': string;

  // Voice commands
  'voice.title': string;
  'voice.listening': string;
  'voice.sendingSOS': string;
  'voice.tapToListen': string;
  'voice.trySaying': string;
  'voice.contactingContacts': string;
  'voice.notUnderstood': string;
  'voice.micDenied': string;
  'voice.webOnly': string;

  // Diet & Wellness
  'tabs.diet': string;
  'diet.title': string;
  'diet.subtitle': string;
  'diet.dailyTips': string;
  'diet.sampleMeals': string;
  'diet.tipWater': string;
  'diet.tipWaterDesc': string;
  'diet.tipFruits': string;
  'diet.tipFruitsDesc': string;
  'diet.tipGrains': string;
  'diet.tipGrainsDesc': string;
  'diet.tipProtein': string;
  'diet.tipProteinDesc': string;
  'diet.tipDairy': string;
  'diet.tipDairyDesc': string;
  'diet.tipSugar': string;
  'diet.tipSugarDesc': string;
  'diet.breakfast': string;
  'diet.breakfastItems': string;
  'diet.lunch': string;
  'diet.lunchItems': string;
  'diet.dinner': string;
  'diet.dinnerItems': string;
  'diet.snacks': string;
  'diet.snackItems': string;
  'diet.disclaimer': string;
  'diet.aiCardTitle': string;
  'diet.aiCardDesc': string;
  'diet.aiTitle': string;
  'diet.aiSubtitle': string;
  'diet.chatEmpty': string;
  'diet.aiTyping': string;
  'diet.inputPlaceholder': string;
  'diet.aiError': string;
  'diet.q1': string;
  'diet.q2': string;
  'diet.q3': string;
  'diet.q4': string;
  'diet.q5': string;
  'diet.q6': string;

  // Compass AI
  'ai.title': string;
  'ai.subtitle': string;
  'ai.tabChat': string;
  'ai.tabDiet': string;
  'ai.tabRecipes': string;
  'ai.chatWelcome': string;
  'ai.chatDesc': string;
  'ai.inputPlaceholder': string;
  'ai.topicDiet': string;
  'ai.topicExercise': string;
  'ai.topicHealth': string;
  'ai.topicTech': string;
  'ai.topicChat': string;
  'ai.topicGames': string;
  'ai.promptDiet': string;
  'ai.promptExercise': string;
  'ai.promptHealth': string;
  'ai.promptTech': string;
  'ai.promptChat': string;
  'ai.promptGames': string;
  'ai.voiceThinking': string;
  // Recipes
  'recipes.title': string;
  'recipes.subtitle': string;
  'recipes.featured': string;
  'recipes.recipe1.name': string;
  'recipes.recipe1.time': string;
  'recipes.recipe1.desc': string;
  'recipes.recipe2.name': string;
  'recipes.recipe2.time': string;
  'recipes.recipe2.desc': string;
  'recipes.recipe3.name': string;
  'recipes.recipe3.time': string;
  'recipes.recipe3.desc': string;
  'recipes.recipe4.name': string;
  'recipes.recipe4.time': string;
  'recipes.recipe4.desc': string;
  'recipes.askAI': string;
};

type Translations = Record<LangCode, TranslationKeys>;

export const translations: Translations = {
  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.ok': 'OK',
    'common.back': 'Back',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.required': 'Required',
    'common.comingSoon': 'Coming Soon',
    'tabs.games': 'Games',
    'tabs.schedule': 'Schedule',
    'tabs.sos': 'SOS',
    'tabs.chat': 'Chat',
    'tabs.help': 'Help',
    'tabs.profile': 'Profile',
    'auth.appName': 'BridgeApp',
    'auth.tagline': 'Connecting generations, one moment at a time',
    'auth.login': 'Log In',
    'auth.signup': 'Sign Up',
    'auth.fullName': 'Full Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.namePlaceholder': 'Enter your name',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': 'Enter password',
    'auth.confirmPlaceholder': 'Re-enter password',
    'auth.createAccount': 'Create Account',
    'auth.noAccount': "Don't have an account? ",
    'auth.hasAccount': 'Already have an account? ',
    'auth.secureFooter': 'Your data is securely stored and synced across devices',
    'auth.missingInfo': 'Missing Info',
    'auth.fillFields': 'Please fill in all fields.',
    'auth.missingName': 'Missing Name',
    'auth.enterName': 'Please enter your name.',
    'auth.passwordMismatch': "Passwords Don't Match",
    'auth.passwordMismatchMsg': 'Please make sure your passwords match.',
    'auth.weakPassword': 'Weak Password',
    'auth.weakPasswordMsg': 'Password must be at least 6 characters.',
    'auth.loginFailed': 'Login Failed',
    'auth.signupFailed': 'Sign Up Failed',
    'games.title': 'Games',
    'games.subtitle': 'Play together, bond forever',
    'games.featured': 'Featured Games',
    'games.moreGames': 'More Games',
    'games.startPlaying': 'Start Playing!',
    'games.challengeDesc': 'Challenge family and friends to a game',
    'games.chess': 'Chess',
    'games.chessDesc': 'Classic strategy game. Challenge your mind!',
    'games.connectFour': 'Connect Four',
    'games.connectFourDesc': 'Drop discs and connect four in a row to win!',
    'games.poker': 'Poker',
    'games.pokerDesc': 'Texas Hold\'em - bluff, bet, and win big!',
    'games.ticTacToe': 'Tic-Tac-Toe',
    'games.checkers': 'Checkers',
    'games.wordSearch': 'Word Search',
    'games.trivia': 'Trivia',
    'games.players': 'players',
    'games.strategy': 'Strategy',
    'games.easy': 'Easy',
    'games.medium': 'Medium',
    'games.classic': 'Classic',
    'games.fun': 'Fun',
    'games.quick': 'Quick',
    'games.cards': 'Cards',
    'games.bluffing': 'Bluffing',
    'schedule.title': 'Schedule',
    'schedule.newEvent': 'New Event',
    'schedule.editEvent': 'Edit Event',
    'schedule.eventTitle': 'Event Title *',
    'schedule.eventTitlePlaceholder': 'e.g. Chess with Grandpa',
    'schedule.date': 'Date',
    'schedule.datePlaceholder': 'YYYY-MM-DD',
    'schedule.time': 'Time',
    'schedule.timePlaceholder': 'e.g. 3:00 PM',
    'schedule.description': 'Description',
    'schedule.descPlaceholder': 'Add details...',
    'schedule.eventColor': 'Event Color',
    'schedule.reminderNote': "You'll be reminded 15 minutes before this event.",
    'schedule.todayEvents': "Today's Events",
    'schedule.noEvents': 'No events this day',
    'schedule.upcoming': 'Upcoming',
    'schedule.deleteEvent': 'Delete Event',
    'schedule.deleteConfirm': 'Delete this event?',
    'schedule.saved': 'Saved!',
    'schedule.titleRequired': 'Please enter an event title.',
    'chat.title': 'Messages',
    'chat.connections': 'connections',
    'chat.searchPlaceholder': 'Search conversations...',
    'chat.onlineNow': 'Online Now',
    'chat.noOneOnline': 'No one online right now',
    'chat.noConversations': 'No conversations yet',
    'chat.startChatting': 'Start chatting with family and friends!',
    'conversation.online': 'Online',
    'conversation.offline': 'Offline',
    'conversation.typePlaceholder': 'Type a message...',
    'sos.title': 'Emergency SOS',
    'sos.subtitle': 'Hold the button for 2 seconds to alert all emergency contacts',
    'sos.buttonText': 'SOS',
    'sos.holdHint': 'Hold 2s',
    'sos.sending': 'SENDING...',
    'sos.sent': 'SENT',
    'sos.holdToSend': 'Hold the button to send emergency alert',
    'sos.lastLocation': 'Last known location',
    'sos.willAlert': 'Will Alert',
    'sos.noContacts': 'No emergency contacts added yet. Go to Profile to add some.',
    'sos.noContactsMsg': 'Please add emergency contacts in your Profile before sending SOS.',
    'sos.fullyAutomatic': 'Fully Automatic',
    'sos.automaticDesc': 'SMS and email are sent automatically through our server — no compose screens, no extra taps. Just hold the SOS button and your contacts are notified instantly.',
    'sos.smsViaTwilio': 'SMS via Twilio',
    'sos.emailViaGmail': 'Email via Gmail',
    'sos.emergencyServices': 'Emergency Services',
    'sos.call911': 'Call 911',
    'sos.crisis988': 'Crisis 988',
    'sos.sosSent': 'SOS Sent!',
    'sos.sosIssues': 'SOS Issues',
    'sos.sendError': 'Error',
    'sos.sendErrorMsg': 'Failed to send SOS. Please call emergency services directly.',
    'profile.title': 'My Profile',
    'profile.fullName': 'Full Name',
    'profile.namePlaceholder': 'Your full name',
    'profile.age': 'Age',
    'profile.agePlaceholder': 'Your age',
    'profile.bio': 'Bio',
    'profile.bioPlaceholder': 'Tell us about yourself...',
    'profile.iAmA': 'I am a...',
    'profile.senior': 'Senior',
    'profile.youth': 'Child / Youth',
    'profile.saveProfile': 'Save Profile',
    'profile.saved': 'Saved!',
    'profile.savedMsg': 'Your profile has been updated.',
    'profile.nameRequired': 'Name required',
    'profile.nameRequiredMsg': 'Please enter your name.',
    'profile.quickActions': 'Quick Actions',
    'profile.emergencyContacts': 'Emergency Contacts',
    'profile.emergencyContactsSub': 'Manage your emergency contacts',
    'profile.gameStats': 'Game Stats',
    'profile.gameStatsSub': 'View your game history',
    'profile.settings': 'Settings',
    'profile.settingsSub': 'App preferences & notifications',
    'profile.language': 'Language',
    'profile.languageSub': 'Change app language',
    'profile.logOut': 'Log Out',
    'profile.logOutConfirm': 'Log Out',
    'profile.logOutMsg': 'Are you sure you want to log out? Your data is saved.',
    'profile.changePhoto': 'Change Photo',
    'profile.camera': 'Camera',
    'profile.photoLibrary': 'Photo Library',
    'emergency.title': 'Emergency Contacts',
    'emergency.subtitle': 'People who will be alerted in an SOS',
    'emergency.noContacts': 'No Emergency Contacts',
    'emergency.noContactsDesc': 'Add contacts who will receive your location and alert when you press SOS.',
    'emergency.addFirst': 'Add First Contact',
    'emergency.primary': 'Primary',
    'emergency.newContact': 'New Contact',
    'emergency.editContact': 'Edit Contact',
    'emergency.fullName': 'Full Name *',
    'emergency.namePlaceholder': "Contact's full name",
    'emergency.phone': 'Phone Number *',
    'emergency.phonePlaceholder': '+1 (555) 000-0000',
    'emergency.emailLabel': 'Email Address',
    'emergency.emailPlaceholder': 'email@example.com',
    'emergency.relationship': 'Relationship',
    'emergency.family': 'Family',
    'emergency.spouse': 'Spouse',
    'emergency.parent': 'Parent',
    'emergency.sibling': 'Sibling',
    'emergency.friend': 'Friend',
    'emergency.caregiver': 'Caregiver',
    'emergency.doctor': 'Doctor',
    'emergency.other': 'Other',
    'emergency.namePhoneRequired': 'Name and phone are required.',
    'emergency.removeContact': 'Remove Contact',
    'emergency.removeConfirm': 'Remove from emergency contacts?',
    'emergency.infoText': 'In an SOS emergency, all contacts will receive a text message and email with your GPS location.',
    'help.title': 'How to Use BridgeApp',
    'help.subtitle': 'Simple step-by-step instructions',
    'help.readAll': 'Read All Instructions Aloud',
    'help.stopReading': 'Stop Reading',
    'help.quickTips': 'Quick Tips',
    'help.tip1': 'The bottom bar lets you switch between all sections of the app.',
    'help.tip2': 'Your data is saved automatically — no need to worry about losing anything.',
    'help.tip3': 'Use the microphone button for hands-free navigation.',
    'help.tip4': 'If something goes wrong, close and reopen the app.',
    'help.sectionProfile': 'Your Profile',
    'help.sectionSOS': 'SOS Emergency',
    'help.sectionSchedule': 'Schedule & Reminders',
    'help.sectionChat': 'Chat & Messages',
    'help.sectionGames': 'Games',
    'help.sectionVoice': 'Voice Commands',
    'help.sectionAccount': 'Account & Login',
    'voice.title': 'Voice Commands',
    'voice.listening': 'Listening...',
    'voice.sendingSOS': 'Sending SOS...',
    'voice.tapToListen': 'Tap to Listen',
    'voice.trySaying': 'Try saying:',
    'voice.contactingContacts': 'Contacting your emergency contacts...',
    'voice.notUnderstood': 'I didn\'t understand that. Try again.',
    'voice.micDenied': 'Microphone access denied. Please allow microphone permission.',
    'voice.webOnly': 'Voice commands work best on web. Try saying a command in your browser!',

    // Diet & Wellness
    'tabs.diet': 'Compass',
    'diet.title': 'Diet & Wellness',
    'diet.subtitle': 'Healthy eating tips and AI-powered nutrition advice',
    'diet.dailyTips': 'Daily Nutrition Tips',
    'diet.sampleMeals': 'Sample Meal Ideas',
    'diet.tipWater': 'Stay Hydrated',
    'diet.tipWaterDesc': 'Drink 6-8 glasses of water daily. Add lemon or fruit for flavor.',
    'diet.tipFruits': 'Eat More Fruits',
    'diet.tipFruitsDesc': 'Aim for 2-3 servings of colorful fruits every day.',
    'diet.tipGrains': 'Whole Grains',
    'diet.tipGrainsDesc': 'Choose brown rice, oats, and whole wheat bread over refined grains.',
    'diet.tipProtein': 'Lean Protein',
    'diet.tipProteinDesc': 'Include fish, chicken, beans, or tofu in your meals.',
    'diet.tipDairy': 'Calcium Rich',
    'diet.tipDairyDesc': 'Milk, yogurt, and cheese help keep bones strong.',
    'diet.tipSugar': 'Limit Sugar',
    'diet.tipSugarDesc': 'Reduce sugary drinks and snacks. Try fresh fruit instead.',
    'diet.breakfast': 'Breakfast',
    'diet.breakfastItems': 'Oatmeal with berries, whole wheat toast with avocado, or yogurt with granola',
    'diet.lunch': 'Lunch',
    'diet.lunchItems': 'Grilled chicken salad, vegetable soup with bread, or a turkey sandwich',
    'diet.dinner': 'Dinner',
    'diet.dinnerItems': 'Baked salmon with vegetables, stir-fry with brown rice, or pasta with tomato sauce',
    'diet.snacks': 'Snacks',
    'diet.snackItems': 'Nuts, fresh fruit, hummus with veggies, or cheese with crackers',
    'diet.disclaimer': 'This information is for general wellness only. Always consult your doctor or dietitian for personalized dietary advice.',
    'diet.aiCardTitle': 'Compass AI',
    'diet.aiCardDesc': 'Ask me anything!',
    'diet.aiTitle': 'Compass AI',
    'diet.aiSubtitle': 'Your AI Assistant',
    'diet.chatEmpty': 'Ask me anything — health, tech, daily life, or just chat!',
    'diet.aiTyping': 'Thinking...',
    'diet.inputPlaceholder': 'Ask me anything...',
    'diet.aiError': 'Sorry, I could not get a response. Please try again.',
    'diet.q1': 'What should I eat for breakfast?',
    'diet.q2': 'How can I eat healthier on a budget?',
    'diet.q3': 'What foods help with energy?',
    'diet.q4': 'Best snacks for seniors?',
    'diet.q5': 'Help me plan my day',
    'diet.q6': 'How do I use this app?',
    // Compass AI
    'ai.title': 'Compass AI',
    'ai.subtitle': 'Your AI Assistant',
    'ai.tabChat': 'Chat',
    'ai.tabDiet': 'Nutrition',
    'ai.tabRecipes': 'Recipes',
    'ai.chatWelcome': 'Hi! I\'m Compass AI \u{1F9ED}',
    'ai.chatDesc': 'Ask me about anything \u2014 health, technology, daily life, recipes, or just have a chat!',
    'ai.inputPlaceholder': 'Ask me anything...',
    'ai.topicDiet': 'Nutrition',
    'ai.topicExercise': 'Exercise',
    'ai.topicHealth': 'Health',
    'ai.topicTech': 'Tech Help',
    'ai.topicChat': 'Just Chat',
    'ai.topicGames': 'Game Tips',
    'ai.promptDiet': 'What should I eat today for a balanced diet?',
    'ai.promptExercise': 'What are some gentle exercises I can do at home?',
    'ai.promptHealth': 'How can I improve my sleep quality?',
    'ai.promptTech': 'How do I send a photo to someone on my phone?',
    'ai.promptChat': 'Tell me something interesting that happened today in history',
    'ai.promptGames': 'What are some tips for winning at chess?',
    'ai.voiceThinking': 'Let me think about that...',
    // Recipes
    'recipes.title': 'Featured Recipes',
    'recipes.subtitle': 'Delicious dishes to brighten your day',
    'recipes.featured': 'Today\'s Picks',
    'recipes.recipe1.name': 'Classic Chicken Noodle Soup',
    'recipes.recipe1.time': '45 min',
    'recipes.recipe1.desc': 'A warm, comforting bowl of homemade chicken soup with egg noodles and fresh vegetables.',
    'recipes.recipe2.name': 'Fluffy Blueberry Pancakes',
    'recipes.recipe2.time': '20 min',
    'recipes.recipe2.desc': 'Light and fluffy pancakes bursting with fresh blueberries, served with maple syrup.',
    'recipes.recipe3.name': 'Garlic Butter Shrimp Pasta',
    'recipes.recipe3.time': '25 min',
    'recipes.recipe3.desc': 'Succulent shrimp tossed in garlic butter sauce with linguine and fresh parsley.',
    'recipes.recipe4.name': 'Homemade Apple Pie',
    'recipes.recipe4.time': '90 min',
    'recipes.recipe4.desc': 'A classic American apple pie with a flaky golden crust and cinnamon-spiced filling.',
    'recipes.askAI': 'Ask Compass AI for the full recipe and step-by-step instructions!',
  },

  zh: {
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.close': '关闭',
    'common.ok': '确定',
    'common.back': '返回',
    'common.search': '搜索',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.required': '必填',
    'common.comingSoon': '即将推出',
    'tabs.games': '游戏',
    'tabs.schedule': '日程',
    'tabs.sos': '求救',
    'tabs.chat': '聊天',
    'tabs.help': '帮助',
    'tabs.profile': '我的',
    'auth.appName': 'BridgeApp',
    'auth.tagline': '连接代际，一刻一情',
    'auth.login': '登录',
    'auth.signup': '注册',
    'auth.fullName': '姓名',
    'auth.email': '邮箱',
    'auth.password': '密码',
    'auth.confirmPassword': '确认密码',
    'auth.namePlaceholder': '请输入您的姓名',
    'auth.emailPlaceholder': 'your@email.com',
    'auth.passwordPlaceholder': '请输入密码',
    'auth.confirmPlaceholder': '请再次输入密码',
    'auth.createAccount': '创建账号',
    'auth.noAccount': '还没有账号？',
    'auth.hasAccount': '已有账号？',
    'auth.secureFooter': '您的数据安全存储并跨设备同步',
    'auth.missingInfo': '信息缺失',
    'auth.fillFields': '请填写所有字段。',
    'auth.missingName': '缺少姓名',
    'auth.enterName': '请输入您的姓名。',
    'auth.passwordMismatch': '密码不匹配',
    'auth.passwordMismatchMsg': '请确保两次输入的密码一致。',
    'auth.weakPassword': '密码太弱',
    'auth.weakPasswordMsg': '密码至少需要6个字符。',
    'auth.loginFailed': '登录失败',
    'auth.signupFailed': '注册失败',
    'games.title': '游戏',
    'games.subtitle': '一起玩，永远在一起',
    'games.featured': '精选游戏',
    'games.moreGames': '更多游戏',
    'games.startPlaying': '开始玩吧！',
    'games.challengeDesc': '邀请家人朋友来一场游戏',
    'games.chess': '国际象棋',
    'games.chessDesc': '经典策略游戏，挑战你的思维！',
    'games.connectFour': '四子棋',
    'games.connectFourDesc': '投放棋子，四子连珠即获胜！',
    'games.poker': '扑克',
    'games.pokerDesc': '德州扑克 - 虚张声势，下注赢大！',
    'games.ticTacToe': '井字棋',
    'games.checkers': '跳棋',
    'games.wordSearch': '找字游戏',
    'games.trivia': '知识问答',
    'games.players': '玩家',
    'games.strategy': '策略',
    'games.easy': '简单',
    'games.medium': '中等',
    'games.classic': '经典',
    'games.fun': '有趣',
    'games.quick': '快速',
    'games.cards': '纸牌',
    'games.bluffing': '诈唬',
    'schedule.title': '日程表',
    'schedule.newEvent': '新建事件',
    'schedule.editEvent': '编辑事件',
    'schedule.eventTitle': '事件标题 *',
    'schedule.eventTitlePlaceholder': '例如：和爷爷下棋',
    'schedule.date': '日期',
    'schedule.datePlaceholder': '年-月-日',
    'schedule.time': '时间',
    'schedule.timePlaceholder': '例如：下午3:00',
    'schedule.description': '描述',
    'schedule.descPlaceholder': '添加详情...',
    'schedule.eventColor': '事件颜色',
    'schedule.reminderNote': '系统将在事件开始前15分钟提醒您。',
    'schedule.todayEvents': '今日事件',
    'schedule.noEvents': '今天没有事件',
    'schedule.upcoming': '即将到来',
    'schedule.deleteEvent': '删除事件',
    'schedule.deleteConfirm': '确定删除此事件？',
    'schedule.saved': '已保存！',
    'schedule.titleRequired': '请输入事件标题。',
    'chat.title': '消息',
    'chat.connections': '位好友',
    'chat.searchPlaceholder': '搜索对话...',
    'chat.onlineNow': '在线好友',
    'chat.noOneOnline': '目前没有好友在线',
    'chat.noConversations': '暂无对话',
    'chat.startChatting': '开始与家人朋友聊天吧！',
    'conversation.online': '在线',
    'conversation.offline': '离线',
    'conversation.typePlaceholder': '输入消息...',
    'sos.title': '紧急求救',
    'sos.subtitle': '按住按钮2秒钟即可通知所有紧急联系人',
    'sos.buttonText': '求救',
    'sos.holdHint': '按住2秒',
    'sos.sending': '发送中...',
    'sos.sent': '已发送',
    'sos.holdToSend': '按住按钮发送紧急警报',
    'sos.lastLocation': '最近位置',
    'sos.willAlert': '将通知',
    'sos.noContacts': '尚未添加紧急联系人。请到个人资料中添加。',
    'sos.noContactsMsg': '请在个人资料中添加紧急联系人后再发送求救。',
    'sos.fullyAutomatic': '全自动发送',
    'sos.automaticDesc': '短信和邮件通过服务器自动发送 - 无需打开编辑界面，无需额外操作。只需按住SOS按钮，联系人即刻收到通知。',
    'sos.smsViaTwilio': '通过Twilio发送短信',
    'sos.emailViaGmail': '通过Gmail发送邮件',
    'sos.emergencyServices': '紧急服务',
    'sos.call911': '拨打911',
    'sos.crisis988': '危机热线988',
    'sos.sosSent': '求救已发送！',
    'sos.sosIssues': '求救问题',
    'sos.sendError': '错误',
    'sos.sendErrorMsg': '发送求救失败。请直接拨打急救电话。',
    'profile.title': '我的资料',
    'profile.fullName': '姓名',
    'profile.namePlaceholder': '您的姓名',
    'profile.age': '年龄',
    'profile.agePlaceholder': '您的年龄',
    'profile.bio': '简介',
    'profile.bioPlaceholder': '介绍一下自己...',
    'profile.iAmA': '我是...',
    'profile.senior': '长辈',
    'profile.youth': '青少年',
    'profile.saveProfile': '保存资料',
    'profile.saved': '已保存！',
    'profile.savedMsg': '您的资料已更新。',
    'profile.nameRequired': '需要姓名',
    'profile.nameRequiredMsg': '请输入您的姓名。',
    'profile.quickActions': '快捷操作',
    'profile.emergencyContacts': '紧急联系人',
    'profile.emergencyContactsSub': '管理您的紧急联系人',
    'profile.gameStats': '游戏统计',
    'profile.gameStatsSub': '查看您的游戏记录',
    'profile.settings': '设置',
    'profile.settingsSub': '应用偏好和通知',
    'profile.language': '语言',
    'profile.languageSub': '更改应用语言',
    'profile.logOut': '退出登录',
    'profile.logOutConfirm': '退出登录',
    'profile.logOutMsg': '确定要退出登录吗？您的数据已保存。',
    'profile.changePhoto': '更换头像',
    'profile.camera': '相机',
    'profile.photoLibrary': '照片库',
    'emergency.title': '紧急联系人',
    'emergency.subtitle': '紧急求救时将通知的人',
    'emergency.noContacts': '无紧急联系人',
    'emergency.noContactsDesc': '添加联系人，SOS求救时他们将收到您的位置和警报。',
    'emergency.addFirst': '添加第一个联系人',
    'emergency.primary': '主要',
    'emergency.newContact': '新联系人',
    'emergency.editContact': '编辑联系人',
    'emergency.fullName': '姓名 *',
    'emergency.namePlaceholder': '联系人姓名',
    'emergency.phone': '电话 *',
    'emergency.phonePlaceholder': '+86 138 0000 0000',
    'emergency.emailLabel': '邮箱',
    'emergency.emailPlaceholder': 'email@example.com',
    'emergency.relationship': '关系',
    'emergency.family': '家人',
    'emergency.spouse': '配偶',
    'emergency.parent': '父母',
    'emergency.sibling': '兄弟姐妹',
    'emergency.friend': '朋友',
    'emergency.caregiver': '护理人',
    'emergency.doctor': '医生',
    'emergency.other': '其他',
    'emergency.namePhoneRequired': '姓名和电话为必填项。',
    'emergency.removeContact': '移除联系人',
    'emergency.removeConfirm': '确定从紧急联系人中移除？',
    'emergency.infoText': '紧急求救时，所有联系人将收到包含您GPS位置的短信和邮件。',
    'help.title': '如何使用BridgeApp',
    'help.subtitle': '简单的分步说明',
    'help.readAll': '朗读所有说明',
    'help.stopReading': '停止朗读',
    'help.quickTips': '快速提示',
    'help.tip1': '底部导航栏可以切换应用的各个部分。',
    'help.tip2': '数据自动保存，不用担心丢失。',
    'help.tip3': '使用麦克风按钮进行免提导航。',
    'help.tip4': '如果出现问题，关闭并重新打开应用。',
    'help.sectionProfile': '个人资料',
    'help.sectionSOS': '紧急求救',
    'help.sectionSchedule': '日程和提醒',
    'help.sectionChat': '聊天和消息',
    'help.sectionGames': '游戏',
    'help.sectionVoice': '语音命令',
    'help.sectionAccount': '账号和登录',
    'voice.title': '语音命令',
    'voice.listening': '正在聆听...',
    'voice.sendingSOS': '正在发送求救...',
    'voice.tapToListen': '点击开始聆听',
    'voice.trySaying': '试试说：',
    'voice.contactingContacts': '正在联系紧急联系人...',
    'voice.notUnderstood': '没有理解，请再试一次。',
    'voice.micDenied': '麦克风权限被拒绝。请允许麦克风访问。',
    'voice.webOnly': '语音命令在网页浏览器中效果最佳！',

    // Diet
    'tabs.diet': '指南针',
    'diet.title': '饮食与健康',
    'diet.subtitle': '健康饮食建议和AI营养咨询',
    'diet.dailyTips': '每日营养建议',
    'diet.sampleMeals': '推荐菜谱',
    'diet.tipWater': '多喝水', 'diet.tipWaterDesc': '每天喝6-8杯水，可以加柠檬或水果调味。',
    'diet.tipFruits': '多吃水果', 'diet.tipFruitsDesc': '每天吃2-3份色彩丰富的水果。',
    'diet.tipGrains': '全谷物', 'diet.tipGrainsDesc': '选择糙米、燕麦和全麦面包代替精制谷物。',
    'diet.tipProtein': '优质蛋白质', 'diet.tipProteinDesc': '在饮食中加入鱼、鸡肉、豆类或豆腐。',
    'diet.tipDairy': '富含钙质', 'diet.tipDairyDesc': '牛奶、酸奶和奶酪有助于骨骼健康。',
    'diet.tipSugar': '少吃糖', 'diet.tipSugarDesc': '减少含糖饮料和零食，改吃新鲜水果。',
    'diet.breakfast': '早餐', 'diet.breakfastItems': '豆浆油条、小笼包、粥配咸菜，或鸡蛋饼',
    'diet.lunch': '午餐', 'diet.lunchItems': '红烧肉配米饭、牛肉面、或蔬菜炒饭',
    'diet.dinner': '晚餐', 'diet.dinnerItems': '清蒸鱼配时蔬、番茄蛋花汤、或饺子',
    'diet.snacks': '零食', 'diet.snackItems': '坚果、水果、红豆糕、或酸奶',
    'diet.disclaimer': '以上信息仅供一般健康参考。请务必咨询您的医生或营养师获取个性化饮食建议。',
    'diet.aiCardTitle': 'Compass AI', 'diet.aiCardDesc': '有什么都可以问我！',
    'diet.aiTitle': 'Compass AI', 'diet.aiSubtitle': '您的AI助手',
    'diet.chatEmpty': '什么都可以问我 — 健康、科技、日常生活、菜谱等等！',
    'diet.aiTyping': '思考中...', 'diet.inputPlaceholder': '有什么想问的...',
    'diet.aiError': '抱歉，无法获取回复。请重试。',
    'diet.q1': '早餐应该吃什么？', 'diet.q2': '怎么省钱又吃得健康？', 'diet.q3': '吃什么能提高精力？',
    'diet.q4': '适合老年人的零食推荐？', 'diet.q5': '帮我规划今天的安排', 'diet.q6': '这个应用怎么用？',
    'ai.title': 'Compass AI', 'ai.subtitle': '您的AI助手',
    'ai.tabChat': '聊天', 'ai.tabDiet': '营养', 'ai.tabRecipes': '菜谱',
    'ai.chatWelcome': '你好！我是Compass AI \u{1F9ED}',
    'ai.chatDesc': '什么都可以问我 — 健康、科技、日常生活、菜谱，或者聊聊天！',
    'ai.inputPlaceholder': '有什么想问的...',
    'ai.topicDiet': '营养', 'ai.topicExercise': '运动', 'ai.topicHealth': '健康',
    'ai.topicTech': '科技帮助', 'ai.topicChat': '聊天', 'ai.topicGames': '游戏攻略',
    'ai.promptDiet': '今天吃什么比较健康？',
    'ai.promptExercise': '在家可以做哪些简单的运动？',
    'ai.promptHealth': '怎么改善睡眠质量？',
    'ai.promptTech': '怎么用手机发照片给别人？',
    'ai.promptChat': '讲讲今天历史上发生了什么有趣的事',
    'ai.promptGames': '下棋有什么技巧？',
    'ai.voiceThinking': '让我想想...',
    'recipes.title': '精选菜谱', 'recipes.subtitle': '美味佳肴，温暖人心',
    'recipes.featured': '今日推荐',
    'recipes.recipe1.name': '红烧排骨', 'recipes.recipe1.time': '60分钟',
    'recipes.recipe1.desc': '色泽红亮、肉质酥烂的经典家常菜，配上米饭绝了。',
    'recipes.recipe2.name': '葱油拌面', 'recipes.recipe2.time': '15分钟',
    'recipes.recipe2.desc': '简单又美味，浓郁的葱油香气让人食欲大开。',
    'recipes.recipe3.name': '麻婆豆腐', 'recipes.recipe3.time': '20分钟',
    'recipes.recipe3.desc': '麻辣鲜香的经典川菜，嫩滑的豆腐配上肉末，超下饭。',
    'recipes.recipe4.name': '蛋挞', 'recipes.recipe4.time': '45分钟',
    'recipes.recipe4.desc': '酥脆的外皮包裹着丝滑的蛋奶馅，甜而不腻。',
    'recipes.askAI': '向Compass AI询问详细食谱和做法步骤！',
  },

  'zh-TW': {
    'common.save': '儲存', 'common.cancel': '取消', 'common.delete': '刪除', 'common.edit': '編輯', 'common.close': '關閉', 'common.ok': '確定', 'common.back': '返回', 'common.search': '搜尋', 'common.loading': '載入中...', 'common.error': '錯誤', 'common.success': '成功', 'common.required': '必填', 'common.comingSoon': '即將推出',
    'tabs.games': '遊戲', 'tabs.schedule': '行程', 'tabs.sos': '求救', 'tabs.chat': '聊天', 'tabs.help': '幫助', 'tabs.profile': '我的',
    'auth.appName': 'BridgeApp', 'auth.tagline': '連結世代，一刻一情', 'auth.login': '登入', 'auth.signup': '註冊', 'auth.fullName': '姓名', 'auth.email': '電子郵件', 'auth.password': '密碼', 'auth.confirmPassword': '確認密碼', 'auth.namePlaceholder': '請輸入您的姓名', 'auth.emailPlaceholder': 'your@email.com', 'auth.passwordPlaceholder': '請輸入密碼', 'auth.confirmPlaceholder': '請再次輸入密碼', 'auth.createAccount': '建立帳號', 'auth.noAccount': '還沒有帳號？', 'auth.hasAccount': '已有帳號？', 'auth.secureFooter': '您的資料安全儲存並跨裝置同步', 'auth.missingInfo': '資訊缺失', 'auth.fillFields': '請填寫所有欄位。', 'auth.missingName': '缺少姓名', 'auth.enterName': '請輸入您的姓名。', 'auth.passwordMismatch': '密碼不匹配', 'auth.passwordMismatchMsg': '請確保兩次輸入的密碼一致。', 'auth.weakPassword': '密碼太弱', 'auth.weakPasswordMsg': '密碼至少需要6個字元。', 'auth.loginFailed': '登入失敗', 'auth.signupFailed': '註冊失敗',
    'games.title': '遊戲', 'games.subtitle': '一起玩，永遠在一起', 'games.featured': '精選遊戲', 'games.moreGames': '更多遊戲', 'games.startPlaying': '開始遊戲！', 'games.challengeDesc': '邀請家人朋友來場遊戲', 'games.chess': '國際象棋', 'games.chessDesc': '經典策略遊戲，挑戰你的思維！', 'games.connectFour': '四子棋', 'games.connectFourDesc': '投放棋子，四子連珠即獲勝！', 'games.poker': '撲克', 'games.pokerDesc': '德州撲克 - 虛張聲勢，下注贏大！', 'games.ticTacToe': '井字棋', 'games.checkers': '跳棋', 'games.wordSearch': '找字遊戲', 'games.trivia': '知識問答', 'games.players': '玩家', 'games.strategy': '策略', 'games.easy': '簡單', 'games.medium': '中等', 'games.classic': '經典', 'games.fun': '有趣', 'games.quick': '快速', 'games.cards': '紙牌', 'games.bluffing': '詐唬',
    'schedule.title': '行程表', 'schedule.newEvent': '新建事件', 'schedule.editEvent': '編輯事件', 'schedule.eventTitle': '事件標題 *', 'schedule.eventTitlePlaceholder': '例如：和爺爺下棋', 'schedule.date': '日期', 'schedule.datePlaceholder': '年-月-日', 'schedule.time': '時間', 'schedule.timePlaceholder': '例如：下午3:00', 'schedule.description': '描述', 'schedule.descPlaceholder': '新增詳情...', 'schedule.eventColor': '事件顏色', 'schedule.reminderNote': '系統將在事件開始前15分鐘提醒您。', 'schedule.todayEvents': '今日事件', 'schedule.noEvents': '今天沒有事件', 'schedule.upcoming': '即將到來', 'schedule.deleteEvent': '刪除事件', 'schedule.deleteConfirm': '確定刪除此事件？', 'schedule.saved': '已儲存！', 'schedule.titleRequired': '請輸入事件標題。',
    'chat.title': '訊息', 'chat.connections': '位好友', 'chat.searchPlaceholder': '搜尋對話...', 'chat.onlineNow': '線上好友', 'chat.noOneOnline': '目前沒有好友在線', 'chat.noConversations': '暫無對話', 'chat.startChatting': '開始與家人朋友聊天吧！',
    'conversation.online': '線上', 'conversation.offline': '離線', 'conversation.typePlaceholder': '輸入訊息...',
    'sos.title': '緊急求救', 'sos.subtitle': '按住按鈕2秒鐘即可通知所有緊急聯絡人', 'sos.buttonText': '求救', 'sos.holdHint': '按住2秒', 'sos.sending': '傳送中...', 'sos.sent': '已傳送', 'sos.holdToSend': '按住按鈕傳送緊急警報', 'sos.lastLocation': '最近位置', 'sos.willAlert': '將通知', 'sos.noContacts': '尚未新增緊急聯絡人。請到個人資料中新增。', 'sos.noContactsMsg': '請在個人資料中新增緊急聯絡人後再傳送求救。', 'sos.fullyAutomatic': '全自動傳送', 'sos.automaticDesc': '簡訊和郵件透過伺服器自動傳送 - 無需開啟編輯界面，無需額外操作。', 'sos.smsViaTwilio': '透過Twilio傳送簡訊', 'sos.emailViaGmail': '透過Gmail傳送郵件', 'sos.emergencyServices': '緊急服務', 'sos.call911': '撥打911', 'sos.crisis988': '危機熱線988', 'sos.sosSent': '求救已傳送！', 'sos.sosIssues': '求救問題', 'sos.sendError': '錯誤', 'sos.sendErrorMsg': '傳送求救失敗。請直接撥打急救電話。',
    'profile.title': '我的資料', 'profile.fullName': '姓名', 'profile.namePlaceholder': '您的姓名', 'profile.age': '年齡', 'profile.agePlaceholder': '您的年齡', 'profile.bio': '簡介', 'profile.bioPlaceholder': '介紹一下自己...', 'profile.iAmA': '我是...', 'profile.senior': '長輩', 'profile.youth': '青少年', 'profile.saveProfile': '儲存資料', 'profile.saved': '已儲存！', 'profile.savedMsg': '您的資料已更新。', 'profile.nameRequired': '需要姓名', 'profile.nameRequiredMsg': '請輸入您的姓名。', 'profile.quickActions': '快捷操作', 'profile.emergencyContacts': '緊急聯絡人', 'profile.emergencyContactsSub': '管理您的緊急聯絡人', 'profile.gameStats': '遊戲統計', 'profile.gameStatsSub': '查看您的遊戲記錄', 'profile.settings': '設定', 'profile.settingsSub': '應用偏好和通知', 'profile.language': '語言', 'profile.languageSub': '更改應用語言', 'profile.logOut': '登出', 'profile.logOutConfirm': '登出', 'profile.logOutMsg': '確定要登出嗎？您的資料已儲存。', 'profile.changePhoto': '更換頭像', 'profile.camera': '相機', 'profile.photoLibrary': '照片庫',
    'emergency.title': '緊急聯絡人', 'emergency.subtitle': '緊急求救時將通知的人', 'emergency.noContacts': '無緊急聯絡人', 'emergency.noContactsDesc': '新增聯絡人，SOS求救時他們將收到您的位置和警報。', 'emergency.addFirst': '新增第一個聯絡人', 'emergency.primary': '主要', 'emergency.newContact': '新聯絡人', 'emergency.editContact': '編輯聯絡人', 'emergency.fullName': '姓名 *', 'emergency.namePlaceholder': '聯絡人姓名', 'emergency.phone': '電話 *', 'emergency.phonePlaceholder': '+886 912 345 678', 'emergency.emailLabel': '電子郵件', 'emergency.emailPlaceholder': 'email@example.com', 'emergency.relationship': '關係', 'emergency.family': '家人', 'emergency.spouse': '配偶', 'emergency.parent': '父母', 'emergency.sibling': '兄弟姐妹', 'emergency.friend': '朋友', 'emergency.caregiver': '護理人', 'emergency.doctor': '醫生', 'emergency.other': '其他', 'emergency.namePhoneRequired': '姓名和電話為必填項。', 'emergency.removeContact': '移除聯絡人', 'emergency.removeConfirm': '確定從緊急聯絡人中移除？', 'emergency.infoText': '緊急求救時，所有聯絡人將收到包含您GPS位置的簡訊和郵件。',
    'help.title': '如何使用BridgeApp', 'help.subtitle': '簡單的分步說明', 'help.readAll': '朗讀所有說明', 'help.stopReading': '停止朗讀', 'help.quickTips': '快速提示', 'help.tip1': '底部導航欄可以切換應用的各個部分。', 'help.tip2': '資料自動儲存，不用擔心遺失。', 'help.tip3': '使用麥克風按鈕進行免提導航。', 'help.tip4': '如果出現問題，關閉並重新開啟應用。', 'help.sectionProfile': '個人資料', 'help.sectionSOS': '緊急求救', 'help.sectionSchedule': '行程和提醒', 'help.sectionChat': '聊天和訊息', 'help.sectionGames': '遊戲', 'help.sectionVoice': '語音命令', 'help.sectionAccount': '帳號和登入',
    'voice.title': '語音命令', 'voice.listening': '正在聆聽...', 'voice.sendingSOS': '正在傳送求救...', 'voice.tapToListen': '點擊開始聆聽', 'voice.trySaying': '試試說：', 'voice.contactingContacts': '正在聯繫緊急聯絡人...', 'voice.notUnderstood': '沒有理解，請再試一次。', 'voice.micDenied': '麥克風權限被拒絕。請允許麥克風存取。', 'voice.webOnly': '語音命令在網頁瀏覽器中效果最佳！',
  },

  es: {
    'common.save': 'Guardar', 'common.cancel': 'Cancelar', 'common.delete': 'Eliminar', 'common.edit': 'Editar', 'common.close': 'Cerrar', 'common.ok': 'OK', 'common.back': 'Volver', 'common.search': 'Buscar', 'common.loading': 'Cargando...', 'common.error': 'Error', 'common.success': 'Éxito', 'common.required': 'Requerido', 'common.comingSoon': 'Próximamente',
    'tabs.games': 'Juegos', 'tabs.schedule': 'Horario', 'tabs.sos': 'SOS', 'tabs.chat': 'Chat', 'tabs.help': 'Ayuda', 'tabs.profile': 'Perfil',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Conectando generaciones, un momento a la vez', 'auth.login': 'Iniciar Sesión', 'auth.signup': 'Registrarse', 'auth.fullName': 'Nombre Completo', 'auth.email': 'Correo', 'auth.password': 'Contraseña', 'auth.confirmPassword': 'Confirmar Contraseña', 'auth.namePlaceholder': 'Ingrese su nombre', 'auth.emailPlaceholder': 'tu@correo.com', 'auth.passwordPlaceholder': 'Ingrese contraseña', 'auth.confirmPlaceholder': 'Reingrese contraseña', 'auth.createAccount': 'Crear Cuenta', 'auth.noAccount': '¿No tienes cuenta? ', 'auth.hasAccount': '¿Ya tienes cuenta? ', 'auth.secureFooter': 'Tus datos se almacenan y sincronizan de forma segura', 'auth.missingInfo': 'Información Faltante', 'auth.fillFields': 'Por favor complete todos los campos.', 'auth.missingName': 'Falta Nombre', 'auth.enterName': 'Por favor ingrese su nombre.', 'auth.passwordMismatch': 'Contraseñas No Coinciden', 'auth.passwordMismatchMsg': 'Asegúrese de que las contraseñas coincidan.', 'auth.weakPassword': 'Contraseña Débil', 'auth.weakPasswordMsg': 'La contraseña debe tener al menos 6 caracteres.', 'auth.loginFailed': 'Inicio de Sesión Fallido', 'auth.signupFailed': 'Registro Fallido',
    'games.title': 'Juegos', 'games.subtitle': 'Juega juntos, unidos para siempre', 'games.featured': 'Juegos Destacados', 'games.moreGames': 'Más Juegos', 'games.startPlaying': '¡A jugar!', 'games.challengeDesc': 'Desafía a familia y amigos a un juego', 'games.chess': 'Ajedrez', 'games.chessDesc': '¡Juego de estrategia clásico. Desafía tu mente!', 'games.connectFour': 'Conecta Cuatro', 'games.connectFourDesc': '¡Coloca fichas y conecta cuatro en fila para ganar!', 'games.poker': 'Póker', 'games.pokerDesc': 'Texas Hold\'em - ¡farolea, apuesta y gana!', 'games.ticTacToe': 'Tres en Raya', 'games.checkers': 'Damas', 'games.wordSearch': 'Sopa de Letras', 'games.trivia': 'Trivia', 'games.players': 'jugadores', 'games.strategy': 'Estrategia', 'games.easy': 'Fácil', 'games.medium': 'Medio', 'games.classic': 'Clásico', 'games.fun': 'Divertido', 'games.quick': 'Rápido', 'games.cards': 'Cartas', 'games.bluffing': 'Farol',
    'schedule.title': 'Horario', 'schedule.newEvent': 'Nuevo Evento', 'schedule.editEvent': 'Editar Evento', 'schedule.eventTitle': 'Título del Evento *', 'schedule.eventTitlePlaceholder': 'ej. Ajedrez con el abuelo', 'schedule.date': 'Fecha', 'schedule.datePlaceholder': 'AAAA-MM-DD', 'schedule.time': 'Hora', 'schedule.timePlaceholder': 'ej. 3:00 PM', 'schedule.description': 'Descripción', 'schedule.descPlaceholder': 'Agregar detalles...', 'schedule.eventColor': 'Color del Evento', 'schedule.reminderNote': 'Se te recordará 15 minutos antes del evento.', 'schedule.todayEvents': 'Eventos de Hoy', 'schedule.noEvents': 'No hay eventos hoy', 'schedule.upcoming': 'Próximos', 'schedule.deleteEvent': 'Eliminar Evento', 'schedule.deleteConfirm': '¿Eliminar este evento?', 'schedule.saved': '¡Guardado!', 'schedule.titleRequired': 'Ingrese un título para el evento.',
    'chat.title': 'Mensajes', 'chat.connections': 'conexiones', 'chat.searchPlaceholder': 'Buscar conversaciones...', 'chat.onlineNow': 'En Línea Ahora', 'chat.noOneOnline': 'Nadie en línea ahora', 'chat.noConversations': 'Sin conversaciones aún', 'chat.startChatting': '¡Comienza a chatear con familia y amigos!',
    'conversation.online': 'En línea', 'conversation.offline': 'Desconectado', 'conversation.typePlaceholder': 'Escribe un mensaje...',
    'sos.title': 'SOS de Emergencia', 'sos.subtitle': 'Mantén presionado 2 segundos para alertar a todos tus contactos', 'sos.buttonText': 'SOS', 'sos.holdHint': 'Mantener 2s', 'sos.sending': 'ENVIANDO...', 'sos.sent': 'ENVIADO', 'sos.holdToSend': 'Mantén presionado para enviar alerta', 'sos.lastLocation': 'Última ubicación', 'sos.willAlert': 'Alertará a', 'sos.noContacts': 'No hay contactos de emergencia. Ve a Perfil para agregar.', 'sos.noContactsMsg': 'Agrega contactos de emergencia en tu Perfil antes de enviar SOS.', 'sos.fullyAutomatic': 'Totalmente Automático', 'sos.automaticDesc': 'SMS y email se envían automáticamente — sin pantallas de redacción, sin toques extra.', 'sos.smsViaTwilio': 'SMS vía Twilio', 'sos.emailViaGmail': 'Email vía Gmail', 'sos.emergencyServices': 'Servicios de Emergencia', 'sos.call911': 'Llamar 911', 'sos.crisis988': 'Crisis 988', 'sos.sosSent': '¡SOS Enviado!', 'sos.sosIssues': 'Problemas con SOS', 'sos.sendError': 'Error', 'sos.sendErrorMsg': 'Error al enviar SOS. Llame a emergencias directamente.',
    'profile.title': 'Mi Perfil', 'profile.fullName': 'Nombre Completo', 'profile.namePlaceholder': 'Tu nombre completo', 'profile.age': 'Edad', 'profile.agePlaceholder': 'Tu edad', 'profile.bio': 'Biografía', 'profile.bioPlaceholder': 'Cuéntanos sobre ti...', 'profile.iAmA': 'Soy un/a...', 'profile.senior': 'Adulto Mayor', 'profile.youth': 'Joven', 'profile.saveProfile': 'Guardar Perfil', 'profile.saved': '¡Guardado!', 'profile.savedMsg': 'Tu perfil ha sido actualizado.', 'profile.nameRequired': 'Nombre requerido', 'profile.nameRequiredMsg': 'Por favor ingresa tu nombre.', 'profile.quickActions': 'Acciones Rápidas', 'profile.emergencyContacts': 'Contactos de Emergencia', 'profile.emergencyContactsSub': 'Gestiona tus contactos de emergencia', 'profile.gameStats': 'Estadísticas', 'profile.gameStatsSub': 'Ver historial de juegos', 'profile.settings': 'Configuración', 'profile.settingsSub': 'Preferencias y notificaciones', 'profile.language': 'Idioma', 'profile.languageSub': 'Cambiar idioma de la app', 'profile.logOut': 'Cerrar Sesión', 'profile.logOutConfirm': 'Cerrar Sesión', 'profile.logOutMsg': '¿Seguro que deseas cerrar sesión? Tus datos están guardados.', 'profile.changePhoto': 'Cambiar Foto', 'profile.camera': 'Cámara', 'profile.photoLibrary': 'Galería',
    'emergency.title': 'Contactos de Emergencia', 'emergency.subtitle': 'Personas que serán alertadas en un SOS', 'emergency.noContacts': 'Sin Contactos', 'emergency.noContactsDesc': 'Agrega contactos que recibirán tu ubicación en una emergencia.', 'emergency.addFirst': 'Agregar Primer Contacto', 'emergency.primary': 'Principal', 'emergency.newContact': 'Nuevo Contacto', 'emergency.editContact': 'Editar Contacto', 'emergency.fullName': 'Nombre Completo *', 'emergency.namePlaceholder': 'Nombre del contacto', 'emergency.phone': 'Teléfono *', 'emergency.phonePlaceholder': '+1 (555) 000-0000', 'emergency.emailLabel': 'Correo', 'emergency.emailPlaceholder': 'email@ejemplo.com', 'emergency.relationship': 'Relación', 'emergency.family': 'Familia', 'emergency.spouse': 'Cónyuge', 'emergency.parent': 'Padre/Madre', 'emergency.sibling': 'Hermano/a', 'emergency.friend': 'Amigo/a', 'emergency.caregiver': 'Cuidador/a', 'emergency.doctor': 'Doctor/a', 'emergency.other': 'Otro', 'emergency.namePhoneRequired': 'Nombre y teléfono son requeridos.', 'emergency.removeContact': 'Eliminar Contacto', 'emergency.removeConfirm': '¿Eliminar de contactos de emergencia?', 'emergency.infoText': 'En una emergencia SOS, todos los contactos recibirán un SMS y email con tu ubicación GPS.',
    'help.title': 'Cómo Usar BridgeApp', 'help.subtitle': 'Instrucciones simples paso a paso', 'help.readAll': 'Leer Todas las Instrucciones', 'help.stopReading': 'Dejar de Leer', 'help.quickTips': 'Consejos Rápidos', 'help.tip1': 'La barra inferior te permite cambiar entre secciones.', 'help.tip2': 'Tus datos se guardan automáticamente.', 'help.tip3': 'Usa el botón del micrófono para navegación manos libres.', 'help.tip4': 'Si algo falla, cierra y reabre la app.', 'help.sectionProfile': 'Tu Perfil', 'help.sectionSOS': 'SOS de Emergencia', 'help.sectionSchedule': 'Horario y Recordatorios', 'help.sectionChat': 'Chat y Mensajes', 'help.sectionGames': 'Juegos', 'help.sectionVoice': 'Comandos de Voz', 'help.sectionAccount': 'Cuenta e Inicio de Sesión',
    'voice.title': 'Comandos de Voz', 'voice.listening': 'Escuchando...', 'voice.sendingSOS': 'Enviando SOS...', 'voice.tapToListen': 'Toca para Escuchar', 'voice.trySaying': 'Intenta decir:', 'voice.contactingContacts': 'Contactando a tus contactos de emergencia...', 'voice.notUnderstood': 'No entendí. Inténtalo de nuevo.', 'voice.micDenied': 'Acceso al micrófono denegado.', 'voice.webOnly': '¡Los comandos de voz funcionan mejor en el navegador web!',
    'tabs.diet': 'Compass',
    'diet.title': 'Dieta y Bienestar', 'diet.subtitle': 'Consejos de alimentación saludable',
    'diet.dailyTips': 'Consejos Diarios', 'diet.sampleMeals': 'Ideas de Comidas',
    'diet.tipWater': 'Hidratación', 'diet.tipWaterDesc': 'Bebe 6-8 vasos de agua al día.',
    'diet.tipFruits': 'Más Frutas', 'diet.tipFruitsDesc': 'Come 2-3 porciones de frutas al día.',
    'diet.tipGrains': 'Granos Integrales', 'diet.tipGrainsDesc': 'Elige arroz integral y pan integral.',
    'diet.tipProtein': 'Proteína Magra', 'diet.tipProteinDesc': 'Incluye pescado, pollo, frijoles o tofu.',
    'diet.tipDairy': 'Rico en Calcio', 'diet.tipDairyDesc': 'Leche, yogur y queso fortalecen los huesos.',
    'diet.tipSugar': 'Menos Azúcar', 'diet.tipSugarDesc': 'Reduce bebidas y snacks azucarados.',
    'diet.breakfast': 'Desayuno', 'diet.breakfastItems': 'Churros con chocolate, tostada con tomate, o huevos revueltos',
    'diet.lunch': 'Almuerzo', 'diet.lunchItems': 'Paella, ensalada mixta con pollo, o gazpacho',
    'diet.dinner': 'Cena', 'diet.dinnerItems': 'Tortilla española, pescado a la plancha, o sopa de verduras',
    'diet.snacks': 'Merienda', 'diet.snackItems': 'Frutos secos, fruta fresca, aceitunas, o yogur',
    'diet.disclaimer': 'Esta información es solo orientativa. Consulte siempre a su médico.',
    'diet.aiCardTitle': 'Compass AI', 'diet.aiCardDesc': '¡Pregúntame lo que quieras!',
    'diet.aiTitle': 'Compass AI', 'diet.aiSubtitle': 'Tu asistente de IA',
    'diet.chatEmpty': '¡Pregúntame lo que quieras — salud, tecnología, vida diaria o recetas!',
    'diet.aiTyping': 'Pensando...', 'diet.inputPlaceholder': 'Pregúntame lo que sea...',
    'diet.aiError': 'Lo siento, no pude obtener una respuesta. Inténtalo de nuevo.',
    'diet.q1': '¿Qué debería desayunar?', 'diet.q2': '¿Cómo comer sano con poco dinero?',
    'diet.q3': '¿Qué alimentos dan energía?', 'diet.q4': '¿Mejores snacks para mayores?',
    'diet.q5': 'Ayúdame a planificar mi día', 'diet.q6': '¿Cómo uso esta app?',
    'ai.title': 'Compass AI', 'ai.subtitle': 'Tu asistente de IA',
    'ai.tabChat': 'Chat', 'ai.tabDiet': 'Nutrición', 'ai.tabRecipes': 'Recetas',
    'ai.chatWelcome': '¡Hola! Soy Compass AI \u{1F9ED}',
    'ai.chatDesc': '¡Pregúntame sobre cualquier cosa — salud, tecnología, vida diaria, recetas o simplemente charlar!',
    'ai.inputPlaceholder': 'Pregúntame lo que sea...',
    'ai.topicDiet': 'Nutrición', 'ai.topicExercise': 'Ejercicio', 'ai.topicHealth': 'Salud',
    'ai.topicTech': 'Tecnología', 'ai.topicChat': 'Charlar', 'ai.topicGames': 'Juegos',
    'ai.promptDiet': '¿Qué debería comer hoy?',
    'ai.promptExercise': '¿Qué ejercicios suaves puedo hacer en casa?',
    'ai.promptHealth': '¿Cómo puedo dormir mejor?',
    'ai.promptTech': '¿Cómo envío una foto por el teléfono?',
    'ai.promptChat': 'Cuéntame algo interesante de la historia de hoy',
    'ai.promptGames': '¿Consejos para ganar al ajedrez?',
    'ai.voiceThinking': 'Déjame pensar...',
    'recipes.title': 'Recetas Destacadas', 'recipes.subtitle': 'Platos deliciosos para alegrar tu día',
    'recipes.featured': 'Selección del Día',
    'recipes.recipe1.name': 'Paella Valenciana', 'recipes.recipe1.time': '60 min',
    'recipes.recipe1.desc': 'El clásico arroz español con mariscos, pollo y azafrán.',
    'recipes.recipe2.name': 'Tortilla Española', 'recipes.recipe2.time': '30 min',
    'recipes.recipe2.desc': 'Jugosa tortilla de patatas, perfecta para cualquier comida.',
    'recipes.recipe3.name': 'Gazpacho Andaluz', 'recipes.recipe3.time': '15 min',
    'recipes.recipe3.desc': 'Sopa fría de tomate refrescante, ideal para el verano.',
    'recipes.recipe4.name': 'Churros con Chocolate', 'recipes.recipe4.time': '25 min',
    'recipes.recipe4.desc': 'Crujientes churros servidos con chocolate caliente espeso.',
    'recipes.askAI': '¡Pide a Compass AI la receta completa paso a paso!',
  },

  // Remaining languages use English as base with key translations
  fr: { ...null as any }, de: { ...null as any }, ja: { ...null as any }, ko: { ...null as any },
  hi: { ...null as any }, pt: { ...null as any }, ar: { ...null as any }, vi: { ...null as any },
  tl: { ...null as any }, ru: { ...null as any }, it: { ...null as any },
};

// ─── Fill remaining languages with essential translations ──────
// Each language gets full coverage of critical UI strings

const langFills: Record<string, Partial<TranslationKeys>> = {
  fr: {
    'common.save': 'Enregistrer', 'common.cancel': 'Annuler', 'common.delete': 'Supprimer', 'common.edit': 'Modifier', 'common.close': 'Fermer', 'common.ok': 'OK', 'common.back': 'Retour', 'common.search': 'Rechercher', 'common.loading': 'Chargement...', 'common.error': 'Erreur', 'common.success': 'Succès', 'common.required': 'Requis', 'common.comingSoon': 'Bientôt',
    'tabs.games': 'Jeux', 'tabs.schedule': 'Agenda', 'tabs.sos': 'SOS', 'tabs.chat': 'Chat', 'tabs.help': 'Aide', 'tabs.profile': 'Profil',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Relier les générations, un instant à la fois', 'auth.login': 'Connexion', 'auth.signup': 'Inscription', 'auth.fullName': 'Nom Complet', 'auth.email': 'Email', 'auth.password': 'Mot de passe', 'auth.confirmPassword': 'Confirmer', 'auth.namePlaceholder': 'Entrez votre nom', 'auth.emailPlaceholder': 'votre@email.com', 'auth.passwordPlaceholder': 'Entrez le mot de passe', 'auth.confirmPlaceholder': 'Confirmez le mot de passe', 'auth.createAccount': 'Créer un Compte', 'auth.noAccount': 'Pas de compte ? ', 'auth.hasAccount': 'Déjà un compte ? ', 'auth.secureFooter': 'Vos données sont stockées et synchronisées en toute sécurité',
    'games.title': 'Jeux', 'games.subtitle': 'Jouez ensemble, restez unis', 'games.featured': 'Jeux en Vedette', 'games.moreGames': 'Plus de Jeux', 'games.chess': 'Échecs', 'games.connectFour': 'Puissance 4', 'games.poker': 'Poker', 'games.ticTacToe': 'Morpion', 'games.checkers': 'Dames', 'games.wordSearch': 'Mots Mêlés', 'games.trivia': 'Quiz',
    'schedule.title': 'Agenda', 'schedule.newEvent': 'Nouvel Événement', 'schedule.todayEvents': "Événements d'Aujourd'hui", 'schedule.noEvents': 'Aucun événement',
    'chat.title': 'Messages', 'chat.searchPlaceholder': 'Rechercher...', 'chat.onlineNow': 'En Ligne',
    'sos.title': 'SOS Urgence', 'sos.subtitle': 'Maintenez 2 secondes pour alerter vos contacts', 'sos.buttonText': 'SOS', 'sos.holdHint': 'Maintenir 2s', 'sos.sending': 'ENVOI...', 'sos.sent': 'ENVOYÉ', 'sos.emergencyServices': "Services d'Urgence",
    'profile.title': 'Mon Profil', 'profile.fullName': 'Nom Complet', 'profile.age': 'Âge', 'profile.bio': 'Bio', 'profile.senior': 'Aîné', 'profile.youth': 'Jeune', 'profile.saveProfile': 'Enregistrer', 'profile.quickActions': 'Actions Rapides', 'profile.language': 'Langue', 'profile.languageSub': 'Changer la langue', 'profile.logOut': 'Déconnexion',
    'emergency.title': "Contacts d'Urgence", 'emergency.family': 'Famille', 'emergency.spouse': 'Conjoint(e)', 'emergency.parent': 'Parent', 'emergency.friend': 'Ami(e)', 'emergency.doctor': 'Médecin',
    'help.title': 'Comment Utiliser BridgeApp', 'help.subtitle': 'Instructions simples étape par étape', 'help.readAll': 'Lire Toutes les Instructions', 'help.stopReading': 'Arrêter', 'help.quickTips': 'Conseils Rapides',
    'voice.title': 'Commandes Vocales', 'voice.listening': 'Écoute...', 'voice.tapToListen': 'Appuyez pour Écouter', 'voice.trySaying': 'Essayez de dire :',
    'tabs.diet': 'Compass',
    'diet.title': 'Alimentation & Bien-être', 'diet.subtitle': 'Conseils nutritionnels et assistance IA',
    'diet.dailyTips': 'Conseils Quotidiens', 'diet.sampleMeals': 'Idées de Repas',
    'diet.tipWater': 'Hydratation', 'diet.tipWaterDesc': 'Buvez 6 à 8 verres d\'eau par jour.',
    'diet.tipFruits': 'Plus de Fruits', 'diet.tipFruitsDesc': 'Mangez 2 à 3 portions de fruits par jour.',
    'diet.tipGrains': 'Céréales Complètes', 'diet.tipGrainsDesc': 'Préférez le riz complet et le pain complet.',
    'diet.tipProtein': 'Protéines Maigres', 'diet.tipProteinDesc': 'Incluez poisson, poulet, légumineuses ou tofu.',
    'diet.tipDairy': 'Riche en Calcium', 'diet.tipDairyDesc': 'Lait, yaourt et fromage renforcent les os.',
    'diet.tipSugar': 'Moins de Sucre', 'diet.tipSugarDesc': 'Réduisez boissons et snacks sucrés.',
    'diet.breakfast': 'Petit-déjeuner', 'diet.breakfastItems': 'Croissant, café au lait, yaourt aux fruits, ou tartines de confiture',
    'diet.lunch': 'Déjeuner', 'diet.lunchItems': 'Quiche lorraine, salade niçoise, ou croque-monsieur',
    'diet.dinner': 'Dîner', 'diet.dinnerItems': 'Ratatouille, poulet rôti aux légumes, ou soupe à l\'oignon',
    'diet.snacks': 'Goûter', 'diet.snackItems': 'Fromage, fruits, madeleines, ou noix',
    'diet.disclaimer': 'Ces informations sont à titre indicatif. Consultez toujours votre médecin.',
    'diet.aiCardTitle': 'Compass AI', 'diet.aiCardDesc': 'Demandez-moi n\'importe quoi !',
    'diet.aiTitle': 'Compass AI', 'diet.aiSubtitle': 'Votre assistant IA',
    'diet.chatEmpty': 'Demandez-moi n\'importe quoi — santé, technologie, vie quotidienne ou recettes !',
    'diet.aiTyping': 'Réflexion...', 'diet.inputPlaceholder': 'Demandez-moi n\'importe quoi...',
    'diet.aiError': 'Désolé, je n\'ai pas pu obtenir de réponse. Réessayez.',
    'diet.q1': 'Que devrais-je manger au petit-déjeuner ?', 'diet.q2': 'Comment manger sainement à petit budget ?',
    'diet.q3': 'Quels aliments donnent de l\'énergie ?', 'diet.q4': 'Meilleurs encas pour les seniors ?',
    'diet.q5': 'Aidez-moi à planifier ma journée', 'diet.q6': 'Comment utiliser cette application ?',
    'ai.title': 'Compass AI', 'ai.subtitle': 'Votre assistant IA',
    'ai.tabChat': 'Discussion', 'ai.tabDiet': 'Nutrition', 'ai.tabRecipes': 'Recettes',
    'ai.chatWelcome': 'Bonjour ! Je suis Compass AI \u{1F9ED}',
    'ai.chatDesc': 'Demandez-moi n\'importe quoi — santé, technologie, vie quotidienne, recettes ou bavardage !',
    'ai.inputPlaceholder': 'Demandez-moi n\'importe quoi...',
    'ai.topicDiet': 'Nutrition', 'ai.topicExercise': 'Exercice', 'ai.topicHealth': 'Santé',
    'ai.topicTech': 'Tech', 'ai.topicChat': 'Discuter', 'ai.topicGames': 'Jeux',
    'ai.promptDiet': 'Que devrais-je manger aujourd\'hui ?',
    'ai.promptExercise': 'Quels exercices doux puis-je faire à la maison ?',
    'ai.promptHealth': 'Comment améliorer mon sommeil ?',
    'ai.promptTech': 'Comment envoyer une photo avec mon téléphone ?',
    'ai.promptChat': 'Racontez-moi quelque chose d\'intéressant de l\'histoire d\'aujourd\'hui',
    'ai.promptGames': 'Des conseils pour gagner aux échecs ?',
    'ai.voiceThinking': 'Laissez-moi réfléchir...',
    'recipes.title': 'Recettes en Vedette', 'recipes.subtitle': 'Des plats délicieux pour égayer votre journée',
    'recipes.featured': 'Sélection du Jour',
    'recipes.recipe1.name': 'Coq au Vin', 'recipes.recipe1.time': '90 min',
    'recipes.recipe1.desc': 'Le classique français : poulet braisé au vin rouge avec champignons.',
    'recipes.recipe2.name': 'Crêpes Suzette', 'recipes.recipe2.time': '25 min',
    'recipes.recipe2.desc': 'Fines crêpes flambées au Grand Marnier avec beurre d\'orange.',
    'recipes.recipe3.name': 'Ratatouille Provençale', 'recipes.recipe3.time': '45 min',
    'recipes.recipe3.desc': 'Légumes du soleil mijotés lentement aux herbes de Provence.',
    'recipes.recipe4.name': 'Tarte Tatin', 'recipes.recipe4.time': '50 min',
    'recipes.recipe4.desc': 'Tarte aux pommes caramélisées renversée, un dessert emblématique.',
    'recipes.askAI': 'Demandez à Compass AI la recette complète étape par étape !',
  },
  de: {
    'common.save': 'Speichern', 'common.cancel': 'Abbrechen', 'common.delete': 'Löschen', 'common.edit': 'Bearbeiten', 'common.close': 'Schließen', 'common.ok': 'OK', 'common.back': 'Zurück', 'common.search': 'Suchen', 'common.loading': 'Laden...', 'common.error': 'Fehler', 'common.success': 'Erfolg', 'common.required': 'Erforderlich', 'common.comingSoon': 'Demnächst',
    'tabs.games': 'Spiele', 'tabs.schedule': 'Kalender', 'tabs.sos': 'SOS', 'tabs.chat': 'Chat', 'tabs.help': 'Hilfe', 'tabs.profile': 'Profil',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Generationen verbinden, Moment für Moment', 'auth.login': 'Anmelden', 'auth.signup': 'Registrieren',
    'games.title': 'Spiele', 'games.subtitle': 'Zusammen spielen, für immer verbunden', 'games.chess': 'Schach', 'games.connectFour': 'Vier Gewinnt', 'games.poker': 'Poker', 'games.ticTacToe': 'Tic-Tac-Toe', 'games.checkers': 'Dame', 'games.wordSearch': 'Wortsuche', 'games.trivia': 'Quiz',
    'schedule.title': 'Kalender', 'schedule.newEvent': 'Neues Ereignis', 'schedule.todayEvents': 'Heutige Ereignisse', 'schedule.noEvents': 'Keine Ereignisse',
    'chat.title': 'Nachrichten', 'chat.onlineNow': 'Jetzt Online',
    'sos.title': 'Notfall-SOS', 'sos.subtitle': '2 Sekunden halten um alle Kontakte zu alarmieren', 'sos.buttonText': 'SOS', 'sos.holdHint': '2s halten', 'sos.sending': 'SENDEN...', 'sos.sent': 'GESENDET', 'sos.emergencyServices': 'Notdienste',
    'profile.title': 'Mein Profil', 'profile.fullName': 'Vollständiger Name', 'profile.age': 'Alter', 'profile.bio': 'Bio', 'profile.senior': 'Senior', 'profile.youth': 'Jugendliche/r', 'profile.saveProfile': 'Profil Speichern', 'profile.language': 'Sprache', 'profile.languageSub': 'App-Sprache ändern', 'profile.logOut': 'Abmelden',
    'help.title': 'So verwenden Sie BridgeApp', 'help.readAll': 'Alle Anweisungen vorlesen', 'help.quickTips': 'Schnelle Tipps',
    'voice.title': 'Sprachbefehle', 'voice.listening': 'Höre zu...', 'voice.tapToListen': 'Tippen zum Hören', 'voice.trySaying': 'Versuchen Sie:',
    'tabs.diet': 'Compass',
    'diet.title': 'Ernährung & Wohlbefinden', 'diet.subtitle': 'Gesunde Ernährungstipps und KI-Beratung',
    'diet.dailyTips': 'Tägliche Tipps', 'diet.sampleMeals': 'Mahlzeitenideen',
    'diet.tipWater': 'Hydratation', 'diet.tipWaterDesc': 'Trinken Sie 6-8 Gläser Wasser täglich.',
    'diet.tipFruits': 'Mehr Obst', 'diet.tipFruitsDesc': 'Essen Sie 2-3 Portionen Obst täglich.',
    'diet.tipGrains': 'Vollkornprodukte', 'diet.tipGrainsDesc': 'Wählen Sie Vollkornreis und Vollkornbrot.',
    'diet.tipProtein': 'Mageres Eiweiß', 'diet.tipProteinDesc': 'Fisch, Hähnchen, Hülsenfrüchte oder Tofu einbeziehen.',
    'diet.tipDairy': 'Kalziumreich', 'diet.tipDairyDesc': 'Milch, Joghurt und Käse stärken die Knochen.',
    'diet.tipSugar': 'Weniger Zucker', 'diet.tipSugarDesc': 'Reduzieren Sie zuckerhaltige Getränke und Snacks.',
    'diet.breakfast': 'Frühstück', 'diet.breakfastItems': 'Brötchen mit Aufschnitt, Müsli mit Obst, oder Rührei',
    'diet.lunch': 'Mittagessen', 'diet.lunchItems': 'Schnitzel mit Kartoffelsalat, Suppe, oder Bratwurst mit Sauerkraut',
    'diet.dinner': 'Abendessen', 'diet.dinnerItems': 'Sauerbraten, Fischfilet mit Gemüse, oder Kartoffelsuppe',
    'diet.snacks': 'Snacks', 'diet.snackItems': 'Nüsse, Obst, Brezel, oder Quark',
    'diet.disclaimer': 'Diese Informationen dienen nur der allgemeinen Gesundheit. Bitte fragen Sie Ihren Arzt.',
    'diet.aiCardTitle': 'Compass AI', 'diet.aiCardDesc': 'Fragen Sie mich alles!',
    'diet.aiTitle': 'Compass AI', 'diet.aiSubtitle': 'Ihr KI-Assistent',
    'diet.chatEmpty': 'Fragen Sie mich alles — Gesundheit, Technik, Alltag oder Rezepte!',
    'diet.aiTyping': 'Denke nach...', 'diet.inputPlaceholder': 'Fragen Sie mich alles...',
    'diet.aiError': 'Entschuldigung, keine Antwort erhalten. Bitte versuchen Sie es erneut.',
    'diet.q1': 'Was sollte ich zum Frühstück essen?', 'diet.q2': 'Wie esse ich gesund und günstig?',
    'diet.q3': 'Welche Lebensmittel geben Energie?', 'diet.q4': 'Beste Snacks für Senioren?',
    'diet.q5': 'Hilf mir meinen Tag zu planen', 'diet.q6': 'Wie benutze ich diese App?',
    'ai.title': 'Compass AI', 'ai.subtitle': 'Ihr KI-Assistent',
    'ai.tabChat': 'Chat', 'ai.tabDiet': 'Ernährung', 'ai.tabRecipes': 'Rezepte',
    'ai.chatWelcome': 'Hallo! Ich bin Compass AI \u{1F9ED}',
    'ai.chatDesc': 'Fragen Sie mich alles — Gesundheit, Technik, Alltag, Rezepte oder einfach plaudern!',
    'ai.inputPlaceholder': 'Fragen Sie mich alles...',
    'ai.topicDiet': 'Ernährung', 'ai.topicExercise': 'Bewegung', 'ai.topicHealth': 'Gesundheit',
    'ai.topicTech': 'Technik', 'ai.topicChat': 'Plaudern', 'ai.topicGames': 'Spieltipps',
    'ai.promptDiet': 'Was sollte ich heute essen?',
    'ai.promptExercise': 'Welche leichten Übungen kann ich zuhause machen?',
    'ai.promptHealth': 'Wie kann ich besser schlafen?',
    'ai.promptTech': 'Wie sende ich ein Foto mit meinem Handy?',
    'ai.promptChat': 'Erzählen Sie mir etwas Interessantes aus der Geschichte',
    'ai.promptGames': 'Tipps zum Schachspielen?',
    'ai.voiceThinking': 'Lass mich nachdenken...',
    'recipes.title': 'Empfohlene Rezepte', 'recipes.subtitle': 'Köstliche Gerichte für gute Laune',
    'recipes.featured': 'Auswahl des Tages',
    'recipes.recipe1.name': 'Wiener Schnitzel', 'recipes.recipe1.time': '30 Min',
    'recipes.recipe1.desc': 'Knuspriges paniertes Kalbsschnitzel mit Zitrone und Kartoffelsalat.',
    'recipes.recipe2.name': 'Apfelstrudel', 'recipes.recipe2.time': '60 Min',
    'recipes.recipe2.desc': 'Blättriger Strudel gefüllt mit zimtigen Äpfeln und Rosinen.',
    'recipes.recipe3.name': 'Käsespätzle', 'recipes.recipe3.time': '35 Min',
    'recipes.recipe3.desc': 'Herzhafte schwäbische Spätzle überbacken mit würzigem Käse.',
    'recipes.recipe4.name': 'Schwarzwälder Kirschtorte', 'recipes.recipe4.time': '90 Min',
    'recipes.recipe4.desc': 'Schokoladentorte mit Kirschen, Sahne und einem Hauch Kirschwasser.',
    'recipes.askAI': 'Fragen Sie Compass AI nach dem vollständigen Rezept mit Schritt-für-Schritt-Anleitung!',
  },
  ja: {
    'common.save': '保存', 'common.cancel': 'キャンセル', 'common.delete': '削除', 'common.edit': '編集', 'common.close': '閉じる', 'common.ok': 'OK', 'common.back': '戻る', 'common.search': '検索', 'common.loading': '読み込み中...', 'common.error': 'エラー', 'common.success': '成功', 'common.required': '必須', 'common.comingSoon': '近日公開',
    'tabs.games': 'ゲーム', 'tabs.schedule': 'スケジュール', 'tabs.sos': 'SOS', 'tabs.chat': 'チャット', 'tabs.help': 'ヘルプ', 'tabs.profile': 'プロフィール',
    'auth.appName': 'BridgeApp', 'auth.tagline': '世代をつなぐ、一瞬一瞬', 'auth.login': 'ログイン', 'auth.signup': '新規登録',
    'games.title': 'ゲーム', 'games.subtitle': '一緒に遊ぼう、永遠の絆', 'games.chess': 'チェス', 'games.connectFour': 'コネクトフォー', 'games.poker': 'ポーカー', 'games.ticTacToe': '三目並べ', 'games.checkers': 'チェッカー', 'games.wordSearch': 'ワードサーチ', 'games.trivia': 'トリビア',
    'schedule.title': 'スケジュール', 'schedule.newEvent': '新しいイベント', 'schedule.todayEvents': '今日のイベント', 'schedule.noEvents': 'イベントなし',
    'chat.title': 'メッセージ', 'chat.onlineNow': 'オンライン',
    'sos.title': '緊急SOS', 'sos.subtitle': '2秒長押しで全連絡先に通知', 'sos.buttonText': 'SOS', 'sos.holdHint': '2秒長押し', 'sos.sending': '送信中...', 'sos.sent': '送信済み', 'sos.emergencyServices': '緊急サービス',
    'profile.title': 'マイプロフィール', 'profile.fullName': '氏名', 'profile.age': '年齢', 'profile.bio': '自己紹介', 'profile.senior': 'シニア', 'profile.youth': '若者', 'profile.saveProfile': 'プロフィール保存', 'profile.language': '言語', 'profile.languageSub': 'アプリの言語を変更', 'profile.logOut': 'ログアウト',
    'help.title': 'BridgeAppの使い方', 'help.readAll': 'すべて読み上げる', 'help.quickTips': 'クイックヒント',
    'voice.title': '音声コマンド', 'voice.listening': '聞いています...', 'voice.tapToListen': 'タップして聞く', 'voice.trySaying': '次のように言ってみてください：',
    'tabs.diet': 'コンパス',
    'diet.title': '食事と健康',
    'diet.subtitle': '健康的な食事のヒントとAIアドバイス',
    'diet.dailyTips': '毎日の栄養ヒント',
    'diet.sampleMeals': '食事メニュー例',
    'diet.tipWater': '水分補給',
    'diet.tipWaterDesc': '毎日6〜8杯の水を飲みましょう。レモンやフルーツで風味を加えて。',
    'diet.tipFruits': '果物を食べよう',
    'diet.tipFruitsDesc': '毎日2〜3種類のカラフルな果物を食べましょう。',
    'diet.tipGrains': '全粒穀物',
    'diet.tipGrainsDesc': '白米より玄米、オートミール、全粒粉パンを選びましょう。',
    'diet.tipProtein': '良質なタンパク質',
    'diet.tipProteinDesc': '魚、鶏肉、豆類、豆腐を食事に取り入れましょう。',
    'diet.tipDairy': 'カルシウム豊富',
    'diet.tipDairyDesc': '牛乳、ヨーグルト、チーズで骨を丈夫に。',
    'diet.tipSugar': '砂糖を控えめに',
    'diet.tipSugarDesc': '甘い飲み物やお菓子を減らし、新鮮な果物を代わりに。',
    'diet.breakfast': '朝食',
    'diet.breakfastItems': '味噌汁と焼き魚、納豆ご飯、またはオートミールとフルーツ',
    'diet.lunch': '昼食',
    'diet.lunchItems': '親子丼、野菜たっぷりうどん、または鮭弁当',
    'diet.dinner': '夕食',
    'diet.dinnerItems': '焼き魚と煮物、鍋料理、またはカレーライス',
    'diet.snacks': 'おやつ',
    'diet.snackItems': 'おにぎり、枝豆、和菓子、フルーツ',
    'diet.disclaimer': 'この情報は一般的な健康のためのものです。個別の食事アドバイスは必ず医師や栄養士にご相談ください。',
    'diet.aiCardTitle': 'Compass AI',
    'diet.aiCardDesc': '何でも聞いてください！',
    'diet.aiTitle': 'Compass AI',
    'diet.aiSubtitle': 'あなたのAIアシスタント',
    'diet.chatEmpty': '何でも聞いてください — 健康、テクノロジー、日常生活、レシピなど！',
    'diet.aiTyping': '考え中...',
    'diet.inputPlaceholder': '何でも聞いてください...',
    'diet.aiError': '申し訳ございません、応答を取得できませんでした。もう一度お試しください。',
    'diet.q1': '朝食には何を食べればいいですか？',
    'diet.q2': '節約しながら健康に食べるには？',
    'diet.q3': 'エネルギーが出る食べ物は？',
    'diet.q4': 'シニアにおすすめのおやつは？',
    'diet.q5': '一日の計画を手伝ってください',
    'diet.q6': 'このアプリの使い方を教えて',
    'ai.title': 'Compass AI',
    'ai.subtitle': 'あなたのAIアシスタント',
    'ai.tabChat': 'チャット',
    'ai.tabDiet': '栄養',
    'ai.tabRecipes': 'レシピ',
    'ai.chatWelcome': 'こんにちは！Compass AIです \u{1F9ED}',
    'ai.chatDesc': '何でも聞いてください — 健康、テクノロジー、日常生活、レシピなど！',
    'ai.inputPlaceholder': '何でも聞いてください...',
    'ai.topicDiet': '栄養',
    'ai.topicExercise': '運動',
    'ai.topicHealth': '健康',
    'ai.topicTech': 'テクノロジー',
    'ai.topicChat': 'おしゃべり',
    'ai.topicGames': 'ゲーム攻略',
    'ai.promptDiet': '今日のバランスの良い食事は何がいいですか？',
    'ai.promptExercise': '家でできる簡単な運動を教えてください',
    'ai.promptHealth': '睡眠の質を上げるにはどうすればいいですか？',
    'ai.promptTech': 'スマホで写真を送る方法を教えてください',
    'ai.promptChat': '今日の歴史的な出来事を教えてください',
    'ai.promptGames': 'チェスで勝つコツを教えてください',
    'ai.voiceThinking': '考えています...',
    'recipes.title': 'おすすめレシピ',
    'recipes.subtitle': '笑顔になれる美味しい料理',
    'recipes.featured': '今日のおすすめ',
    'recipes.recipe1.name': '肉じゃが',
    'recipes.recipe1.time': '40分',
    'recipes.recipe1.desc': '家庭の味、ホクホクのじゃがいもと甘辛い肉の煮込み料理。',
    'recipes.recipe2.name': 'ふわふわパンケーキ',
    'recipes.recipe2.time': '20分',
    'recipes.recipe2.desc': 'ふわっと軽いパンケーキにフルーツとメープルシロップを添えて。',
    'recipes.recipe3.name': '鮭のバター醤油焼き',
    'recipes.recipe3.time': '15分',
    'recipes.recipe3.desc': '香ばしいバター醤油で焼いた鮭。ご飯によく合います。',
    'recipes.recipe4.name': '抹茶ティラミス',
    'recipes.recipe4.time': '30分',
    'recipes.recipe4.desc': 'ほろ苦い抹茶とクリーミーなマスカルポーネの和洋折衷デザート。',
    'recipes.askAI': 'Compass AIに詳しいレシピと作り方を聞いてみましょう！',
  },
  ko: {
    'common.save': '저장', 'common.cancel': '취소', 'common.delete': '삭제', 'common.edit': '편집', 'common.close': '닫기', 'common.ok': '확인', 'common.back': '뒤로', 'common.search': '검색', 'common.loading': '로딩 중...', 'common.error': '오류', 'common.success': '성공', 'common.required': '필수', 'common.comingSoon': '곧 출시',
    'tabs.games': '게임', 'tabs.schedule': '일정', 'tabs.sos': 'SOS', 'tabs.chat': '채팅', 'tabs.help': '도움말', 'tabs.profile': '프로필',
    'auth.appName': 'BridgeApp', 'auth.tagline': '세대를 연결하는 순간', 'auth.login': '로그인', 'auth.signup': '회원가입',
    'games.title': '게임', 'games.chess': '체스', 'games.connectFour': '커넥트포', 'games.poker': '포커', 'games.ticTacToe': '틱택토', 'games.checkers': '체커', 'games.wordSearch': '단어 찾기', 'games.trivia': '퀴즈',
    'schedule.title': '일정', 'schedule.newEvent': '새 일정', 'schedule.todayEvents': '오늘의 일정', 'schedule.noEvents': '일정 없음',
    'chat.title': '메시지', 'chat.onlineNow': '현재 온라인',
    'sos.title': '긴급 SOS', 'sos.buttonText': 'SOS', 'sos.sending': '전송 중...', 'sos.sent': '전송됨', 'sos.emergencyServices': '응급 서비스',
    'profile.title': '내 프로필', 'profile.fullName': '이름', 'profile.age': '나이', 'profile.bio': '소개', 'profile.senior': '어르신', 'profile.youth': '청소년', 'profile.language': '언어', 'profile.languageSub': '앱 언어 변경', 'profile.logOut': '로그아웃',
    'help.title': 'BridgeApp 사용법', 'voice.title': '음성 명령', 'voice.listening': '듣고 있습니다...', 'voice.tapToListen': '탭하여 듣기', 'voice.trySaying': '다음과 같이 말해보세요:',
    'tabs.diet': '컴파스',
    'diet.title': '식단 & 건강', 'diet.subtitle': '건강한 식습관 팁과 AI 영양 상담',
    'diet.dailyTips': '매일 영양 팁', 'diet.sampleMeals': '식단 아이디어',
    'diet.tipWater': '수분 보충', 'diet.tipWaterDesc': '매일 6-8잔의 물을 마시세요.',
    'diet.tipFruits': '과일 섭취', 'diet.tipFruitsDesc': '매일 2-3가지 과일을 드세요.',
    'diet.tipGrains': '통곡물', 'diet.tipGrainsDesc': '현미, 귀리, 통밀빵을 선택하세요.',
    'diet.tipProtein': '양질의 단백질', 'diet.tipProteinDesc': '생선, 닭고기, 콩, 두부를 포함하세요.',
    'diet.tipDairy': '칼슘 섭취', 'diet.tipDairyDesc': '우유, 요거트, 치즈로 뼈를 튼튼하게.',
    'diet.tipSugar': '설탕 줄이기', 'diet.tipSugarDesc': '단 음료와 간식을 줄이세요.',
    'diet.breakfast': '아침', 'diet.breakfastItems': '된장찌개와 밥, 계란말이, 또는 죽',
    'diet.lunch': '점심', 'diet.lunchItems': '비빔밥, 김치찌개, 또는 잡채밥',
    'diet.dinner': '저녁', 'diet.dinnerItems': '불고기, 생선구이와 나물, 또는 칼국수',
    'diet.snacks': '간식', 'diet.snackItems': '떡, 과일, 견과류, 또는 고구마',
    'diet.disclaimer': '이 정보는 일반적인 건강 목적입니다. 개인 식이 조언은 의사와 상담하세요.',
    'diet.aiCardTitle': 'Compass AI', 'diet.aiCardDesc': '무엇이든 물어보세요!',
    'diet.aiTitle': 'Compass AI', 'diet.aiSubtitle': '당신의 AI 도우미',
    'diet.chatEmpty': '무엇이든 물어보세요 — 건강, 기술, 일상, 레시피 등!',
    'diet.aiTyping': '생각 중...', 'diet.inputPlaceholder': '무엇이든 물어보세요...',
    'diet.aiError': '죄송합니다, 응답을 받지 못했습니다. 다시 시도해주세요.',
    'ai.title': 'Compass AI', 'ai.subtitle': '당신의 AI 도우미',
    'ai.tabChat': '채팅', 'ai.tabDiet': '영양', 'ai.tabRecipes': '레시피',
    'ai.chatWelcome': '안녕하세요! Compass AI입니다 \u{1F9ED}',
    'ai.chatDesc': '무엇이든 물어보세요 — 건강, 기술, 일상, 레시피, 또는 그냥 대화해요!',
    'ai.inputPlaceholder': '무엇이든 물어보세요...',
    'ai.topicDiet': '영양', 'ai.topicExercise': '운동', 'ai.topicHealth': '건강',
    'ai.topicTech': '기술 도움', 'ai.topicChat': '대화', 'ai.topicGames': '게임 팁',
    'ai.promptDiet': '오늘 무엇을 먹으면 좋을까요?',
    'ai.promptExercise': '집에서 할 수 있는 가벼운 운동은?',
    'ai.promptHealth': '수면의 질을 높이려면?',
    'ai.promptTech': '핸드폰으로 사진 보내는 방법은?',
    'ai.promptChat': '오늘 역사에서 일어난 재미있는 일을 알려주세요',
    'ai.promptGames': '체스에서 이기는 팁이 있나요?',
    'ai.voiceThinking': '생각하고 있어요...',
    'recipes.title': '추천 레시피', 'recipes.subtitle': '행복을 가져다 주는 맛있는 요리',
    'recipes.featured': '오늘의 추천',
    'recipes.recipe1.name': '소고기 불고기', 'recipes.recipe1.time': '30분',
    'recipes.recipe1.desc': '달콤짭짤한 양념에 재운 소고기를 구워낸 한국의 대표 요리.',
    'recipes.recipe2.name': '김치전', 'recipes.recipe2.time': '20분',
    'recipes.recipe2.desc': '바삭하게 구운 김치전, 막걸리와 함께 즐기면 최고.',
    'recipes.recipe3.name': '떡볶이', 'recipes.recipe3.time': '25분',
    'recipes.recipe3.desc': '쫄깃한 떡에 매콤달콤한 고추장 소스, 한국의 국민 간식.',
    'recipes.recipe4.name': '호떡', 'recipes.recipe4.time': '30분',
    'recipes.recipe4.desc': '따끈한 흑설탕 속이 가득한 바삭한 호떡, 겨울 간식의 왕.',
    'recipes.askAI': 'Compass AI에게 자세한 레시피와 만드는 법을 물어보세요!',
  },
  hi: {
    'common.save': 'सहेजें', 'common.cancel': 'रद्द करें', 'common.delete': 'हटाएं', 'common.edit': 'संपादित करें', 'common.close': 'बंद करें', 'common.ok': 'ठीक', 'common.back': 'वापस', 'common.search': 'खोजें', 'common.loading': 'लोड हो रहा है...', 'common.error': 'त्रुटि', 'common.success': 'सफल', 'common.required': 'आवश्यक', 'common.comingSoon': 'जल्द आ रहा है',
    'tabs.games': 'खेल', 'tabs.schedule': 'शेड्यूल', 'tabs.sos': 'SOS', 'tabs.chat': 'चैट', 'tabs.help': 'मदद', 'tabs.profile': 'प्रोफाइल',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'पीढ़ियों को जोड़ना, एक पल में', 'auth.login': 'लॉग इन', 'auth.signup': 'साइन अप',
    'games.title': 'खेल', 'games.chess': 'शतरंज', 'games.poker': 'पोकर', 'games.ticTacToe': 'टिक टैक टो', 'games.checkers': 'चेकर्स', 'games.trivia': 'क्विज़',
    'sos.title': 'आपातकालीन SOS', 'sos.buttonText': 'SOS', 'sos.emergencyServices': 'आपातकालीन सेवाएं',
    'profile.title': 'मेरी प्रोफाइल', 'profile.language': 'भाषा', 'profile.languageSub': 'ऐप की भाषा बदलें', 'profile.logOut': 'लॉग आउट',
    'help.title': 'BridgeApp कैसे उपयोग करें', 'voice.title': 'वॉइस कमांड', 'voice.listening': 'सुन रहे हैं...', 'voice.tapToListen': 'सुनने के लिए टैप करें',
  },
  pt: {
    'common.save': 'Salvar', 'common.cancel': 'Cancelar', 'common.delete': 'Excluir', 'common.edit': 'Editar', 'common.close': 'Fechar', 'common.ok': 'OK', 'common.back': 'Voltar', 'common.search': 'Buscar', 'common.loading': 'Carregando...', 'common.error': 'Erro', 'common.success': 'Sucesso', 'common.required': 'Obrigatório', 'common.comingSoon': 'Em breve',
    'tabs.games': 'Jogos', 'tabs.schedule': 'Agenda', 'tabs.sos': 'SOS', 'tabs.chat': 'Chat', 'tabs.help': 'Ajuda', 'tabs.profile': 'Perfil',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Conectando gerações, um momento de cada vez', 'auth.login': 'Entrar', 'auth.signup': 'Cadastrar',
    'games.title': 'Jogos', 'games.chess': 'Xadrez', 'games.poker': 'Pôquer', 'games.ticTacToe': 'Jogo da Velha', 'games.checkers': 'Damas', 'games.trivia': 'Trivia',
    'sos.title': 'SOS Emergência', 'sos.buttonText': 'SOS', 'sos.emergencyServices': 'Serviços de Emergência',
    'profile.title': 'Meu Perfil', 'profile.language': 'Idioma', 'profile.languageSub': 'Alterar idioma do app', 'profile.logOut': 'Sair',
    'help.title': 'Como Usar o BridgeApp', 'voice.title': 'Comandos de Voz', 'voice.listening': 'Ouvindo...', 'voice.tapToListen': 'Toque para Ouvir',
  },
  ar: {
    'common.save': 'حفظ', 'common.cancel': 'إلغاء', 'common.delete': 'حذف', 'common.edit': 'تعديل', 'common.close': 'إغلاق', 'common.ok': 'موافق', 'common.back': 'رجوع', 'common.search': 'بحث', 'common.loading': '...جارٍ التحميل', 'common.error': 'خطأ', 'common.success': 'نجاح', 'common.required': 'مطلوب', 'common.comingSoon': 'قريباً',
    'tabs.games': 'ألعاب', 'tabs.schedule': 'جدول', 'tabs.sos': 'طوارئ', 'tabs.chat': 'دردشة', 'tabs.help': 'مساعدة', 'tabs.profile': 'ملفي',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'ربط الأجيال، لحظة بلحظة', 'auth.login': 'تسجيل الدخول', 'auth.signup': 'إنشاء حساب',
    'games.title': 'ألعاب', 'games.chess': 'شطرنج', 'games.poker': 'بوكر',
    'sos.title': 'طوارئ SOS', 'sos.buttonText': 'SOS', 'sos.emergencyServices': 'خدمات الطوارئ',
    'profile.title': 'ملفي الشخصي', 'profile.language': 'اللغة', 'profile.languageSub': 'تغيير لغة التطبيق', 'profile.logOut': 'تسجيل الخروج',
    'help.title': 'كيفية استخدام BridgeApp', 'voice.title': 'أوامر صوتية', 'voice.listening': '...جارٍ الاستماع',
  },
  vi: {
    'common.save': 'Lưu', 'common.cancel': 'Hủy', 'common.delete': 'Xóa', 'common.edit': 'Sửa', 'common.close': 'Đóng', 'common.ok': 'OK', 'common.back': 'Quay lại', 'common.search': 'Tìm kiếm', 'common.loading': 'Đang tải...', 'common.error': 'Lỗi', 'common.success': 'Thành công', 'common.required': 'Bắt buộc', 'common.comingSoon': 'Sắp ra mắt',
    'tabs.games': 'Trò chơi', 'tabs.schedule': 'Lịch', 'tabs.sos': 'SOS', 'tabs.chat': 'Chat', 'tabs.help': 'Trợ giúp', 'tabs.profile': 'Hồ sơ',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Kết nối thế hệ, từng khoảnh khắc', 'auth.login': 'Đăng nhập', 'auth.signup': 'Đăng ký',
    'games.title': 'Trò chơi', 'games.chess': 'Cờ vua', 'games.poker': 'Poker',
    'sos.title': 'SOS Khẩn cấp', 'sos.buttonText': 'SOS', 'sos.emergencyServices': 'Dịch vụ khẩn cấp',
    'profile.title': 'Hồ sơ', 'profile.language': 'Ngôn ngữ', 'profile.languageSub': 'Đổi ngôn ngữ ứng dụng', 'profile.logOut': 'Đăng xuất',
    'help.title': 'Cách sử dụng BridgeApp', 'voice.title': 'Lệnh giọng nói', 'voice.listening': 'Đang nghe...',
  },
  tl: {
    'common.save': 'I-save', 'common.cancel': 'Kanselahin', 'common.delete': 'Tanggalin', 'common.edit': 'I-edit', 'common.close': 'Isara', 'common.ok': 'OK', 'common.back': 'Bumalik', 'common.search': 'Hanapin', 'common.loading': 'Naglo-load...', 'common.error': 'Error', 'common.success': 'Tagumpay', 'common.required': 'Kailangan', 'common.comingSoon': 'Malapit na',
    'tabs.games': 'Laro', 'tabs.schedule': 'Iskedyul', 'tabs.sos': 'SOS', 'tabs.chat': 'Chat', 'tabs.help': 'Tulong', 'tabs.profile': 'Profile',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Ikokonekta ang mga henerasyon', 'auth.login': 'Mag-login', 'auth.signup': 'Mag-signup',
    'games.title': 'Mga Laro', 'games.chess': 'Chess',
    'sos.title': 'Emergency SOS', 'sos.buttonText': 'SOS', 'sos.emergencyServices': 'Emergency Services',
    'profile.title': 'Aking Profile', 'profile.language': 'Wika', 'profile.languageSub': 'Baguhin ang wika ng app', 'profile.logOut': 'Mag-logout',
    'help.title': 'Paano Gamitin ang BridgeApp', 'voice.title': 'Voice Commands', 'voice.listening': 'Nakikinig...',
  },
  ru: {
    'common.save': 'Сохранить', 'common.cancel': 'Отмена', 'common.delete': 'Удалить', 'common.edit': 'Редактировать', 'common.close': 'Закрыть', 'common.ok': 'ОК', 'common.back': 'Назад', 'common.search': 'Поиск', 'common.loading': 'Загрузка...', 'common.error': 'Ошибка', 'common.success': 'Успех', 'common.required': 'Обязательно', 'common.comingSoon': 'Скоро',
    'tabs.games': 'Игры', 'tabs.schedule': 'Расписание', 'tabs.sos': 'SOS', 'tabs.chat': 'Чат', 'tabs.help': 'Помощь', 'tabs.profile': 'Профиль',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Связывая поколения, момент за моментом', 'auth.login': 'Войти', 'auth.signup': 'Регистрация',
    'games.title': 'Игры', 'games.chess': 'Шахматы', 'games.poker': 'Покер', 'games.checkers': 'Шашки', 'games.trivia': 'Викторина',
    'sos.title': 'Экстренный SOS', 'sos.buttonText': 'SOS', 'sos.emergencyServices': 'Экстренные службы',
    'profile.title': 'Мой Профиль', 'profile.language': 'Язык', 'profile.languageSub': 'Изменить язык приложения', 'profile.logOut': 'Выйти',
    'help.title': 'Как пользоваться BridgeApp', 'voice.title': 'Голосовые команды', 'voice.listening': 'Слушаю...',
  },
  it: {
    'common.save': 'Salva', 'common.cancel': 'Annulla', 'common.delete': 'Elimina', 'common.edit': 'Modifica', 'common.close': 'Chiudi', 'common.ok': 'OK', 'common.back': 'Indietro', 'common.search': 'Cerca', 'common.loading': 'Caricamento...', 'common.error': 'Errore', 'common.success': 'Successo', 'common.required': 'Richiesto', 'common.comingSoon': 'In arrivo',
    'tabs.games': 'Giochi', 'tabs.schedule': 'Agenda', 'tabs.sos': 'SOS', 'tabs.chat': 'Chat', 'tabs.help': 'Aiuto', 'tabs.profile': 'Profilo',
    'auth.appName': 'BridgeApp', 'auth.tagline': 'Collegare le generazioni, un momento alla volta', 'auth.login': 'Accedi', 'auth.signup': 'Registrati',
    'games.title': 'Giochi', 'games.chess': 'Scacchi', 'games.poker': 'Poker', 'games.checkers': 'Dama', 'games.trivia': 'Quiz',
    'sos.title': 'SOS Emergenza', 'sos.buttonText': 'SOS', 'sos.emergencyServices': 'Servizi di Emergenza',
    'profile.title': 'Il Mio Profilo', 'profile.language': 'Lingua', 'profile.languageSub': "Cambia la lingua dell'app", 'profile.logOut': 'Esci',
    'help.title': 'Come Usare BridgeApp', 'voice.title': 'Comandi Vocali', 'voice.listening': 'Ascolto...',
  },
};

// Merge partial translations with English fallback
for (const [lang, partial] of Object.entries(langFills)) {
  translations[lang as LangCode] = { ...translations.en, ...partial };
}
// Also fill zh-TW with any missing keys from en
translations['zh-TW'] = { ...translations.en, ...translations['zh-TW'] };

// ─── Helper: get translation with fallback ─────────────────────
export function t(key: keyof TranslationKeys, lang: LangCode): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}
