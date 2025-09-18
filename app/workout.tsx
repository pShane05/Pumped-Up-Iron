import { Link, router } from "expo-router";
import { COLORS, FONTS, imageMap, styles } from "./costants";
import {  View, Text, Pressable, FlatList, Image, SafeAreaView } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { usePlanByProfile, usePlanDayByProfile } from "../hooks/usePlan"
import { useProfile } from "../hooks/useProfile"
import { Session } from '@supabase/supabase-js'
import { supabase } from "../lib/supabase";
import { Profile, updateProfile } from "../lib/profile";
import { Exercise } from "../lib/exercise";
import ExerciseModal from "../components/ExerciseSelect";
import { logWorkout } from "../lib/workout";
import { BackButton, ConfirmCancelModal, SelectedExerciseCard } from "../components/WorkoutComponents";
import { Set, } from "../lib/sets";
import LoadingScreen from "../components/LoadingScreen";
import { PlanDay } from "../lib/planDay";
import SetLogModal from "../components/SetLog";
import VictoryScreen from "../components/VictoryScreen";
import { giveUserXp } from "../lib/levels";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Target = {
  id: number,
  name: string
}

export type SelectionsByTarget = {
  [targetName: string]: Exercise[]
}

type CompleteSetsByExercise = {
  [exerciseName: string]: Set[]
}

