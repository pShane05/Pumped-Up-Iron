import { Link, router } from "expo-router";
import { COLORS, styles } from "./costants";
import {  View, Text, Pressable, Dimensions, FlatList, ActivityIndicator, Image, Modal, TouchableOpacity, SafeAreaView } from 'react-native'
import { useExercisesByGroup, useExercisesByTarget } from "../hooks/useExercises";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from "react";
import { getTargetsByProfile } from "../hooks/usePlan"
import { useProfile } from "../hooks/useProfile"
import { Session } from '@supabase/supabase-js'
import { supabase } from "../lib/supabase";

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

  return (
    
    <SafeAreaView style={ styles.container }>
            
      <BackButton />

      <Text style={{ alignSelf: 'center', fontSize: 32, color: COLORS.TEAL, marginTop: 60}}> Chest and Shoulders </Text>

      <View style={[ styles.horizontalLine, { marginTop: 40}]} />

      <Pressable style={ styles.altButton } >
        <Text style={{ color: COLORS.TEAL}}>
          Edit Workout
        </Text>
      </Pressable>

      <Pressable style={[ styles.button, { marginTop: 15} ]}>
        <Text style={{ fontSize: 20,}}>
          Start Workout
        </Text>
      </Pressable>


      <View style={[ styles.horizontalLine, { width: '70%', marginTop: 30 }]}/>

      <ExerciseCards setSelectedItem={ setSelectedItem } setShowInfo={ setShowInfo }/>
      
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
    <Link href='/(tabs)' style={[ styles.logout, { position: 'absolute', top: 20, left: 0} ]}> Back </Link>
  )
}



export function ExerciseCards(props: { setShowInfo: (item: any) => void, setSelectedItem: (item: any) => void, session: Session | null}) {

  const { exercises, loading } = useExercisesByTarget("pectorals")
  const [ targets, setTargets ] = useState<Target[]>([])

  const profile = getTargetsByProfile(useProfile(props.session?.user.id).profile)

  if (loading) return <ActivityIndicator size="large" color={COLORS.PINK}  />;
  
  else {  return (
    <FlatList
      style={{ width: '100%'}}
      data={profile?.targets}
      renderItem={({ item }) => (
        <CardGroup target={ item } setShowInfo={ props.setShowInfo } setSelectedItem={ props.setSelectedItem }/>
      )}
    />

  )}

  function CardGroup(props: { target: string | undefined, setShowInfo: (item: any) => void, setSelectedItem: (item: any) => void} ) {

    if (!props.target) return

    return (

      <View>

        <Text 
          style={{ 
            alignSelf: 'center', 
            marginTop: 20, marginBottom: 10,
            fontSize: 20,
            fontWeight: '500',
            color: COLORS.BORDER }}
        >
          {props.target.charAt(0).toUpperCase() + props.target.slice(1)}
        </Text>

          <FlatList
            style={{ width: '100%'}}
            data={exercises}
            renderItem={({ item }) => (

              <View style={ styles.cardView }>
              
                <View style={{ width: 80, height: 80, margin: '2%', borderRadius: '20%', marginRight: 10, justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialCommunityIcons name="weight-lifter" size={60} color="black" />
                </View>

                
                <View style={{ 
                  justifyContent: 'space-between', width: '60%', height: '100%', position: 'absolute', right: 10, marginBottom: 10, marginTop: 20
                }}>

                <Text style={[ styles.exerciseNameText, { width: '80%'} ]}> { item.name.charAt(0).toUpperCase() + item.name.slice(1)} </Text>
                <View style={[ styles.horizontalLine, {width: '20%'} ]} />

                <Text style={ styles.exerciseText }> weight: [weight]</Text>
                <Text style={ styles.exerciseText }> reps:  8-10</Text>
                </View>  

                <TouchableOpacity 
                  onPress={() => {
                    props.setSelectedItem(item)
                    props.setShowInfo(true)
                    }}
                    style={{ position: 'absolute', right: 10, top: 10}}
                >
                  <Text >ℹ️</Text>
                </TouchableOpacity>
              </View>
      
            )}
          />
          
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
