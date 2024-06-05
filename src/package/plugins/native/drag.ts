import { PanResponder } from 'react-native';

import type { CarouselInstance } from '../../core/types';
import { clamp, inputHandler, sign } from '../../core/utils';
import type {
  HOOK_DRAG_CHECKED,
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_UPDATED,
} from '../types';
import type {
  HOOK_LAYOUT_CHANGED,
  NativeInstance,
  NativeOptions,
} from './types';

export default function Drag(
  carousel: CarouselInstance<
    NativeOptions,
    NativeInstance<{}>,
    | HOOK_DRAG_ENDED
    | HOOK_DRAG_STARTED
    | HOOK_DRAGGED
    | HOOK_UPDATED
    | HOOK_LAYOUT_CHANGED
    | HOOK_DRAG_CHECKED
  >
): void {
  const breakFactorValue = 2;
  let direction;
  let defaultDirection;
  let size;
  let dragActive;
  let dragSpeed;
  let dragIdentifier;
  let dragJustStarted;
  let lastValue;
  let lastX;
  let lastY;
  let min;
  let max;
  function dragStart(e) {
    if (
      dragActive ||
      !carousel.track.details ||
      !carousel.track.details.length ||
      !carousel.options.drag
    )
      return;
    dragActive = true;
    dragJustStarted = true;
    dragIdentifier = e.idChanged;
    isSlide(e);
    lastValue = xy(e);
    carousel.emit('dragStarted');
    return true;
  }
  function drag(e) {
    if (!dragActive || dragIdentifier !== e.idChanged) {
      return;
    }

    const value = xy(e);
    if (dragJustStarted) {
      if (!isSlide(e)) return dragStop(e);
      carousel.emit('dragChecked');
      dragJustStarted = false;
    }

    const distance = rubberband(
      (dragSpeed(lastValue - value) / carousel.size) * defaultDirection
    );

    direction = sign(distance);
    carousel.track.add(distance);
    lastValue = value;
    carousel.emit('dragged');
  }
  function setSpeed() {
    const speed = carousel.options.dragSpeed || 1;
    dragSpeed =
      typeof speed === 'function' ? speed : (val) => val * (speed as number);
  }
  function dragStop(e) {
    if (!dragActive || dragIdentifier !== e.idChanged) return;
    dragActive = false;
    carousel.emit('dragEnded');
  }

  function isSlide(e) {
    const vertical = carousel.options.vertical;
    const x = vertical ? e.y : e.x;
    const y = vertical ? e.x : e.y;
    const isSlide =
      lastX !== undefined &&
      lastY !== undefined &&
      Math.abs(lastY - y) <= Math.abs(lastX - x);
    lastX = x;
    lastY = y;
    return isSlide;
  }

  function rubberband(distance) {
    if (min === -Infinity && max === Infinity) return distance;
    const details = carousel.track.details;
    const length = details.length;
    const position = details.position;
    const clampedDistance = clamp(distance, min - position, max - position);
    if (length === 0) return 0;
    if (!carousel.options.rubberband) {
      return clampedDistance;
    }

    if (position <= max && position >= min) return distance;
    if (
      (position < min && direction > 0) ||
      (position > max && direction < 0)
    ) {
      return distance;
    }

    const overflow =
      (position < min ? position - min : position - max) / length;

    const trackSize = size * length;
    const overflowedSize = Math.abs(overflow * trackSize);
    const p = Math.max(0, 1 - (overflowedSize / size) * breakFactorValue);
    return p * p * distance;
  }

  function setSizes() {
    size = carousel.size;
    const details = carousel.track.details;
    if (!details) return;
    min = details.min;
    max = details.max;
  }

  function xy(e) {
    return carousel.options.vertical ? e.y : e.x;
  }

  function update() {
    setSizes();
    setSpeed();
    defaultDirection = !carousel.options.rtl ? 1 : -1;
  }

  carousel.on('updated', update);
  carousel.on('layoutChanged', update);
  carousel.on('created', update);

  const pan = PanResponder.create({
    onPanResponderMove: inputHandler(drag),
    onPanResponderRelease: inputHandler(dragStop),
    onPanResponderTerminate: inputHandler(dragStop),
    onStartShouldSetPanResponder: inputHandler(dragStart),
  });
  Object.assign(carousel.containerProps, pan.panHandlers);
}
