import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { GoldCounter, XpDisplay } from '../../components/UI'
import { COLORS } from '../costants'
import { useProfile } from '../hooks/useProfile'
import { updateProfile } from '../../lib/profile'


export default function AvatarScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const profile = useProfile(session?.user.id).profile
  const gold = profile?.gold_count
  const userId = profile?.id

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

  return (
    <View style={ styles.container}>

      <GoldCounter goldCount={ gold }/> 
      
      <Text style= {{ alignSelf: 'center', fontSize: 32, color: '#cbeef3'}}> Avatar </Text>
      <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />

      <Pressable style={[ styles.button, { marginTop: 30 } ]}>
        <Text style={{ color: COLORS.BLACK, fontSize: 20 }}> Wardrobe </Text>
      </Pressable>

       <View style={[ styles.horizontalLine, { width: '60%', marginTop: 40 } ]} />

       <XpDisplay userId= { userId }/>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    paddingTop: '20%',
    alignContent: 'center',
  },
  boxView: {
    backgroundColor: '#10002b',
    borderRadius: 25,
    borderColor: '#cbeef3',
    borderWidth: 3,
    padding: 2,
  },
  logout: {
    backgroundColor: '#cbeef3', 
    marginTop: 25,
    width: '20%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    alignSelf: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.PINK,
    marginTop: 20,
    alignSelf: 'center',
  },
  horizontalLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.TEAL, 
    alignSelf: 'center',
  },
  
});
