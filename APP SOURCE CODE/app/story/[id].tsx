// SAARTHI — Heritage Story Detail & Reader Screen
// Implements PRD §14: In-depth reading, provenance stamps, source verification, and integrated audio narration

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { getStoryById, getStoriesBySiteId } from '../../data/stories';
import { getSiteById } from '../../data/sites';
import { ProvenanceBadge } from '../../components/common/ProvenanceBadge';
import { Button } from '../../components/common/Button';
import { useAudioStore } from '../../store/audioStore';

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const story = getStoryById(id || 'story-qm-arch');
  const site = story ? getSiteById(story.siteId) : null;
  const otherStories = site
    ? getStoriesBySiteId(site.id).filter((s) => s.id !== story?.id)
    : [];

  const playTrack = useAudioStore((s) => s.playTrack);
  const currentTrack = useAudioStore((s) => s.currentTrack);
  const playbackState = useAudioStore((s) => s.playbackState);
  const pause = useAudioStore((s) => s.pause);
  const resume = useAudioStore((s) => s.resume);

  if (!story) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-text-outline" size={48} color={Colors.error} />
        <Text style={styles.errorTitle}>Story Not Found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={{ marginTop: Spacing.md }}
        />
      </View>
    );
  }

  const isCurrentPlaying =
    currentTrack?.id === story.audioId && playbackState === 'playing';

  const handleAudioToggle = () => {
    if (isCurrentPlaying) {
      pause();
    } else if (currentTrack?.id === story.audioId && playbackState === 'paused') {
      resume();
    } else {
      playTrack({
        id: story.audioId || `audio-${story.id}`,
        storyId: story.id,
        siteId: story.siteId,
        title: story.title,
        duration: story.readTime * 60,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        {site && (
          <TouchableOpacity
            style={styles.sitePill}
            onPress={() => router.push(`/site/${site.id}`)}
          >
            <Ionicons name="business-outline" size={14} color={Colors.primary} />
            <Text style={styles.sitePillText} numberOfLines={1}>
              {site.name}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Category & Provenance */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{story.category.toUpperCase()}</Text>
          </View>
          {story.labels.map((lbl, idx) => (
            <ProvenanceBadge key={idx} label={lbl} size="sm" />
          ))}
        </View>

        {/* Story Title */}
        <Text style={styles.title}>{story.title}</Text>

        {/* Read time & language meta */}
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.metaText}>{story.readTime} min read</Text>
          <Text style={styles.metaText}>•</Text>
          <Ionicons name="globe-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.metaText}>
            Language: {story.language.toUpperCase()}
          </Text>
        </View>

        {/* In-Story Audio Narration Bar */}
        {story.audioAvailable && (
          <TouchableOpacity
            style={[
              styles.audioBanner,
              isCurrentPlaying && styles.audioBannerPlaying,
            ]}
            onPress={handleAudioToggle}
            activeOpacity={0.85}
          >
            <View style={styles.audioIconCircle}>
              <Ionicons
                name={isCurrentPlaying ? 'pause' : 'play'}
                size={20}
                color={Colors.white}
              />
            </View>
            <View style={styles.audioBannerTextCol}>
              <Text style={styles.audioBannerTitle}>
                {isCurrentPlaying ? 'Playing Audio Narration' : 'Listen to Audio Guide'}
              </Text>
              <Text style={styles.audioBannerSub}>
                Narrated heritage commentary ({story.readTime}:00 min)
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Summary Lead Paragraph */}
        <Text style={styles.summaryLead}>{story.summary}</Text>

        {/* Full In-Depth Story Content */}
        <Text style={styles.mainContent}>{story.content}</Text>

        {/* Scholarly Provenance & Verification Box */}
        <View style={styles.provenanceBox}>
          <View style={styles.provenanceHeader}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
            <Text style={styles.provenanceTitle}>Documentary Verification</Text>
          </View>
          <Text style={styles.provenanceMeta}>Primary Source: {story.source}</Text>
          {story.verifiedBy && (
            <Text style={styles.provenanceMeta}>
              Verified by: {story.verifiedBy}
            </Text>
          )}
          <Text style={styles.provenanceMeta}>
            Record Updated: {story.lastUpdated}
          </Text>
        </View>

        {/* Related Stories at this Site */}
        {otherStories.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>Related Stories at this Site</Text>
            {otherStories.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedCard}
                onPress={() => router.push(`/story/${item.id}`)}
              >
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedTitle}>{item.title}</Text>
                  <Text style={styles.relatedCategory}>
                    {item.category} • {item.readTime} min read
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sitePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
    gap: 6,
    maxWidth: 220,
  },
  sitePillText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: 110,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
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
    fontSize: Typography.scale.h1,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  metaText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
  },
  audioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  audioBannerPlaying: {
    backgroundColor: '#FDF7F5',
  },
  audioIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioBannerTextCol: {
    flex: 1,
  },
  audioBannerTitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  audioBannerSub: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  summaryLead: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifMedium,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  mainContent: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sans,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  provenanceBox: {
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.xl,
  },
  provenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  provenanceTitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  provenanceMeta: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  relatedSection: {
    marginTop: Spacing.md,
  },
  relatedHeading: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  relatedInfo: {
    flex: 1,
  },
  relatedTitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  relatedCategory: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
});
