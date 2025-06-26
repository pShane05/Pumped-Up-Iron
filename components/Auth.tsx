import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  var notSession = !session;

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })


    if (error) Alert.alert(error.message)
   // if (!session) Alert.alert('New Account Created!')
    

    signInWithEmail();
    Alert.alert('New Account Created!')
    setLoading(false)
  }


  return (
    <View style={styles.container}>
      <View style={[styles.input, styles.mt25]}>
        <Input
          //label="Email"
          //leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          disabled={!notSession}
        />
      </View>
      <View style={styles.input}>
        <Input
          //label="Password"
          //leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          disabled={!notSession}
        />
      </View>
      <View style={[styles.button, {backgroundColor: '#550577'}, {borderColor: '#E113C5'}, {borderWidth: 2}, styles.mt25]}>
        <Pressable disabled={loading || !notSession} onPress={() => signUpWithEmail()}>
            <Text style={{color: '#E113C5', borderColor: '#E113C5'}}>Create Account</Text>
        </Pressable>
      </View>
      <View style={[styles.button]}>
        <Pressable disabled={loading || !notSession} onPress={() => signInWithEmail()}>
            <Text>Sign In</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 15,
    //alignItems: 'center',
  },
  input: {
    margin: 3,
    marginTop: 15,
    backgroundColor: '#f0f0f0',
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 20,
    height: '17%',
  },
  mt25: {
    marginTop: 25,
  },
  button: {
    margin: 6,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#0D6B93',
    marginTop: 10,
    position: 'relative',
    alignSelf: 'center',
  },
})