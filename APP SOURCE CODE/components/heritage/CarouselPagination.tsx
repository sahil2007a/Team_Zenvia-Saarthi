// SAARTHI — Carousel Pagination Indicator
// Clean, accessible indicator dots with smooth active state highlighting

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius } from '../../constants/layout';

interface CarouselPaginationProps {
  total: number;
  activeIndex: number;
}

export const CarouselPagination: React.FC<CarouselPaginationProps> = ({
  total,
  activeIndex,
}) => {
  return (
    <View style={styles.container} accessibilityRole="tablist" accessibilityLabel="Carousel pagination">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Slide ${index + 1} of ${total}`}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  dot: {
    height: 6,
    borderRadius: BorderRadius.round,
  },
  activeDot: {
    width: 22,
    backgroundColor: Colors.secondary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: Colors.border,
  },
});
