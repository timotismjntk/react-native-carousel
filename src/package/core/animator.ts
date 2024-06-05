import type {
  AnimatorInstance,
  CarouselHooks,
  CarouselInstance,
} from './types';
import { cancelFrame, getFrame } from './utils';

function Animator(
  carousel: CarouselInstance<{}, {}, CarouselHooks>
): AnimatorInstance {
  let instance: AnimatorInstance;
  let currentKeyframe, duration, keyframes, reqId, started;

  function animate(now) {
    if (!started) started = now;
    setActive(true);
    let time = now - started;
    if (time > duration) time = duration;
    const keyframe = keyframes[currentKeyframe];
    const endTime = keyframe[3];
    if (endTime < time) {
      currentKeyframe++;
      return animate(now);
    }
    const startTime = keyframe[2];
    const easingDuration = keyframe[4];
    const startPosition = keyframe[0];
    const distance = keyframe[1];
    const easing = keyframe[5];
    const progress =
      easingDuration === 0 ? 1 : (time - startTime) / easingDuration;
    const add = distance * easing(progress);
    if (add) carousel.track.to(startPosition + add);
    if (time < duration) return nextFrame();
    started = null;
    setActive(false);
    setTargetIdx(null);
    carousel.emit('animationEnded');
  }

  function setActive(active) {
    instance.active = active;
  }

  function setTargetIdx(value) {
    instance.targetIdx = value;
  }

  function nextFrame() {
    reqId = getFrame(animate);
  }

  function start(_keyframes) {
    stop();
    if (!carousel.track.details) return;
    let sumDistance = 0;
    let endPosition = carousel.track.details.position;
    currentKeyframe = 0;
    duration = 0;
    keyframes = _keyframes.map((keyframe) => {
      const startPosition = Number(endPosition);
      const animationDuration = keyframe.earlyExit ?? keyframe.duration;
      const easing = keyframe.easing;
      const distance =
        keyframe.distance * easing(animationDuration / keyframe.duration) || 0;
      endPosition += distance;
      const startTime = duration;
      duration += animationDuration;
      sumDistance += distance;
      return [
        startPosition,
        keyframe.distance,
        startTime,
        duration,
        keyframe.duration,
        easing,
      ];
    });
    setTargetIdx(carousel.track.distToIdx(sumDistance));
    nextFrame();
    carousel.emit('animationStarted');
  }

  function stop() {
    cancelFrame(reqId);
    setActive(false);
    setTargetIdx(null);
    if (started) carousel.emit('animationStopped');
    started = null;
  }

  instance = { active: false, start, stop, targetIdx: null };
  return instance;
}

export default Animator;
