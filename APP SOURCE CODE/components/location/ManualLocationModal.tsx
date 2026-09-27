// SAARTHI — Manual Location Selection Modal
// Allows users to manually choose a region/hub when GPS permission is denied or when exploring remotely

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import { curatedHeritageHubs, type HeritageHub } from '../../data/places/nearbyPlacesData';
import { locationService } from '../../services/location/locationService';

interface ManualLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectHub?: (hub: HeritageHub) => void;
}

export const ManualLocationModal: React.FC<ManualLocationModalProps> = ({
  visible,
  onClose,
  onSelectHub,
}) => {
  const handleSelect = (hub: HeritageHub) => {
    locationService.setManualLocation({
      latitude: hub.coordinates.latitude,
      longitude: hub.coordinates.longitude,
    });
    if (onSelectHub) {
      onSelectHub(hub);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.title}>Choose Location Manually</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select an Indian heritage region to discover monuments, temples, and famous places around it:
          </Text>

          {/* Hub list */}
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {curatedHeritageHubs.map((hub) => (
              <TouchableOpacity
                key={hub.id}
                style={styles.hubItem}
                onPress={() => handleSelect(hub)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Select ${hub.name}, ${hub.region}`}
              >
                <View style={styles.hubIconCircle}>
                  <Ionicons name="business-outline" size={18} color={Colors.primary} />
                </View>
                <View style={styles.hubInfo}>
                  <Text style={styles.hubName}>{hub.name}</Text>
                  <Text style={styles.hubRegion}>{hub.region}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 25, 35, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  list: {
    marginVertical: Spacing.xs,
  },
  hubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  hubIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubInfo: {
    flex: 1,
  },
  hubName: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  hubRegion: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
