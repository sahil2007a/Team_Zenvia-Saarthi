// SAARTHI — Dedicated Heritage 360° Virtual Tour Route
// PRD & SIH 2026 Virtual Tour Integration: /heritage/[slug]/virtual-tour

import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { VirtualTourViewer } from '../../../components/virtual-tour';

export default function HeritageVirtualTourScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const siteId = slug || 'qutub-minar';

  return <VirtualTourViewer siteId={siteId} />;
}
