// SAARTHI Design System — Offline Status Banner
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';
import { useOfflineStore } from '../../store/offlineStore';

export const OfflineBanner: React.FC = () => {
  const isOffline = useOfflineStore((s) => s.isOfflineMode);
  const setOfflineMode = useOfflineStore((s) => s.setOfflineMode);

  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline" size={18} color="#FFFFFF" />
      <Text style={styles.text} numberOfLines={1}>
        Offline Mode — Downloaded packs available
      </Text>
      <TouchableOpacity
        onPress={() => setOfflineMode(false)}
        style={styles.actionButton}
      >
        <Text style={styles.actionText}>Go Online</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: Spacing.sm,
  },
  text: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sansMedium,
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansBold,
  },
});
