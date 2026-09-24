// SAARTHI Design System — Filter Chips Component
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/layout';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  horizontal?: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedId,
  onSelect,
  horizontal = true,
}) => {
  const content = options.map((option) => {
    const isSelected = option.id === selectedId;
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.chip,
          isSelected ? styles.chipSelected : styles.chipUnselected,
        ]}
        onPress={() => onSelect(option.id)}
        activeOpacity={0.8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`Filter by ${option.label}`}
      >
        <Text
          style={[
            styles.chipText,
            isSelected ? styles.textSelected : styles.textUnselected,
          ]}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  });

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {content}
      </ScrollView>
    );
  }

  return <View style={styles.wrapContainer}>{content}</View>;
};

const styles = StyleSheet.create({
  horizontalScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.xs + 3,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: Typography.scale.caption + 1,
    fontFamily: Typography.fonts.sansMedium,
  },
  textSelected: {
    color: Colors.white,
    fontFamily: Typography.fonts.sansBold,
  },
  textUnselected: {
    color: Colors.textSecondary,
  },
});
