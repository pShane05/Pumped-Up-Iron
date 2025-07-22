import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import { COLORS, styles } from '../app/costants'

  export default function DailyQuestCard() {
  const [loading, setLoading] = useState(false)

  return (
    
    <View style={[ styles.boxView, {alignItems: 'center', paddingVertical: 15} ]} >
      
      <Text style={{ 
        color: COLORS.TEAL, alignSelf: 'center', fontSize: 20,}}> 
          Daily Quests 
      </Text>
      
      <View style={ styles.horizontalLine }/>

      <DailyQuest/>
      <DailyQuest/>
      <DailyQuest/>

      <Text style={{ color: 'red', marginTop: 20 }}> * Required </Text>
    </View>
  )
}

export function DailyQuest() {
  return (
    <View style={ styles.singleQuest }>
      <Text style={{ color: COLORS.TEAL}}> Do 50 Pushups </Text>
    </View>
  )
}

