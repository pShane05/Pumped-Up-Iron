import { Link, router } from "expo-router";
import { COLORS, FONTS, styles } from "./costants";
import {  View, Text, Pressable, Dimensions, FlatList, ActivityIndicator, Image, Modal, TouchableOpacity, SafeAreaView } from 'react-native'
import { useExercisesByGroup, useExercisesByTarget } from "../hooks/useExercises";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import { usePlanByProfile, usePlanDayByProfile } from "../hooks/usePlan"
import { useProfile } from "../hooks/useProfile"
import { Session } from '@supabase/supabase-js'
import { supabase } from "../lib/supabase";
import { updateProfile } from "../lib/profile";
import { TargetPreview } from "../components/WorkoutComponents";

type Target = {
  id: string,
  name: string
}

export default function WorkoutScreen() {

  const [showInfo, setShowInfo] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

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

  
  async function handleStartButtonClick() {
    
    if (!plan || !profile || !day) return

    const nextDay = (profile?.plan_day % plan?.days) + 1;
          
    await updateProfile({
      session,
      setLoading,
      updates: {
        plan_day: nextDay
      }
    })

    router.replace('/')
  }


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
        onPress={() => { handleStartButtonClick()  }}
      >
        <Text style={{ fontSize: 20, fontFamily: FONTS.BODY}}>
          Start Workout
        </Text>
      </Pressable>


      <View style={[ styles.horizontalLine, { width: '70%', marginTop: 30 }]}/>

      <ExerciseCards setSelectedItem={ setSelectedItem } setShowInfo={ setShowInfo } session={ session }/>
      
      <InfoWindow
        visible={showInfo}
        onClose={() => setShowInfo(false)}
        title={ selectedItem?.name || ''}
        desc={ selectedItem?.description || ''}
        diff={ selectedItem?.difficulty || ''}
        cat={ selectedItem?.category || ''}
      />

    </SafeAreaView>
  );
}

export function BackButton() {
  return (
    <Link href='/(tabs)' style={[ styles.logout, { position: 'absolute', top: 20, left: 0, fontFamily: FONTS.BODY} ]}> Back </Link>
  )
}



export function ExerciseCards(props: { setShowInfo: (item: any) => void, setSelectedItem: (item: any) => void, session: Session | null}) {

  const { day, error, loading } = (usePlanDayByProfile(useProfile(props.session?.user.id).profile))
  const targets = day?.target_muscles
  if (loading) return <ActivityIndicator size="large" color={COLORS.PINK}  />;
  
  else {  

    return (

      <FlatList
        style={{ width: '100%'}}
        data={targets}
        renderItem={({ item }) => (
          <CardGroup target={ item } />
        )}
      />

  )}

  function CardGroup(props: { target: {id: number, name: string}}) {

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

          <TargetPreview target={props.target} />
          
      </View>
    )
  }

}

const InfoWindow = (props: { visible: boolean, onClose: () => void, title: string, desc: string, diff: string, cat: string }) => {
  
  return (
    <Modal
      transparent={true}
      visible={props.visible}
      animationType="fade"
      onRequestClose={ props.onClose}
    >

      <TouchableOpacity 
        style={styles.infoWindow} 
        activeOpacity={1} 
        onPress={ props.onClose}
      >

        <TouchableOpacity 
          style={styles.boxView} 
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when tapping the window itself
        >

          <Text style={{ color: COLORS.TEAL, fontSize: 20, alignSelf: 'center'}}>{ props.title }</Text>

          <TouchableOpacity style={styles.closeButton} onPress={ props.onClose}>
            <Text style={styles.closeButtonText}>×</Text>

          </TouchableOpacity>

          <View style={[ styles.horizontalLine, {width: '75%'} ]} />


          <Text style={styles.content}> 

            <Text style={{ color: COLORS.PINK, fontWeight: 'bold'}}> Description: </Text>

            {props.desc}
          </Text>

          <Text style={styles.content}> 

            <Text style={{ color: COLORS.PINK, fontWeight: 'bold'}}> Difficulty: </Text>

            {props.diff}
          </Text>

          <Text style={styles.content}> 

            <Text style={{ color: COLORS.PINK, fontWeight: 'bold'}}> Category: </Text>

            {props.cat}
          </Text>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
