import type { LegacyRef } from 'react';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import type { TrackcarouselDataConfigOption } from '../../core/types';
import type {
  DRAG_ANIMATION_MODE_FREE,
  DRAG_ANIMATION_MODE_FREE_SNAP,
  DRAG_ANIMATION_MODE_SNAP,
  DragAnimationOptions,
} from '../types';

export type NativeOptions = {
  drag?: boolean;
  dragSpeed?: number | ((val: number) => number);
  rubberband?: boolean;
  carouselData?:
    | ((size: number) => TrackcarouselDataConfigOption)
    | number
    | {
        origin?: 'center' | 'auto' | number;
        number?: number | (() => number | null) | null;
        perView?: number | (() => number);
        spacing?: number | (() => number);
      };

  vertical?: boolean;
} & DragAnimationOptions<
  | DRAG_ANIMATION_MODE_SNAP
  | DRAG_ANIMATION_MODE_FREE_SNAP
  | DRAG_ANIMATION_MODE_FREE
>;

export type CarouselProps = {
  ref?: LegacyRef<View>;
  style?: StyleProp<ViewStyle>;
};

export interface NativeInstance<O> {
  containerProps: {
    onStartShouldSetResponder: (event: GestureResponderEvent) => boolean;
    onResponderMove: (event: GestureResponderEvent) => void;
    onResponderRelease: (event: GestureResponderEvent) => void;
    onResponderTerminate: (event: GestureResponderEvent) => void;
    onLayout: (event: LayoutChangeEvent) => void;
  };
  carouselProps: CarouselProps[];
  size: number;
  next: () => void;
  prev: () => void;
  update: (options?: O, idx?: number) => void;
}

export type HOOK_LAYOUT_CHANGED = 'layoutChanged';
