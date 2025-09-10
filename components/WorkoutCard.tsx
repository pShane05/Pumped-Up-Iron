import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { Link, router } from 'expo-router'
import { COLORS, FONTS, styles } from '../app/costants'
import { usePlanDayByProfile } from '../hooks/usePlan'
import { useProfile } from '../hooks/useProfile'
import { Session } from '@supabase/supabase-js'
import { PlanDay } from '../lib/planDay'


  export default function WorkoutCard(props: {session: Session | null}) {

  const profile = useProfile(props.session?.user.id).profile 
  const day = usePlanDayByProfile(profile).day

  return (
    
    <View style={ styles.boxView } >
      
      <Text style={[ styles.headerText, { paddingHorizontal: 10, textAlign: 'center' } ]}> 
          {day?.name + " Training"}
      </Text>
      
      <View style={ styles.horizontalLine }/>

      <Pressable style={ styles.altButton }>
        <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY }}> Edit Workout </Text>
      </Pressable>

      <Pressable 
        onPress={() => router.push('../workout')}
        style={[ styles.button, { borderColor: COLORS.CYAN, marginBottom: 25,} ]}
      >
        <Text style={{ fontFamily: FONTS.BODY}}>
          View Workout 
        </Text>
      </Pressable>

      <ExercisePreview day={day}/>

    </View>
  )
}

export function ExercisePreview(props: {day: PlanDay | null}) {

  const targets = props.day?.target_muscles

  if (!targets) return

  return (
    <View style={{ width: '100%', alignItems: 'center', padding: 15}}>
      {targets.slice(0, 5).map((item) => (        

        <TargetPreview target={item} key={item.id} />
      
      ))}
    </View>
  )
}


export function TargetPreview(props: {target: {id: number, name: string}}) {

  if (!props.target) return

  return (
    <View style={ styles.ExercisePreview }>

      <Text style={{ color: COLORS.TEAL, alignSelf: 'center', fontFamily: FONTS.BODY, fontSize: 16 }}>{ props.target?.name.charAt(0).toUpperCase() + props.target?.name.slice(1) }</Text>

    </View>
  )
}
