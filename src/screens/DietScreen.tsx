import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';
import { useLanguage } from '../context/LanguageContext';

const API_BASE = __DEV__
  ? 'http://localhost:3000'
  : 'https://bridgeapp-sos.vercel.app';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type TabType = 'chat' | 'diet' | 'recipes';

export default function DietScreen() {
  const { t, lang } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const chatScrollRef = useRef<FlatList>(null);

  // ─── Topic cards for quick prompts ──────────────────────
  const TOPICS = [
    { icon: 'nutrition-outline' as const, label: t('ai.topicDiet'), color: Colors.accentGreen, prompt: t('ai.promptDiet') },
    { icon: 'fitness-outline' as const, label: t('ai.topicExercise'), color: Colors.secondary, prompt: t('ai.promptExercise') },
    { icon: 'medkit-outline' as const, label: t('ai.topicHealth'), color: Colors.danger, prompt: t('ai.promptHealth') },
    { icon: 'phone-portrait-outline' as const, label: t('ai.topicTech'), color: Colors.accentBlue, prompt: t('ai.promptTech') },
    { icon: 'happy-outline' as const, label: t('ai.topicChat'), color: Colors.accent, prompt: t('ai.promptChat') },
    { icon: 'game-controller-outline' as const, label: t('ai.topicGames'), color: Colors.primaryLight, prompt: t('ai.promptGames') },
  ];

  // ─── Diet tips ──────────────────────
  const DIET_TIPS = [
    { key: 'water', icon: 'water-outline' as const, title: t('diet.tipWater'), desc: t('diet.tipWaterDesc'), color: Colors.accentBlue },
    { key: 'fruits', icon: 'nutrition-outline' as const, title: t('diet.tipFruits'), desc: t('diet.tipFruitsDesc'), color: Colors.accentGreen },
    { key: 'grains', icon: 'leaf-outline' as const, title: t('diet.tipGrains'), desc: t('diet.tipGrainsDesc'), color: Colors.accent },
    { key: 'protein', icon: 'fish-outline' as const, title: t('diet.tipProtein'), desc: t('diet.tipProteinDesc'), color: Colors.secondary },
    { key: 'dairy', icon: 'cafe-outline' as const, title: t('diet.tipDairy'), desc: t('diet.tipDairyDesc'), color: Colors.primaryLight },
    { key: 'sugar', icon: 'close-circle-outline' as const, title: t('diet.tipSugar'), desc: t('diet.tipSugarDesc'), color: Colors.danger },
  ];

  const SAMPLE_MEALS = [
    { meal: t('diet.breakfast'), items: t('diet.breakfastItems'), icon: 'sunny-outline' as const },
    { meal: t('diet.lunch'), items: t('diet.lunchItems'), icon: 'partly-sunny-outline' as const },
    { meal: t('diet.dinner'), items: t('diet.dinnerItems'), icon: 'moon-outline' as const },
    { meal: t('diet.snacks'), items: t('diet.snackItems'), icon: 'heart-outline' as const },
  ];

  // ─── Recipes ──────────────────────
  const RECIPES = [
    {
      name: t('recipes.recipe1.name'), time: t('recipes.recipe1.time'), desc: t('recipes.recipe1.desc'),
      icon: 'flame-outline' as const, color: '#FF6B6B',
    },
    {
      name: t('recipes.recipe2.name'), time: t('recipes.recipe2.time'), desc: t('recipes.recipe2.desc'),
      icon: 'cafe-outline' as const, color: '#4ECDC4',
    },
    {
      name: t('recipes.recipe3.name'), time: t('recipes.recipe3.time'), desc: t('recipes.recipe3.desc'),
      icon: 'restaurant-outline' as const, color: '#FFD93D',
    },
    {
      name: t('recipes.recipe4.name'), time: t('recipes.recipe4.time'), desc: t('recipes.recipe4.desc'),
      icon: 'heart-outline' as const, color: '#C77DFF',
    },
  ];

  // Send message to AI
  const sendMessage = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    // Switch to chat tab if not already there
    if (activeTab !== 'chat') setActiveTab('chat');

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const systemPrompt = `You are Compass AI, a friendly and helpful AI assistant for BridgeApp — an app connecting seniors and children across generations. You can help with ANYTHING: health & nutrition advice, exercise tips, technology help, daily planning, conversation, answering questions, emotional support, games tips, recipes, history, science, and more. When giving recipes, provide complete step-by-step instructions with ingredients and measurements. Keep responses warm, supportive, clear, and easy to understand for all ages. Respond in the same language the user writes in. Current app language: ${lang}. For medical advice, always recommend consulting a doctor. Keep responses concise (under 250 words unless the user asks for detail or a full recipe).`;

      const res = await fetch(`${API_BASE}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, system: systemPrompt }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply,
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), role: 'assistant', content: t('diet.aiError'),
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant', content: t('diet.aiError'),
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const askRecipe = (recipeName: string) => {
    sendMessage(`Give me the complete step-by-step recipe for ${recipeName}. Include all ingredients with measurements, preparation steps, and cooking tips.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerBadge}>
            <Ionicons name="compass-outline" size={22} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t('ai.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('ai.subtitle')}</Text>
          </View>
        </View>
        {/* Tab switcher */}
        <View style={styles.tabRow}>
          {(['chat', 'recipes', 'diet'] as TabType[]).map(tab => {
            const icons: Record<TabType, keyof typeof Ionicons.glyphMap> = {
              chat: 'chatbubble-ellipses-outline',
              recipes: 'book-outline',
              diet: 'nutrition-outline',
            };
            const labels: Record<TabType, string> = {
              chat: t('ai.tabChat'),
              recipes: t('ai.tabRecipes'),
              diet: t('ai.tabDiet'),
            };
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Ionicons name={icons[tab]} size={16} color={activeTab === tab ? Colors.white : Colors.textSecondary} />
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{labels[tab]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ─── Recipes Tab ──────────────── */}
      {activeTab === 'recipes' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>{t('recipes.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('recipes.subtitle')}</Text>

          <View style={styles.recipesGrid}>
            {RECIPES.map((recipe, i) => (
              <View key={i} style={styles.recipeCard}>
                <View style={[styles.recipeIconWrap, { backgroundColor: recipe.color + '20' }]}>
                  <Ionicons name={recipe.icon} size={28} color={recipe.color} />
                </View>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <View style={styles.recipeTimeRow}>
                  <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.recipeTime}>{recipe.time}</Text>
                </View>
                <Text style={styles.recipeDesc} numberOfLines={3}>{recipe.desc}</Text>
                <TouchableOpacity
                  style={styles.getRecipeBtn}
                  onPress={() => askRecipe(recipe.name)}
                >
                  <Ionicons name="sparkles" size={14} color={Colors.white} />
                  <Text style={styles.getRecipeBtnText}>Get Recipe</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Ask AI banner */}
          <View style={styles.recipeBanner}>
            <Ionicons name="compass-outline" size={24} color={Colors.primary} />
            <Text style={styles.recipeBannerText}>{t('recipes.askAI')}</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* ─── Diet Tab ──────────────── */}
      {activeTab === 'diet' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>{t('diet.dailyTips')}</Text>
          <View style={styles.tipsGrid}>
            {DIET_TIPS.map(tip => (
              <View key={tip.key} style={styles.tipCard}>
                <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
                  <Ionicons name={tip.icon} size={24} color={tip.color} />
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDesc}>{tip.desc}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t('diet.sampleMeals')}</Text>
          <View style={styles.mealPlan}>
            {SAMPLE_MEALS.map((meal, i) => (
              <View key={i} style={styles.mealRow}>
                <View style={styles.mealIconWrap}>
                  <Ionicons name={meal.icon} size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mealLabel}>{meal.meal}</Text>
                  <Text style={styles.mealItems}>{meal.items}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.disclaimerCard}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.disclaimerText}>{t('diet.disclaimer')}</Text>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* ─── Chat Tab ──────────────── */}
      {activeTab === 'chat' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={chatScrollRef}
            data={messages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatMessages}
            renderItem={({ item }) => (
              <View style={[
                styles.bubble,
                item.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}>
                {item.role === 'assistant' && (
                  <Ionicons name="compass-outline" size={14} color={Colors.primary} style={{ marginRight: 6 }} />
                )}
                <Text style={[
                  styles.bubbleText,
                  item.role === 'user' ? styles.userBubbleText : styles.aiBubbleText,
                ]}>{item.content}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatTitle}>{t('ai.chatWelcome')}</Text>
                <Text style={styles.emptyChatText}>{t('ai.chatDesc')}</Text>
                <View style={styles.topicsGrid}>
                  {TOPICS.map((topic, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.topicCard}
                      onPress={() => sendMessage(topic.prompt)}
                    >
                      <View style={[styles.topicIcon, { backgroundColor: topic.color + '20' }]}>
                        <Ionicons name={topic.icon} size={22} color={topic.color} />
                      </View>
                      <Text style={styles.topicLabel}>{topic.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
          />

          {loading && (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.typingText}>{t('diet.aiTyping')}</Text>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.chatInput}
              value={input}
              onChangeText={setInput}
              placeholder={t('ai.inputPlaceholder')}
              placeholderTextColor={Colors.textLight}
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage()}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <Ionicons name="send" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: Spacing.lg },

  // Header
  header: {
    backgroundColor: Colors.white, paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  headerBadge: {
    backgroundColor: Colors.primary, width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.text },
  headerSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary },

  // Tabs
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.xs },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full, backgroundColor: Colors.background,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },

  // Section
  sectionTitle: {
    fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text,
    marginBottom: 4, marginTop: Spacing.lg,
  },
  sectionSubtitle: {
    fontSize: FontSizes.md, color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  // Recipes
  recipesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recipeCard: {
    width: '48%', backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.small,
  },
  recipeIconWrap: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  recipeName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  recipeTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  recipeTime: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  recipeDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 18, marginBottom: Spacing.sm },
  getRecipeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: Colors.primary, borderRadius: BorderRadius.full,
    paddingVertical: 8, paddingHorizontal: 12,
  },
  getRecipeBtnText: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.white },
  recipeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.primary + '10', borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '30',
  },
  recipeBannerText: { flex: 1, fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600', lineHeight: 20 },

  // Tips grid
  tipsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Spacing.xl },
  tipCard: {
    width: '48%', backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.small,
  },
  tipIcon: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  tipTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  tipDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 18 },

  // Meal plan
  mealPlan: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginBottom: Spacing.xl, ...Shadow.small,
  },
  mealRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.md },
  mealIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '15',
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  mealLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text },
  mealItems: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },

  // Disclaimer
  disclaimerCard: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.accent + '20',
    borderRadius: BorderRadius.md, padding: Spacing.md, gap: 8,
  },
  disclaimerText: { fontSize: FontSizes.sm, color: Colors.textSecondary, flex: 1, lineHeight: 18 },

  // ─── Chat styles ──────────────
  chatMessages: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, flexGrow: 1 },
  bubble: {
    maxWidth: '80%', borderRadius: BorderRadius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: Colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.white, alignSelf: 'flex-start', borderBottomLeftRadius: 4,
    ...Shadow.small,
  },
  bubbleText: { fontSize: FontSizes.md, lineHeight: 20, flex: 1 },
  userBubbleText: { color: Colors.white },
  aiBubbleText: { color: Colors.text },

  // Empty state
  emptyChat: { alignItems: 'center', paddingTop: 30, paddingHorizontal: Spacing.md },
  emptyChatTitle: { fontSize: FontSizes.xxl, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  emptyChatText: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: 8, marginBottom: Spacing.xl, textAlign: 'center' },
  topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.md, width: '100%' },
  topicCard: {
    width: '28%', minWidth: 90, backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', ...Shadow.small,
  },
  topicIcon: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  topicLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text, textAlign: 'center' },

  typingRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl,
    paddingVertical: 6, gap: 8,
  },
  typingText: { fontSize: FontSizes.sm, color: Colors.textSecondary },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chatInput: {
    flex: 1, backgroundColor: Colors.background, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSizes.md,
    maxHeight: 100, color: Colors.text,
  },
  sendBtn: {
    backgroundColor: Colors.primary, width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.sm,
  },
  sendBtnDisabled: { opacity: 0.5 },
});
