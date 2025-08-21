import { Link, router } from "expo-router";
import { COLORS, FONTS, imageMap, styles } from "./costants";
import {  View, Text, Pressable, Dimensions, FlatList, ActivityIndicator, Image, Modal, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import { useExercisesByGroup, useExercisesByTarget } from "../hooks/useExercises";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePlanByProfile, usePlanDayByProfile } from "../hooks/usePlan"
import { useProfile } from "../hooks/useProfile"
import { Session } from '@supabase/supabase-js'
import { supabase } from "../lib/supabase";
import { Profile, updateProfile } from "../lib/profile";
import { Exercise } from "../lib/exercise";
import ExerciseModal from "../components/ExerciseSelect";
import { logWorkout } from "../lib/workout";
import { BackButton, CompletedExercises, ExerciseDone, SelectedExerciseCard } from "../components/WorkoutComponents";
import { Set, Weight } from "../lib/sets";
import LoadingScreen from "../components/LoadingScreen";
import { PlanDay } from "../lib/planDay";

type Target = {
  id: number,
  name: string
}

type SelectionsByTarget = {
  [targetName: string]: Exercise[]
}

type CompleteSetsByExercise = {
  [exerciseName: string]: Set[]
}

export default function WorkoutScreen() {

  const [targets, setTargets] = useState<Target[] | null>(null)
  const [selectedExercises, setSelectedExercises] = useState<Exercise[] | null>(null)
  const [selectedExercisesByTarget, setSelectedExercisesByTarget] = useState<SelectionsByTarget>({})
  const [completedSetsByExercise, setCompletedSetsByExercise] = useState<CompleteSetsByExercise>({})
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [workoutIsActive, setWorkoutIsActive] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [target, setTarget] = useState<string | undefined>()
  const [completedSets, setCompletedSets] = useState<Set[]>([])
  const [profile, setProfile] = useState<Profile>()
  const [plan, setPlan] = useState<
    {
        id: number
        name: string
        description: string
        days: number
    } | null
  >()
  const [day, setDay] = useState<PlanDay | null>()

  const { profile: profileData } = useProfile(session?.user?.id)
  const { plan: planData } = usePlanByProfile(profile)
  const { day: dayData, loading: dayLoading } = usePlanDayByProfile(profile)

  const isComplete = completedSets && completedSets?.length > 0

  const allTargetsHaveSelection = 
  targets ? targets.every(
    target => selectedExercisesByTarget[target.name] && selectedExercisesByTarget[target.name].length > 0
  ) : false

  const exercisesAllComplete = completedSets ? completedSets.every(
    set => {}
  ) : false

  // Get User Session Data //

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


  // ROute to login if needed
  useEffect(() => {
    if (!loading && !session) {
      router.replace('../login')
    }
  }, [session])

  // Update profile when session changes
  useEffect(() => {
    if (session && profileData) {
      setProfile(profileData)
    }
  }, [session, profileData])

  // Update plan when profile changes
  useEffect(() => {
    if (profile && planData) {
      setPlan(planData)
    }
  }, [profile, planData])

  // Update day when profile changes
  useEffect(() => {
    if (profile && dayData) {
      setDay(dayData)
    }
  }, [profile, dayData])

  // Update targets when day changes
  useEffect(() => {
    if (day?.target_muscles) {
      setTargets(day.target_muscles)
    }
  }, [day])

  if (loading || dayLoading) return <LoadingScreen />


  // Workout COmplete Button
  async function handleCompleteButtonClick( sets: Set[] ) {

    if (!plan || !profile || !day || !completedSets) return

    const nextDay = (profile?.plan_day % plan?.days) + 1;
          
    await logWorkout({
      session, 
      setLoading,
      updates: {
        duration_seconds: 3600,
        notes: 'No Notes Yet'
      },
      sets: completedSets
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

    if (!target) return

    setSelectedExercisesByTarget(prev => {
      const currentExercises = prev[target] || []

      const exerciseExists = currentExercises.some(ex => ex.id === exercise.id)

      if (exerciseExists) {
        return {
          ...prev,
          [target]: currentExercises.filter(ex => ex.id !== exercise.id)
        }
      } else {
        return {
          ...prev,
          [target]: [...currentExercises, exercise]
        }
      }

    })

    setSelectedExercises(prev => {
      const currentExercises = prev || []

      const exerciseExists = currentExercises.some(ex => ex.id === exercise.id)

      if(!currentExercises) {
        return [exercise]
      }
      else if (exerciseExists) {
        return currentExercises.filter(ex => ex.id !== exercise.id)
        
      } else {
        return [...currentExercises, exercise]
        
      }
    })

  }


  function removeExerciseFromTarget(targetName: string, exerciseId: string) {
    setSelectedExercisesByTarget(prev => ({
      ...prev,
      [targetName]: (prev[targetName] || []).filter(ex => ex.id !== exerciseId)
    }))
  }

  const conditionalRenderExerciseCard = ({ item }: {item: Exercise}) => {

    const isCompleted = completedSets?.some(completedExercise => 
      completedExercise.exercise_name === item.name)

    return isCompleted ?
      <ExerciseDone exercise={item}/>
    :  
      <ActiveExerciseCard exercise={item} setCompletedSets={setCompletedSets}/>
  }
    
  // Exercise selection screen
  if (!workoutIsActive) {  

    if (!day) return

    return (
    
      <SafeAreaView style={ styles.container }>
              
        <BackButton />

        <Text style={[ styles.headerText, { fontSize: 40, alignSelf: 'center', marginTop: 60}]}> {day?.name} </Text>

        <View style={[ styles.horizontalLine, { marginTop: 40}]} />

        <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginTop: 10, fontFamily: FONTS.BODY }]}>
          Rewards:
        </Text>
        <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginVertical: 10, fontFamily: FONTS.BODY }]}>
          [insert rewards]
        </Text>

        <Pressable 
          style={[ allTargetsHaveSelection ? styles.button : styles.buttonDisabled, { marginTop: 15}]}
          onPress={() => { setWorkoutIsActive(true) }}
          disabled={ !allTargetsHaveSelection }
        >
          <Text style={{ fontSize: 20, fontFamily: FONTS.BODY}}>
            Start Workout
          </Text>
        </Pressable>


        <View style={[ styles.horizontalLine, { width: '70%', marginTop: 30 }]}/>

        <SelectExerciseCards selectedExercises={ selectedExercisesByTarget } targets={ targets } setTarget={ setTarget } session={ session } OpenModal={ setModalIsOpen } sets={null}/>


        <ExerciseModal 
          target={target}
          showModal= {modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          onSelectExercise={handleExerciseSelect}
          completedSets={ completedSets }
          setCompletedSets={ setCompletedSets }
          
          />

      </SafeAreaView>
    )
  }


  // Active workout screen
  else { 

    return (

      <SafeAreaView style={ styles.container }>
              
        <BackButton />

        <Text style={[ styles.headerText, { fontSize: 40, alignSelf: 'center', marginTop: 60}]}> {day?.name} </Text>

        <View style={[ styles.horizontalLine, { marginTop: 40}]} />

        <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginTop: 10, fontFamily: FONTS.BODY }]}>
          Rewards:
        </Text>
        <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginVertical: 10, fontFamily: FONTS.BODY }]}>
          { selectedExercises?.length + ' | ' + completedSets?.length}
        </Text>


        <View style={[ styles.horizontalLine, { width: '70%', marginTop: 30 }]}/>

        <FlatList 
          style={{width: '100%', marginBottom: 75}}
          data={ targets }
          renderItem={ ({ item }) => (

            <FlatList
              style={{width: '100%'}}
              data={ selectedExercisesByTarget[item.name] }
              renderItem={ conditionalRenderExerciseCard }
              keyExtractor={ (item) => item.name }
            />

          )}
        />

        <Pressable 
          style={[ isComplete ? styles.buttonBig : styles.buttonBigDisabled, {position: 'absolute', bottom: 50,} ]}
          disabled={!isComplete}
          onPress={ async () => { await handleCompleteButtonClick(completedSets) }}
        >
          
          <Text style={{ fontFamily: 'Electrolize-Regular'}}>
            Complete
          </Text>

        </Pressable>
 
        <ExerciseModal 
          target={target}
          showModal= {modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          onSelectExercise={ handleExerciseSelect }
          completedSets={ completedSets }
          setCompletedSets={ setCompletedSets }/>

      </SafeAreaView>

    )
  }
}


