import Animator from './animator';
import Track from './track';
import type {
  CarouselInstance,
  CarouselOptions,
  CarouselPlugin,
} from './types';
import { getProp } from './utils';

function Carousel<O, C, H extends string>(
  options: CarouselOptions<O>,
  plugins?: CarouselPlugin[]
): CarouselInstance<O, C, H> {
  const subs = {};

  let instance: CarouselInstance<O, C, H>;

  function init() {
    instance.track = Track(instance);
    instance.animator = Animator(instance);
    if (plugins) {
      for (const plugin of plugins) {
        plugin(instance);
      }
    }
    instance.track.init(instance.options.initial || 0);
    instance.emit('created');
  }

  function moveToIdx(idx, absolute, animation) {
    const distance = instance.track.idxToDist(idx, absolute);
    if (!distance) return;
    const defaultAnimation = instance.options.defaultAnimation;
    instance.animator.start([
      {
        distance,
        duration: getProp(animation || defaultAnimation, 'duration', 500),
        easing: getProp(
          animation || defaultAnimation,
          'easing',
          (t) => 1 + --t * t * t * t * t
        ),
      },
    ]);
  }

  function on(name, cb, remove = false) {
    if (!subs[name]) subs[name] = [];
    const idx = subs[name].indexOf(cb);

    if (idx > -1) {
      if (remove) delete subs[name][idx];
      return;
    }
    if (!remove) subs[name].push(cb);
  }

  function emit(name) {
    if (subs[name]) {
      subs[name].forEach((cb) => {
        cb(instance);
      });
    }
    const optionCallBack = instance.options && instance.options[name];
    if (optionCallBack) optionCallBack(instance);
  }

  instance = {
    emit,
    moveToIdx,
    on,
    options,
  } as CarouselInstance<O, C, H>;

  init();

  return instance;
}

export default Carousel;
