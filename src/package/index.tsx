import { useEffect, useMemo, useRef } from 'react';

import Carousel from './core/carousel';
import type {
  CarouselHooks,
  CarouselInstance,
  CarouselOptions,
  CarouselPlugin,
} from './core/types';
import { checkOptions } from './core/utils';
import Modes from './plugins/modes';
import Native from './plugins/native/native';
import type { NativeInstance, NativeOptions } from './plugins/native/types';
import type {
  HOOK_DRAG_CHECKED,
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_UPDATED,
} from './plugins/types';

export type CarouselNativeHooks =
  | CarouselHooks
  | HOOK_UPDATED
  | HOOK_DRAGGED
  | HOOK_DRAG_ENDED
  | HOOK_DRAG_STARTED
  | HOOK_DRAG_CHECKED;

export type CarouselNativeOptions<
  O = {},
  P = {},
  H extends string = CarouselNativeHooks,
> = CarouselOptions<NativeOptions> & {
  [key in Exclude<
    H | CarouselNativeHooks,
    keyof CarouselOptions<NativeOptions>
  >]?: (carousel: CarouselNativeInstance<O, P, H>) => void;
} & Omit<O, keyof CarouselOptions<NativeOptions>>;

export type CarouselNativeInstance<
  O = {},
  P = {},
  H extends string = CarouselNativeHooks,
> = CarouselInstance<
  CarouselNativeOptions<O, P, H>,
  NativeInstance<CarouselNativeOptions<O, P, H>> & P,
  CarouselNativeHooks | H
>;

export type CarouselNativePlugin<
  O = {},
  P = {},
  H extends string = CarouselNativeHooks,
> = CarouselPlugin<
  CarouselNativeOptions<O, P, H>,
  CarouselNativeInstance<O, P, H>,
  CarouselNativeHooks | H
>;

export * from './plugins/native/types';
export * from './plugins/native/types';
export * from './core/types';

const CarouselNative = function <O, P, H extends string = CarouselNativeHooks>(
  options?: CarouselNativeOptions<O, P, H>,
  plugins?: CarouselNativePlugin[]
): CarouselNativeInstance<O, P, H> {
  try {
    const defOpts = {
      drag: true,
      mode: 'snap',
      rubberband: true,
    } as CarouselNativeOptions;
    return Carousel<
      CarouselNativeOptions<O, P, H>,
      CarouselNativeInstance<O, P, H>,
      CarouselNativeHooks
    >(options, [
      Native<CarouselNativeOptions>(defOpts),
      Modes,
      ...(plugins || []),
    ]);
  } catch (e) {
    throw e;
  }
};

export default CarouselNative as unknown as {
  new <O = {}, P = {}, H extends string = CarouselNativeHooks>(
    options?: CarouselNativeOptions<O, P, H>,
    plugins?: CarouselNativePlugin<O, P, H>[]
  ): CarouselNativeInstance<O, P, H>;
};

export function useCarouselNative<
  O = {},
  P = {},
  H extends string = CarouselNativeHooks,
>(
  options?: CarouselNativeOptions<O, P, H>,
  plugins?: CarouselNativePlugin<O, P, H>[]
): CarouselNativeInstance<O, P, H> {
  const optionsCheckedFirst = useRef(false);
  const currentOptions = useRef(options);
  const carousel = useMemo<CarouselNativeInstance<O, P, H>>(
    () => CarouselNative(options, plugins),
    []
  );
  useEffect(() => {
    if (!optionsCheckedFirst.current) {
      optionsCheckedFirst.current = true;
      return;
    }

    if (carousel) carousel.update(currentOptions.current);
  }, [checkOptions(currentOptions, options)]);

  return carousel;
}
