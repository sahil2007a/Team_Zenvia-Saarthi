// SAARTHI — Sarthi Guide AI Chat Screen
// Implements PRD §12 & TRD §6: Grounded AI Q&A, Provenance Labels, Sources Drawer & Suggested Inquiries

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { heritageSites } from '../../data/sites';
import { ChatMessage } from '../../components/guide/ChatMessage';
import { SuggestedQuestions } from '../../components/guide/SuggestedQuestions';
import { aiService } from '../../services/ai/aiService';
import type { ChatMessage as ChatMessageType } from '../../types/services';
import { useUserStore } from '../../store/userStore';

export default function GuideScreen() {
  const { t } = useTranslation();
  const userLang = useUserStore((s) => s.profile.language);
  const [selectedSiteId, setSelectedSiteId] = useState('qutub-minar');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Initial introductory message
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaste! I am your Sarthi Heritage Guide. Ask me anything about monument architecture, historical evidence, or cultural stories.',
      timestamp: new Date().toISOString(),
      sources: [
        {
          title: 'Archaeological Survey of India Official Database',
          sourceType: 'ASI',
          verified: true,
        },
      ],
      provenanceLabels: ['VERIFIED_FACT'],
      followUpQuestions: [
        'What am I looking at?',
        'Why is this monument important?',
        'Which parts are original?',
      ],
    },
  ]);

  const suggestedQuestions = [
    'What am I looking at?',
    'Why is this monument important?',
    'Tell me the story in simple Hindi',
    'What should I see next?',
    'I have 30 minutes. What should I explore?',
    'Which parts are original?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await aiService.askQuestion(query, {
        siteId: selectedSiteId,
        language: userLang,
      });

      const aiMessage: ChatMessageType = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toISOString(),
        sources: response.sources,
        provenanceLabels: response.provenanceLabels as any,
        followUpQuestions: response.followUpQuestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: ChatMessageType = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Unable to retrieve answer right now. Please check local site data or retry.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const selectedSite =
    heritageSites.find((s) => s.id === selectedSiteId) || heritageSites[0];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      {/* Top Heritage Context Selector */}
      <View style={styles.siteSelectorBar}>
        <Ionicons name="location-outline" size={16} color={Colors.primary} />
        <Text style={styles.siteSelectorLabel}>Context:</Text>
        <TouchableOpacity
          style={styles.siteSelectorPill}
          onPress={() => {
            // Cycle through sites for quick context switching
            const idx = heritageSites.findIndex((s) => s.id === selectedSiteId);
            const nextSite = heritageSites[(idx + 1) % heritageSites.length];
            setSelectedSiteId(nextSite.id);
          }}
          accessibilityRole="button"
          accessibilityLabel="Switch heritage site context"
        >
          <Text style={styles.siteSelectorText}>{selectedSite.name}</Text>
          <Ionicons name="swap-horizontal" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Chat Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatMessage
            message={item}
            onFollowUpPress={(q) => handleSend(q)}
          />
        )}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>
                Consulting Archaeological Survey records...
              </Text>
            </View>
          ) : null
        }
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Suggested Quick Question Chips */}
      <SuggestedQuestions
        questions={suggestedQuestions}
        onSelect={(q) => handleSend(q)}
      />

      {/* Message Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('guide.inputPlaceholder', 'Ask anything about this site...')}
          placeholderTextColor={Colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || loading) && styles.sendButtonDisabled,
          ]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || loading}
          accessibilityRole="button"
          accessibilityLabel="Send inquiry"
        >
          <Ionicons name="arrow-up" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  siteSelectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 6,
  },
  siteSelectorLabel: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  siteSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  siteSelectorText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  loadingText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.6,
  },
});
