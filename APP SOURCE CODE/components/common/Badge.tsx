// SAARTHI Design System — Standard Badge Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/layout';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'secondary',
  size = 'sm',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: Colors.primaryLight, text: Colors.primary };
      case 'success':
        return { bg: '#E8F5E9', text: Colors.success };
      case 'warning':
        return { bg: '#FFF8E1', text: Colors.warning };
      case 'info':
        return { bg: '#E1F5FE', text: Colors.info };
      case 'secondary':
      default:
        return { bg: Colors.surfaceVariant, text: Colors.textSecondary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: text },
          size === 'sm' ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginRight: Spacing.xs,
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
  },
  text: {
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: Typography.scale.caption - 1,
  },
  textMd: {
    fontSize: Typography.scale.caption,
  },
});
