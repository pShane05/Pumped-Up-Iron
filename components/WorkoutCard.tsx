import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { Link } from 'expo-router'
import { COLORS, styles } from '../app/costants'
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

      <Pressable style={ styles.altButton }>
        <Text style={{ color: COLORS.TEAL }}> Edit Workout </Text>
      </Pressable>

      <Link href="/workout" style={[ styles.button, {backgroundColor: COLORS.TEAL, borderColor: COLORS.CYAN, marginBottom: 25} ]}>
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

