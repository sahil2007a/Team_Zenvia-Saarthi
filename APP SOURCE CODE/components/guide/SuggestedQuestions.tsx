// SAARTHI Design System — Suggested Quick Questions Component
// Per PRD §12: Suggested question chips for visitors

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bulb-outline" size={14} color={Colors.accent} />
        <Text style={styles.headerTitle}>Suggested Questions</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {questions.map((q, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.chip}
            onPress={() => onSelect(q)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Ask: ${q}`}
          >
            <Text style={styles.chipText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs + 2,
  },
  chip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
});
