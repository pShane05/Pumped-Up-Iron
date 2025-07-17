import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Signup from '../components/Auth'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link } from "expo-router"
import { styles } from './costants'


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
    <View style={[ styles.container, {rowGap: 20, paddingVertical: 75}]}>

      <View style={ [styles.boxView, { marginTop: 75, height: 450 }] }>
        <Signup />
      </View>

      <Text style={{ alignSelf: 'center', color: '#cbeef3', marginTop: 20 }}> Have an Account Already? </Text>

      <Link href={"/login"} style={[styles.altButton, {marginTop: 0 }]}> Sign in </Link>

    </View>
  )
}