export default function WorkoutScreen() {

  const [target, setTarget] = useState<string | undefined>()
  const [completedSets, setCompletedSets] = useState<Set[]>([])
  const [targets, setTargets] = useState<Target[] | null>(null)

  const [exerciseToLog, setExerciseToLog] = useState<Exercise | null>(null)
  const [selectedExercisesByTarget, setSelectedExercisesByTarget] = useState<SelectionsByTarget>({})
  const [completedSetsByExercise, setCompletedSetsByExercise] = useState<CompleteSetsByExercise>({})
  const minSets = 3

  const [workoutIsActive, setWorkoutIsActive] = useState(false)
  const [selectModalIsOpen, setSelectModalIsOpen] = useState(false)
  const [logModalIsOpen, setLogModalIsOpen] = useState(false)
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false)
  const [showVictory, setShowVictory] = useState(false)

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
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

  const rewards = {
    xp: profile?.level && targets ? profile.level * targets.length : -1,
    gold: profile?.level ? Math.floor(profile.level * 0.25) + 4 : -1
  }

  const allTargetsHaveSelection = 
  targets ? targets.every(
    target => selectedExercisesByTarget[target.name] && selectedExercisesByTarget[target.name].length > 0
  ) : false

  const exercisesAllComplete = selectedExercisesByTarget && targets ? targets.every(
    target => {
      selectedExercisesByTarget[target.name] ? selectedExercisesByTarget[target.name].every(
        exercise => {
          return completedSetsByExercise[exercise.name] ? completedSetsByExercise[exercise.name].length >= minSets : false
        }
        
      ) :
      false
    }
  ) : false


  // Async storage functions

  const saveActiveState = async (isActive: string) => {
    try {
      await AsyncStorage.setItem("workout-is-active", isActive)
    } catch (e) {
      alert(e)
    }
  }

  const saveExerciseState = async ( exercisesByTarget: SelectionsByTarget) => {
    try {
    
      let jsonValue = JSON.stringify(exercisesByTarget)
      await AsyncStorage.setItem("selected-exercises-by-target", jsonValue)

    } catch (e) {
      alert(e)
    }
  }

  const saveSetState = async ( setsByExercise: CompleteSetsByExercise) => {
    try {

      let jsonValue = JSON.stringify(setsByExercise)
      await AsyncStorage.setItem("completed-sets-by-exercise", jsonValue)

    } catch (e) {
      alert(e)
    }
  }


  // Load state functions
  
  const loadActiveState = async () => {
    try {
      const isActive = await AsyncStorage.getItem("workout-is-active")

      if (isActive !== null) {
        if (isActive === "true")
        setWorkoutIsActive(true)
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

  const loadSetState = async () => {
    try {

      const setsByExercise = await AsyncStorage.getItem("completed-sets-by-exercise")

      if (setsByExercise !== null) setCompletedSetsByExercise(JSON.parse(setsByExercise))
    } catch (e) {
      alert(e)
    }
  }

  const removeExercises = async () => {

    const keys = ['selected-exercises-by-target', 'completed-sets-by-exercise']
    try {
      await AsyncStorage.multiRemove(keys)
    } catch(e) {
      alert(e)
    }
  }

  // Load screen state

  useEffect(() => {
    loadActiveState()
    loadExerciseState()
    loadSetState()
  }, [])

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

  // Update exercise state
  useEffect(() => {
    if (selectedExercisesByTarget) {
      saveExerciseState(selectedExercisesByTarget)
    }
  }, [selectedExercisesByTarget])

  useEffect(() => {
    if (completedSetsByExercise) {
      saveSetState(completedSetsByExercise)
    }
  }, [completedSetsByExercise])


  if (loading || dayLoading) return <LoadingScreen />


  // Workout COmplete Button
  async function handleCompleteButtonClick( ) {

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
        plan_day: nextDay,
        gold_count: profile.gold_count + rewards.gold
      }
    })

    await giveUserXp(rewards.xp, profile, session, setLoading, setProfile)

    setWorkoutIsActive(false)
    saveActiveState("false")
    removeExercises()
    setShowVictory(true)    
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

  }


  function addSetToExercise(set: Set, exerciseName: string | undefined) {
    
    if (!exerciseName) return

    // add to exercise array
    setCompletedSetsByExercise(prev => {
      const currentSets = prev[exerciseName] || []

      return {
        ...prev,
        [exerciseName]: [...currentSets, set]
      }

    })

    // add to complete array
    setCompletedSets(prev => {
      const currentSets = prev || []

      return [...currentSets, set]

    })

  }
  
    
  // Exercise selection screen
  if (!workoutIsActive) {  

    if (!day) return

    return (
    
      <SafeAreaView style={ styles.container }>
              
        <BackButton />

        <Text style={[ styles.headerText, { fontSize: 40, alignSelf: 'center', marginTop: 60}]}> 
          {day?.name} 
        </Text>

        <View style={[ styles.horizontalLine, { marginTop: 40}]} />

        <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginTop: 10, fontFamily: FONTS.BODY }]}>
          Rewards:
        </Text>
        <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginVertical: 10, fontFamily: FONTS.BODY }]}>
          { rewards.xp ? rewards.xp : "[xp]" } xp
        </Text>

        <Text style={{ textAlign: 'center', color: '#fffe00' }}>
          { rewards.gold ? rewards.gold : "[gold]" } gold
        </Text>

        <Pressable 
          style={[ allTargetsHaveSelection ? styles.button : styles.buttonDisabled, { marginTop: 15}]}
          onPress={() => { 
            setWorkoutIsActive(true)
            saveActiveState("true")
            saveExerciseState(selectedExercisesByTarget)
          }}
          disabled={ !allTargetsHaveSelection }
        >
          <Text style={{ fontSize: 20, fontFamily: FONTS.BODY}}>
            Start Workout
          </Text>
        </Pressable>


        <View style={[ styles.horizontalLine, { width: '70%', marginTop: 30 }]}/>

        <SelectExerciseCards selectedExercises={ selectedExercisesByTarget } targets={ targets } setTarget={ setTarget } session={ session } OpenModal={ setSelectModalIsOpen } sets={null}/>


        <ExerciseModal 
          target={target}
          showModal= {selectModalIsOpen}
          onClose={() => setSelectModalIsOpen(false)}
          selectedExercises={selectedExercisesByTarget}
          setSelectedExercises={ setSelectedExercisesByTarget }
          onSelectExercise={handleExerciseSelect}
          
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
        <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginVertical: 5, fontFamily: FONTS.BODY }]}>
          { rewards.xp ? rewards.xp : "[xp]" } xp
        </Text>

        <Text style={{ textAlign: 'center', color: '#fffe00', fontFamily: 'Electrolize-Regular' }}>
          { rewards.gold ? rewards.gold : "[gold]" } gold
        </Text>


        <View style={[ styles.horizontalLine, { width: '70%', marginTop: 25 }]}/>


        <Pressable 
            style={[ styles.altButton, { backgroundColor: "#800000", position: 'absolute', top: 40, margin: 20, right: 0, padding: 8, paddingHorizontal: 12} ]}
            onPress={ () => {
              setCancelModalIsOpen(true)
            }}
          > 

            <Text style={{ fontFamily: 'Electrolize-Regular', color: COLORS.BORDER, fontSize: 12,  }}> 
              X
            </Text>

          </Pressable>

        <FlatList 
          style={{width: '100%', marginBottom: 75, marginTop: 15}}
          data={ targets }
          renderItem={ ({ item }) => (

            <FlatList
              style={{width: '100%'}}
              data={ selectedExercisesByTarget[item.name] }
              renderItem={ ({ item}) => (
                <ActiveExerciseCard exercise={item} completedSets={completedSetsByExercise} setCompletedSets={setCompletedSetsByExercise} minSets={minSets}
                setShowModal={setLogModalIsOpen} setExercise={setExerciseToLog} />
              )}
            />

          )}
        />

        <Pressable 
          style={[ exercisesAllComplete ? styles.buttonBig : styles.buttonBigDisabled, {position: 'absolute', bottom: 50,} ]}
          disabled={!exercisesAllComplete}
          onPress={ async () => { await handleCompleteButtonClick() }}
        >
          
          <Text style={{ fontFamily: 'Electrolize-Regular'}}>
            Complete
          </Text>

        </Pressable>
 
        <SetLogModal 
          exercise={ exerciseToLog }
          showModal={logModalIsOpen}
          onClose={() => setLogModalIsOpen(false) }
          updateSets={ addSetToExercise }
          setNum={ exerciseToLog ? 

            completedSetsByExercise[exerciseToLog.name] ?

              completedSetsByExercise[exerciseToLog.name].length + 1 : 1

          : 
            1

          }
        />

        <ConfirmCancelModal 
          showModal={cancelModalIsOpen} 
          onClose={() => {
            setCancelModalIsOpen(false)
          }}
          onConfirm={() => {
            saveActiveState("false")
            removeExercises()
            setCancelModalIsOpen(false)
            router.replace('/')
          }}          
        />

        <VictoryScreen
          rewards={ rewards }
          title={ day?.name + " Training" }
          profile={ profile }
          showVictory={ showVictory }
          onClose={ setShowVictory }
        />

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


