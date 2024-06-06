# @timotismjntk/react-native-carousel

A Robust carousel component without using any dependecies and without need complicated config, easy to use

## Installation

```sh
npm install @timotismjntk/react-native-carousel
```
or
```sh
yarn add @timotismjntk/react-native-carousel
```

## Demo
<img src="https://drive.usercontent.google.com/download?id=1gVd-3arSxdoAEUU9vfocFiXVj4rEX3Im&export=view&authuser=0"/>

## Usage

```js
import Carousel from '@timotismjntk/react-native-carousel';

// ...

return (
    <Carousel
        data={[
            {
                img: 'https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=2008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            {
                img: 'https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=2008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
            {
                img: 'https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=2008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        ]}
        contentContainerStyle={{
            backgroundColor: '#fff',
            overflow: 'hidden',
            width: '100%',
            height: 130,
            borderRadius: 10,
        }}
        renderItem={({item, index}) => (
            <Image
                key={index}
                style={styles.imageCarousel}
                source={{uri: item.img}}
                resizeMethod="resize"
            />
        )}
        loop={true}
        autoplay={true}
        autoplayInterval={5000}
        pagination={{
            activeDotColor: 'rgba(255, 91, 0, 1)',
            inactiveDotColor: 'yellow',
            horizontalPosition: 'center',
            marginTop: 10,
            isTapAble: true,
        }}
    />
)
```

## Props
Prop | Description | Type | Default
------ | ------ | ------ | ------
**`data`** | Array of items to loop on | Array | **Required**
**`renderItem`** | Takes an item from data and renders it into the list. The function receives one argument `{item, index}` and must return a React element. | Function | **Required**
**`contentContainerStyle`** | These styles will be applied to the carousel content container. | Object | undefined
**`loop`** | Enables or disables loop functionality of the carousel. | Boolean | false
**`autoplay`** | Enables or disables autoplay functionality of the carousel. | Boolean | false
**`autoplayInterval`** | Delay in ms until navigating to the next item. | Number | 2000
**`pagination`** | Pagination props to show pagination dot indicator if you specify it | Object | undefined


### type
```js
type CarouselProps<ItemT = any> = {
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
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
