import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, StyleSheet, View, Text, Alert, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import DailyPreviewCard from '../../components/DailiesPreview'
import WorkoutCard from '../../components/WorkoutCard'
import { COLORS, FONTS, styles } from '../costants'
import { useProfile } from '../../hooks/useProfile'
import LoadingScreen from '../../components/LoadingScreen'
import { Profile } from '../../lib/profile'
import { useProfileQuests } from '../../hooks/useDailies'
import { createClient } from '@supabase/supabase-js'



export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>()
  const [workoutIsActive, setWorkoutIsActive] = useState(false)

  const { profile: profileData } = useProfile(session?.user?.id)
  
  const { dailyQuests } = useProfileQuests(profile?.id)
  
  const router = useRouter()
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription?.unsubscribe()     // cleanup the listener when the compnoent unmounts
    }
  }, [])
  
  useEffect(() => {
    
    if (loading) return
    
    if (profile === undefined || loading) {
      return // session still loading
    }
    else {
      if (!session) 
        router.replace("/login")

      else if (!profile?.username) {
        router.replace('/makeProfile')
    
      }
      else if (!profile?.dob) 
        router.replace('/setBirthday')
    }
  }, [session, profile, loading])

  // update profile when session updates
    useEffect(() => {
        if (session)
            setProfile(profileData)
    }, [session, profileData])
   

  if (loading) {
    return (
    <LoadingScreen />
    )
  }
      
  return (
    <SafeAreaView style={ styles.container}>
      <View style={ styles.titleView  }>
        
        <Image style={{ marginTop: 15, resizeMode: 'contain', width: '100%', height: "100%", tintColor: COLORS.PINK}} source={require('../../assets/images/crownbell-logo.png')}/>
        
        <Pressable style={styles.logout} onPress={() => {
          supabase.auth.signOut()
          router.replace('../login')
          Alert.alert('Logged Out of Account')
        }}>
            <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY }}> Logout </Text>
        </Pressable>

      </View>
      

      <ScrollView contentContainerStyle={ styles.scrollableView }>
        <View style={{ height: 180}} />

        <DailyPreviewCard quests={dailyQuests}/>

        <WorkoutCard session={session}/>

      </ScrollView>
      
      

    </SafeAreaView>
  )
}
