import { Link, router } from "expo-router";
import { COLORS, FONTS, styles } from "./costants";
import {  View, Text, Pressable, Dimensions, FlatList, ActivityIndicator, Image, Modal, TouchableOpacity, SafeAreaView } from 'react-native'
import { useExercisesByGroup, useExercisesByTarget } from "../hooks/useExercises";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from "react";
import { usePlanByProfile, usePlanDayByProfile } from "../hooks/usePlan"
import { useProfile } from "../hooks/useProfile"
import { Session } from '@supabase/supabase-js'
import { supabase } from "../lib/supabase";
import { updateProfile } from "../lib/profile";
import { Exercise } from "../lib/exercise";
import ExerciseModal from "../components/ExerciseSelect";
import { logWorkout } from "../lib/workout";
import { CompletedExercises } from "../components/WorkoutComponents";
import { Set } from "../lib/sets";

type Target = {
  id: string,
  name: string
}


export default function WorkoutScreen() {

  const [showInfo, setShowInfo] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [workoutIsActive, setWorkoutIsActive] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [target, setTarget] = useState<string | undefined>()
  const [completedSets, setCompletedSets] = useState<Set[] | null>(null)
  const isComplete = completedSets && completedSets?.length > 0

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

  const profile = useProfile(session?.user.id).profile    
  const plan = usePlanByProfile(profile).plan
  const day = usePlanDayByProfile(profile).day

  console.log(modalIsOpen)
  


  async function handleCompleteButtonClick() {

    if (!plan || !profile || !day) return

    const nextDay = (profile?.plan_day % plan?.days) + 1;
          
    await logWorkout({
      session, 
      setLoading,
      updates: {
        duration: 3600,
        notes: 'No Notes Yet'
      }
    })

    await updateProfile({
      session,
      setLoading,
      updates: {
        plan_day: nextDay
      }
    })

    router.replace('/')
  }

  
  async function handleExerciseSelect(exercise: Exercise) {
    setSelectedExercise(exercise)
    console.log("Selected Exercise: ", selectedExercise)
  }


  if (!workoutIsActive) {  

    return (
    
      <SafeAreaView style={ styles.container }>
              
        <BackButton />

        <Text style={[ styles.headerText, { fontSize: 40, alignSelf: 'center', marginTop: 60}]}> {day?.name} </Text>

        <View style={[ styles.horizontalLine, { marginTop: 40}]} />

        <Text style={[ styles.exerciseNameText, { color: COLORS.CYAN, marginTop: 10, fontFamily: FONTS.BODY }]}>
          Rewards:
        </Text>
        <Text style={[ styles.exerciseNameText, { color: COLORS.CYAN, marginVertical: 10, fontFamily: FONTS.BODY }]}>
          [insert rewards]
        </Text>

        <Pressable 
          style={[ styles.button, { marginTop: 15}]}
          onPress={() => { setWorkoutIsActive(true) }}
        >
          <Text style={{ fontSize: 20, fontFamily: FONTS.BODY}}>
            Start Workout
          </Text>
        </Pressable>


        <View style={[ styles.horizontalLine, { width: '70%', marginTop: 30 }]}/>

        <ExerciseCards setTarget={setTarget} session={ session } OpenModal={ setModalIsOpen } sets={null}/>


        <ExerciseModal 
          target={target}
          showModal= {modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          onSelectExercise={handleExerciseSelect}/>

      </SafeAreaView>
    )
  }

  else { 

    return (

      <SafeAreaView style={ styles.container }>
              
        <BackButton />

        <Text style={[ styles.headerText, { fontSize: 40, alignSelf: 'center', marginTop: 60}]}> {day?.name} </Text>

        <View style={[ styles.horizontalLine, { marginTop: 40}]} />

        <Text style={[ styles.exerciseNameText, { color: COLORS.CYAN, marginTop: 10, fontFamily: FONTS.BODY }]}>
          Rewards:
        </Text>
        <Text style={[ styles.exerciseNameText, { color: COLORS.CYAN, marginVertical: 10, fontFamily: FONTS.BODY }]}>
          [insert rewards]
        </Text>


        <View style={[ styles.horizontalLine, { width: '70%', marginTop: 30 }]}/>

        <ExerciseCards setTarget={setTarget} session={ session } OpenModal={ setModalIsOpen } sets={ completedSets }/>

        <Pressable 
          style={[ isComplete ? styles.buttonBig : styles.buttonBigDisabled, {position: 'absolute', bottom: 50,} ]}
          disabled={!isComplete}
          onPress={ handleCompleteButtonClick }
        >
          
          <Text style={{ fontFamily: 'Electrolize-Regular'}}>
            Complete
          </Text>

        </Pressable>
 
        <ExerciseModal 
          target={target}
          showModal= {modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          onSelectExercise={ handleExerciseSelect }/>

      </SafeAreaView>

    )
  }
}


function ExerciseCards(props: { setTarget: (id: any) => void, session: Session | null, OpenModal: (item: any) => void, sets: Set[] | null }) {

  const { day, error, loading } = (usePlanDayByProfile(useProfile(props.session?.user.id).profile))
  const targets = day?.target_muscles
  const [completed, setCompleted] = useState<Exercise[] | null>(null)
  
  if (loading) return <ActivityIndicator size="large" color={COLORS.PINK}  />
  
  else {  

    return (

      <FlatList
        style={{ width: '100%'}}
        data={targets}
        renderItem={({ item }) => (
          <CardGroup setTarget={props.setTarget} target={ item } OpenModal={ props.OpenModal} sets={ props.sets }/>
        )}
      />

  )}
}


function CardGroup(props: { setTarget: (id: any) => void, target: {id: number, name: string}, OpenModal: (item: any) => void, sets: Set[] | null }) {

    if (!props.target) return

    const [isDone, setIsDone] = useState(false)

    return (

      <View>

        <Text 
          style={{ 
            alignSelf: 'center', 
            marginTop: 20, marginBottom: 10,
            fontSize: 24,
            fontWeight: '500',
            color: COLORS.BORDER,
            fontFamily: FONTS.BODY }}
        >
          {
            props.target.name.charAt(0).toUpperCase() + props.target.name.slice(1) // capitalize the target string
          }

        </Text>

        <CompletedExercises exercisesDone={ props.sets }/>

        <SelectExerciseCard setTarget={props.setTarget} target={props.target} OpenModal={ props.OpenModal }/>
          
      </View>
    )
}


function BackButton() {
  return (
    <Link href='/(tabs)' style={[ styles.logout, { position: 'absolute', top: 20, left: 0, fontFamily: FONTS.BODY} ]}> Back </Link>
  )
}


function SelectExerciseCard(props: { setTarget: (id: any) => void, target: {id: number, name: string}, OpenModal: (item: any) => void }) {

  const [selected, setSelected] = useState<Exercise | null>(null)

  if (selected) {
  return (

    <View style={ styles.cardView }>
      
    </View>

  )}

  return (
    <Pressable 
        style={[ styles.cardView, { backgroundColor: COLORS.TRANSPURPLE, paddingVertical: 10, height: 100} ]}
        onPress={() => {
          props.setTarget(props.target.name)
          props.OpenModal(true)
        }}
    >

                
      <View style={{ 
        alignItems: 'center',  width: '100%', height: '100%', marginBottom: 10, justifyContent: 'space-around'
      }}>

        <Text style={[ styles.exerciseNameText, { width: '80%', fontFamily: FONTS.BODY, color: COLORS.PINK} ]}> { "Choose " + props.target.name.charAt(0).toUpperCase() + props.target.name.slice(1) + " Exercise"} </Text>
               
      </View>  

            
    </Pressable>
  )
}