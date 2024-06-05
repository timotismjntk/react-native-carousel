export type TrackDetails = {
  abs: number;
  length: number;
  max: number;
  maxIdx: number;
  min: number;
  minIdx: number;
  position: number;
  rel: number;
  progress: number;
  carouselData: {
    abs: number;
    distance: number;
    portion: number;
    size: number;
  }[];
  carouselDataLength: number;
};

export type TrackcarouselDataConfigEntry = {
  origin?: Number;
  size?: Number;
  spacing?: Number;
} | null;

export type TrackcarouselDataConfigOption = TrackcarouselDataConfigEntry[];

export type CarouselHooks =
  | HOOK_CREATED
  | HOOK_ANIMATION_ENDED
  | HOOK_ANIMATION_STARTED
  | HOOK_ANIMATION_STOPPED
  | HOOK_SLIDE_CHANGED
  | HOOK_DETAILS_CHANGED;

export type CarouselHookOptions<H extends string, I> = {
  [key in H]?: (carousel: I) => void;
};

export type CarouselOptions<O = {}> = {
  defaultAnimation?: {
    duration?: number;
    easing?: (t: number) => number;
  };
  initial?: number;
  loop?: boolean | { min?: number; max?: number };
  range?: { align?: boolean; min?: number; max?: number };
  rtl?: boolean;
  trackConfig?: TrackcarouselDataConfigOption;
} & O;

export type CarouselInstance<O = {}, C = {}, H extends string = string> = {
  animator: AnimatorInstance;
  emit: (name: H | CarouselHooks) => void;
  moveToIdx: (
    idx: number,
    absolute?: boolean,
    animation?: { duration?: number; easing?: (t: number) => number }
  ) => void;
  on: (
    name: H | CarouselHooks,
    cb: (props: CarouselInstance<O, C, H>) => void,
    remove?: boolean
  ) => void;
  options: CarouselOptions<O>;
  track: TrackInstance;
} & C;

export type CarouselPlugin<O = {}, C = {}, H extends string = string> = (
  carousel: CarouselInstance<O, C, H>
) => void;

export interface AnimatorInstance {
  active: boolean;
  start: (
    keyframes: {
      distance: number;
      duration: number;
      earlyExit?: number;
      easing: (t: number) => number;
    }[]
  ) => void;
  stop: () => void;
  targetIdx: number | null;
}

export interface TrackInstance {
  absToRel: (absoluteIdx: number) => number;
  add: (value: number) => void;
  details: TrackDetails;
  distToIdx: (distance: number) => number;
  idxToDist: (idx: number, absolute?: boolean, fromPosition?: number) => number;
  init: (idx?: number) => void;
  to: (value: number) => void;
  velocity: () => number;
}

export type HOOK_ANIMATION_ENDED = 'animationEnded';
export type HOOK_ANIMATION_STARTED = 'animationStarted';
export type HOOK_ANIMATION_STOPPED = 'animationStopped';
export type HOOK_CREATED = 'created';
export type HOOK_SLIDE_CHANGED = 'slideChanged';
export type HOOK_DETAILS_CHANGED = 'detailsChanged';
