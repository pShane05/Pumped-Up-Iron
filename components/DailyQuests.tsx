import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'expo-router'
import { COLORS } from '../app/costants'

  export default function DailyQuestCard() {
  const [loading, setLoading] = useState(false)

  return (
    
    <View style={ styles.boxView } >
      
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

const styles = StyleSheet.create({
  boxView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND_BLUE,
    borderRadius: 25,
    borderColor: COLORS.TEAL,
    borderWidth: 3,
    padding: 2,
    marginHorizontal: 30,
    paddingTop: 25,
    paddingBottom: 20,
  },
  horizontalLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.TEAL, 
    marginTop: 10, 
    marginBottom: 25,
    alignSelf: 'center',
  },
  singleQuest: {
    width: '80%',
    backgroundColor: '#20204b',
    padding: 10,
    borderRadius: 25,
    marginVertical: 5
  }
});
