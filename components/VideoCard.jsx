import { icons } from "@/constants"
import { useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Video, ResizeMode} from 'expo-av'
import {useVideoPlayer,VideoView} from 'expo-video'
import { useEvent } from "expo"

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {

  const player = useVideoPlayer(video, (player) => {
    player.loop = true
    // player.play()
  })

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  })

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row gap-3 items-start'>
        <View className='justify-center items-center flex-row flex-1'>
          <View className='w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center px-0.5'>
            <Image
              source={{ uri: avatar }}
              className='w-full h-full rounded-lg'
              resizeMode='cover'
            />
          </View>
          <View className='justify-center flex-1 ml-3 ga-y-1'>
            <Text
              className='text-white font-psemibold text-sm'
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className='text-xs text-gray-100 font-pregular'
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className='mt-2'>
          <Image source={icons.menu} className='w-5 h-5' resizeMode='contain' />
        </View>
      </View>
      {/* video */}
      {isPlaying ? (
        <VideoView style={{width:350, height:275}} player={player} allowsFullscreen allowsPictureInPicture />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (isPlaying) {
              player.pause()
            } else {
              player.play()
            }
          }}
          className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
        >
          <Image
            source={{ uri: thumbnail }}
            className='w-full h-full rounded-xl mt-3'
            resizeMode='cover'
          />
          <Image
            source={icons.play}
            className='w-12 h-12 absolute'
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
    </View>
  )
}
export default VideoCard
const styles = StyleSheet.create({})