function SelectExerciseCards(props: { selectedExercises: {[targetName: string]: Exercise[]}, targets: Target[] | null, setTarget: (id: any) => void, session: Session | null, OpenModal: (item: any) => void, sets: Set[] | null }) {

  return (

    <FlatList
      style={{ width: '100%'}}
      data={props.targets}
      renderItem={({ item }) => (
        <CardGroup selectedExercises={ props.selectedExercises } setTarget={props.setTarget} target={ item } OpenModal={ props.OpenModal} sets={ props.sets }/>
      )}
    />
)}



function CardGroup(props: { selectedExercises: {[targetName: string]: Exercise[]}, setTarget: (id: any) => void, target: {id: number, name: string}, OpenModal: (item: any) => void, sets: Set[] | null }) {

    if (!props.target) return

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


        { props.selectedExercises[props.target.name] && (
          <FlatList 
            style={{ width: '100%'}}
            data={props.selectedExercises[props.target.name]}
            renderItem={({ item }) => (
              <SelectedExerciseCard exercise={item}/>
            )}
          />
        )}

        <SelectExerciseCard setTarget={props.setTarget} target={props.target} OpenModal={ props.OpenModal }/>
          
      </View>
    )
}


function SelectExerciseCard(props: { setTarget: (id: any) => void, target: {id: number, name: string}, OpenModal: (item: any) => void }) {

  return (
    <Pressable 
        style={[ styles.cardView, { backgroundColor: COLORS.TRANSPURPLE, paddingVertical: 10, height: 80} ]}
        onPress={() => {
          props.setTarget(props.target.name)
          props.OpenModal(true)
        }}
    >

                
      <View style={{ 
        alignItems: 'center',  width: '100%', height: '100%', marginBottom: 10, justifyContent: 'space-around'
      }}>

        <Text style={[ styles.exerciseNameText, { textAlign: 'center', width: '80%', fontFamily: FONTS.BODY, color: COLORS.PINK} ]}> { "Add " + props.target.name.charAt(0).toUpperCase() + props.target.name.slice(1) + " Exercise"} </Text>
               
      </View>  

            
    </Pressable>
  )
}

