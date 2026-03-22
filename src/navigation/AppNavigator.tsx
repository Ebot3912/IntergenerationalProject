import React, { useRef } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceCommandButton from '../components/VoiceCommandButton';

import AuthScreen from '../screens/AuthScreen';
import GamesScreen from '../screens/GamesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EmergencyContactScreen from '../screens/EmergencyContactScreen';
import SOSScreen from '../screens/SOSScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ChatScreen from '../screens/ChatScreen';
import ConversationScreen from '../screens/ConversationScreen';
import HelpScreen from '../screens/HelpScreen';
import ChessGame from '../screens/games/ChessGame';
import ConnectFourGame from '../screens/games/ConnectFourGame';
import PokerGame from '../screens/games/PokerGame';
import TicTacToeGame from '../screens/games/TicTacToeGame';
import CheckersGame from '../screens/games/CheckersGame';
import WordSearchGame from '../screens/games/WordSearchGame';
import TriviaGame from '../screens/games/TriviaGame';

const Tab = createBottomTabNavigator();
const GamesStack = createStackNavigator();
const ChatStack = createStackNavigator();
const AuthStack = createStackNavigator();

function GamesStackNavigator() {
  return (
    <GamesStack.Navigator id="GamesStack" screenOptions={{ headerShown: false }}>
      <GamesStack.Screen name="GamesList" component={GamesScreen} />
      <GamesStack.Screen name="Chess" component={ChessGame} />
      <GamesStack.Screen name="ConnectFour" component={ConnectFourGame} />
      <GamesStack.Screen name="Poker" component={PokerGame} />
      <GamesStack.Screen name="TicTacToe" component={TicTacToeGame} />
      <GamesStack.Screen name="Checkers" component={CheckersGame} />
      <GamesStack.Screen name="WordSearch" component={WordSearchGame} />
      <GamesStack.Screen name="Trivia" component={TriviaGame} />
    </GamesStack.Navigator>
  );
}

function ChatStackNavigator() {
  return (
    <ChatStack.Navigator id="ChatStack" screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatList" component={ChatScreen} />
      <ChatStack.Screen name="Conversation" component={ConversationScreen} />
    </ChatStack.Navigator>
  );
}

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  size: number;
};

function TabIcon({ name, focused, size }: TabIconProps) {
  return (
    <View style={focused ? styles.activeTab : styles.inactiveTab}>
      <Ionicons name={name} size={size} color={focused ? Colors.white : Colors.textSecondary} />
    </View>
  );
}

function MainTabs() {
  const { t } = useLanguage();
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Games"
        component={GamesStackNavigator}
        options={{
          tabBarLabel: t('tabs.games'),
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name={focused ? 'game-controller' : 'game-controller-outline'} focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarLabel: t('tabs.schedule'),
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SOS"
        component={SOSScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.sosTabButton}>
              <Ionicons name="alert-circle" size={28} color={Colors.white} />
            </View>
          ),
          tabBarLabel: () => <Text style={styles.sosLabel}>{t('tabs.sos')}</Text>,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: t('tabs.chat'),
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Help"
        component={HelpScreen}
        options={{
          tabBarLabel: t('tabs.help'),
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name={focused ? 'help-circle' : 'help-circle-outline'} focused={focused} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ focused, size }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading, isConfigured } = useAuth();
  const { t } = useLanguage();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  const handleVoiceNavigate = (screen: string) => {
    const nav = navigationRef.current;
    if (!nav) return;

    // Tab screens
    const tabScreens = ['Games', 'Schedule', 'SOS', 'Chat', 'Help', 'Profile'];
    if (tabScreens.includes(screen)) {
      nav.navigate(screen);
      return;
    }

    // Game screens — navigate to Games tab first, then to the game
    const gameScreens = ['Chess', 'ConnectFour', 'Poker', 'TicTacToe', 'Checkers', 'WordSearch', 'Trivia'];
    if (gameScreens.includes(screen)) {
      nav.navigate('Games', { screen });
      return;
    }

    // Special commands
    if (screen === 'ReadHelp') {
      nav.navigate('Help');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  // If Firebase is configured, require auth. Otherwise, go straight to app.
  const showApp = !isConfigured || user;

  return (
    <NavigationContainer ref={navigationRef}>
      {showApp ? (
        <View style={{ flex: 1 }}>
          <MainTabs />
          <VoiceCommandButton onNavigate={handleVoiceNavigate} />
        </View>
      ) : (
        <AuthStack.Navigator id="AuthStack" screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Auth" component={AuthScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 12, fontSize: 16, color: Colors.textSecondary,
  },
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 6,
    marginBottom: 2,
  },
  inactiveTab: {
    padding: 6,
    marginBottom: 2,
  },
  sosTabButton: {
    backgroundColor: Colors.danger,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  sosLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.danger,
    marginTop: 2,
  },
});
