// SAARTHI Design System — Accessibility Information Card
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';
import { AvailabilityStatus, type AccessibilityFeatures } from '../../types/heritage';

interface AccessibilityInfoProps {
  accessibility: AccessibilityFeatures;
}

export const AccessibilityInfo: React.FC<AccessibilityInfoProps> = ({
  accessibility,
}) => {
  const items: {
    key: keyof AccessibilityFeatures;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    status: AvailabilityStatus;
  }[] = [
    {
      key: 'accessibleEntrance',
      label: 'Step-Free Entrance',
      icon: 'walk-outline',
      status: accessibility.accessibleEntrance,
    },
    {
      key: 'ramp',
      label: 'Access Ramps',
      icon: 'trending-up-outline',
      status: accessibility.ramp,
    },
    {
      key: 'accessibleToilet',
      label: 'Accessible Toilets',
      icon: 'water-outline',
      status: accessibility.accessibleToilet,
    },
    {
      key: 'parking',
      label: 'Disabled Parking',
      icon: 'car-outline',
      status: accessibility.parking,
    },
    {
      key: 'batteryVehicle',
      label: 'Battery Shuttle Buggy',
      icon: 'bus-outline',
      status: accessibility.batteryVehicle,
    },
    {
      key: 'restAreas',
      label: 'Benches & Shaded Rest Areas',
      icon: 'cafe-outline',
      status: accessibility.restAreas,
    },
  ];

  const getStatusDisplay = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return { text: 'Available', color: Colors.success, icon: 'checkmark-circle' as const };
      case AvailabilityStatus.LIMITED:
        return { text: 'Limited / Assisted', color: Colors.warning, icon: 'alert-circle' as const };
      case AvailabilityStatus.NOT_AVAILABLE:
      default:
        return { text: 'Not Available', color: Colors.error, icon: 'close-circle' as const };
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const display = getStatusDisplay(item.status);
        return (
          <View key={item.key} style={styles.row}>
            <View style={styles.labelCol}>
              <Ionicons name={item.icon} size={16} color={Colors.textSecondary} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <View style={styles.statusCol}>
              <Ionicons name={display.icon} size={14} color={display.color} />
              <Text style={[styles.statusText, { color: display.color }]}>
                {display.text}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  label: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  statusCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
  },
});