function ActiveExerciseCard(props: {exercise: Exercise, completedSets: CompleteSetsByExercise, setCompletedSets: (item: any) => void, setShowModal: (item: any) => void, setExercise: (item:any) => void, minSets: number }) {

  const exercise = props.exercise
  const completedSets = props.completedSets[exercise.name]
  if (!exercise) return

  // disable button if there are too many sets
  const buttonDisabled = 
    props.completedSets[exercise.name] && 
    (props.completedSets[exercise.name].length) >= props.minSets + 1
  
  const setsDone = (!completedSets) ? 0 : completedSets.length
  
  function CheckBox(props: {checked: boolean}) {
    return (
      <View
        style={{ 
          height: 12, 
          width: 12, 
          margin: 2,
          marginTop: 10,
          borderWidth: 1, 
          borderColor: COLORS.PINK,
          backgroundColor: props.checked ? COLORS.CYAN : COLORS.DARK_PURPLE,
        }}
      />
  )}

  return (
    <View style={[
      styles.cardView, {
        height: 180,
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

      <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
        {Array.from({ length: props.minSets + 1}, (_, index) => (
          <CheckBox 
            checked={
              props.completedSets[exercise.name] &&
              (props.completedSets[exercise.name].length) > index
            } 
            key={index} />
        ))}
      </View>

      <Pressable 
        style={[ buttonDisabled ? styles. buttonDisabled : styles.altButton, { marginTop: 5 } ]}
        disabled={ buttonDisabled }
        onPress={() => {
          props.setExercise(exercise)
          props.setShowModal(true)
        }}
        
      >

        <Text style={{ color: buttonDisabled ? COLORS.BLACK : COLORS.BORDER, textAlign: 'center'}}>
          Check
        </Text>

      </Pressable>

    </View>
    
  )
}
