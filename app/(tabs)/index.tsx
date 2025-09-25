import 'react-native-url-polyfill/auto'
import { ScrollView, Image, Pressable, StyleSheet, View, Text, Alert, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native'
import { Link, useRouter } from "expo-router"
import DailyPreviewCard from '../../components/DailiesPreview'
import WorkoutCard from '../../components/WorkoutCard'
import { COLORS, FONTS, styles } from '../costants'
import { useProfileData } from '../../hooks/useProfile'
import LoadingScreen from '../../components/LoadingScreen'


export default function App() {

  const { loading, session, signOut} = useProfileData()
  
  
  const router = useRouter()
  
  const handleLogout = async () => {
    try {

      await signOut()
      router.replace('../login')
      Alert.alert('Logged Out of Account')
    } catch (error) {

      Alert.alert('Error: ', 'Failed to log out') 
    } 
  }
  

  if (loading) {
    return (
    <LoadingScreen />
    )
  }
      
  return (
    <SafeAreaView style={ styles.container}>
      <View style={ styles.titleView  }>
        
        <Image style={{ marginTop: 15, resizeMode: 'contain', width: '100%', height: "100%", tintColor: COLORS.PINK}} source={require('../../assets/images/crownbell-logo.png')}/>
        
        <Pressable style={styles.logout} 
          onPress={() => {
            handleLogout()
          }}
        >
          <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY }}> Logout </Text>
        </Pressable>

      </View>
      

      <ScrollView contentContainerStyle={ styles.scrollableView }>
        <View style={{ height: 180}} />

        <DailyPreviewCard />

        <WorkoutCard session={session}/>

      </ScrollView>
      
      

    </SafeAreaView>
  )
}
