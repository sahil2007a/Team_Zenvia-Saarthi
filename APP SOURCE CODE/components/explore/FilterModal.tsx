// SAARTHI — Multi-Criteria Heritage Filter Modal
// Enables filtering by State, Distance, Type, UNESCO status, Duration, and Accessibility

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';

export interface FilterCriteria {
  state: string;
  maxDistanceKm: number | null; // null = any
  unescoOnly: boolean;
  asiOnly: boolean;
  visitDuration: string; // 'all' | '< 1 hr' | '1-2 hrs' | '2-3 hrs'
  accessibleOnly: boolean;
  offlineOnly: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  criteria: FilterCriteria;
  onApply: (newCriteria: FilterCriteria) => void;
  onReset: () => void;
  availableStates?: string[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  criteria,
  onApply,
  onReset,
  availableStates = ['All', 'Maharashtra', 'Delhi', 'Uttar Pradesh', 'Karnataka', 'Rajasthan', 'Madhya Pradesh'],
}) => {
  const [localCriteria, setLocalCriteria] = useState<FilterCriteria>({ ...criteria });

  // Sync with prop when opened
  React.useEffect(() => {
    if (visible) {
      setLocalCriteria({ ...criteria });
    }
  }, [visible, criteria]);

  const radiusOptions = [
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '25 km', value: 25 },
    { label: '50 km', value: 50 },
    { label: '100 km', value: 100 },
    { label: 'Any Distance', value: null },
  ];

  const durationOptions = [
    { label: 'All Durations', value: 'all' },
    { label: '< 1 Hour', value: '< 1 hr' },
    { label: '1 - 2 Hours', value: '1-2 hrs' },
    { label: '2 - 3 Hours', value: '2-3 hrs' },
  ];

  const handleApply = () => {
    onApply(localCriteria);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Sheet Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <Ionicons name="options-outline" size={20} color={Colors.primary} />
              <Text style={styles.sheetTitle}>Filter Monuments</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Section 1: Region / State */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Region / State</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                {availableStates.map((st) => {
                  const isSelected = localCriteria.state.toLowerCase() === st.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => setLocalCriteria((prev) => ({ ...prev, state: st }))}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Section 2: Proximity Radius */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Distance Proximity</Text>
              <View style={styles.wrapGrid}>
                {radiusOptions.map((opt) => {
                  const isSelected = localCriteria.maxDistanceKm === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      style={[styles.smallChip, isSelected && styles.chipActive]}
                      onPress={() => setLocalCriteria((prev) => ({ ...prev, maxDistanceKm: opt.value }))}
                    >
                      <Text style={[styles.smallChipText, isSelected && styles.chipTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 3: Estimated Visit Duration */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Visit Duration</Text>
              <View style={styles.wrapGrid}>
                {durationOptions.map((opt) => {
                  const isSelected = localCriteria.visitDuration === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.smallChip, isSelected && styles.chipActive]}
                      onPress={() => setLocalCriteria((prev) => ({ ...prev, visitDuration: opt.value }))}
                    >
                      <Text style={[styles.smallChipText, isSelected && styles.chipTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 4: Verified Status Switches */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Certifications & Features</Text>

              {/* UNESCO Only */}
              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchTitle}>UNESCO World Heritage Sites Only</Text>
                  <Text style={styles.switchSub}>Show places of outstanding universal value</Text>
                </View>
                <Switch
                  value={localCriteria.unescoOnly}
                  onValueChange={(val) => setLocalCriteria((p) => ({ ...p, unescoOnly: val }))}
                  trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>

              {/* ASI Protected */}
              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchTitle}>ASI Protected Monuments</Text>
                  <Text style={styles.switchSub}>National archaeological heritage</Text>
                </View>
                <Switch
                  value={localCriteria.asiOnly}
                  onValueChange={(val) => setLocalCriteria((p) => ({ ...p, asiOnly: val }))}
                  trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>

              {/* Wheelchair Accessible */}
              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchTitle}>Wheelchair Accessible</Text>
                  <Text style={styles.switchSub}>Has ramp or step-free entrance</Text>
                </View>
                <Switch
                  value={localCriteria.accessibleOnly}
                  onValueChange={(val) => setLocalCriteria((p) => ({ ...p, accessibleOnly: val }))}
                  trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>

              {/* Offline Available */}
              <View style={styles.switchRow}>
                <View style={styles.switchTextCol}>
                  <Text style={styles.switchTitle}>Offline Package Available</Text>
                  <Text style={styles.switchSub}>Browse without cellular connectivity</Text>
                </View>
                <Switch
                  value={localCriteria.offlineOnly}
                  onValueChange={(val) => setLocalCriteria((p) => ({ ...p, offlineOnly: val }))}
                  trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
    paddingBottom: Spacing.xl,
    ...Shadows.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: Typography.scale.h3,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  sheetContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterLabel: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 4,
  },
  wrapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.white,
    fontFamily: Typography.fonts.sansBold,
  },
  smallChip: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  smallChipText: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  switchTextCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  switchTitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
  },
  resetBtnText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  applyBtnText: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.white,
  },
});
