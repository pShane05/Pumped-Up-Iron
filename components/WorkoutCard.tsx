import React, { useEffect, useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { Link, router } from 'expo-router'
import { COLORS, FONTS, styles } from '../app/costants'
import { usePlanDayByProfile } from '../hooks/usePlan'
import { useProfile } from '../hooks/useProfile'
import { Session } from '@supabase/supabase-js'
import { PlanDay } from '../lib/planDay'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SelectionsByTarget } from '../app/workout'
import { Exercise } from '../lib/exercise'


export default function WorkoutCard(props: {session: Session | null}) {

  const profile = useProfile(props.session?.user.id).profile 
  const day = usePlanDayByProfile(profile).day
  const [workoutIsActive, setWorkoutIsActive] = useState(false)
  const [selectedExercisesByTarget, setSelectedExercisesByTarget] = useState<SelectionsByTarget>({})

  // load workout state
  const loadActiveState = async () => {
    try {
      const isActive = await AsyncStorage.getItem("workout-is-active")
  
      if (isActive !== null) {
        if (isActive === "true")
          setWorkoutIsActive(true)
        else
          setWorkoutIsActive(false)
      }
    } catch (e) {
      alert(e)
    }
  }

  const loadExerciseState = async () => {
    try {

      const exercisesByTarget = await AsyncStorage.getItem("selected-exercises-by-target")

      if (exercisesByTarget !== null) setSelectedExercisesByTarget(JSON.parse(exercisesByTarget))

    } catch (e) {
      alert(e)
    }
  }
  
  useEffect(() => {
    loadActiveState()
    loadExerciseState()
  }, [])

  return (
    
    <View style={ styles.boxView } >
      
      <Text style={[ styles.headerText, { paddingHorizontal: 10, textAlign: 'center' } ]}> 
          {day?.name + " Training"}
      </Text>
      
      <View style={ styles.horizontalLine }/>

      <Pressable 
        onPress={() => router.push('../workout')}
        style={[ styles.button, { borderColor: COLORS.CYAN, marginVertical: 20,} ]}
      >
        <Text style={{ fontFamily: FONTS.BODY}}>
          {workoutIsActive ? 'Continue' : 'View'} Workout 
        </Text>
      </Pressable>

      {workoutIsActive ? <ActiveWorkoutPreview day={day} selectedExercises={selectedExercisesByTarget}/> : <WorkoutPreview day={day}/>}

    </View>
  )
}

export function WorkoutPreview(props: {day: PlanDay | null}) {

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


export function ActiveWorkoutPreview(props: {day: PlanDay | null, selectedExercises: SelectionsByTarget}) {

  const targets = props.day?.target_muscles

  if (!targets) return


  return (
    <View style={{ width: '100%', alignItems: 'center', padding: 15}}>
      {targets.slice(0, 5).map((currTarget) => (        
        
        <FlatList 
          style={{ width: '100%'}}
          scrollEnabled={false}
          data={props.selectedExercises[currTarget.name]} 
          renderItem={ ({ item}) => (
            <ExercisePreview exercise={item}/>
          )}     
        />
      
      ))}
    </View>
  )
}

export function ExercisePreview(props: {exercise: Exercise}) {

  if (!props.exercise) return

  

  return (
    <View style={[ styles.ExercisePreview, { alignSelf: 'center'} ]}>

      <Text style={{ color: COLORS.TEAL, alignSelf: 'center', fontFamily: FONTS.BODY, fontSize: 16 }}>{ props.exercise?.name.charAt(0).toUpperCase() + props.exercise?.name.slice(1) }</Text>

    </View>
  )
}