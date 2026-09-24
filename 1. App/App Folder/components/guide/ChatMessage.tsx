// SAARTHI Design System — AI Guide Chat Message Component
// Implements verified provenance tags, collapsible sources drawer, and grounded responses

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import type { ChatMessage as ChatMessageType } from '../../types/services';
import { ProvenanceBadge } from '../common/ProvenanceBadge';

interface ChatMessageProps {
  message: ChatMessageType;
  onFollowUpPress?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onFollowUpPress,
}) => {
  const isUser = message.sender === 'user';
  const [sourcesOpen, setSourcesOpen] = useState(false);

  if (isUser) {
    return (
      <View style={styles.userWrapper}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiWrapper}>
      <View style={styles.aiHeader}>
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={14} color={Colors.white} />
        </View>
        <Text style={styles.aiName}>SARTHI GUIDE</Text>
      </View>

      <View style={styles.aiBubble}>
        {/* Provenance Tags Row */}
        {message.provenanceLabels && message.provenanceLabels.length > 0 && (
          <View style={styles.provenanceRow}>
            {message.provenanceLabels.map((lbl, idx) => (
              <ProvenanceBadge key={idx} label={lbl} size="sm" />
            ))}
          </View>
        )}

        {/* Text Answer */}
        <Text style={styles.aiText}>{message.text}</Text>

        {/* Sources Accordion */}
        {message.sources && message.sources.length > 0 && (
          <View style={styles.sourcesContainer}>
            <TouchableOpacity
              style={styles.sourcesToggle}
              onPress={() => setSourcesOpen(!sourcesOpen)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={Colors.primary}
              />
              <Text style={styles.sourcesToggleText}>
                {sourcesOpen
                  ? 'Hide Verified Sources'
                  : `Verified Sources (${message.sources.length})`}
              </Text>
              <Ionicons
                name={sourcesOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>

            {sourcesOpen && (
              <View style={styles.sourcesList}>
                {message.sources.map((src, idx) => (
                  <View key={idx} style={styles.sourceItem}>
                    <Text style={styles.sourceTitle}>• {src.title}</Text>
                    <Text style={styles.sourceMeta}>{src.sourceType}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Suggested Follow-up Questions */}
      {message.followUpQuestions && message.followUpQuestions.length > 0 && (
        <View style={styles.followUpWrapper}>
          <Text style={styles.followUpHeader}>Related questions you can ask:</Text>
          <View style={styles.followUpChips}>
            {message.followUpQuestions.map((q, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.followUpChip}
                onPress={() => onFollowUpPress && onFollowUpPress(q)}
              >
                <Text style={styles.followUpText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userWrapper: {
    alignItems: 'flex-end',
    marginVertical: Spacing.xs + 2,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.xs,
    maxWidth: '82%',
    ...Shadows.sm,
  },
  userText: {
    color: Colors.white,
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    lineHeight: 20,
  },
  aiWrapper: {
    alignItems: 'flex-start',
    marginVertical: Spacing.sm,
    width: '100%',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginLeft: 4,
  },
  aiAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiName: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.xs,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  provenanceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  aiText: {
    color: Colors.textPrimary,
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    lineHeight: 22,
  },
  sourcesContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  sourcesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourcesToggleText: {
    flex: 1,
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  sourcesList: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.sm,
  },
  sourceItem: {
    marginBottom: 4,
  },
  sourceTitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  sourceMeta: {
    fontSize: 10,
    fontFamily: Typography.fonts.sans,
    color: Colors.textTertiary,
    marginLeft: 8,
  },
  followUpWrapper: {
    marginTop: Spacing.sm,
    width: '100%',
    paddingLeft: 4,
  },
  followUpHeader: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  followUpChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  followUpChip: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  followUpText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.primary,
  },
});
