import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ScrollView,
  View,
  type ViewStyle,
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// components
import Dot from './components/Dot';
import EmptyDot, { defaultEmptyDotSize } from './components/EmptyDot';

// hooks
import usePrevious from './hooks/usePrevious';

export interface IPaginationDotProps {
  curPage: number;
  maxPage: number;
  sizeRatio?: number;
  activeDotColor: string;
  inactiveDotColor?: string;
  vertical?: boolean;
  onPressDot?: (index: number) => void;
}

const ONE_EMPTY_DOT_SIZE = defaultEmptyDotSize * defaultEmptyDotSize;

export default function PaginationDot(props: IPaginationDotProps) {
  const refScrollView = useRef<ScrollView>(null);
  const prevPage = usePrevious(props.curPage);

  const getSizeRatio = useCallback<() => number>(() => {
    if (!props.sizeRatio) return 1.0;

    return Math.max(1.0, props.sizeRatio);
  }, [props.sizeRatio]);

  const scrollTo = useCallback<(index: number, animated?: boolean) => void>(
    (index, animated = true) => {
      if (!refScrollView.current) return;

      const sizeRatio = getSizeRatio();
      const FIRST_EMPTY_DOT_SPACE = ONE_EMPTY_DOT_SIZE * 2;
      const MOVE_DISTANCE = ONE_EMPTY_DOT_SIZE * sizeRatio;

      const moveTo = Math.max(
        0,
        FIRST_EMPTY_DOT_SPACE + (index - 4) * MOVE_DISTANCE
      );

      if (props.vertical) {
        refScrollView.current.scrollTo({
          x: 0,
          y: moveTo,
          animated,
        });
        return;
      }

      refScrollView.current.scrollTo({
        x: moveTo,
        y: 0,
        animated,
      });
    },
    [getSizeRatio, props.vertical]
  );

  const getContainerStyle = useCallback<() => StyleProp<ViewStyle>>(() => {
    const { vertical } = props;
    const sizeRatio = getSizeRatio();
    const containerSize = 84 * sizeRatio;

    return {
      alignItems: 'center',
      flexDirection: vertical ? 'column' : 'row',
      maxHeight: vertical ? containerSize : undefined,
      maxWidth: vertical ? undefined : containerSize,
    };
  }, [getSizeRatio, props]);

  useEffect(() => {
    if (props.maxPage > 4 && prevPage !== props.curPage)
      scrollTo(props.curPage);
  }, [prevPage, props.curPage, props.maxPage, scrollTo]);

  const { curPage, maxPage, activeDotColor, inactiveDotColor } = props;
  const list = useMemo(() => [...Array(maxPage).keys()], [maxPage]);

  let normalizedPage = curPage;
  if (curPage < 0) {
    normalizedPage = 0;
  }

  if (curPage > maxPage - 1) {
    normalizedPage = maxPage - 1;
  }
  const sizeRatio = getSizeRatio();

  const container = getContainerStyle();

  if (maxPage < 5) {
    return (
      <View style={container}>
        {list.map((i) => {
          return (
            <TouchableOpacity onPress={() => props?.onPressDot?.(i)}>
              <Dot
                key={i}
                idx={i}
                sizeRatio={sizeRatio}
                curPage={normalizedPage}
                maxPage={maxPage}
                activeColor={activeDotColor}
                inactiveColor={inactiveDotColor}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View
      style={container}
      onLayout={() => {
        // scroll to right index on initial render
        scrollTo(props.curPage, false);
      }}
    >
      <ScrollView
        ref={refScrollView}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        horizontal={!props.vertical}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* previous empty dummy dot */}
        <EmptyDot sizeRatio={sizeRatio} />
        <EmptyDot sizeRatio={sizeRatio} />

        {list.map((i) => {
          return (
            <Dot
              sizeRatio={sizeRatio}
              key={i}
              idx={i}
              curPage={normalizedPage}
              maxPage={maxPage}
              activeColor={activeDotColor}
              inactiveColor={inactiveDotColor}
            />
          );
        })}

        {/* previous empty dummy dot */}
        <EmptyDot sizeRatio={sizeRatio} />
        <EmptyDot sizeRatio={sizeRatio} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
  },
});
