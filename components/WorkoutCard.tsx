import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'
import { COLORS } from '../app/costants'

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
      <ExercisePreview />
      <ExercisePreview />
      <ExercisePreview />

    </View>
  )
}

export function ExercisePreview() {
   return (
      <View style={ styles.ExercisePreview }>
        <Text style={{ color: COLORS.TEAL}}>        Flat Bench Press         [3x 10] </Text>
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
    paddingTop: 15,
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
    backgroundColor: '#20204b',
    padding: 10,
    borderRadius: 25,
    marginVertical: 10
  },
  Button: {
    backgroundColor: COLORS.CYAN,
    padding: 10,
    borderRadius: 25,
    margin: 10,
    alignSelf: 'center',
  },
});