function UpcomingExerciseCard(props: { exercise: Exercise}) {

  const exercise = props.exercise

  return (
    <View 
    style={[
      styles.cardView,  {
      height: 120,
      flexDirection: 'row',
      padding: 10,
      
    }]}>

      <View style={{ alignSelf: 'center' }}>
        <FontAwesome5 name="dumbbell" size={50} color="black" />
      </View>

      <View style={{ width: '60%', paddingLeft: 20, justifyContent: 'space-between'}}>
        <Text style={[ styles.exerciseNameText, { color: COLORS.BORDER }]}>
            { exercise.name }
        </Text>

        <View style={{}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', columnGap: 15}}>
            <Text style={{ fontWeight: 'bold', color: COLORS.PINK, fontFamily: 'Electrolize-Regular'}}>Category:</Text>
              <Text style={{ color: COLORS.BORDER, fontFamily: 'Electrolize-Regular' }}>
                {exercise.muscle_group}
              </Text>
          </View>
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', columnGap: 15}}>
            <Text style={{ fontWeight: 'bold', color: COLORS.PINK, fontFamily: 'Electrolize-Regular' }}>Equipment:</Text>
            <Text style={{ color: COLORS.BORDER, fontFamily: 'Electrolize-Regular' }}>
              {exercise.equipment}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between', columnGap: 15}}>
            <Text style={{ fontWeight: 'bold', color: COLORS.PINK, fontFamily: 'Electrolize-Regular' }}>Difficulty:</Text>
            <Text style={{ color: COLORS.BORDER, fontFamily: 'Electrolize-Regular' }}>
              {exercise.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function ActiveExerciseCard(props: {exercise: Exercise, setCompletedSets: (item: any) => void}) {

  const exercise = props.exercise

  return (
    <View style={[
      styles.cardView, {
        height: 160,
        padding: 10,
        flexDirection: 'column'
      }
    ]}>
      <View 
      style={[{
        height: 80,
        flexDirection: 'row',
      }]}>

        <View style={{ alignSelf: 'center', width: 75, height: 75, }}>
          <Image style={{ resizeMode: 'contain', width: '100%', height: '100%',}} source={ imageMap[props.exercise.icon] }/>
        </View>

        <View style={{ width: '60%', paddingLeft: 20, justifyContent: 'space-between'}}>
          <Text style={[ styles.exerciseNameText, { color: COLORS.BORDER }]}>
              { exercise.name }
          </Text>

          <View style={{}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', columnGap: 15}}>
              <Text style={{ fontWeight: 'bold', color: COLORS.PINK, fontFamily: 'Electrolize-Regular'}}>Category:</Text>
                <Text style={{ color: COLORS.BORDER, fontFamily: 'Electrolize-Regular' }}>
                  {exercise.muscle_group}
                </Text>
            </View>
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', columnGap: 15}}>
              <Text style={{ fontWeight: 'bold', color: COLORS.PINK, fontFamily: 'Electrolize-Regular' }}>Equipment:</Text>
              <Text style={{ color: COLORS.BORDER, fontFamily: 'Electrolize-Regular' }}>
                {exercise.equipment}
              </Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', columnGap: 15}}>
              <Text style={{ fontWeight: 'bold', color: COLORS.PINK, fontFamily: 'Electrolize-Regular' }}>Difficulty:</Text>
              <Text style={{ color: COLORS.BORDER, fontFamily: 'Electrolize-Regular' }}>
                {exercise.difficulty}
              </Text>
            </View>
          </View>

          
        </View>

        
        
      </View>

      <Pressable 
        style={[ styles.altButton, { marginTop: 15} ]}
        onPress={() => handleCheckPress(exercise, props.setCompletedSets)}
        
      >
          <Text style={{ color: COLORS.BORDER, textAlign: 'center'}}>
            Check
          </Text>
      </Pressable>

    </View>
    
  )
}

async function handleCheckPress(exercise: Exercise, setCompletedSets: Dispatch<SetStateAction<Set[]>>) {
  setCompletedSets(prev => {
      const currentSets = prev || []

      const setExists = currentSets.some(set => set.exercise_name === exercise.name)

      const newSet = {
        exercise_name: exercise.name,
        reps: 10,
        weight_lbs: 200,
        set_number: 1
      }

      if(!currentSets) return [newSet]
      
      else if (setExists) return currentSets.filter(set => set.exercise_name !== newSet.exercise_name) 
        
      else return [...currentSets, newSet]
    })
}