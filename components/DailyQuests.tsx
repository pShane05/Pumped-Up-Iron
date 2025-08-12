import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import { COLORS, FONTS, styles } from '../app/costants'

  export default function DailyQuestCard() {
  const [loading, setLoading] = useState(false)

  return (
    
    <View style={[ styles.boxView, {alignItems: 'center', paddingVertical: 15} ]} >
      
      <Text style={ styles.headerText }> 
          Daily Quests 
      </Text>
      
      <View style={ styles.horizontalLine }/>

      <DailyQuest/>
      <DailyQuest/>
      <DailyQuest/>

      <Text style={{ color: 'red', marginTop: 20, fontFamily: FONTS.BODY }}> * Required </Text>
    </View>
  )
}

export function DailyQuest() {
  return (
    <View style={ styles.singleQuest }>
      <Text style={{ color: COLORS.TEAL, fontFamily: FONTS.BODY}}> Do 50 Pushups </Text>
    </View>
  )
}

