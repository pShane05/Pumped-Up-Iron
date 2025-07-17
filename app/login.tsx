import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Login } from '../components/Auth'
import { ImageBackground, Pressable, StyleSheet, View, Text, Alert, SafeAreaView } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link } from "expo-router"
import { COLORS, styles } from "./costants"

export default function LoginScreen() {
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
        <SafeAreaView style={[ styles.container, { rowGap: 20, justifyContent: 'center'} ]}>
            <View style={ [styles.boxView, { marginTop: 75, height: 350 }] }>
                <Login />
            </View>

            <Text style={{ alignSelf: 'center', color: COLORS.TEAL, marginTop: 20 }}> Don't have an account? </Text>
            
            <Link href={"/signup"} style={[styles.altButton, {marginTop: 0 }]}> Create Account </Link>

        </SafeAreaView>
    );
}

