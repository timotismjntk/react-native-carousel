import { createRef } from 'react';

import type { CarouselInstance, CarouselPlugin } from '../../core/types';
import { getProp } from '../../core/utils';
import type {
  HOOK_DRAG_CHECKED,
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_UPDATED,
} from '../types';
import Drag from './drag';
import Renderer from './renderer';
import type {
  HOOK_LAYOUT_CHANGED,
  NativeInstance,
  NativeOptions,
} from './types';

export default function Native<O>(
  defaultOptions: O
): CarouselPlugin<{}, {}, HOOK_UPDATED> {
  return (
    carousel: CarouselInstance<
      NativeOptions,
      NativeInstance<{}>,
      | HOOK_UPDATED
      | HOOK_LAYOUT_CHANGED
      | HOOK_DRAG_ENDED
      | HOOK_DRAG_STARTED
      | HOOK_DRAGGED
      | HOOK_DRAG_CHECKED
    >
  ): void => {
    let mounted = false;

    function initTrack(idx?) {
      carousel.animator.stop();
      const details = carousel.track.details;
      carousel.track.init(idx ?? (details ? details.abs : 0));
    }

    function updatecarouselData(newLength) {
      const currentLength = carousel.carouselProps.length;
      if (currentLength === newLength) return;
      const diff = newLength - currentLength;
      if (diff > 0) {
        carousel.carouselProps.push(
          ...Array(diff)
            .fill(null)
            .map(() => ({ ref: createRef() }))
        );
      } else {
        carousel.carouselProps.splice(diff);
      }
    }

    function updateTrackConfig() {
      const carouselData = carousel.options.carouselData;
      if (typeof carouselData === 'function')
        return (carousel.options.trackConfig = carouselData(carousel.size));
      const carouselDataCount: number =
        typeof carouselData === 'number'
          ? carouselData
          : getProp(carouselData, 'number', 0, true);
      const config = [];
      const perView = getProp<number>(carouselData, 'perView', 1, true);
      const spacing =
        (getProp(carouselData, 'spacing', 0, true) as number) / carousel.size ||
        0;
      const spacingPortion = spacing / (perView as number);
      const originOption = getProp(carouselData, 'origin', 'auto') as any;
      let length = 0;
      for (let i = 0; i < carouselDataCount; i++) {
        const size = 1 / (perView as number) - spacing + spacingPortion;
        const origin =
          originOption === 'center'
            ? 0.5 - size / 2
            : originOption === 'auto'
            ? 0
            : originOption;
        config.push({
          origin,
          size,
          spacing,
        });
        length += size;
      }
      length += spacing * (carouselDataCount - 1);
      if (originOption === 'auto' && !carousel.options.loop && perView !== 1) {
        let checkedLength = 0;
        config.map((entry) => {
          const space = length - checkedLength;
          checkedLength += entry.size + spacing;
          if (space >= 1) return entry;
          entry.origin = 1 - space - (length > 1 ? 0 : 1 - length);
          return entry;
        });
      }
      carousel.options.trackConfig = config;
      updatecarouselData(carousel.options.trackConfig?.length);
    }

    function onLayout(e) {
      const newSize = carousel.options.vertical
        ? e.nativeEvent.layout.height
        : e.nativeEvent.layout.width;
      if (newSize === carousel.size) return;
      carousel.size = newSize;
      if (!mounted) {
        mounted = true;
      }
      updateTrackConfig();
      initTrack();
      carousel.emit('layoutChanged');
    }

    function update(options?, idx?) {
      if (options) {
        carousel.options = { ...defaultOptions, ...options };
      }
      updateTrackConfig();
      initTrack(idx);
      carousel.emit('updated');
    }

    function init() {
      carousel.options = { ...defaultOptions, ...carousel.options };
      updateTrackConfig();
    }

    carousel.containerProps = {
      onLayout,
    };
    carousel.carouselProps = [];
    carousel.update = update;

    carousel.prev = () => {
      carousel.moveToIdx(carousel.track.details.abs - 1, true);
    };

    carousel.next = () => {
      carousel.moveToIdx(carousel.track.details.abs + 1, true);
    };

    init();

    Renderer(carousel);
    Drag(carousel);
  };
}
