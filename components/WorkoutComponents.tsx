import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native"
import { COLORS, FONTS, styles } from "../app/costants"
import React, { useState } from "react"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Exercise } from "../lib/exercise"
import { Set } from "../lib/sets";



export function ExerciseDone(props: {set: Set}) {

    return (

        <View style={[ styles.cardView, { backgroundColor: COLORS.PURPLE, paddingVertical: 20} ]}>

                
            <View style={{ 
                alignItems: 'center',  width: '100%', height: '100%', marginBottom: 10, justifyContent: 'space-around'
            }}>

                <Text style={[ styles.exerciseNameText, { width: '80%', fontFamily: FONTS.BODY} ]}> { "Choose " + props.set.exercise.name.charAt(0).toUpperCase() + props.set.exercise.name.slice(1) + " Exercise"} </Text>
                <View style={[ styles.horizontalLine, {width: '20%', alignSelf: 'center'} ]} />

                <Text style={[ styles.exerciseText, { fontFamily: FONTS.BODY} ]}> reps:  6-8</Text>
            </View>  

        </View>
    )
}

export function CompletedExercises(props: { exercisesDone: Set[] | null }) {

    if (!props.exercisesDone) return

    return (

        <View >
            <FlatList style={{ width: '100%'}}
                data={props.exercisesDone}
                renderItem={({ item }) => (
                    <ExerciseDone set={ item } />
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
