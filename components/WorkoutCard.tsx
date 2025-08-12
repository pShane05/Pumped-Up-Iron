import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { Link } from 'expo-router'
import { COLORS, styles } from '../app/costants'
import { useExercisesByGroup } from '../hooks/useExercises'
import { usePlanDayByProfile } from '../hooks/usePlan'
import { useProfile } from '../hooks/useProfile'
import { Session } from '@supabase/supabase-js'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { PlanDay } from '../lib/planDay'


  export default function WorkoutCard(props: {session: Session | null}) {

  const profile = useProfile(props.session?.user.id).profile 
  const day = usePlanDayByProfile(profile).day

  return (
    
    <View style={ styles.boxView } >
      
      <Text style={{ 
        color: COLORS.TEAL, alignSelf: 'center', fontSize: 20,}}> 
          {day?.name + " Training"}
      </Text>
      
      <View style={ styles.horizontalLine }/>

      <Pressable style={ styles.altButton }>
        <Text style={{ color: COLORS.TEAL }}> Edit Workout </Text>
      </Pressable>

      <Link href="/workout" style={[ styles.button, {backgroundColor: COLORS.TEAL, borderColor: COLORS.CYAN, marginBottom: 25} ]}>
        View Workout 
      </Link>

      <ExercisePreview day={day}/>

    </View>
  )
}

export function ExercisePreview(props: {day: PlanDay | null}) {

  const targets = props.day?.target_muscles

  if (!targets) return

  return (
    <View style={{ width: '100%', alignItems: 'center', padding: 15}}>
      {targets.slice(0, 5).map((item, index) => (        

        <View key={`${item.id}-${index}`} style={ styles.ExercisePreview }>

          <Text style={{ color: COLORS.TEAL, flexShrink: 1}}>{ item.name}</Text>

          <Text
            style={{ fontSize: 12, fontWeight: 'bold', width: '40%', alignSelf: 'center', color: COLORS.TEAL, left: 15}} > 
              [3 x 6-8]
          </Text>

        </View>
      
      ))}
    </View>
  )
}

