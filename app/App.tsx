import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  return (
    <View style={ styles.container}>
      <View style={styles.boxView}>
        <Auth />
      
        
      </View>
        {session && session.user && <Text style={{color: '#cbeef3', marginTop: 30}}>{session.user.id}</Text>}

        {session && session.user && <Pressable style={styles.logout} onPress={() => {
          supabase.auth.signOut()
          Alert.alert('Logged Out of Account')
        }}>
            <Text style={{ color: 'black' }}>Logout</Text>
          </Pressable>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
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
    height: '45%',
  },
  logout: {
    backgroundColor: '#cbeef3', 
    marginTop: 25,
    width: '20%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    alignSelf: 'center',
  }
});
