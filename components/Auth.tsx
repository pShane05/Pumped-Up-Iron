import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, TextInput } from 'react-native'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { navigate } from 'expo-router/build/global-state/routing'
import { useRouter } from 'expo-router'
import { COLORS, styles } from '../app/costants'



export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  var notSession = !session;
  const router = useRouter()

  async function signInWithEmail(newUser: boolean) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) 
      Alert.alert(error.message)
    else if (!newUser)
      router.push('/')
    else {
      router.push('/makeProfile')
    }
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


    if (error) {
      Alert.alert(error.message)
      setLoading(false)
      return
    }
    else
    {
      Alert.alert('New Account Created!')
      signInWithEmail(true);

      setLoading(false)
      return
    }
    

    
  }


  return (
    <View style={styles.authContainer}>

      <Text style={ styles.headerText }> Create Account</Text>
      <View style={ styles.horizontalLine } />

      <View style={[styles.input, styles.mt25]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          //disabled={!notSession}
          //inputStyle={{ color: COLORS.BORDER }}
        />
      </View>

      <View style={styles.input}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          //disabled={!notSession}
          //inputStyle={{ color: COLORS.BORDER }}
        />
      </View>

      <View style={styles.input}>
        <TextInput
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
          autoCapitalize={'none'}
          //disabled={!notSession}
          //inputStyle={{ color: COLORS.BORDER }}
        />
      </View>

      <Pressable style={{ marginVertical: 20, position: 'absolute', bottom: 0}} disabled={loading || !notSession} onPress={() => signUpWithEmail()}>
        <Text style={[ styles.button, { fontFamily: 'Electrolize-Regular' }]}>Create Account</Text>
      </Pressable>

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
    <View style={styles.authContainer}>

      <Text style={ styles.headerText }> Login </Text>
      <View style={ styles.horizontalLine } />

      <View style={[styles.input, styles.mt25, { marginHorizontal: 20}]}>
        <TextInput
          style={ styles.subText }
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          //disabled={!notSession}
          //inputStyle={{ color: COLORS.BORDER }}
        />
      </View>

      <View style={styles.input}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
          //disabled={!notSession}
          //inputStyle={{ color: COLORS.BORDER }}
        />
      </View>


      <Pressable style={{ marginVertical: 20, position: 'absolute', bottom: 0}} disabled={loading || !notSession} onPress={() => signInWithEmail()}>
            <Text style={[ styles.button, { fontFamily: 'Electrolize-Regular'} ]}>Login</Text>
      </Pressable>

    </View>
  )
}
