import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Login } from '../components/Auth'
import { ImageBackground, Pressable, StyleSheet, View, Text, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link } from "expo-router"
import { COLORS, styles } from "./costants"
import { useProfileData } from '../hooks/useProfile'

export default function LoginScreen() {
      
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={[ styles.container, { rowGap: 20, justifyContent: 'center'} ]}>
          <View style={ [styles.boxView, { marginTop: 75, height: 350 }] }>
            <Login />
          </View>

          <Text style={{ alignSelf: 'center', color: COLORS.TEAL, marginTop: 20, fontFamily: 'Electrolize-Regular' }}> Don't have an account? </Text>
            
          <Link href={"/signup"} style={[styles.altButton, {marginTop: 0, fontFamily: 'Electrolize-Regular' }]}> Create Account </Link>

      </SafeAreaView>
      </TouchableWithoutFeedback>
    );
}

