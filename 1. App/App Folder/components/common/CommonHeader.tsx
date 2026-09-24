// SAARTHI — Common Application Header
// Implements production-grade, reusable mobile header with official logo, brand title, and profile navigation

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { useUserStore } from '../../store/userStore';

export interface CommonHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showProfile?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const CommonHeader: React.FC<CommonHeaderProps> = ({
  title = 'SAARTHI',
  subtitle,
  showLogo = true,
  showProfile = true,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const router = useRouter();
  const user = useUserStore((s) => s.profile);
  const isLargeText = user?.accessibility?.largeText;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      {/* Left Section: Back Button OR Logo + Title */}
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}

        {showLogo && (
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
              accessibilityRole="image"
              accessibilityLabel="SAARTHI official logo"
            />
          </View>
        )}

        <View style={styles.brandTitleCol}>
          <Text
            style={[
              styles.brandTitle,
              isLargeText && styles.largeBrandTitle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.brandSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Section: Profile or Custom Action */}
      <View style={styles.rightSection}>
        {rightAction ? (
          rightAction
        ) : showProfile ? (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Open user profile"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.profileAvatarCircle}>
              <Ionicons name="person" size={17} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 90,
    paddingTop: 34,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    marginRight: Spacing.sm,
    padding: 6,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm + 2,
    overflow: 'hidden',
    backgroundColor: '#FFFDF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm + 4,
    borderWidth: 1.5,
    borderColor: 'rgba(196, 150, 60, 0.4)',
    ...Shadows.sm,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm + 2,
  },
  brandTitleCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 1.2,
  },
  largeBrandTitle: {
    fontSize: Typography.largeScale.h3,
  },
  brandSubtitle: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    marginTop: -1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 4,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1.5,
    borderColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
