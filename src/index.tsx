/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

// lib
import { useCarouselNative } from './package';

// components
import PaginationDot from './component/PaginationDot';

export type CarouselProps<ItemT = any> = {
  data: ItemT[];
  renderItem: ({
    item,
    index,
  }: {
    item: ItemT;
    index: number;
  }) => React.ReactElement;
  contentContainerStyle?: StyleProp<ViewStyle>;
  loop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  pagination?: {
    sizeRatio?: number;
    activeDotColor: string;
    inactiveDotColor?: string;
    vertical?: boolean;
    horizontalPosition?: 'left' | 'center' | 'right';
    marginTop?: number;
    isTapAble?: boolean;
  };
};

export default function Carousel<ItemT>({
  data,
  renderItem,
  contentContainerStyle,
  loop = true,
  autoplay = false,
  autoplayInterval = 2000,
  pagination,
}: CarouselProps<ItemT>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carousel = useCarouselNative(
    {
      carouselData: data.length,
      loop: loop,
    },
    [
      (e) => {
        e.on('slideChanged', ({ track }) => {
          setActiveIndex(track.details.rel);
        });
      },
    ]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (carousel) {
      if (autoplay) {
        interval = setInterval(() => {
          carousel.next();
        }, autoplayInterval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoplay, autoplayInterval, carousel]);

  return (
    <View style={styles.container}>
      <View style={contentContainerStyle} {...carousel.containerProps}>
        {[...Array(data.length).keys()].map((idx) => {
          return (
            <View key={idx} {...carousel.carouselProps[idx]}>
              {renderItem({ item: data[idx]!, index: idx })}
            </View>
          );
        })}
      </View>
      {pagination && (
        <View
          style={{
            alignItems:
              pagination.horizontalPosition === 'left'
                ? 'flex-start'
                : pagination.horizontalPosition === 'center'
                  ? 'center'
                  : pagination.horizontalPosition === 'right'
                    ? 'flex-end'
                    : 'flex-start',
            marginTop: pagination.marginTop || 0,
          }}
        >
          <PaginationDot
            activeDotColor={pagination.activeDotColor}
            inactiveDotColor={pagination.inactiveDotColor}
            sizeRatio={pagination.sizeRatio}
            vertical={pagination.vertical}
            curPage={activeIndex}
            maxPage={data.length}
            onPressDot={(index) =>
              pagination.isTapAble && carousel.moveToIdx(index)
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});
