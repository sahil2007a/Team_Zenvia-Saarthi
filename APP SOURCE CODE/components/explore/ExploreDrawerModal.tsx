// SAARTHI — Quick Navigation Drawer Modal (Screen 2 Header Menu)
// Provides quick links to Home, Intro, Virtual 360° Tours, AI Guide, Saved, and Offline Downloads

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { useUserStore } from '../../store/userStore';

interface ExploreDrawerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ExploreDrawerModal: React.FC<ExploreDrawerModalProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const user = useUserStore((s) => s.profile);

  const menuItems = [
    {
      id: 'home',
      label: 'Home Feed',
      icon: 'home-outline' as const,
      onPress: () => {
        onClose();
        router.replace('/');
      },
    },
    {
      id: 'intro',
      label: 'Explore Stories Intro',
      icon: 'sparkles-outline' as const,
      onPress: () => {
        onClose();
        router.push('/intro' as any);
      },
    },
    {
      id: 'vr',
      label: 'Virtual 360° Tours',
      icon: 'cube-outline' as const,
      onPress: () => {
        onClose();
        router.push('/site/deekshabhoomi/experience' as any);
      },
    },
    {
      id: 'guide',
      label: 'AI Heritage Guide',
      icon: 'chatbubbles-outline' as const,
      onPress: () => {
        onClose();
        router.push('/guide');
      },
    },
    {
      id: 'planner',
      label: 'Smart Visit Planner',
      icon: 'calendar-outline' as const,
      onPress: () => {
        onClose();
        router.push('/planner');
      },
    },
    {
      id: 'profile',
      label: 'Saved & Offline Packs',
      icon: 'bookmark-outline' as const,
      onPress: () => {
        onClose();
        router.push('/profile');
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop dismiss */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Left Side Drawer */}
        <View style={styles.drawer}>
          {/* Drawer Header with SAARTHI Logo */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.logo}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.brandTitle}>SAARTHI</Text>
                <Text style={styles.brandSub}>Heritage Discovery</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* User info snippet */}
          <View style={styles.userSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {(user.name || 'E').slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userTextCol}>
              <Text style={styles.userName}>{user.name || 'Explorer'}</Text>
              <Text style={styles.userRole}>Cultural Traveler</Text>
            </View>
          </View>

          {/* Menu Items List */}
          <View style={styles.menuList}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemText}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Drawer Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SAARTHI v1.0 • Authentic Indian Heritage</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  drawer: {
    width: '78%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    height: '100%',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  brandTitle: {
    fontSize: 15,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
    letterSpacing: 1.2,
  },
  brandSub: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.secondary,
  },
  closeBtn: {
    padding: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  avatarInitials: {
    fontSize: 14,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  userTextCol: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  userRole: {
    fontSize: 10,
    fontFamily: Typography.fonts.sans,
    color: Colors.textTertiary,
  },
  menuList: {
    flex: 1,
    paddingTop: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  footer: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footerText: {
    fontSize: 10,
    fontFamily: Typography.fonts.sans,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
