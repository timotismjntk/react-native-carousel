
export function now(): number {
  return Date.now();
}

export function inputHandler(handler: any): any {
  return (e) => {
    if (e.nativeEvent) e = e.nativeEvent;
    const changedTouches = e.changedTouches || [];
    const touchPoints = e.targetTouches || [];
    const detail = e.detail && e.detail.x ? e.detail : null;
    return handler({
      id: detail
        ? detail.identifier
          ? detail.identifier
          : 'i'
        : !touchPoints[0]
          ? 'd'
          : touchPoints[0]
            ? touchPoints[0].identifier
            : 'e',
      idChanged: detail
        ? detail.identifier
          ? detail.identifier
          : 'i'
        : !changedTouches[0]
          ? 'd'
          : changedTouches[0]
            ? changedTouches[0].identifier
            : 'e',
      raw: e,
      x:
        detail && detail.x
          ? detail.x
          : touchPoints[0]
            ? touchPoints[0].screenX
            : detail
              ? detail.x
              : e.pageX,
      y:
        detail && detail.y
          ? detail.y
          : touchPoints[0]
            ? touchPoints[0].screenY
            : detail
              ? detail.y
              : e.pageY,
    });
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sign(x: number): number {
  return (x > 0 ? 1 : 0) - (x < 0 ? 1 : 0) || +x;
}

export function getFrame(cb: FrameRequestCallback): number {
  return window.requestAnimationFrame(cb);
}

export function cancelFrame(id: number): void {
  return window.cancelAnimationFrame(id);
}

export function isNumber(n: unknown): boolean {
  return Number(n) === n;
}

export function getProp<R>(
  obj: {},
  key: string,
  fallback: R,
  resolve?: boolean
): R {
  const prop = obj && obj[key];
  if (typeof prop === 'undefined' || prop === null) return fallback;
  return resolve && typeof prop === 'function' ? prop() : prop;
}

export function round(value: number): number {
  return Math.round(value * 1000000) / 1000000;
}

export function equal(v1: any, v2: any): boolean {
  if (v1 === v2) return true;
  const t1 = typeof v1;
  const t2 = typeof v2;
  if (t1 !== t2) return false;
  if (t1 === 'object' && v1 !== null && v2 !== null) {
    if (
      v1.length !== v2.length ||
      Object.getOwnPropertyNames(v1).length !==
        Object.getOwnPropertyNames(v2).length
    )
      return false;
    for (const prop in v1) {
      if (!equal(v1[prop], v2[prop])) return false;
    }
  } else if (t1 === 'function') {
    return v1.toString() === v2.toString();
  } else {
    return false;
  }
  return true;
}

export function checkOptions(currentOptions, newOptions) {
  if (!equal(currentOptions.current, newOptions)) {
    currentOptions.current = newOptions;
  }
  return currentOptions.current;
}
