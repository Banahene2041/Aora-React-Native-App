import EmptyState from "@/components/EmptyState"
import SearchInput from "@/components/SearchInput"
import Trending from "@/components/Trending"
import VideoCard from "@/components/VideoCard"
import { images } from "@/constants"
import { useGlobalContext } from "@/context/GloabalProvider"
import { getAllPosts, getLatestPosts } from "@/lib/appwrite"
import useAppwrite from "@/lib/useAppwrite"
import { StatusBar } from "expo-status-bar"
import { useState } from "react"
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Home = () => {
  const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts)
  const { data: latestPosts } = useAppwrite(getLatestPosts)
  const [refreshing, setRefreshing] = useState(false)
  const { user } = useGlobalContext()

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        renderItem={({ item }) => <VideoCard video={item} />}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome Back,
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {user?.username}
                </Text>
              </View>

              <View className='mt-1.5'>
                <Image
                  source={images.logoSmall}
                  className='w-9 h-9'
                  resizeMode='contain'
                />
              </View>
            </View>

            {/* search input */}
            <SearchInput />
            {/* latest video section */}
            <View className='w-full flex-1 pt-5 pb-8'>
              <Text className='text-gray-100 text-lg font-pregular mb-3'>
                Latest Videos
              </Text>

              {/* carousel  video*/}
              <Trending post={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No videos Found'
            subtitle='Be the first one to upload a video'
          />
        )}
        refreshControl={
          <RefreshControl
            tintColor='white'
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
      <StatusBar style='light' />
    </SafeAreaView>
  )
}
export default Home
const styles = StyleSheet.create({})
