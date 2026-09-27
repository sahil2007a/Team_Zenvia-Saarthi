// SAARTHI Design System — Heritage Story Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows, Layout } from '../../constants/layout';
import type { HeritageStory } from '../../types/heritage';
import { ProvenanceBadge } from '../common/ProvenanceBadge';
import { useAudioStore } from '../../store/audioStore';

interface StoryCardProps {
  story: HeritageStory;
  onPress: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onPress }) => {
  const playTrack = useAudioStore((s) => s.playTrack);

  const handleAudioPress = (e: any) => {
    e.stopPropagation();
    if (story.audioAvailable && story.audioId) {
      playTrack({
        id: story.audioId,
        storyId: story.id,
        siteId: story.siteId,
        title: story.title,
        duration: story.readTime * 60,
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Read story: ${story.title}`}
    >
      {/* Category and Provenance Badges Header */}
      <View style={styles.badgeRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{story.category.toUpperCase()}</Text>
        </View>
        {story.labels.map((lbl, idx) => (
          <ProvenanceBadge key={idx} label={lbl} size="sm" />
        ))}
      </View>

      {/* Title */}
      <Text style={styles.title}>{story.title}</Text>

      {/* Summary Content */}
      <Text style={styles.summary} numberOfLines={3}>
        {story.summary}
      </Text>

      {/* Footer Info: Read Time, Source & Audio Button */}
      <View style={styles.footer}>
        <View style={styles.sourceMeta}>
          <Text style={styles.metaText}>
            {story.readTime} min read • Source: {story.source}
          </Text>
        </View>

        {story.audioAvailable && (
          <TouchableOpacity
            style={styles.listenButton}
            onPress={handleAudioPress}
            accessibilityRole="button"
            accessibilityLabel={`Listen to audio guide for ${story.title}`}
          >
            <Ionicons name="volume-high" size={14} color={Colors.primary} />
            <Text style={styles.listenText}>LISTEN</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Layout.cardPadding,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  categoryText: {
    color: Colors.primary,
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  summary: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  sourceMeta: {
    flex: 1,
  },
  metaText: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textTertiary,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  listenText: {
    color: Colors.primary,
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
});
