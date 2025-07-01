import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { navigate } from 'expo-router/build/global-state/routing'
import { useRouter } from 'expo-router'



export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  var notSession = !session;
  const router = useRouter()

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) 
      Alert.alert(error.message)
    else
      router.push('/')
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    if (password != confirmPassword) {
      Alert.alert('Passwords do not match!')
      return;
    }
    const {
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })


    if (error) Alert.alert(error.message)
    

    signInWithEmail();
    Alert.alert('New Account Created!')
    setLoading(false)
  }


  return (
    <View style={styles.container}>

      <Text style={{ color: '#cbeef3', fontSize: 16}}> Create Account</Text>

      <View style={[styles.input, styles.mt25]}>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          disabled={!notSession}
        />
      </View>

      <View style={styles.input}>
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          disabled={!notSession}
        />
      </View>

      <View style={styles.input}>
        <Input
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
          autoCapitalize={'none'}
          disabled={!notSession}
        />
      </View>

      <View style={[styles.button, styles.mt25, 
        {backgroundColor: '#550577', borderColor: '#E113C5', borderWidth: 2} ]}>

        <Pressable disabled={loading || !notSession} onPress={() => signUpWithEmail()}>
            <Text style={{color: '#E113C5', borderColor: '#E113C5'}}>Create Account</Text>
        </Pressable>

      </View>
    </View>
  )
}


export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  var notSession = !session;
  const router = useRouter()

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) 
      Alert.alert(error.message)
    else
      router.push('/')
    setLoading(false)
  }


  return (
    <View style={styles.container}>

      <Text style={{ color: '#cbeef3', fontSize: 16}}> Login </Text>

      <View style={[styles.input, styles.mt25]}>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          disabled={!notSession}
        />
      </View>

      <View style={styles.input}>
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          disabled={!notSession}
        />
      </View>


      <View style={[styles.button, styles.mt25, 
        {backgroundColor: '#550577', borderColor: '#E113C5', borderWidth: 2} ]}>

        <Pressable disabled={loading || !notSession} onPress={() => signInWithEmail()}>
            <Text style={{color: '#E113C5', borderColor: '#E113C5'}}>Login</Text>
        </Pressable>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  input: {
    width: '95%',
    margin: 3,
    marginTop: 15,
    backgroundColor: '#f0f0f0',
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 20,
    //height: '15%',
  },
  mt25: {
    marginTop: 25,
  },
  button: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#0D6B93',
    marginTop: 10,
    alignSelf: 'center',
  },
})