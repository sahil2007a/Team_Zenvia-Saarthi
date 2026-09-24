// SAARTHI Design System — Provenance Badge Component
// Renders color-coded, standardized epistemological provenance tags per PRD §16, TRD §6

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/layout';
import { KnowledgeLabel, StructureStatus } from '../../types/heritage';
import { useUserStore } from '../../store/userStore';

interface ProvenanceBadgeProps {
  label: KnowledgeLabel | StructureStatus | string;
  size?: 'sm' | 'md';
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  label,
  size = 'md',
}) => {
  const isLargeText = useUserStore((s) => s.profile.accessibility.largeText);

  // Label styling & text configuration
  const getLabelConfig = () => {
    switch (label) {
      case KnowledgeLabel.VERIFIED_FACT:
      case 'VERIFIED_FACT':
        return {
          title: 'VERIFIED FACT',
          bg: Colors.provenance.verifiedFactBg,
          text: Colors.provenance.verifiedFact,
        };
      case KnowledgeLabel.ARCHAEOLOGICAL_EVIDENCE:
      case 'ARCHAEOLOGICAL_EVIDENCE':
        return {
          title: 'ARCHAEOLOGICAL EVIDENCE',
          bg: Colors.provenance.archaeologicalEvidenceBg,
          text: Colors.provenance.archaeologicalEvidence,
        };
      case KnowledgeLabel.LOCAL_TRADITION:
      case 'LOCAL_TRADITION':
        return {
          title: 'LOCAL TRADITION',
          bg: Colors.provenance.localTraditionBg,
          text: Colors.provenance.localTradition,
        };
      case KnowledgeLabel.INTERPRETATION:
      case 'INTERPRETATION':
        return {
          title: 'HISTORICAL INTERPRETATION',
          bg: Colors.provenance.interpretationBg,
          text: Colors.provenance.interpretation,
        };
      case StructureStatus.ORIGINAL:
      case 'ORIGINAL':
        return {
          title: 'ORIGINAL STRUCTURE',
          bg: Colors.provenance.originalBg,
          text: Colors.provenance.original,
        };
      case StructureStatus.RESTORED:
      case 'RESTORED':
        return {
          title: 'CONSERVED / RESTORED',
          bg: Colors.provenance.restoredBg,
          text: Colors.provenance.restored,
        };
      case StructureStatus.RECONSTRUCTED:
      case 'RECONSTRUCTED':
        return {
          title: 'RECONSTRUCTED',
          bg: Colors.provenance.reconstructedBg,
          text: Colors.provenance.reconstructed,
        };
      default:
        return {
          title: String(label).toUpperCase(),
          bg: Colors.surfaceVariant,
          text: Colors.textSecondary,
        };
    }
  };

  const config = getLabelConfig();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        size === 'sm' ? styles.badgeSm : styles.badgeMd,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Provenance: ${config.title}`}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: config.text },
          size === 'sm' && styles.dotSm,
        ]}
      />
      <Text
        style={[
          styles.text,
          { color: config.text },
          size === 'sm' ? styles.textSm : styles.textMd,
          isLargeText && styles.largeText,
        ]}
      >
        {config.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.round,
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotSm: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4,
  },
  text: {
    fontFamily: Typography.fonts.sansBold,
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: Typography.scale.caption,
  },
  textMd: {
    fontSize: Typography.scale.caption + 1,
  },
  largeText: {
    fontSize: Typography.largeScale.caption,
  },
});
