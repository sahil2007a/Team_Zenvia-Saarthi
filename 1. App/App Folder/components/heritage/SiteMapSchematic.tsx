// SAARTHI Design System — Offline Schematic Site Map Component
// Provides an intuitive architectural schematic without requiring external Map API keys

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius, Shadows } from '../../constants/layout';
import type { HeritageSite } from '../../types/heritage';

interface SiteMapSchematicProps {
  site: HeritageSite;
}

interface MapMarker {
  id: string;
  name: string;
  type: 'monument' | 'entrance' | 'toilet' | 'water' | 'info';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  description: string;
}

export const SiteMapSchematic: React.FC<SiteMapSchematicProps> = ({ site }) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Pre-configured schematic layout markers for the site
  const markers: MapMarker[] = [
    {
      id: 'm1',
      name: 'Main Gateway / Entrance',
      type: 'entrance',
      x: 20,
      y: 80,
      description: 'Ticket verification, security check, and audio guide reception.',
    },
    {
      id: 'm2',
      name: `${site.name} Central Sanctuary`,
      type: 'monument',
      x: 52,
      y: 40,
      description: 'Primary monumental structure and historical epigraphic inscriptions.',
    },
    {
      id: 'm3',
      name: 'Archaeological Courtyard',
      type: 'monument',
      x: 75,
      y: 55,
      description: 'Remains of ancient cloisters, decorative colonnades, and reliefs.',
    },
    {
      id: 'm4',
      name: 'Restrooms & Facilities',
      type: 'toilet',
      x: 25,
      y: 30,
      description: 'Wheelchair-accessible restrooms and clean drinking water.',
    },
    {
      id: 'm5',
      name: 'Drinking Water Station',
      type: 'water',
      x: 65,
      y: 75,
      description: 'RO filtered drinking water fountain.',
    },
  ];

  const getMarkerIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'monument':
        return 'business';
      case 'entrance':
        return 'log-in';
      case 'toilet':
        return 'water';
      case 'water':
        return 'pint';
      default:
        return 'information-circle';
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'monument':
        return Colors.primary;
      case 'entrance':
        return Colors.secondary;
      case 'toilet':
      case 'water':
        return '#0288D1';
      default:
        return Colors.accent;
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Canvas / Schematic Ground */}
      <View style={styles.mapCanvas}>
        {/* Background courtyard grid */}
        <View style={styles.gridLineHorizontal1} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineVertical1} />
        <View style={styles.gridLineVertical2} />

        {/* Outer perimeter outline */}
        <View style={styles.perimeter} />

        {/* Central monument footprint */}
        <View style={styles.centralStructure}>
          <Text style={styles.structureLabel}>{site.name}</Text>
        </View>

        {/* Accessible walking path simulation */}
        <View style={styles.walkwayPath} />

        {/* Interactive Markers */}
        {markers.map((marker) => {
          const isSelected = selectedMarker?.id === marker.id;
          const icon = getMarkerIcon(marker.type);
          const color = getMarkerColor(marker.type);

          return (
            <TouchableOpacity
              key={marker.id}
              style={[
                styles.markerWrapper,
                { left: `${marker.x}%`, top: `${marker.y}%` },
                isSelected && styles.markerSelected,
              ]}
              onPress={() => setSelectedMarker(marker)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Map point: ${marker.name}`}
            >
              <View style={[styles.markerPin, { backgroundColor: color }]}>
                <Ionicons name={icon} size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Map Legend Overlay */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Monument</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
            <Text style={styles.legendText}>Entry</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#0288D1' }]} />
            <Text style={styles.legendText}>Facilities</Text>
          </View>
        </View>
      </View>

      {/* Selected Marker Details Drawer */}
      {selectedMarker && (
        <View style={styles.detailsBox}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsTitleCol}>
              <Text style={styles.detailsTitle}>{selectedMarker.name}</Text>
              <Text style={styles.detailsType}>
                {selectedMarker.type.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedMarker(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.detailsDesc}>{selectedMarker.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  mapCanvas: {
    height: 240,
    backgroundColor: '#F3E9DD', // Sandstone parchment ground
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#D4C3B3',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLineHorizontal1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '35%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '65%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridLineVertical1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '35%',
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridLineVertical2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '65%',
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  perimeter: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(107, 79, 79, 0.25)',
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
  },
  centralStructure: {
    position: 'absolute',
    top: '28%',
    left: '42%',
    width: 90,
    height: 80,
    backgroundColor: '#DFC2A5',
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: '#B38B6D',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  structureLabel: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: '#5C3A21',
    textAlign: 'center',
  },
  walkwayPath: {
    position: 'absolute',
    bottom: 40,
    left: '25%',
    width: '45%',
    height: 6,
    backgroundColor: 'rgba(190, 150, 110, 0.4)',
    borderRadius: 3,
  },
  markerWrapper: {
    position: 'absolute',
    marginLeft: -16,
    marginTop: -16,
    zIndex: 10,
  },
  markerPin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...Shadows.sm,
  },
  markerSelected: {
    transform: [{ scale: 1.2 }],
    zIndex: 20,
  },
  legend: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansMedium,
    color: Colors.textSecondary,
  },
  detailsBox: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailsTitleCol: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: Typography.scale.body2,
    fontFamily: Typography.fonts.serifSemiBold,
    color: Colors.textPrimary,
  },
  detailsType: {
    fontSize: 9,
    fontFamily: Typography.fonts.sansBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  detailsDesc: {
    fontSize: Typography.scale.caption,
    fontFamily: Typography.fonts.sans,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
