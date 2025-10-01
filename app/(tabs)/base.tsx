import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Pressable, StyleSheet, View, Text, Alert, ActivityIndicator, SafeAreaView } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { GoldCounter } from '../../components/UI'
import { COLORS, FONTS, styles } from '../costants'
import { useProfile } from '../../hooks/useProfile'
import LoadingScreen from '../../components/LoadingScreen'


export default function BaseScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const profile = useProfile(session?.user.id).profile
  const gold = profile?.gold_count
  const isDataReady = session && profile && gold !== undefined


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


  if (loading || !isDataReady) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <SafeAreaView style={ styles.container}>

      <GoldCounter goldCount={ gold }/> 

      <Text style= {{ marginTop: 20, alignSelf: 'center', fontSize: 40, color: '#cbeef3', fontFamily: FONTS.HEADER}}> Base </Text>

      <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />

      <View style={{ justifyContent: 'center', flex: 1 }}>

        <Text style={[ styles.headerText, { fontSize: 32, textAlign: 'center', alignSelf: 'center', color: COLORS.PINK } ]}>
          Base Editer Coming Soon...
        </Text>

      </View>

      

    </SafeAreaView>
  )
}
