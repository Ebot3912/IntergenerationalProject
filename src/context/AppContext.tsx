import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAuth } from './AuthContext';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface UserProfile {
  name: string;
  age: string;
  role: 'senior' | 'child' | '';
  bio: string;
  photoUri: string | null;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  color: string;
  notificationId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPhoto: string | null;
  timestamp: number;
  conversationId: string;
}

export interface Friend {
  id: string;
  name: string;
  photoUri: string | null;
  lastMessage?: string;
  lastMessageTime?: number;
  online?: boolean;
}

interface AppContextType {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (c: EmergencyContact) => void;
  updateEmergencyContact: (c: EmergencyContact) => void;
  removeEmergencyContact: (id: string) => void;
  scheduleEvents: ScheduleEvent[];
  addScheduleEvent: (e: ScheduleEvent) => void;
  updateScheduleEvent: (e: ScheduleEvent) => void;
  removeScheduleEvent: (id: string) => void;
  messages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;
  friends: Friend[];
  addFriend: (f: Friend) => void;
}

const defaultProfile: UserProfile = {
  name: '',
  age: '',
  role: '',
  bio: '',
  photoUri: null,
};

const defaultFriends: Friend[] = [
  { id: 'demo1', name: 'Grandpa Joe', photoUri: null, lastMessage: 'Ready for chess?', lastMessageTime: Date.now() - 300000, online: true },
  { id: 'demo2', name: 'Emma (age 10)', photoUri: null, lastMessage: 'That was fun!', lastMessageTime: Date.now() - 3600000, online: false },
  { id: 'demo3', name: 'Grandma Rose', photoUri: null, lastMessage: 'See you tomorrow!', lastMessageTime: Date.now() - 86400000, online: true },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Helper: Save to both Firestore and AsyncStorage ──────────
async function saveData(userId: string | null, key: string, data: any) {
  // Always save locally for fast access
  await AsyncStorage.setItem(key, JSON.stringify(data));

  // If logged in and Firebase is configured, also save to Firestore
  if (userId && isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'users', userId), { [key]: data }, { merge: true });
    } catch (err) {
      console.warn(`Firestore save error (${key}):`, err);
    }
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [friends, setFriends] = useState<Friend[]>(defaultFriends);

  // ─── Load data when user changes (login/logout) ──────────
  useEffect(() => {
    if (user && isFirebaseConfigured && db) {
      // User is logged in → try Firestore first, fall back to local
      loadFromFirestore(user.uid);
    } else {
      // Not logged in or Firebase not configured → load from local storage
      loadFromLocal();
    }
  }, [user?.uid]);

  // ─── Real-time Firestore sync (live updates across devices) ──
  useEffect(() => {
    if (!user || !isFirebaseConfigured || !db) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.profile) setProfile(data.profile);
        if (data.emergencyContacts) setEmergencyContacts(data.emergencyContacts);
        if (data.scheduleEvents) setScheduleEvents(data.scheduleEvents);
        if (data.messages) setMessages(data.messages);
        if (data.friends) setFriends(data.friends);
      }
    }, (err) => {
      console.warn('Firestore listener error:', err);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const loadFromFirestore = async (userId: string) => {
    if (!db) { await loadFromLocal(); return; }
    try {
      const snapshot = await getDoc(doc(db, 'users', userId));
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.profile) setProfile(data.profile);
        if (data.emergencyContacts) setEmergencyContacts(data.emergencyContacts);
        if (data.scheduleEvents) setScheduleEvents(data.scheduleEvents);
        if (data.messages) setMessages(data.messages);
        if (data.friends) setFriends(data.friends);

        // Also cache locally
        if (data.profile) await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.emergencyContacts) await AsyncStorage.setItem('emergencyContacts', JSON.stringify(data.emergencyContacts));
        if (data.scheduleEvents) await AsyncStorage.setItem('scheduleEvents', JSON.stringify(data.scheduleEvents));
        if (data.messages) await AsyncStorage.setItem('messages', JSON.stringify(data.messages));
        if (data.friends) await AsyncStorage.setItem('friends', JSON.stringify(data.friends));
        return;
      }
    } catch (err) {
      console.warn('Firestore load error, falling back to local:', err);
    }

    // Fall back to local storage if Firestore fails or has no data
    await loadFromLocal();

    // Upload local data to Firestore for first-time users
    try {
      const localProfile = await AsyncStorage.getItem('profile');
      const localContacts = await AsyncStorage.getItem('emergencyContacts');
      const localEvents = await AsyncStorage.getItem('scheduleEvents');
      const localMessages = await AsyncStorage.getItem('messages');
      const localFriends = await AsyncStorage.getItem('friends');

      if (!db) return;
      await setDoc(doc(db, 'users', userId), {
        profile: localProfile ? JSON.parse(localProfile) : defaultProfile,
        emergencyContacts: localContacts ? JSON.parse(localContacts) : [],
        scheduleEvents: localEvents ? JSON.parse(localEvents) : [],
        messages: localMessages ? JSON.parse(localMessages) : [],
        friends: localFriends ? JSON.parse(localFriends) : defaultFriends,
      }, { merge: true });
    } catch (err) {
      console.warn('Initial Firestore upload error:', err);
    }
  };

  const loadFromLocal = async () => {
    try {
      const [p, ec, se, msgs, fr] = await Promise.all([
        AsyncStorage.getItem('profile'),
        AsyncStorage.getItem('emergencyContacts'),
        AsyncStorage.getItem('scheduleEvents'),
        AsyncStorage.getItem('messages'),
        AsyncStorage.getItem('friends'),
      ]);
      if (p) setProfile(JSON.parse(p));
      if (ec) setEmergencyContacts(JSON.parse(ec));
      if (se) setScheduleEvents(JSON.parse(se));
      if (msgs) setMessages(JSON.parse(msgs));
      if (fr) setFriends(JSON.parse(fr));
    } catch {}
  };

  const userId = user?.uid || null;

  const updateProfile = async (p: Partial<UserProfile>) => {
    const updated = { ...profile, ...p };
    setProfile(updated);
    await saveData(userId, 'profile', updated);
  };

  const addEmergencyContact = async (c: EmergencyContact) => {
    const updated = [...emergencyContacts, c];
    setEmergencyContacts(updated);
    await saveData(userId, 'emergencyContacts', updated);
  };

  const updateEmergencyContact = async (c: EmergencyContact) => {
    const updated = emergencyContacts.map(ec => ec.id === c.id ? c : ec);
    setEmergencyContacts(updated);
    await saveData(userId, 'emergencyContacts', updated);
  };

  const removeEmergencyContact = async (id: string) => {
    const updated = emergencyContacts.filter(c => c.id !== id);
    setEmergencyContacts(updated);
    await saveData(userId, 'emergencyContacts', updated);
  };

  const addScheduleEvent = async (e: ScheduleEvent) => {
    const updated = [...scheduleEvents, e];
    setScheduleEvents(updated);
    await saveData(userId, 'scheduleEvents', updated);
  };

  const updateScheduleEvent = async (e: ScheduleEvent) => {
    const updated = scheduleEvents.map(ev => ev.id === e.id ? e : ev);
    setScheduleEvents(updated);
    await saveData(userId, 'scheduleEvents', updated);
  };

  const removeScheduleEvent = async (id: string) => {
    const updated = scheduleEvents.filter(e => e.id !== id);
    setScheduleEvents(updated);
    await saveData(userId, 'scheduleEvents', updated);
  };

  const addMessage = async (m: ChatMessage) => {
    const updated = [...messages, m];
    setMessages(updated);
    await saveData(userId, 'messages', updated);
  };

  const addFriend = async (f: Friend) => {
    const updated = [...friends, f];
    setFriends(updated);
    await saveData(userId, 'friends', updated);
  };

  return (
    <AppContext.Provider value={{
      profile, updateProfile,
      emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact,
      scheduleEvents, addScheduleEvent, updateScheduleEvent, removeScheduleEvent,
      messages, addMessage,
      friends, addFriend,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
