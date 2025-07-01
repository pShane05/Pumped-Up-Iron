import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"


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

  return (
    <View style={ styles.container}>

      <Text style= {{ alignSelf: 'center', fontSize: 32, color: '#cbeef3'}}> Home </Text>

      {session && session.user && <Text style={{color: '#cbeef3', marginTop: 30}}>{session.user.id}</Text>}
      
      <Pressable style={styles.logout} onPress={() => {
        supabase.auth.signOut()
        router.replace('../login')
        Alert.alert('Logged Out of Account')
      }}>
          <Text style={{ color: 'black' }}>Logout</Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 20,
    backgroundColor: '#202020',
    padding: 50,
    alignContent: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#0D6B93',
    borderColor: '#cbeef3',
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: '#cbeef3'
  }
});
