import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Signup from '../components/Auth'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link } from "expo-router"


export default function SignupScreen() {
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

      <View style={ [styles.boxView, { marginTop: 75 }] }>
        <Signup />
      </View>

      <Text style={{ alignSelf: 'center', color: '#cbeef3', marginTop: 20 }}> Have an Account? </Text>

      <Link href={"/login"} style={[styles.button, {marginTop: 0 }]}> Sign in </Link>


        {session && session.user && <Text style={{color: '#cbeef3', marginTop: 30}}>{session.user.id}</Text>}

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
