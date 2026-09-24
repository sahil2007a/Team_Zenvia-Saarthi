// SAARTHI — Active Itinerary Route Navigation Screen
// Shows stop-by-stop live exploration progress for generated itineraries

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { useItineraryStore } from '../../store/itineraryStore';
import { ItineraryTimeline } from '../../components/planner/ItineraryTimeline';
import { Button } from '../../components/common/Button';
import { useAudioStore } from '../../store/audioStore';

export default function ItineraryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const savedItineraries = useItineraryStore((s) => s.savedItineraries);
  const itinerary = savedItineraries.find((i) => i.id === id) || savedItineraries[0];
  const playTrack = useAudioStore((s) => s.playTrack);

  const [activeStopIndex, setActiveStopIndex] = useState(0);

  if (!itinerary) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="map-outline" size={48} color={Colors.error} />
        <Text style={styles.errorTitle}>Itinerary Not Found</Text>
        <Button
          title="Back to Planner"
          onPress={() => router.replace('/planner')}
          style={{ marginTop: Spacing.md }}
        />
      </View>
    );
  }

  const currentStop = itinerary.stops[activeStopIndex] || itinerary.stops[0];

  const handleNextStop = () => {
    if (activeStopIndex < itinerary.stops.length - 1) {
      setActiveStopIndex(activeStopIndex + 1);
    } else {
      Alert.alert(
        'Tour Complete!',
        'You have visited all stops on this curated itinerary.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          {itinerary.title}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Stop Card */}
        <View style={styles.activeStopCard}>
          <View style={styles.stopHeader}>
            <View style={styles.stopIndexBadge}>
              <Text style={styles.stopIndexText}>
                STOP {activeStopIndex + 1} OF {itinerary.stops.length}
              </Text>
            </View>
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={13} color={Colors.primary} />
              <Text style={styles.durationText}>
                {currentStop.durationMinutes} min
              </Text>
            </View>
          </View>

          <Text style={styles.activeTitle}>{currentStop.title}</Text>
          <Text style={styles.activeDesc}>{currentStop.description}</Text>

          {/* Accessibility & Audio guide buttons */}
          <View style={styles.activeActions}>
            {currentStop.recommendedStoryId && (
              <Button
                title="Listen to Guide"
                onPress={() =>
                  playTrack({
                    id: currentStop.recommendedStoryId!,
                    title: currentStop.title,
                    duration: currentStop.durationMinutes * 60,
                  })
                }
                variant="primary"
                size="sm"
                leftIcon={
                  <Ionicons name="volume-high" size={16} color={Colors.white} />
                }
              />
            )}
            <Button
              title={
                activeStopIndex === itinerary.stops.length - 1
                  ? 'Finish Tour'
                  : 'Next Stop'
              }
              onPress={handleNextStop}
              variant="secondary"
              size="sm"
              rightIcon={
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={Colors.primary}
                />
              }
            />
          </View>
        </View>

        {/* Complete Route Sequence */}
        <Text style={styles.fullRouteHeading}>All Stops on this Itinerary</Text>
        <ItineraryTimeline stops={itinerary.stops} />
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 110,
  },
  activeStopCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stopIndexBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  stopIndexText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  activeTitle: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  activeDesc: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  activeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  fullRouteHeading: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
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
