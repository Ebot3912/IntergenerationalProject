import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  Animated, Platform, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { triggerSOS } from '../utils/sendSOS';
import { SUPPORTED_LANGUAGES } from '../utils/i18n';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';

const API_BASE = __DEV__
  ? 'http://localhost:3000'
  : 'https://bridgeapp-sos.vercel.app';

interface VoiceCommandButtonProps {
  onNavigate: (screen: string) => void;
}

// ─── Supported languages ──────────────────────────────────────
interface Language {
  code: string;       // BCP-47 code for SpeechRecognition
  label: string;      // Display name
  flag: string;       // Emoji flag
  speechCode: string; // Code for expo-speech TTS
}


// ─── Multi-language voice commands ─────────────────────────────
// Each command has patterns in multiple languages
interface VoiceCommand {
  patterns: { [langPrefix: string]: string[] };
  target: string;
  responses: { [langPrefix: string]: string };
  action?: 'sendSOS';
}

const VOICE_COMMANDS: VoiceCommand[] = [
  // ── SOS ACTION ──
  {
    patterns: {
      en: ['send sos', 'send s.o.s', 'send emergency', 'trigger sos', 'activate sos', 'send help', 'i need help now', 'help me', 'emergency', 'sos'],
      zh: ['发送求救', '紧急求救', '救命', '救我', '发送紧急', 'sos', '呼救', '求救信号', '救命啊', '幫助我', '緊急求救'],
      es: ['enviar sos', 'emergencia', 'ayúdame', 'ayuda', 'socorro', 'enviar emergencia'],
      fr: ['envoyer sos', 'urgence', 'aidez-moi', 'au secours', 'aide', 'envoyer urgence'],
      de: ['sos senden', 'notfall', 'hilfe', 'hilf mir', 'notfall senden'],
      ja: ['助けて', '緊急', 'sos送信', '助けてください', '緊急事態', 'sos'],
      ko: ['도와줘', '긴급', 'sos 보내', '도움', '긴급 상황', '구조'],
      hi: ['मदद', 'बचाओ', 'आपातकालीन', 'एसओएस भेजो', 'मदद करो'],
      pt: ['enviar sos', 'emergência', 'me ajude', 'socorro', 'ajuda'],
      ar: ['أرسل نداء استغاثة', 'طوارئ', 'ساعدني', 'نجدة', 'إنقاذ'],
      vi: ['gửi sos', 'cấp cứu', 'cứu tôi', 'giúp tôi', 'khẩn cấp'],
      tl: ['ipadala sos', 'tulong', 'saklolo', 'emergency'],
      ru: ['отправить сос', 'помогите', 'экстренная', 'спасите', 'помощь'],
      it: ['invia sos', 'emergenza', 'aiuto', 'aiutami', 'soccorso'],
    },
    target: 'SendSOS',
    responses: {
      en: 'Sending SOS alert now!',
      zh: '正在发送求救信号！',
      es: 'Enviando alerta SOS ahora!',
      fr: 'Envoi de l\'alerte SOS maintenant!',
      de: 'SOS-Alarm wird jetzt gesendet!',
      ja: 'SOS信号を送信中！',
      ko: 'SOS 알림을 보내는 중!',
      hi: 'अभी SOS अलर्ट भेज रहे हैं!',
      pt: 'Enviando alerta SOS agora!',
      ar: '!جارٍ إرسال نداء الاستغاثة',
      vi: 'Đang gửi tín hiệu SOS!',
      tl: 'Ipinapadala ang SOS ngayon!',
      ru: 'Отправка сигнала SOS!',
      it: 'Invio allarme SOS ora!',
    },
    action: 'sendSOS',
  },
  // ── Navigation: Games ──
  {
    patterns: {
      en: ['go to games', 'open games', 'play games', 'games'],
      zh: ['打开游戏', '玩游戏', '游戏', '開啟遊戲'],
      es: ['ir a juegos', 'abrir juegos', 'juegos', 'jugar'],
      fr: ['ouvrir jeux', 'aller aux jeux', 'jeux', 'jouer'],
      de: ['spiele öffnen', 'zu spielen', 'spiele'],
      ja: ['ゲームを開く', 'ゲーム', '遊ぶ'],
      ko: ['게임 열기', '게임', '게임하자'],
      hi: ['गेम खोलो', 'खेल', 'गेम'],
      pt: ['abrir jogos', 'jogos', 'jogar'],
      ar: ['افتح الألعاب', 'ألعاب', 'العاب'],
      vi: ['mở trò chơi', 'trò chơi', 'chơi game'],
      tl: ['buksan laro', 'laro', 'maglaro'],
      ru: ['открыть игры', 'игры', 'играть'],
      it: ['apri giochi', 'giochi', 'giocare'],
    },
    target: 'Games',
    responses: { en: 'Opening Games', zh: '正在打开游戏', es: 'Abriendo Juegos', fr: 'Ouverture des Jeux', de: 'Spiele werden geöffnet', ja: 'ゲームを開きます', ko: '게임을 엽니다', hi: 'गेम खोल रहे हैं', pt: 'Abrindo Jogos', ar: 'فتح الألعاب', vi: 'Đang mở trò chơi', tl: 'Binubuksan ang laro', ru: 'Открываю игры', it: 'Apertura Giochi' },
  },
  // ── Navigation: Schedule ──
  {
    patterns: {
      en: ['go to schedule', 'open schedule', 'calendar', 'go to calendar', 'my schedule'],
      zh: ['打开日程', '日历', '我的日程', '行程', '開啟行事曆'],
      es: ['ir a horario', 'calendario', 'mi horario', 'agenda'],
      fr: ['ouvrir agenda', 'calendrier', 'mon emploi du temps'],
      de: ['kalender öffnen', 'terminplan', 'kalender'],
      ja: ['スケジュールを開く', 'カレンダー', '予定'],
      ko: ['일정 열기', '캘린더', '일정'],
      hi: ['शेड्यूल खोलो', 'कैलेंडर', 'मेरा शेड्यूल'],
      pt: ['abrir agenda', 'calendário', 'minha agenda'],
      ar: ['افتح الجدول', 'التقويم', 'جدولي'],
      vi: ['mở lịch', 'lịch trình', 'lịch của tôi'],
      tl: ['buksan iskedyul', 'kalendaryo'],
      ru: ['открыть расписание', 'календарь', 'мое расписание'],
      it: ['apri agenda', 'calendario', 'il mio programma'],
    },
    target: 'Schedule',
    responses: { en: 'Opening Schedule', zh: '正在打开日程', es: 'Abriendo Horario', fr: 'Ouverture de l\'Agenda', de: 'Kalender wird geöffnet', ja: 'スケジュールを開きます', ko: '일정을 엽니다', hi: 'शेड्यूल खोल रहे हैं', pt: 'Abrindo Agenda', ar: 'فتح الجدول', vi: 'Đang mở lịch', tl: 'Binubuksan ang iskedyul', ru: 'Открываю расписание', it: 'Apertura Agenda' },
  },
  // ── Navigation: SOS screen ──
  {
    patterns: {
      en: ['go to sos', 'open sos', 'go to emergency'],
      zh: ['打开求救', '打开紧急', '紧急页面'],
      es: ['ir a sos', 'abrir sos'],
      fr: ['aller à sos', 'ouvrir sos'],
      de: ['sos öffnen', 'notfall öffnen'],
      ja: ['sosを開く', '緊急ページ'],
      ko: ['sos 열기', '긴급 페이지'],
      hi: ['sos खोलो', 'आपातकालीन खोलो'],
      pt: ['abrir sos', 'ir para sos'],
      ar: ['افتح صفحة الطوارئ'],
      vi: ['mở sos', 'mở trang khẩn cấp'],
      tl: ['buksan sos'],
      ru: ['открыть сос', 'экстренная страница'],
      it: ['apri sos', 'pagina emergenza'],
    },
    target: 'SOS',
    responses: { en: 'Opening SOS screen', zh: '正在打开求救页面', es: 'Abriendo pantalla SOS', fr: 'Ouverture de l\'écran SOS', de: 'SOS-Bildschirm wird geöffnet', ja: 'SOSページを開きます', ko: 'SOS 화면을 엽니다', hi: 'SOS स्क्रीन खोल रहे हैं', pt: 'Abrindo tela SOS', ar: 'فتح شاشة الطوارئ', vi: 'Đang mở trang SOS', tl: 'Binubuksan ang SOS', ru: 'Открываю экран SOS', it: 'Apertura schermata SOS' },
  },
  // ── Navigation: Chat ──
  {
    patterns: {
      en: ['go to chat', 'open chat', 'messages', 'go to messages'],
      zh: ['打开聊天', '消息', '聊天', '開啟聊天'],
      es: ['ir a chat', 'abrir chat', 'mensajes'],
      fr: ['ouvrir chat', 'messages', 'discussion'],
      de: ['chat öffnen', 'nachrichten', 'chat'],
      ja: ['チャットを開く', 'メッセージ', 'チャット'],
      ko: ['채팅 열기', '메시지', '채팅'],
      hi: ['चैट खोलो', 'मैसेज', 'संदेश'],
      pt: ['abrir chat', 'mensagens', 'conversa'],
      ar: ['افتح المحادثة', 'رسائل', 'دردشة'],
      vi: ['mở chat', 'tin nhắn', 'trò chuyện'],
      tl: ['buksan chat', 'mensahe'],
      ru: ['открыть чат', 'сообщения', 'чат'],
      it: ['apri chat', 'messaggi', 'conversazione'],
    },
    target: 'Chat',
    responses: { en: 'Opening Chat', zh: '正在打开聊天', es: 'Abriendo Chat', fr: 'Ouverture du Chat', de: 'Chat wird geöffnet', ja: 'チャットを開きます', ko: '채팅을 엽니다', hi: 'चैट खोल रहे हैं', pt: 'Abrindo Chat', ar: 'فتح المحادثة', vi: 'Đang mở chat', tl: 'Binubuksan ang chat', ru: 'Открываю чат', it: 'Apertura Chat' },
  },
  // ── Navigation: Profile ──
  {
    patterns: {
      en: ['go to profile', 'open profile', 'my profile', 'profile'],
      zh: ['打开个人资料', '我的资料', '个人资料', '個人檔案'],
      es: ['ir a perfil', 'abrir perfil', 'mi perfil'],
      fr: ['ouvrir profil', 'mon profil', 'profil'],
      de: ['profil öffnen', 'mein profil', 'profil'],
      ja: ['プロフィールを開く', 'マイプロフィール'],
      ko: ['프로필 열기', '내 프로필', '프로필'],
      hi: ['प्रोफाइल खोलो', 'मेरी प्रोफाइल'],
      pt: ['abrir perfil', 'meu perfil', 'perfil'],
      ar: ['افتح الملف الشخصي', 'ملفي'],
      vi: ['mở hồ sơ', 'hồ sơ của tôi'],
      tl: ['buksan profile', 'aking profile'],
      ru: ['открыть профиль', 'мой профиль', 'профиль'],
      it: ['apri profilo', 'il mio profilo', 'profilo'],
    },
    target: 'Profile',
    responses: { en: 'Opening Profile', zh: '正在打开个人资料', es: 'Abriendo Perfil', fr: 'Ouverture du Profil', de: 'Profil wird geöffnet', ja: 'プロフィールを開きます', ko: '프로필을 엽니다', hi: 'प्रोफाइल खोल रहे हैं', pt: 'Abrindo Perfil', ar: 'فتح الملف الشخصي', vi: 'Đang mở hồ sơ', tl: 'Binubuksan ang profile', ru: 'Открываю профиль', it: 'Apertura Profilo' },
  },
  // ── Navigation: Help ──
  {
    patterns: {
      en: ['go to help', 'open help', 'how to use', 'instructions', 'help guide'],
      zh: ['打开帮助', '帮助', '使用说明', '怎么用', '幫助'],
      es: ['ir a ayuda', 'abrir ayuda', 'instrucciones', 'cómo usar'],
      fr: ['ouvrir aide', 'aide', 'comment utiliser', 'instructions'],
      de: ['hilfe öffnen', 'anleitung', 'wie benutzen'],
      ja: ['ヘルプを開く', '使い方', 'ヘルプ'],
      ko: ['도움말 열기', '사용법', '도움말'],
      hi: ['मदद खोलो', 'कैसे उपयोग करें', 'निर्देश'],
      pt: ['abrir ajuda', 'instruções', 'como usar'],
      ar: ['افتح المساعدة', 'كيفية الاستخدام', 'تعليمات'],
      vi: ['mở trợ giúp', 'hướng dẫn', 'cách sử dụng'],
      tl: ['buksan tulong', 'paano gamitin'],
      ru: ['открыть помощь', 'инструкции', 'как пользоваться'],
      it: ['apri aiuto', 'istruzioni', 'come usare'],
    },
    target: 'Help',
    responses: { en: 'Opening Help', zh: '正在打开帮助', es: 'Abriendo Ayuda', fr: 'Ouverture de l\'Aide', de: 'Hilfe wird geöffnet', ja: 'ヘルプを開きます', ko: '도움말을 엽니다', hi: 'मदद खोल रहे हैं', pt: 'Abrindo Ajuda', ar: 'فتح المساعدة', vi: 'Đang mở trợ giúp', tl: 'Binubuksan ang tulong', ru: 'Открываю помощь', it: 'Apertura Aiuto' },
  },
  // ── Navigation: Diet ──
  {
    patterns: {
      en: ['go to diet', 'open diet', 'diet', 'nutrition', 'healthy eating', 'meal plan', 'wellness', 'compass', 'open compass', 'compass ai', 'open ai', 'ask ai'],
      zh: ['打开饮食', '饮食', '营养', '健康饮食', '膳食计划'],
      es: ['ir a dieta', 'dieta', 'nutrición', 'alimentación saludable'],
      fr: ['ouvrir régime', 'régime', 'nutrition', 'alimentation saine'],
      de: ['öffne ernährung', 'ernährung', 'diät', 'gesunde ernährung'],
      ja: ['食事を開く', '食事', '栄養', '健康的な食事'],
      ko: ['식단 열기', '식단', '영양', '건강한 식사'],
      hi: ['आहार खोलें', 'आहार', 'पोषण', 'स्वस्थ भोजन'],
      pt: ['abrir dieta', 'dieta', 'nutrição', 'alimentação saudável'],
      ar: ['فتح النظام الغذائي', 'حمية', 'تغذية', 'أكل صحي'],
      vi: ['mở chế độ ăn', 'chế độ ăn', 'dinh dưỡng', 'ăn uống lành mạnh'],
      tl: ['buksan diyeta', 'diyeta', 'nutrisyon', 'malusog na pagkain'],
      ru: ['открыть диету', 'диета', 'питание', 'здоровое питание'],
      it: ['apri dieta', 'dieta', 'nutrizione', 'alimentazione sana'],
    },
    target: 'Diet',
    responses: { en: 'Opening Diet & Wellness', zh: '正在打开饮食与健康', es: 'Abriendo Dieta', fr: 'Ouverture Régime', de: 'Ernährung wird geöffnet', ja: '食事を開きます', ko: '식단을 엽니다', hi: 'आहार खोल रहे हैं', pt: 'Abrindo Dieta', ar: 'فتح النظام الغذائي', vi: 'Đang mở chế độ ăn', tl: 'Binubuksan ang diyeta', ru: 'Открываю диету', it: 'Apertura Dieta' },
  },
  // ── Games ──
  {
    patterns: {
      en: ['play chess', 'open chess', 'chess'],
      zh: ['下棋', '国际象棋', '象棋'],
      es: ['jugar ajedrez', 'ajedrez'],
      fr: ['jouer aux échecs', 'échecs'],
      de: ['schach spielen', 'schach'],
      ja: ['チェスをする', 'チェス'],
      ko: ['체스', '체스 하자'],
      hi: ['शतरंज खेलो', 'शतरंज'],
      pt: ['jogar xadrez', 'xadrez'],
      ar: ['لعب شطرنج', 'شطرنج'],
      vi: ['chơi cờ vua', 'cờ vua'],
      tl: ['chess', 'maglaro ng chess'],
      ru: ['играть в шахматы', 'шахматы'],
      it: ['giocare a scacchi', 'scacchi'],
    },
    target: 'Chess',
    responses: { en: 'Opening Chess', zh: '正在打开象棋', es: 'Abriendo Ajedrez', fr: 'Ouverture des Échecs', de: 'Schach wird geöffnet', ja: 'チェスを開きます', ko: '체스를 엽니다', hi: 'शतरंज खोल रहे हैं', pt: 'Abrindo Xadrez', ar: 'فتح الشطرنج', vi: 'Đang mở cờ vua', tl: 'Binubuksan ang chess', ru: 'Открываю шахматы', it: 'Apertura Scacchi' },
  },
  {
    patterns: {
      en: ['play connect four', 'connect four', 'connect 4'],
      zh: ['四子棋', '连四棋'],
      es: ['conecta cuatro', 'cuatro en línea'],
      fr: ['puissance quatre', 'quatre en ligne'],
      de: ['vier gewinnt'],
      ja: ['コネクトフォー', '四目並べ'],
      ko: ['사목', '커넥트포'],
      hi: ['कनेक्ट फोर'],
      pt: ['ligue quatro', 'conecta quatro'],
      ar: ['صل أربعة'],
      vi: ['connect four'],
      tl: ['connect four'],
      ru: ['четыре в ряд'],
      it: ['forza quattro'],
    },
    target: 'ConnectFour',
    responses: { en: 'Opening Connect Four', zh: '正在打开四子棋', es: 'Abriendo Conecta Cuatro', fr: 'Ouverture de Puissance 4', de: 'Vier Gewinnt wird geöffnet', ja: 'コネクトフォーを開きます', ko: '커넥트포를 엽니다', hi: 'कनेक्ट फोर खोल रहे हैं', pt: 'Abrindo Conecta 4', ar: 'فتح صل أربعة', vi: 'Đang mở Connect Four', tl: 'Binubuksan ang Connect Four', ru: 'Открываю четыре в ряд', it: 'Apertura Forza Quattro' },
  },
  {
    patterns: {
      en: ['play poker', 'poker'],
      zh: ['打扑克', '扑克', '德州扑克'],
      es: ['jugar póker', 'póker'],
      fr: ['jouer au poker', 'poker'],
      de: ['poker spielen', 'poker'],
      ja: ['ポーカー', 'ポーカーをする'],
      ko: ['포커', '포커 하자'],
      hi: ['पोकर खेलो', 'पोकर'],
      pt: ['jogar pôquer', 'pôquer'],
      ar: ['لعب بوكر', 'بوكر'],
      vi: ['chơi poker', 'poker'],
      tl: ['poker', 'maglaro ng poker'],
      ru: ['играть в покер', 'покер'],
      it: ['giocare a poker', 'poker'],
    },
    target: 'Poker',
    responses: { en: 'Opening Poker', zh: '正在打开扑克', es: 'Abriendo Póker', fr: 'Ouverture du Poker', de: 'Poker wird geöffnet', ja: 'ポーカーを開きます', ko: '포커를 엽니다', hi: 'पोकर खोल रहे हैं', pt: 'Abrindo Pôquer', ar: 'فتح البوكر', vi: 'Đang mở poker', tl: 'Binubuksan ang poker', ru: 'Открываю покер', it: 'Apertura Poker' },
  },
  {
    patterns: {
      en: ['play tic tac toe', 'tic tac toe', 'noughts and crosses'],
      zh: ['井字棋', '三连棋'],
      es: ['tres en raya', 'jugar tres en raya'],
      fr: ['morpion', 'jouer au morpion'],
      de: ['tic tac toe', 'drei gewinnt'],
      ja: ['三目並べ', 'まるばつゲーム'],
      ko: ['틱택토', '삼목'],
      hi: ['टिक टैक टो'],
      pt: ['jogo da velha'],
      ar: ['إكس أو', 'لعبة إكس أو'],
      vi: ['cờ caro', 'tic tac toe'],
      tl: ['tic tac toe'],
      ru: ['крестики-нолики'],
      it: ['tris', 'filetto'],
    },
    target: 'TicTacToe',
    responses: { en: 'Opening Tic Tac Toe', zh: '正在打开井字棋', es: 'Abriendo Tres en Raya', fr: 'Ouverture du Morpion', de: 'Tic Tac Toe wird geöffnet', ja: '三目並べを開きます', ko: '틱택토를 엽니다', hi: 'टिक टैक टो खोल रहे हैं', pt: 'Abrindo Jogo da Velha', ar: 'فتح إكس أو', vi: 'Đang mở tic tac toe', tl: 'Binubuksan ang tic tac toe', ru: 'Открываю крестики-нолики', it: 'Apertura Tris' },
  },
  {
    patterns: {
      en: ['play checkers', 'checkers', 'draughts'],
      zh: ['下跳棋', '跳棋', '西洋跳棋'],
      es: ['jugar damas', 'damas'],
      fr: ['jouer aux dames', 'dames'],
      de: ['dame spielen', 'dame'],
      ja: ['チェッカー'],
      ko: ['체커', '체커 하자'],
      hi: ['चेकर्स'],
      pt: ['jogar damas', 'damas'],
      ar: ['لعب الداما', 'الداما'],
      vi: ['cờ đam', 'checkers'],
      tl: ['checkers', 'dama'],
      ru: ['шашки', 'играть в шашки'],
      it: ['giocare a dama', 'dama'],
    },
    target: 'Checkers',
    responses: { en: 'Opening Checkers', zh: '正在打开跳棋', es: 'Abriendo Damas', fr: 'Ouverture des Dames', de: 'Dame wird geöffnet', ja: 'チェッカーを開きます', ko: '체커를 엽니다', hi: 'चेकर्स खोल रहे हैं', pt: 'Abrindo Damas', ar: 'فتح الداما', vi: 'Đang mở checkers', tl: 'Binubuksan ang checkers', ru: 'Открываю шашки', it: 'Apertura Dama' },
  },
  {
    patterns: {
      en: ['play word search', 'word search'],
      zh: ['找单词', '单词搜索', '找字游戏'],
      es: ['sopa de letras', 'buscar palabras'],
      fr: ['mots mêlés', 'recherche de mots'],
      de: ['wörter suchen', 'wortsuchspiel'],
      ja: ['ワードサーチ', '単語探し'],
      ko: ['단어 찾기'],
      hi: ['शब्द खोज'],
      pt: ['caça-palavras'],
      ar: ['البحث عن الكلمات'],
      vi: ['tìm từ', 'word search'],
      tl: ['word search', 'hanapin salita'],
      ru: ['поиск слов'],
      it: ['cerca parole', 'crucipuzzle'],
    },
    target: 'WordSearch',
    responses: { en: 'Opening Word Search', zh: '正在打开找字游戏', es: 'Abriendo Sopa de Letras', fr: 'Ouverture des Mots Mêlés', de: 'Wortsuchspiel wird geöffnet', ja: 'ワードサーチを開きます', ko: '단어 찾기를 엽니다', hi: 'शब्द खोज खोल रहे हैं', pt: 'Abrindo Caça-Palavras', ar: 'فتح البحث عن الكلمات', vi: 'Đang mở tìm từ', tl: 'Binubuksan ang word search', ru: 'Открываю поиск слов', it: 'Apertura Cerca Parole' },
  },
  {
    patterns: {
      en: ['play trivia', 'trivia', 'quiz'],
      zh: ['知识问答', '问答', '猜谜'],
      es: ['trivia', 'preguntas', 'quiz'],
      fr: ['trivia', 'quiz', 'questions'],
      de: ['quiz', 'trivia', 'quizspiel'],
      ja: ['トリビア', 'クイズ'],
      ko: ['퀴즈', '트리비아'],
      hi: ['क्विज़', 'सामान्य ज्ञान'],
      pt: ['trivia', 'quiz', 'perguntas'],
      ar: ['معلومات عامة', 'كويز', 'اسئلة'],
      vi: ['đố vui', 'quiz', 'trivia'],
      tl: ['trivia', 'quiz', 'tanong'],
      ru: ['викторина', 'квиз', 'тривиа'],
      it: ['trivia', 'quiz', 'domande'],
    },
    target: 'Trivia',
    responses: { en: 'Opening Trivia', zh: '正在打开知识问答', es: 'Abriendo Trivia', fr: 'Ouverture du Trivia', de: 'Quiz wird geöffnet', ja: 'トリビアを開きます', ko: '퀴즈를 엽니다', hi: 'क्विज़ खोल रहे हैं', pt: 'Abrindo Trivia', ar: 'فتح المعلومات العامة', vi: 'Đang mở đố vui', tl: 'Binubuksan ang trivia', ru: 'Открываю викторину', it: 'Apertura Trivia' },
  },
  // ── Read help ──
  {
    patterns: {
      en: ['read help', 'read instructions', 'read aloud'],
      zh: ['朗读帮助', '读出说明', '大声读'],
      es: ['leer ayuda', 'leer instrucciones', 'leer en voz alta'],
      fr: ['lire aide', 'lire instructions', 'lire à voix haute'],
      de: ['hilfe vorlesen', 'anleitung vorlesen'],
      ja: ['ヘルプを読む', '読み上げ'],
      ko: ['도움말 읽기', '소리내어 읽기'],
      hi: ['मदद पढ़ो', 'जोर से पढ़ो'],
      pt: ['ler ajuda', 'ler instruções'],
      ar: ['اقرأ المساعدة', 'اقرأ بصوت عالٍ'],
      vi: ['đọc trợ giúp', 'đọc to'],
      tl: ['basahin tulong'],
      ru: ['прочитать помощь', 'читать вслух'],
      it: ['leggi aiuto', 'leggi istruzioni'],
    },
    target: 'ReadHelp',
    responses: { en: 'Reading help instructions', zh: '正在朗读帮助说明', es: 'Leyendo instrucciones', fr: 'Lecture des instructions', de: 'Anleitung wird vorgelesen', ja: 'ヘルプを読み上げます', ko: '도움말을 읽겠습니다', hi: 'निर्देश पढ़ रहे हैं', pt: 'Lendo instruções', ar: 'قراءة التعليمات', vi: 'Đang đọc hướng dẫn', tl: 'Binabasa ang tulong', ru: 'Читаю инструкции', it: 'Lettura istruzioni' },
  },
];

