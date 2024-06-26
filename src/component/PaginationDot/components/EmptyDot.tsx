import React from 'react';
import { StyleSheet, View } from 'react-native';

export const defaultEmptyDotSize = 3;

const EmptyDot: React.FC<{
  sizeRatio: number;
}> = (props) => {
  return (
    <View
      style={[
        styles.base,
        {
          width: defaultEmptyDotSize * props.sizeRatio,
          height: defaultEmptyDotSize * props.sizeRatio,
          margin: defaultEmptyDotSize * props.sizeRatio,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'white',
    opacity: 0.0,
  },
});

export default EmptyDot;