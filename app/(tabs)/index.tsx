import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, StyleSheet, View, Text, Alert, Dimensions, SafeAreaView } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import DailyQuestCard from '../../components/DailyQuests'
import WorkoutCard from '../../components/WorkoutCard'
import { COLORS, styles } from '../costants'


export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, dob')
    .eq('id', currentSession.user.id)
    .single()
  
    if (!profile?.username) {
      
      router.replace('/makeProfile')
  
    } else if (!profile?.dob) {
      router.replace('/setBirthday')
  
    } else {
      setProfileComplete(true)
    }

  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.3;  // Matches your titleView height

  return (
    <View style={ styles.container}>
      <View style={ styles.titleView  }>
        
        <Image style={{ resizeMode: 'contain', width: '100%', height: "100%", marginTop: 30}} source={require('../../assets/images/crownbell-logo.png')}/>
        
        {session && session.user && <Text style={{color: COLORS.TEAL, position: 'absolute', bottom: 15 }}>{session.user.email}</Text>}
        
        <Pressable style={styles.logout} onPress={() => {
          supabase.auth.signOut()
          router.replace('../login')
          Alert.alert('Logged Out of Account')
        }}>
            <Text style={{ color: 'black' }}> Logout </Text>
        </Pressable>

      </View>
      <View style={{ height:  headerHeight}} />

      <ScrollView contentContainerStyle={ styles.scrollableView }>
        

        <DailyQuestCard />

        <WorkoutCard />

      </ScrollView>
      
      

    </View>
  )
}
