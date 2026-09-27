// SAARTHI Design System — Itinerary Preferences Form
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';
import type { ItineraryPreferences } from '../../types/itinerary';
import type { VisitDuration, BudgetTier, TravelGroup } from '../../types/user';
import { heritageSites } from '../../data/sites';

interface PreferenceFormProps {
  preferences: ItineraryPreferences;
  onChange: (prefs: ItineraryPreferences) => void;
}

export const PreferenceForm: React.FC<PreferenceFormProps> = ({
  preferences,
  onChange,
}) => {
  const durations: VisitDuration[] = [
    '30-45 min',
    '1-2 hours',
    '2-3 hours',
    'Half day',
    'Full day',
  ];

  const budgets: { id: BudgetTier; label: string }[] = [
    { id: 'low', label: 'Budget-Friendly' },
    { id: 'medium', label: 'Moderate' },
    { id: 'high', label: 'Premium' },
  ];

  const groups: { id: TravelGroup; label: string }[] = [
    { id: 'solo', label: 'Solo' },
    { id: 'couple', label: 'Couple' },
    { id: 'family', label: 'Family' },
    { id: 'group', label: 'Group' },
  ];

  return (
    <View style={styles.container}>
      {/* Heritage Destination Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Selected Heritage Site</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {heritageSites.map((s) => {
            const isSelected = s.id === preferences.siteId;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => onChange({ ...preferences, siteId: s.id })}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {s.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Duration */}
      <View style={styles.section}>
        <Text style={styles.label}>Available Time</Text>
        <View style={styles.chipGrid}>
          {durations.map((d) => {
            const isSelected = preferences.duration === d;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => onChange({ ...preferences, duration: d })}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Travel Group */}
      <View style={styles.section}>
        <Text style={styles.label}>Who is traveling?</Text>
        <View style={styles.chipGrid}>
          {groups.map((g) => {
            const isSelected = preferences.travelGroup === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => onChange({ ...preferences, travelGroup: g.id })}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Budget Tier */}
      <View style={styles.section}>
        <Text style={styles.label}>Budget Preference</Text>
        <View style={styles.chipGrid}>
          {budgets.map((b) => {
            const isSelected = preferences.budget === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => onChange({ ...preferences, budget: b.id })}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Mobility Requirement */}
      <View style={styles.section}>
        <Text style={styles.label}>Mobility Preference</Text>
        <View style={styles.chipGrid}>
          {[
            { id: 'full', label: 'Standard Walking' },
            { id: 'wheelchair', label: 'Wheelchair / Step-Free' },
            { id: 'assisted', label: 'Limited Walking / Senior' },
          ].map((m) => {
            const isSelected = preferences.mobility === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() =>
                  onChange({
                    ...preferences,
                    mobility: m.id as any,
                  })
                }
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs + 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    gap: Spacing.xs + 2,
    paddingVertical: 2,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 3,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.scale.caption + 1,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.white,
    fontFamily: Typography.fonts.sansBold,
  },
});
