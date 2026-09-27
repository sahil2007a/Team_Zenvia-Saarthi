// SAARTHI Design System — Site Historical Timeline View
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';
import type { TimelineEvent } from '../../types/heritage';
import { ProvenanceBadge } from '../common/ProvenanceBadge';

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  return (
    <View style={styles.container}>
      {timeline.map((event, index) => {
        const isLast = index === timeline.length - 1;

        return (
          <View key={index} style={styles.timelineItem}>
            {/* Left spine with dot and line */}
            <View style={styles.spine}>
              <View style={styles.dot} />
              {!isLast && <View style={styles.line} />}
            </View>

            {/* Event content */}
            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text style={styles.year}>{event.year}</Text>
                {event.labels?.map((lbl, idx) => (
                  <ProvenanceBadge key={idx} label={lbl} size="sm" />
                ))}
              </View>

              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.description}>{event.description}</Text>
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
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  spine: {
    alignItems: 'center',
    width: 24,
    marginRight: Spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  year: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  description: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
});
