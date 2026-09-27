// SAARTHI — Model Placement Visual Reticle
// Displays ground-anchored ring and alignment grid on the detected surface

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ModelPlacementProps {
  isPlaced: boolean;
}

export const ModelPlacement: React.FC<ModelPlacementProps> = ({ isPlaced }) => {
  if (isPlaced) return null;

  return (
    <View style={styles.placementContainer}>
      <View style={styles.placementOuterRing}>
        <View style={styles.placementInnerRing}>
          <View style={styles.placementDot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  placementContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none' as const,
  },
  placementOuterRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotateX: '65deg' }], // Perspective tilted to look like it's flat on the ground
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  placementInnerRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placementDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
});
