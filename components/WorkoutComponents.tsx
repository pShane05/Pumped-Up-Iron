import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native"
import { COLORS, FONTS, styles } from "../app/costants"
import React, { useState } from "react"
import { Exercise } from "../lib/exercise"
import { Set } from "../lib/sets";
import AntDesign from '@expo/vector-icons/AntDesign';



export function ExerciseDone(props: {exercise: Exercise}) {

    return (
    <View 
        style={[
        styles.cardView,  {
        height: 120,
        flexDirection: 'row',
        padding: 20,
        backgroundColor: COLORS.DARK_PURPLE,
        alignItems: 'center',
        justifyContent: 'center'
    }]}>

      <View style={{ alignItems: 'center', justifyContent: 'center'}}>
        <Text style={[ styles.exerciseNameText, { color: COLORS.BORDER }]}>
            { props.exercise.name }
        </Text>
        <AntDesign name="check" size={40} color={COLORS.BORDER} />
      </View>
    </View>
  )
}

export function CompletedExercises(props: { exercisesDone: Exercise[] | null }) {

    if (!props.exercisesDone) return

    return (

        <View >
            <FlatList style={{ width: '100%'}}
                data={props.exercisesDone}
                renderItem={({ item }) => (
                    <ExerciseDone exercise={ item } />
            )}
        />
        </View>
    )
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