function getLangPrefix(langCode: string): string {
  return langCode.split('-')[0];
}

function matchCommand(transcript: string, langCode: string): { target: string; response: string; action?: 'sendSOS' } | null {
  const lower = transcript.toLowerCase().trim();
  const prefix = getLangPrefix(langCode);

  for (const cmd of VOICE_COMMANDS) {
    // Check patterns for the selected language first
    const langPatterns = cmd.patterns[prefix] || [];
    for (const pattern of langPatterns) {
      if (lower.includes(pattern)) {
        const response = cmd.responses[prefix] || cmd.responses['en'];
        return { target: cmd.target, response, action: cmd.action };
      }
    }
    // Also check English as fallback (universal)
    if (prefix !== 'en') {
      const enPatterns = cmd.patterns['en'] || [];
      for (const pattern of enPatterns) {
        if (lower.includes(pattern)) {
          return { target: cmd.target, response: cmd.responses[prefix] || cmd.responses['en'], action: cmd.action };
        }
      }
    }
  }
  return null;
}

export default function VoiceCommandButton({ onNavigate }: VoiceCommandButtonProps) {
  const { emergencyContacts, profile } = useApp();
  const { lang, langOption, setLanguage, t: tApp } = useLanguage();
  const [listening, setListening] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('');
  const [sendingSOS, setSendingSOS] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recognitionRef = useRef<any>(null);

  // Map from LanguageContext to voice command language
  const selectedLang: Language = {
    code: langOption.speechCode,
    label: langOption.nativeLabel,
    flag: langOption.flag,
    speechCode: langOption.speechCode,
  };

  useEffect(() => {
    if (listening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [listening]);

  const handleSendSOS = useCallback(async () => {
    setSendingSOS(true);
    const prefix = getLangPrefix(selectedLang.code);
    const sosCmd = VOICE_COMMANDS[0]; // SOS is first command
    const responseText = sosCmd.responses[prefix] || sosCmd.responses['en'];
    setStatus(responseText);
    Speech.speak(responseText, { language: selectedLang.speechCode, rate: 1.0 });

    try {
      const result = await triggerSOS(emergencyContacts, profile.name, true);
      if (result.smsSent || result.emailSent) {
        setStatus(prefix === 'zh' ? 'SOS发送成功！' : prefix === 'es' ? 'SOS enviado!' : 'SOS sent successfully!');
      } else {
        setStatus('SOS attempted. Check the alert for details.');
      }
    } catch (err) {
      setStatus('Error sending SOS. Please use the SOS button manually.');
    } finally {
      setSendingSOS(false);
      setTimeout(() => setShowModal(false), 2000);
    }
  }, [emergencyContacts, profile.name, selectedLang]);

  // ─── AI fallback for unrecognized voice input ──────────────
  const askAI = useCallback(async (text: string, langCode: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          system: `You are Compass AI, a friendly voice assistant for BridgeApp — an app connecting seniors and children. The user spoke to you via voice. You can help with ANYTHING: health, nutrition, exercise, technology, daily planning, recipes, history, science, emotional support, games tips, general knowledge, and casual conversation. Give a brief, helpful answer (under 80 words). Be warm and supportive. Respond in the same language as the user's message. Language code: ${langCode}.`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setStatus(data.reply);
        Speech.speak(data.reply, { language: selectedLang.speechCode, rate: 0.9 });
      } else {
        setStatus(tApp('voice.notUnderstood'));
      }
    } catch {
      setStatus(tApp('voice.notUnderstood'));
    }
  }, [selectedLang, tApp]);

  const handleCommand = useCallback((match: { target: string; response: string; action?: 'sendSOS' }) => {
    setStatus(match.response);
    Speech.speak(match.response, { language: selectedLang.speechCode, rate: 1.0 });

    if (match.action === 'sendSOS') {
      handleSendSOS();
    } else {
      setTimeout(() => {
        setShowModal(false);
        setListening(false);
        onNavigate(match.target);
      }, 1000);
    }
  }, [onNavigate, handleSendSOS, selectedLang]);

  const startListening = useCallback(() => {
    if (Platform.OS !== 'web') {
      setShowModal(true);
      setStatus('Voice commands work best on web. Try saying a command in your browser!');
      setTranscript('');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Alert.alert('Not Supported', 'Voice recognition is not available in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang.code;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setShowModal(true);
      setShowLangPicker(false);
      const prefix = getLangPrefix(selectedLang.code);
      const listeningText = prefix === 'zh' ? '正在聆听...请说话' :
        prefix === 'es' ? 'Escuchando... hable ahora' :
        prefix === 'fr' ? 'Écoute... parlez maintenant' :
        prefix === 'de' ? 'Höre zu... sprechen Sie jetzt' :
        prefix === 'ja' ? '聞いています...話してください' :
        prefix === 'ko' ? '듣고 있습니다... 말씀하세요' :
        prefix === 'hi' ? 'सुन रहे हैं... अब बोलें' :
        prefix === 'pt' ? 'Ouvindo... fale agora' :
        prefix === 'ar' ? 'جارٍ الاستماع... تحدث الآن' :
        prefix === 'vi' ? 'Đang nghe... hãy nói' :
        prefix === 'tl' ? 'Nakikinig... magsalita na' :
        prefix === 'ru' ? 'Слушаю... говорите' :
        prefix === 'it' ? 'Ascolto... parla ora' :
        'Listening... speak now';
      setStatus(listeningText);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        const match = matchCommand(finalTranscript, selectedLang.code);
        if (match) {
          handleCommand(match);
        } else {
          // No command matched — send to Compass AI for a helpful response
          const prefix = getLangPrefix(selectedLang.code);
          const thinkingText = prefix === 'zh' ? '让我想想...' :
            prefix === 'ja' ? '考えています...' :
            prefix === 'es' ? 'Déjame pensar...' :
            prefix === 'fr' ? 'Laissez-moi réfléchir...' :
            prefix === 'de' ? 'Lass mich nachdenken...' :
            prefix === 'ko' ? '생각하고 있어요...' :
            'Let me think about that...';
          setStatus(thinkingText);
          askAI(finalTranscript, selectedLang.code);
        }
      }
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      if (event.error === 'not-allowed') {
        setStatus('Microphone access denied. Please allow microphone permission.');
      } else {
        setStatus(`Error: ${event.error}. Tap the mic to try again.`);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [handleCommand, selectedLang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }, []);

  const prefix = getLangPrefix(selectedLang.code);

  // Example commands in selected language
  const getExamples = () => {
    const sosCmd = VOICE_COMMANDS[0];
    const gamesCmd = VOICE_COMMANDS[1];
    const chatCmd = VOICE_COMMANDS[4];
    const sosExample = (sosCmd.patterns[prefix] || sosCmd.patterns['en'])[0];
    const gamesExample = (gamesCmd.patterns[prefix] || gamesCmd.patterns['en'])[0];
    const chatExample = (chatCmd.patterns[prefix] || chatCmd.patterns['en'])[0];
    return { sosExample, gamesExample, chatExample };
  };

  const examples = getExamples();

  return (
    <>
      {/* Floating Microphone Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={listening ? stopListening : startListening}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.fabInner, sendingSOS && styles.fabSOS, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons
            name={sendingSOS ? 'alert-circle' : listening ? 'mic-off' : 'mic'}
            size={26}
            color={Colors.white}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Voice Command Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => { stopListening(); setShowModal(false); setShowLangPicker(false); }}
            >
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>

            {/* Language Selector */}
            <TouchableOpacity
              style={styles.langSelector}
              onPress={() => setShowLangPicker(!showLangPicker)}
            >
              <Text style={styles.langFlag}>{selectedLang.flag}</Text>
              <Text style={styles.langLabel}>{selectedLang.label}</Text>
              <Ionicons name={showLangPicker ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
            </TouchableOpacity>

            {showLangPicker && (
              <ScrollView style={styles.langPicker} nestedScrollEnabled>
                {SUPPORTED_LANGUAGES.map((langOpt) => (
                  <TouchableOpacity
                    key={langOpt.code}
                    style={[styles.langOption, langOption.code === langOpt.code && styles.langOptionActive]}
                    onPress={() => { setLanguage(langOpt.code); setShowLangPicker(false); }}
                  >
                    <Text style={styles.langOptionFlag}>{langOpt.flag}</Text>
                    <Text style={[styles.langOptionLabel, langOption.code === langOpt.code && styles.langOptionLabelActive]}>
                      {langOpt.nativeLabel}
                    </Text>
                    {langOption.code === langOpt.code && (
                      <Ionicons name="checkmark" size={18} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {!showLangPicker && (
              <>
                <View style={styles.modalIcon}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Ionicons
                      name={sendingSOS ? 'alert-circle' : listening ? 'mic' : 'mic-outline'}
                      size={48}
                      color={sendingSOS ? Colors.danger : listening ? Colors.primary : Colors.textSecondary}
                    />
                  </Animated.View>
                </View>

                <Text style={styles.modalTitle}>
                  {sendingSOS ? tApp('voice.sendingSOS') : listening ? tApp('voice.listening') : tApp('voice.title')}
                </Text>

                {transcript ? (
                  <Text style={styles.transcript}>"{transcript}"</Text>
                ) : null}

                {status ? (
                  <Text style={[styles.statusText, sendingSOS && styles.statusSOS]}>{status}</Text>
                ) : null}

                {sendingSOS && (
                  <View style={styles.sosProgress}>
                    <View style={styles.sosProgressBar}>
                      <Animated.View style={styles.sosProgressFill} />
                    </View>
                    <Text style={styles.sosProgressText}>
                      {tApp('voice.contactingContacts')}
                    </Text>
                  </View>
                )}

                <View style={styles.commandsList}>
                  <Text style={styles.commandsHeader}>
                    {tApp('voice.trySaying')}
                  </Text>
                  <CommandExample text={`"${examples.sosExample}"`} highlight />
                  <CommandExample text={`"${examples.gamesExample}"`} />
                  <CommandExample text={`"${examples.chatExample}"`} />
                  <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border }}>
                    <Text style={styles.commandsHeader}>Or ask anything:</Text>
                    <CommandExample text={'"What should I eat for dinner?"'} ai />
                    <CommandExample text={'"How do I send a photo?"'} ai />
                    <CommandExample text={'"Tell me a fun fact"'} ai />
                  </View>
                </View>

                {!listening && !sendingSOS && (
                  <TouchableOpacity style={styles.retryBtn} onPress={startListening}>
                    <Ionicons name="mic" size={20} color={Colors.white} />
                    <Text style={styles.retryText}>
                      {tApp('voice.tapToListen')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

function CommandExample({ text, highlight, ai }: { text: string; highlight?: boolean; ai?: boolean }) {
  return (
    <View style={styles.cmdRow}>
      <Ionicons
        name={highlight ? 'alert-circle' : ai ? 'compass-outline' : 'chatbubble-outline'}
        size={14}
        color={highlight ? Colors.danger : ai ? Colors.primary : Colors.primaryLight}
      />
      <Text style={[styles.cmdText, highlight && styles.cmdTextHighlight, ai && styles.cmdTextAI]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    zIndex: 999,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.large,
  },
  fabSOS: {
    backgroundColor: Colors.danger,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  langFlag: {
    fontSize: 20,
  },
  langLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  langPicker: {
    width: '100%',
    maxHeight: 300,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  langOptionActive: {
    backgroundColor: Colors.primary + '10',
  },
  langOptionFlag: {
    fontSize: 20,
  },
  langOptionLabel: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  langOptionLabelActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    ...Shadow.large,
    maxHeight: '85%',
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 10,
  },
  modalIcon: {
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  transcript: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  statusText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  statusSOS: {
    color: Colors.danger,
    fontWeight: '700',
  },
  sosProgress: {
    width: '100%',
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  sosProgressBar: {
    width: '80%',
    height: 6,
    backgroundColor: Colors.danger + '20',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sosProgressFill: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.danger,
    borderRadius: 3,
  },
  sosProgressText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  commandsList: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  commandsHeader: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  cmdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cmdText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  cmdTextHighlight: {
    fontWeight: '700',
    color: Colors.danger,
  },
  cmdTextAI: {
    color: Colors.primary,
    fontStyle: 'italic',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
  },
  retryText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.white,
  },
});
