import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, StyleSheet, View, Text, Alert, Dimensions } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import DailyQuestCard from '../../components/DailyQuests'
import WorkoutCard from '../../components/WorkoutCard'
import { COLORS } from '../costants'


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

  useEffect(() => {
    if (!loading && !session) {
      router.replace('../login')
    }
  }, [session])

  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.3;  // Matches your titleView height

  return (
    <View style={ styles.container}>
      <View style={ styles.titleView  }>
        
        <Image style={{ resizeMode: 'contain', width: '100%', height: "100%"}} source={require('../../assets/images/crownbell-logo.png')}/>
        
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //rowGap: 20,
    backgroundColor: COLORS.DARK_GRAY,
    alignContent: 'center',
    justifyContent: 'center',
  },
  boxView: {
    backgroundColor: COLORS.BACKGROUND_BLUE,
    borderRadius: 25,
    borderColor: COLORS.TEAL,
    borderWidth: 3,
    padding: 2,
    marginHorizontal: 30,
    paddingTop: 25,
  },
  logout: {
    margin: 20,
    position: 'absolute',
    top: 20,
    right: 0,
    backgroundColor: COLORS.TEAL, 
    marginTop: 30,
    width: '20%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    alignSelf: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.CYAN,
    borderColor: COLORS.TEAL,
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.TEAL
  },
  titleView: {
    flex: 0,
    backgroundColor: COLORS.GRAY,
    width: '100%',
    height: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  horizontalLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.TEAL, 
    marginVertical: 10, 
    alignSelf: 'center',
  },
  scrollableView: {
    paddingBottom: 50,
    rowGap: 40,
  }

});
