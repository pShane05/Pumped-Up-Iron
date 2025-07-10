import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { Link } from 'expo-router'
import { COLORS } from '../app/costants'
import { useExercises } from '../hooks/useExercises'

  export default function WorkoutCard() {
  const [loading, setLoading] = useState(false)

  return (
    
    <View style={ styles.boxView } >
      
      <Text style={{ 
        color: COLORS.TEAL, alignSelf: 'center', fontSize: 20,}}> 
          Chest and Shoulders 
      </Text>
      
      <View style={ styles.horizontalLine }/>

      <Pressable style={ styles.Button }>
        <Text style={{ color: COLORS.TEAL }}> Edit Workout </Text>
      </Pressable>

      <Link href="/workout" style={[ styles.Button, {backgroundColor: COLORS.TEAL, borderColor: COLORS.CYAN, marginBottom: 25} ]}>
        View Workout 
      </Link>

      <ExercisePreview />

    </View>
  )
}

export function ExercisePreview() {

  const { exercises, loading } = useExercises("chest")
  
  if (loading) return <ActivityIndicator size="large" color={COLORS.PINK}  />

  return (
    <View style={{ width: '100%', alignItems: 'center'}}>
      {exercises.slice(0, 5).map((item) => (        

        <View key={item.id} style={ styles.ExercisePreview }>

          <Text style={{ color: COLORS.TEAL, flexShrink: 1}} key={item.id}>{ item.name}</Text>

          <Text
            style={{ fontSize: 12, fontWeight: 'bold', width: '40%', alignSelf: 'center', color: COLORS.TEAL, left: 15}} > 
              [4 x 8-10]
          </Text>

        </View>
      
      ))}
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
  ExercisePreview: {
    width: '80%',
    height: 60,
    backgroundColor: '#20204b',
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  Button: {
    backgroundColor: COLORS.CYAN,
    padding: 10,
    borderRadius: 25,
    margin: 10,
    alignSelf: 'center',
  },
});
