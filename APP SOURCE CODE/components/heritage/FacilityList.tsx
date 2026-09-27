// SAARTHI Design System — Site Facilities Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';
import { SiteFacility, AvailabilityStatus } from '../../types/heritage';

interface FacilityListProps {
  facilities: SiteFacility[];
}

export const FacilityList: React.FC<FacilityListProps> = ({ facilities }) => {
  const getFacilityIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type.toLowerCase()) {
      case 'toilet':
        return 'water-outline';
      case 'drinking_water':
        return 'pint-outline';
      case 'parking':
        return 'car-outline';
      case 'information':
        return 'information-circle-outline';
      case 'food':
        return 'restaurant-outline';
      case 'shop':
        return 'cart-outline';
      case 'first_aid':
        return 'medkit-outline';
      default:
        return 'checkmark-circle-outline';
    }
  };

  const getStatusBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return {
          label: 'Available',
          bg: '#E8F5E9',
          color: Colors.success,
        };
      case AvailabilityStatus.LIMITED:
        return {
          label: 'Limited',
          bg: '#FFF8E1',
          color: Colors.warning,
        };
      case AvailabilityStatus.NOT_AVAILABLE:
      default:
        return {
          label: 'Not Available',
          bg: '#FFEBEE',
          color: Colors.error,
        };
    }
  };

  return (
    <View style={styles.grid}>
      {facilities.map((fac) => {
        const status = getStatusBadge(fac.available);
        const iconName = getFacilityIcon(fac.type);

        return (
          <View key={fac.id} style={styles.facilityCard}>
            <View style={styles.iconCircle}>
              <Ionicons name={iconName} size={18} color={Colors.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {fac.name}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.color }]}>
                  {status.label}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  facilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: '48%',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  statusText: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
  },
});
