import type { CarouselInstance } from '../../core/types';
import type { HOOK_UPDATED } from '../types';
import type { NativeInstance, NativeOptions } from './types';

export default function Renderer(
  carousel: CarouselInstance<NativeOptions, NativeInstance<{}>, HOOK_UPDATED>
): void {
  function update() {
    if (!carousel.track.details) return;
    carousel.track.details.carouselData.forEach((slide, idx) => {
      const width = carousel.options.vertical ? '100%' : `${slide.size * 100}%`;
      const height = !carousel.options.vertical
        ? '100%'
        : `${slide.size * 100}%`;
      const xy = carousel.size
        ? slide.distance * carousel.size
        : slide.distance * 100 + '%';
      const left = carousel.options.vertical ? 0 : xy;
      const top = !carousel.options.vertical ? 0 : xy;
      const position = 'absolute';
      carousel.carouselProps[idx].style = {
        height,
        left,
        position,
        top,
        width,
      };
      const ref = carousel.carouselProps[idx].ref.current;
      if (ref) {
        ref.setNativeProps({
          style: {
            height,
            left,
            position,
            top,
            width,
          },
        });
      }
    });
  }

  carousel.on('detailsChanged', update);
  carousel.on('created', update);
  carousel.on('updated', update);
}
