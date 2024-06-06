import React from 'react';
import { type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
export type CarouselProps<ItemT = any> = {
  data: ItemT[];
  renderItem: ({
    item,
    index,
  }: {
    item: ItemT;
    index: number;
  }) => React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  loop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  pagination?: {
    sizeRatio?: number;
    activeDotColor: string;
    inactiveDotColor?: string;
    vertical?: boolean;
    horizontalPosition?: 'left' | 'center' | 'right';
    marginTop?: number;
    isTapAble?: boolean;
  };
};
export function useOnPressConfig(): (onPress: () => void) => {
  onTouchMove: (event: GestureResponderEvent) => void;
  onTouchEnd: (event: GestureResponderEvent) => void;
}
export default function Carousel<ItemT>({
  data,
  renderItem,
  contentContainerStyle,
  loop,
  autoplay,
  autoplayInterval,
  pagination,
}: CarouselProps<ItemT>): React.JSX.Element;
