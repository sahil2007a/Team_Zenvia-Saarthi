// SAARTHI — Heritage Planner Screen
// Implements PRD §15 & TRD §20, §21: Curated Itinerary Generation, Stop Timelines, and Saved Plans

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { PreferenceForm } from '../../components/planner/PreferenceForm';
import { ItineraryTimeline } from '../../components/planner/ItineraryTimeline';
import { Button } from '../../components/common/Button';
import { itineraryService } from '../../services/itinerary/itineraryService';
import { useItineraryStore } from '../../store/itineraryStore';
import { useOfflineStore } from '../../store/offlineStore';
import type { ItineraryPreferences, GeneratedItinerary } from '../../types/itinerary';

export default function PlannerScreen() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'create' | 'saved'>('create');
  const [preferences, setPreferences] = useState<ItineraryPreferences>({
    siteId: 'qutub-minar',
    duration: '1-2 hours',
    interests: ['Architecture', 'History'],
    budget: 'medium',
    travelGroup: 'couple',
    mobility: 'full',
    language: 'en',
  });

  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);

  const saveItinerary = useItineraryStore((s) => s.saveItinerary);
  const savedItineraries = useItineraryStore((s) => s.savedItineraries);
  const deleteItinerary = useItineraryStore((s) => s.deleteItinerary);
  const downloadSite = useOfflineStore((s) => s.downloadSite);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generated = await itineraryService.generateItinerary(preferences);
      setItinerary(generated);
    } catch (err) {
      Alert.alert('Error', 'Unable to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;
    await saveItinerary(itinerary);
    Alert.alert('Saved', t('planner.planSaved', 'Plan saved successfully!'));
  };

  const handleDownloadOffline = async () => {
    if (!itinerary) return;
    await downloadSite(itinerary.siteId);
    Alert.alert('Offline Pack', `Downloaded complete pack for ${itinerary.siteName}.`);
  };

  return (
    <View style={styles.container}>
      {/* Top Segmented Tab (Create / Saved) */}
      <View style={styles.topTabs}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'create' && styles.tabBtnActive]}
          onPress={() => setTab('create')}
        >
          <Ionicons
            name="sparkles"
            size={16}
            color={tab === 'create' ? Colors.primary : Colors.textSecondary}
          />
          <Text
            style={[styles.tabBtnText, tab === 'create' && styles.tabBtnTextActive]}
          >
            Create Plan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === 'saved' && styles.tabBtnActive]}
          onPress={() => setTab('saved')}
        >
          <Ionicons
            name="bookmark"
            size={16}
            color={tab === 'saved' ? Colors.primary : Colors.textSecondary}
          />
          <Text
            style={[styles.tabBtnText, tab === 'saved' && styles.tabBtnTextActive]}
          >
            Saved Plans ({savedItineraries.length})
          </Text>
        </TouchableOpacity>
      </View>

      {tab === 'create' ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>
            {t('planner.title', 'Plan My Heritage Experience')}
          </Text>
          <Text style={styles.screenSubtitle}>
            Generate an optimized, accessible walking route customized to your available time and interests.
          </Text>

          {/* Preference Input Form */}
          <PreferenceForm
            preferences={preferences}
            onChange={setPreferences}
          />

          {/* Generate Action Button */}
          <Button
            title={loading ? 'Creating Your Itinerary...' : t('planner.generatePlan', 'GENERATE PLAN')}
            onPress={handleGenerate}
            loading={loading}
            size="lg"
            style={styles.generateBtn}
          />

          {/* Generated Result View */}
          {itinerary && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>CUSTOM ITINERARY</Text>
                </View>
                <Text style={styles.itineraryTitle}>{itinerary.title}</Text>
              </View>

              {/* Stats Bar */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Ionicons name="time-outline" size={18} color={Colors.primary} />
                  <Text style={styles.statValue}>
                    {itinerary.totalDurationMinutes} min
                  </Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Ionicons name="walk-outline" size={18} color={Colors.primary} />
                  <Text style={styles.statValue}>
                    {itinerary.walkingDistanceMeters} m
                  </Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Ionicons name="flag-outline" size={18} color={Colors.primary} />
                  <Text style={styles.statValue}>{itinerary.stops.length}</Text>
                  <Text style={styles.statLabel}>Stops</Text>
                </View>
              </View>

              {/* Stop Timeline */}
              <Text style={styles.stopsHeading}>Recommended Route Sequence</Text>
              <ItineraryTimeline stops={itinerary.stops} />

              {/* Action Buttons */}
              <View style={styles.itineraryActions}>
                <Button
                  title={t('planner.savePlan', 'SAVE PLAN')}
                  onPress={handleSave}
                  variant="primary"
                  size="md"
                  style={{ flex: 1 }}
                />
                <Button
                  title="OFFLINE"
                  onPress={handleDownloadOffline}
                  variant="outline"
                  size="md"
                  style={{ width: 110 }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        /* Saved Plans Tab */
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>Your Saved Itineraries</Text>

          {savedItineraries.length === 0 ? (
            <View style={styles.emptySaved}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textTertiary} />
              <Text style={styles.emptySavedTitle}>No saved plans yet</Text>
              <Text style={styles.emptySavedDesc}>
                Customize your first heritage visit to save it for offline exploration.
              </Text>
              <Button
                title="CREATE A PLAN"
                onPress={() => setTab('create')}
                size="md"
                style={{ marginTop: Spacing.md }}
              />
            </View>
          ) : (
            savedItineraries.map((item) => (
              <View key={item.id} style={styles.savedCard}>
                <View style={styles.savedCardHeader}>
                  <Text style={styles.savedCardTitle}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={() => deleteItinerary(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.savedCardMeta}>
                  {item.totalDurationMinutes} mins • {item.stops.length} stops •{' '}
                  {item.preferences.mobility === 'wheelchair' ? 'Wheelchair Accessible' : 'Standard'}
                </Text>

                <ItineraryTimeline stops={item.stops} />
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabBtnActive: {
    borderBottomColor: Colors.primary,
  },
  tabBtnText: {
    fontSize: Typography.scale.caption + 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 110,
  },
  screenTitle: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  generateBtn: {
    marginVertical: Spacing.md,
  },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  resultHeader: {
    marginBottom: Spacing.md,
  },
  planBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  planBadgeText: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  itineraryTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  statLabel: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  stopsHeading: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  itineraryActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  emptySaved: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.massive,
  },
  emptySavedTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySavedDesc: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
  },
  savedCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  savedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedCardTitle: {
    fontSize: Typography.scale.body,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  savedCardMeta: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginVertical: 4,
  },
});
