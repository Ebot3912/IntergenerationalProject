import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, ChatMessage, Friend } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Demo auto-reply messages
const AUTO_REPLIES = [
  "That's great! 😊",
  "I love spending time together!",
  "Can't wait to play chess later!",
  "You're so thoughtful ❤️",
  "Let's plan something fun soon!",
  "Miss you! 👴",
  "How's your day going?",
  "Tell me more!",
  "That sounds wonderful 🌟",
];

export default function ConversationScreen({ route, navigation }: any) {
  const { friend }: { friend: Friend } = route.params;
  const { messages, addMessage, profile } = useApp();
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const flatRef = useRef<FlatList>(null);

  const conversationMessages = messages
    .filter(m => m.conversationId === friend.id)
    .sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    // Seed some initial demo messages if empty
    if (conversationMessages.length === 0) {
      const seed: ChatMessage[] = [
        {
          id: 'seed1',
          text: `Hi there! How are you doing today? 😊`,
          senderId: friend.id,
          senderName: friend.name,
          senderPhoto: friend.photoUri,
          timestamp: Date.now() - 3600000,
          conversationId: friend.id,
        },
      ];
      seed.forEach(m => addMessage(m));
    }
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      senderId: 'me',
      senderName: profile.name || 'You',
      senderPhoto: profile.photoUri,
      timestamp: Date.now(),
      conversationId: friend.id,
    };
    await addMessage(msg);
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);

    // Auto-reply after a short delay
    setTimeout(async () => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        senderId: friend.id,
        senderName: friend.name,
        senderPhoto: friend.photoUri,
        timestamp: Date.now() + 1,
        conversationId: friend.id,
      };
      await addMessage(reply);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200 + Math.random() * 1000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerAvatar}>
          {friend.photoUri ? (
            <Image source={{ uri: friend.photoUri }} style={styles.headerAvatarImg} />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <Text style={styles.headerAvatarText}>{getInitials(friend.name)}</Text>
            </View>
          )}
          {friend.online && <View style={styles.headerOnlineDot} />}
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{friend.name}</Text>
          <Text style={styles.headerStatus}>{friend.online ? `🟢 ${t('conversation.online')}` : t('conversation.offline')}</Text>
        </View>

        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatRef}
          data={conversationMessages}
          keyExtractor={m => m.id}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item, index }) => {
            const isMe = item.senderId === 'me';
            const prevMsg = index > 0 ? conversationMessages[index - 1] : null;
            const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== item.senderId);
            const showTime = !prevMsg || (item.timestamp - prevMsg.timestamp > 300000);

            return (
              <>
                {showTime && (
                  <Text style={styles.timeStamp}>{formatTime(item.timestamp)}</Text>
                )}
                <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
                  {!isMe && (
                    <View style={styles.avatarCol}>
                      {showAvatar ? (
                        <View style={styles.msgAvatar}>
                          <Text style={styles.msgAvatarText}>{getInitials(item.senderName)}</Text>
                        </View>
                      ) : <View style={styles.avatarSpacer} />}
                    </View>
                  )}
                  <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                    <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.text}</Text>
                  </View>
                </View>
              </>
            );
          }}
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="image-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={t('conversation.typePlaceholder')}
            placeholderTextColor={Colors.textLight}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!text.trim()}
          >
            <Ionicons name="send" size={20} color={text.trim() ? Colors.white : Colors.textLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white, ...Shadow.small,
  },
  backBtn: { padding: 4 },
  headerAvatar: { position: 'relative' },
  headerAvatarImg: { width: 44, height: 44, borderRadius: 22 },
  headerAvatarPlaceholder: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
  headerOnlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.accentGreen, borderWidth: 2, borderColor: Colors.white,
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text },
  headerStatus: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 1 },
  headerAction: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center',
  },
  messageList: { flex: 1, backgroundColor: Colors.background },
  messageListContent: { padding: Spacing.md, paddingBottom: Spacing.lg },
  timeStamp: {
    textAlign: 'center', fontSize: FontSizes.xs, color: Colors.textLight,
    marginVertical: Spacing.sm,
  },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  messageRowMe: { justifyContent: 'flex-end' },
  avatarCol: { width: 36, marginRight: 6 },
  avatarSpacer: { width: 36 },
  msgAvatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  msgAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 11 },
  bubble: {
    maxWidth: '70%', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: BorderRadius.xl,
  },
  bubbleMe: {
    backgroundColor: Colors.primary, borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.white, borderBottomLeftRadius: 4, ...Shadow.small,
  },
  bubbleText: { fontSize: FontSizes.md, color: Colors.text, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  attachBtn: { padding: 8 },
  input: {
    flex: 1, backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: FontSizes.md, color: Colors.text, maxHeight: 100,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
});
