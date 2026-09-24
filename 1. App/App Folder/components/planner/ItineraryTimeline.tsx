// SAARTHI Design System — Itinerary Timeline Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import type { ItineraryStop } from '../../types/itinerary';
import { useAudioStore } from '../../store/audioStore';

interface ItineraryTimelineProps {
  stops: ItineraryStop[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ stops }) => {
  const playTrack = useAudioStore((s) => s.playTrack);

  return (
    <View style={styles.container}>
      {stops.map((stop, index) => {
        const isLast = index === stops.length - 1;

        return (
          <View key={stop.order} style={styles.stopRow}>
            {/* Spine */}
            <View style={styles.spine}>
              <View style={styles.orderCircle}>
                <Text style={styles.orderText}>{stop.order}</Text>
              </View>
              {!isLast && <View style={styles.connector} />}
            </View>

            {/* Stop Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.stopTitle}>{stop.title}</Text>
                <View style={styles.durationBadge}>
                  <Ionicons name="time-outline" size={12} color={Colors.primary} />
                  <Text style={styles.durationText}>{stop.durationMinutes} min</Text>
                </View>
              </View>

              <Text style={styles.description}>{stop.description}</Text>

              <View style={styles.cardFooter}>
                {stop.wheelchairAccessible && (
                  <View style={styles.accessibleTag}>
                    <Ionicons name="accessibility" size={13} color={Colors.success} />
                    <Text style={styles.accessibleText}>Wheelchair Friendly</Text>
                  </View>
                )}

                {stop.recommendedStoryId && (
                  <TouchableOpacity
                    style={styles.storyButton}
                    onPress={() =>
                      playTrack({
                        id: stop.recommendedStoryId!,
                        title: stop.title,
                        duration: stop.durationMinutes * 60,
                      })
                    }
                  >
                    <Ionicons name="volume-medium" size={13} color={Colors.primary} />
                    <Text style={styles.storyButtonText}>Audio Guide</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  stopRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  spine: {
    alignItems: 'center',
    width: 32,
    marginRight: Spacing.sm,
  },
  orderCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Typography.fonts.sansBold,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: Spacing.xs,
  },
  stopTitle: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
    gap: 3,
  },
  durationText: {
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  description: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  accessibleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accessibleText: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.success,
  },
  storyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  storyButtonText: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
});
