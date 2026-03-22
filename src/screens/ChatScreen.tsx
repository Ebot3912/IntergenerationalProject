import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Image, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Friend } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Colors, FontSizes, Spacing, BorderRadius, Shadow } from '../utils/theme';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m`;
  if (hr < 24) return `${hr}h`;
  return `${day}d`;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [Colors.primary, Colors.secondary, Colors.accentGreen, Colors.accentBlue, Colors.warning];

export default function ChatScreen({ navigation }: any) {
  const { friends, messages, profile } = useApp();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Get unread counts and last messages
  const getFriendData = (friend: Friend) => {
    const conv = messages.filter(m => m.conversationId === friend.id);
    const last = conv.sort((a, b) => b.timestamp - a.timestamp)[0];
    return {
      lastMessage: last?.text || friend.lastMessage || 'Start a conversation!',
      lastTime: last?.timestamp || friend.lastMessageTime || 0,
    };
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('chat.title')}</Text>
          <Text style={styles.headerSubtitle}>{friends.length} {t('chat.connections')}</Text>
        </View>
        <TouchableOpacity style={styles.newChatBtn}>
          <Ionicons name="create-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder={t('chat.searchPlaceholder')}
          placeholderTextColor={Colors.textLight}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Online Users */}
      <View style={styles.onlineSection}>
        <Text style={styles.onlineSectionTitle}>{t('chat.onlineNow')}</Text>
        <FlatList
          horizontal
          data={friends.filter(f => f.online)}
          keyExtractor={f => f.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.onlineList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.onlineAvatar}
              onPress={() => navigation.navigate('Conversation', { friend: item })}
            >
              {item.photoUri ? (
                <Image source={{ uri: item.photoUri }} style={styles.onlineAvatarImg} />
              ) : (
                <View style={[styles.onlineAvatarPlaceholder, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
                  <Text style={styles.onlineAvatarText}>{getInitials(item.name)}</Text>
                </View>
              )}
              <View style={styles.onlineDot} />
              <Text style={styles.onlineName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noOnlineText}>{t('chat.noOneOnline')}</Text>
          )}
        />
      </View>

      {/* Conversations */}
      <FlatList
        data={filtered}
        keyExtractor={f => f.id}
        showsVerticalScrollIndicator={false}
        style={styles.conversationList}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>{t('chat.noConversations')}</Text>
            <Text style={styles.emptySubtitle}>{t('chat.startChatting')}</Text>
          </View>
        )}
        renderItem={({ item: friend, index }) => {
          const { lastMessage, lastTime } = getFriendData(friend);
          return (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => navigation.navigate('Conversation', { friend })}
              activeOpacity={0.7}
            >
              <View style={styles.convAvatarWrapper}>
                {friend.photoUri ? (
                  <Image source={{ uri: friend.photoUri }} style={styles.convAvatar} />
                ) : (
                  <View style={[styles.convAvatarPlaceholder, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
                    <Text style={styles.convAvatarText}>{getInitials(friend.name)}</Text>
                  </View>
                )}
                {friend.online && <View style={styles.convOnlineDot} />}
              </View>

              <View style={styles.convContent}>
                <View style={styles.convTopRow}>
                  <Text style={styles.convName}>{friend.name}</Text>
                  {lastTime > 0 && (
                    <Text style={styles.convTime}>{timeAgo(lastTime)}</Text>
                  )}
                </View>
                <Text style={styles.convLastMsg} numberOfLines={1}>{lastMessage}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={Colors.border} />
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md,
  },
  headerTitle: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.text },
  headerSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  newChatBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, marginHorizontal: Spacing.xl, marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    borderRadius: BorderRadius.xl, ...Shadow.small,
  },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.text },
  onlineSection: { paddingLeft: Spacing.xl, marginBottom: Spacing.md },
  onlineSectionTitle: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm },
  onlineList: { paddingRight: Spacing.xl, gap: Spacing.md },
  onlineAvatar: { alignItems: 'center', width: 60 },
  onlineAvatarImg: { width: 52, height: 52, borderRadius: 26 },
  onlineAvatarPlaceholder: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
  },
  onlineAvatarText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
  onlineDot: {
    position: 'absolute', bottom: 20, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.accentGreen, borderWidth: 2, borderColor: Colors.white,
  },
  onlineName: { fontSize: 11, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
  noOnlineText: { fontSize: FontSizes.sm, color: Colors.textLight, padding: Spacing.md },
  conversationList: { flex: 1, backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  conversationItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  convAvatarWrapper: { position: 'relative' },
  convAvatar: { width: 52, height: 52, borderRadius: 26 },
  convAvatarPlaceholder: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  convAvatarText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.lg },
  convOnlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: Colors.accentGreen, borderWidth: 2, borderColor: Colors.white,
  },
  convContent: { flex: 1 },
  convTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  convName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text },
  convTime: { fontSize: FontSizes.xs, color: Colors.textLight },
  convLastMsg: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  separator: { height: 1, backgroundColor: Colors.background, marginLeft: 80 },
  emptyState: { alignItems: 'center', padding: 60 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.text, marginTop: 16 },
  emptySubtitle: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },
});
