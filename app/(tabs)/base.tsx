import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Pressable, StyleSheet, View, Text, Alert } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { GoldCounter } from '../../components/UI'
import { COLORS } from '../costants'


export default function BaseScreen() {
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

      <Text style= {{ alignSelf: 'center', fontSize: 32, color: '#cbeef3'}}> Base </Text>

      <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />

      <View style={styles.editBar}>

        <View style={ styles.editIcons }> 
            <Text style={{ alignSelf: 'center', color: '#cbeef3' }}> [Will open edit base menu] </Text>
        </View>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    alignContent: 'center',
    paddingTop: '20%',
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
  },
  editBar: {
    backgroundColor: '#606060',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 30,
  },
  editIcons: {
    //flexDirection: 'row',
    width: '100%',
  },
  horizontalLine: {
      width: '60%',
      height: 1,
      backgroundColor: COLORS.TEAL, 
      alignSelf: 'center',
    },
});
