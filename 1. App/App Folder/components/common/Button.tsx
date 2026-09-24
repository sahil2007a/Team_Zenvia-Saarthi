// SAARTHI Design System — Accessible Button Component
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/layout';
import { useUserStore } from '../../store/userStore';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const isLargeText = useUserStore((s) => s.profile.accessibility.largeText);

  // Variant styling
  const getVariantStyles = (): { btn: ViewStyle; txt: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          btn: {
            backgroundColor: Colors.surfaceVariant,
            borderWidth: 0,
          },
          txt: { color: Colors.primary },
        };
      case 'outline':
        return {
          btn: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: Colors.primary,
          },
          txt: { color: Colors.primary },
        };
      case 'ghost':
        return {
          btn: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          txt: { color: Colors.primary },
        };
      case 'primary':
      default:
        return {
          btn: {
            backgroundColor: Colors.primary,
            borderWidth: 0,
          },
          txt: { color: Colors.white },
        };
    }
  };

  // Size styling
  const getSizeStyles = (): { btn: ViewStyle; txt: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          btn: {
            paddingVertical: Spacing.xs + 2,
            paddingHorizontal: Spacing.md,
            minHeight: 36,
          },
          txt: { fontSize: Typography.scale.caption },
        };
      case 'lg':
        return {
          btn: {
            paddingVertical: Spacing.md,
            paddingHorizontal: Spacing.xxl,
            minHeight: 52,
          },
          txt: { fontSize: Typography.scale.body },
        };
      case 'md':
      default:
        return {
          btn: {
            paddingVertical: Spacing.sm + 2,
            paddingHorizontal: Spacing.lg,
            minHeight: 46,
          },
          txt: { fontSize: Typography.scale.body2 },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        vStyles.btn,
        sStyles.btn,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={accessibilityLabel || title}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text
            style={[
              styles.baseText,
              vStyles.txt,
              sStyles.txt,
              disabled && styles.disabledText,
              isLargeText && styles.largeText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: Spacing.sm,
  },
  rightIconContainer: {
    marginLeft: Spacing.sm,
  },
  baseText: {
    fontFamily: Typography.fonts.sansBold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  largeText: {
    fontSize: Typography.largeScale.body,
  },
  disabledButton: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
    opacity: 0.6,
  },
  disabledText: {
    color: Colors.textTertiary,
  },
});
