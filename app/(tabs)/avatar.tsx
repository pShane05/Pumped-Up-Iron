import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { GoldCounter } from '../../components/UI'
import { COLORS } from '../costants'


export default function AvatarScreen() {
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

      <GoldCounter /> 
      
      <Text style= {{ alignSelf: 'center', fontSize: 32, color: '#cbeef3'}}> Avatar </Text>
      <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />

      <Pressable style={[ styles.button, { marginTop: 30 } ]}>
        <Text style={{ color: COLORS.BLACK, fontSize: 20 }}> Wardrobe </Text>
      </Pressable>

       <View style={[ styles.horizontalLine, { width: '60%', marginTop: 40 } ]} />

       <View style={ styles.XpDisplay }>

        <Text style={{ color: COLORS.CYAN, fontSize: 20, alignSelf: 'center', marginTop: 20}}>
          Lvl. [level]
        </Text>

        <View style={ styles.XpBar } />

       </View>

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
    XpDisplay: {
      height: '20%',
      width: '100%',
      backgroundColor: COLORS.BACKGROUND_BLUE,
      position: 'absolute',
      bottom: 0,

    },
    XpBar: {
      width: '80%',
      height: '20%',
      backgroundColor: COLORS.BLACK,
      borderRadius: '20%',
      borderWidth: 2,
      borderColor: COLORS.CYAN,
      alignSelf: 'center',
      marginTop: 10
    }
});
