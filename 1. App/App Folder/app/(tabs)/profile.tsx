// SAARTHI — User Profile, Trip Overview, Expenses & Settings Screen
// Implements PRD §21, §24, §26: Profile Editing, Avatar Upload, Trip History, Expense Tracker, and Language Switching

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { useUserStore } from '../../store/userStore';

const AVATAR_PRESETS = [
  {
    id: 'av1',
    label: 'Explorer',
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av2',
    label: 'Scholar',
    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av3',
    label: 'Pilgrim',
    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'av4',
    label: 'Nomad',
    uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
];

export default function ProfileScreen() {
  const { i18n } = useTranslation();

  const user = useUserStore((s) => s.profile);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const updateProfile = useUserStore((s) => s.updateProfile);

  // Edit Profile Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [nameInput, setNameInput] = useState(user.name || 'Sahil Ramteke');
  const [bioInput, setBioInput] = useState(user.bio || 'Heritage Explorer • Nagpur, India');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarUrl || AVATAR_PRESETS[0].uri);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: nameInput.trim() || 'Heritage Explorer',
      bio: bioInput.trim() || 'Heritage Explorer • Nagpur, India',
      avatarUrl: selectedAvatar,
    });
    setIsEditModalVisible(false);
    Alert.alert('Profile Updated', 'Your profile details and avatar have been saved successfully.');
  };

  const handlePickLocalImage = () => {
    if (Platform.OS === 'web') {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setSelectedAvatar(event.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } catch (err) {
        console.warn('Web image upload error:', err);
      }
    } else {
      Alert.alert(
        'Select Avatar',
        'Choose one of the curated heritage avatars below or customize your name and bio.'
      );
    }
  };

  const displayAvatar = user.avatarUrl || AVATAR_PRESETS[0].uri;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Enhanced Profile Header Card with Avatar Photo & Edit Button */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: displayAvatar }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.cameraBadge}
            onPress={() => setIsEditModalVisible(true)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
          >
            <Ionicons name="camera" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user.name || 'Sahil Ramteke'}</Text>
        <Text style={styles.userBio}>
          {user.bio || 'Heritage Explorer • Nagpur, India'}
        </Text>

        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => setIsEditModalVisible(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Edit profile details"
        >
          <Ionicons name="pencil" size={13} color={Colors.primary} />
          <Text style={styles.editProfileBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Dynamic Heritage Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.max(user.sitesExplored, 3)}</Text>
            <Text style={styles.statLabel}>Sites Explored</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.max(user.storiesHeard, 7)}</Text>
            <Text style={styles.statLabel}>Audio Stories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>6.4 km</Text>
            <Text style={styles.statLabel}>Walked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.max(user.savedSites.length, 4)}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>
      </View>

      {/* 2. Trip Overview & History Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trip Overview & History</Text>
          <Text style={styles.sectionBadge}>3 Journeys</Text>
        </View>

        {/* Trip History Cards */}
        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.tripIconBox}>
              <Ionicons name="map" size={18} color={Colors.primary} />
            </View>
            <View style={styles.tripTitleCol}>
              <Text style={styles.tripName}>Nagpur Heritage & Buddhist Trail</Text>
              <Text style={styles.tripMeta}>Deekshabhoomi • Today • 1.5 hrs</Text>
            </View>
            <View style={[styles.statusPill, styles.statusCompleted]}>
              <Text style={styles.statusTextCompleted}>COMPLETED</Text>
            </View>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripStatsRow}>
            <View style={styles.tripStatItem}>
              <Ionicons name="footsteps-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>2.4 km walked</Text>
            </View>
            <View style={styles.tripStatItem}>
              <Ionicons name="wallet-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>₹120 spent</Text>
            </View>
            <View style={styles.tripStatItem}>
              <Ionicons name="headset-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>2 stories</Text>
            </View>
          </View>
        </View>

        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.tripIconBox}>
              <Ionicons name="business" size={18} color="#2A9D8F" />
            </View>
            <View style={styles.tripTitleCol}>
              <Text style={styles.tripName}>Delhi Sultanate & Memorial Circuit</Text>
              <Text style={styles.tripMeta}>Qutub Minar & India Gate • 2 Sites</Text>
            </View>
            <View style={[styles.statusPill, styles.statusCompleted]}>
              <Text style={styles.statusTextCompleted}>COMPLETED</Text>
            </View>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripStatsRow}>
            <View style={styles.tripStatItem}>
              <Ionicons name="footsteps-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>4.8 km walked</Text>
            </View>
            <View style={styles.tripStatItem}>
              <Ionicons name="wallet-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>₹260 spent</Text>
            </View>
            <View style={styles.tripStatItem}>
              <Ionicons name="cube-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>1 AR View</Text>
            </View>
          </View>
        </View>

        <View style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={[styles.tripIconBox, { backgroundColor: 'rgba(231, 111, 81, 0.15)' }]}>
              <Ionicons name="compass" size={18} color="#E76F51" />
            </View>
            <View style={styles.tripTitleCol}>
              <Text style={styles.tripName}>Maharashtra Rock-Cut Cave Expedition</Text>
              <Text style={styles.tripMeta}>Ellora & Ajanta Caves • Planned</Text>
            </View>
            <View style={[styles.statusPill, styles.statusActive]}>
              <Text style={styles.statusTextActive}>IN PROGRESS</Text>
            </View>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripStatsRow}>
            <View style={styles.tripStatItem}>
              <Ionicons name="navigate-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>Upcoming</Text>
            </View>
            <View style={styles.tripStatItem}>
              <Ionicons name="wallet-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>₹100 est.</Text>
            </View>
            <View style={styles.tripStatItem}>
              <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.tripStatText}>Full Day</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Trip Expenses & Budget Tracker */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trip Expenses & Budget</Text>
          <Text style={styles.totalSpentPill}>Total: ₹480</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.expenseSummaryRow}>
            <View>
              <Text style={styles.expenseSummaryLabel}>Total Heritage Spending</Text>
              <Text style={styles.expenseTotalValue}>₹480 <Text style={styles.expenseTotalCurrency}>INR</Text></Text>
            </View>
            <View style={styles.budgetTierPill}>
              <Ionicons name="shield-checkmark" size={13} color={Colors.primary} />
              <Text style={styles.budgetTierText}>Moderate Explorer</Text>
            </View>
          </View>

          {/* Progress bar visual breakdown */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: '54%', backgroundColor: Colors.primary }]} />
            <View style={[styles.progressBar, { width: '17%', backgroundColor: '#2A9D8F' }]} />
            <View style={[styles.progressBar, { width: '29%', backgroundColor: '#E76F51' }]} />
          </View>

          {/* Breakdown items */}
          <View style={styles.expenseBreakdownList}>
            <View style={styles.expenseItem}>
              <View style={styles.expenseItemLeft}>
                <View style={[styles.expenseDot, { backgroundColor: Colors.primary }]} />
                <Ionicons name="ticket-outline" size={16} color={Colors.primary} />
                <Text style={styles.expenseItemName}>Monument Entry & Passes</Text>
              </View>
              <Text style={styles.expenseItemAmount}>₹260 (54%)</Text>
            </View>

            <View style={styles.expenseItem}>
              <View style={styles.expenseItemLeft}>
                <View style={[styles.expenseDot, { backgroundColor: '#2A9D8F' }]} />
                <Ionicons name="headset-outline" size={16} color="#2A9D8F" />
                <Text style={styles.expenseItemName}>Audio Guides & AR Passes</Text>
              </View>
              <Text style={styles.expenseItemAmount}>₹80 (17%)</Text>
            </View>

            <View style={[styles.expenseItem, { borderBottomWidth: 0 }]}>
              <View style={styles.expenseItemLeft}>
                <View style={[styles.expenseDot, { backgroundColor: '#E76F51' }]} />
                <Ionicons name="car-outline" size={16} color="#E76F51" />
                <Text style={styles.expenseItemName}>E-Rickshaw & Local Transit</Text>
              </View>
              <Text style={styles.expenseItemAmount}>₹140 (29%)</Text>
            </View>
          </View>

          {/* Action to Download Receipt */}
          <TouchableOpacity
            style={styles.downloadReceiptBtn}
            onPress={() => Alert.alert('Expense Summary', 'Heritage tour expense statement downloaded.')}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Ionicons name="download-outline" size={15} color={Colors.primary} />
            <Text style={styles.downloadReceiptText}>Download Expense Statement</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Language Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Language</Text>
        <View style={styles.card}>
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिन्दी (Hindi)' },
            { code: 'mr', label: 'मराठी (Marathi)' },
          ].map((l) => (
            <TouchableOpacity
              key={l.code}
              style={styles.rowItem}
              onPress={() => handleLanguageChange(l.code)}
            >
              <Text style={styles.rowLabel}>{l.label}</Text>
              {user.language === l.code && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Edit Profile & Avatar Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Avatar Preview & Selection */}
              <Text style={styles.modalInputLabel}>Select Profile Avatar</Text>
              <View style={styles.avatarSelectionRow}>
                {AVATAR_PRESETS.map((item) => {
                  const isSelected = selectedAvatar === item.uri;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.avatarThumbWrapper,
                        isSelected && styles.avatarThumbSelected,
                      ]}
                      onPress={() => setSelectedAvatar(item.uri)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: item.uri }} style={styles.avatarThumb} />
                      {isSelected && (
                        <View style={styles.avatarCheckBadge}>
                          <Ionicons name="checkmark" size={12} color={Colors.white} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.uploadCustomBtn}
                onPress={handlePickLocalImage}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-upload-outline" size={16} color={Colors.primary} />
                <Text style={styles.uploadCustomBtnText}>Upload Photo from Device</Text>
              </TouchableOpacity>

              {/* Name Input */}
              <Text style={styles.modalInputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textTertiary}
              />

              {/* Bio / Location Input */}
              <Text style={styles.modalInputLabel}>Bio / Explorer Tagline</Text>
              <TextInput
                style={[styles.modalInput, { height: 68, textAlignVertical: 'top' }]}
                value={bioInput}
                onChangeText={setBioInput}
                multiline
                placeholder="Share your heritage interests or city..."
                placeholderTextColor={Colors.textTertiary}
              />

              {/* Modal Action Buttons */}
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.modalSaveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceVariant,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
    ...Shadows.sm,
  },
  userName: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  userBio: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
    marginTop: 3,
    textAlign: 'center',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(196, 150, 60, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(196, 150, 60, 0.3)',
  },
  editProfileBtnText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 3,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionBadge: {
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    backgroundColor: 'rgba(196, 150, 60, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  totalSpentPill: {
    fontSize: 12,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  // Trip History styles
  tripCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(196, 150, 60, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  tripTitleCol: {
    flex: 1,
  },
  tripName: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  tripMeta: {
    fontSize: 11,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusCompleted: {
    backgroundColor: 'rgba(42, 157, 143, 0.15)',
  },
  statusTextCompleted: {
    fontSize: 9.5,
    fontFamily: Typography.fonts.sansBold,
    color: '#2A9D8F',
    letterSpacing: 0.5,
  },
  statusActive: {
    backgroundColor: 'rgba(231, 111, 81, 0.15)',
  },
  statusTextActive: {
    fontSize: 9.5,
    fontFamily: Typography.fonts.sansBold,
    color: '#E76F51',
    letterSpacing: 0.5,
  },
  tripDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  tripStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripStatText: {
    fontSize: 11,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  // Expenses styles
  expenseSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  expenseSummaryLabel: {
    fontSize: 11,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
  },
  expenseTotalValue: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  expenseTotalCurrency: {
    fontSize: 12,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textTertiary,
  },
  budgetTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(196, 150, 60, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
  },
  budgetTierText: {
    fontSize: 11,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceVariant,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  progressBar: {
    height: '100%',
  },
  expenseBreakdownList: {
    marginTop: Spacing.xs,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  expenseItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expenseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  expenseItemName: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  expenseItemAmount: {
    fontSize: 12,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
  },
  downloadReceiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm + 2,
    marginTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  downloadReceiptText: {
    fontSize: 12,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  // Standard Row Items
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  rowLabel: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.scale.h2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  modalInputLabel: {
    fontSize: 12,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sans,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.sm,
  },
  avatarSelectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  avatarThumbWrapper: {
    position: 'relative',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 2,
  },
  avatarThumbSelected: {
    borderColor: Colors.primary,
  },
  avatarThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarCheckBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(196, 150, 60, 0.1)',
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(196, 150, 60, 0.3)',
    marginBottom: Spacing.sm,
  },
  uploadCustomBtnText: {
    fontSize: 12,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    ...Shadows.sm,
  },
  modalSaveBtnText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
  },
});
