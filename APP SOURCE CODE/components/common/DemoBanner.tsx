// SAARTHI Design System — Demo Mode Watermark Banner
// Per PRD §26: Visible watermark when demo simulation is running

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/layout';
import { useUserStore } from '../../store/userStore';
import { useLocationStore } from '../../store/locationStore';

export const DemoBanner: React.FC = () => {
  const isDemoMode = useUserStore((s) => s.isDemoMode);
  const setDemoMode = useUserStore((s) => s.setDemoMode);
  const isSimulated = useLocationStore((s) => s.isSimulated);
  const disableSimulation = useLocationStore((s) => s.disableSimulation);

  if (!isDemoMode && !isSimulated) return null;

  const handleExit = () => {
    setDemoMode(false);
    disableSimulation();
  };

  return (
    <View style={styles.container}>
      <Ionicons name="flask-outline" size={16} color={Colors.white} />
      <Text style={styles.text} numberOfLines={1}>
        DEMO MODE: SIMULATED LOCATION & LOCAL DATA
      </Text>
      <TouchableOpacity
        onPress={handleExit}
        style={styles.exitButton}
        accessibilityRole="button"
        accessibilityLabel="Exit Demo Mode"
      >
        <Text style={styles.exitText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C85A17', // Warm ochre warning accent
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: Spacing.sm,
  },
  text: {
    flex: 1,
    color: Colors.white,
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  exitButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  exitText: {
    color: Colors.white,
    fontSize: Typography.scale.caption - 1,
    fontFamily: Typography.fonts.sansBold,
  },
});
