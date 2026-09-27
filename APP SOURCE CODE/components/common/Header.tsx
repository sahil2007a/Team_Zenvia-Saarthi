// SAARTHI Design System — Standard App Header
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/layout';
import { Typography } from '../../constants/typography';
import { useUserStore } from '../../store/userStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  showProfile = true,
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

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              isLargeText && styles.largeTitle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rightContainer}>
        {rightAction ? (
          rightAction
        ) : showProfile ? (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Open user profile"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.profileAvatarCircle}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.profileAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={16} color={Colors.primary} />
              )}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  largeTitle: {
    fontSize: Typography.largeScale.h3,
  },
  subtitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surfaceVariant,
    borderWidth: 1.5,
    borderColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
  },
});
