import { Text, View, Image } from 'react-native'
import { Tabs,Redirect } from 'expo-router'
import { icons } from '../../constants';

const TabIcon = ({icon,color,name,focused}) => {
  return (
    <View className='items-center justify-center'>
      <Image source={icon} resizeMode="contain" tintColor={color} style={{height:24,width:24}} />
      <Text className={`${focused ? 'font-psemibold': 'font-pregular'}`} style={{fontSize:12,marginTop:2, width: '100%',color:color}}>{name}</Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <View className='flex-1'>
    <Tabs
    screenOptions={{
      tabBarShowLabel:false,
      tabBarStyle:{
        height: 84,
        paddingTop:12,
        backgroundColor: '#161622',
        borderTopWidth: 1,
        borderTopColor: '#232533'
      },
      tabBarActiveTintColor: '#FFA001',
      tabBarInactiveTintColor: '#CDCDE0',
    }}
    >
      <Tabs.Screen 
      name='home'
      options={{
        title:'Home',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
        )
      }}
      />
      <Tabs.Screen 
      name='bookmark'
      options={{
        title:'Bookmark',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon icon={icons.bookmark} color={color} name="Bookmark" focused={focused} />
        )
      }}
      />
      <Tabs.Screen 
      name='create'
      options={{
        title:'Create',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
        )
      }}
      />
      <Tabs.Screen 
      name='profile'
      options={{
        title:'Profile',
        headerShown:false,
        tabBarIcon:({color,focused})=>(
          <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
        )
      }}
      />
    </Tabs>
    </View>
  )
}
export default TabsLayout