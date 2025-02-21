import { icons } from '@/constants';
import { useState } from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable';
import {useVideoPlayer,VideoView} from 'expo-video'
import { useEvent } from 'expo';

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1:{
    scale: 1.1,
  }
}
const zoomOut = {
  0: {
    scale: 1,
  },
  1:{
    scale: 0.9,
  }
}

const TrendingItem = ({item,activeItem}) => {
  
  const player = useVideoPlayer(item?.video, (player)=> {
    player.loop = true;
  })

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  })
  
  return (
    <Animatable.View
      className='mr-5'
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {isPlaying ? (
        <VideoView
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
        />
      ) : (
        <TouchableOpacity
          className='relative justify-center items-center'
          activeOpacity={0.7}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            }else{
              player.play();
            }
          }}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({post}) => {
  const [activeItem,setActiveItem] = useState(post[0])
  
  const viewableItemChanged = ({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList
      data={post}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      contentOffset={{x:170}}
      horizontal
    />
  )
}
export default Trending
const styles = StyleSheet.create({})