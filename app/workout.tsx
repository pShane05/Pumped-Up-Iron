import { Link } from "expo-router";
import { COLORS } from "./costants";
import { StyleSheet, View, Text, Pressable, Dimensions, FlatList, ActivityIndicator, Image, Modal, TouchableOpacity, SafeAreaView } from 'react-native'
import { useExercises } from "../hooks/useExercises";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react";


export default function WorkoutScreen() {

  const [showInfo, setShowInfo] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)


  return (
    
    <SafeAreaView style={ styles.container }>
            
      <BackButton />

      <Text style={{ alignSelf: 'center', fontSize: 32, color: COLORS.TEAL}}> Chest and Shoulders </Text>

      <View style={[ styles.horizontalLine, { marginTop: 40}]} />

      <Pressable style={ styles.editWorkout } >
        <Text style={{ color: COLORS.TEAL}}>
          Edit Workout
        </Text>
      </Pressable>

      <Pressable style={ styles.startWorkout }>
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
    <Link href='/(tabs)' style={ styles.button }> Back </Link>
  )
}



export function ExerciseCards(props: { setShowInfo: (item: any) => void, setSelectedItem: (item: any) => void}) {

  const { exercises, loading } = useExercises("chest")

  if (loading) return <ActivityIndicator size="large" color={COLORS.PINK}  />;
  
  else {  return (

    <FlatList
      style={{ width: '100%'}}
      data={exercises}
      renderItem={({ item }) => (

      <View style={ styles.cardView }>

        <View style={{ width: 80, height: 80, margin: '2%', borderRadius: '20%', marginRight: 10, justifyContent: 'center', alignItems: 'center'}}>
            <MaterialCommunityIcons name="weight-lifter" size={60} color="black" />
        </View>

      
        <View style={{ 
          justifyContent: 'space-between', width: '60%', height: '100%', position: 'absolute', right: 10, marginVertical: 10
        }}>

          <Text style={[ styles.exerciseNameText ]}> { item.name.charAt(0).toUpperCase() + item.name.slice(1)} </Text>
          <View style={[ styles.horizontalLine, {width: '20%'} ]} />
          <Text style={ styles.exerciseText }> weight: [weight]</Text>
          <Text style={ styles.exerciseText }> reps:  8-10</Text>
        </View>  

        <TouchableOpacity 
          onPress={() => {
            props.setShowInfo(true)
          }}
        >
          <Text >ℹ️</Text>
        </TouchableOpacity>
      
      </View>
      )}
    />
  )}

  

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_BLUE,
    alignItems: 'center',
    paddingTop: '30%'
  },
  boxView: {
    backgroundColor: COLORS.BACKGROUND_BLUE,
    borderRadius: 25,
    borderColor: COLORS.TEAL,
    borderWidth: 3,
    padding: 15,
    marginHorizontal: 50,
    paddingTop: 30,
  },
  logout: {
    margin: 20,
    position: 'absolute',
    top: 20,
    right: 0,
    backgroundColor: COLORS.TEAL, 
    marginTop: 30,
    width: '20%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    alignSelf: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    backgroundColor: COLORS.CYAN,
    marginTop: 10,
    alignSelf: 'center',
    color: COLORS.TEAL,
    position: 'absolute',
    top: 50,
    left: 20
  },
  titleView: {
    flex: 0,
    backgroundColor: COLORS.GRAY,
    width: '100%',
    height: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  horizontalLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.TEAL, 
    marginVertical: 10, 
    alignSelf: 'center',
  },
  scrollableView: {
    paddingBottom: 50,
    rowGap: 40,
  },
  editWorkout: {
    backgroundColor: COLORS.PURPLE,
    borderRadius: '13%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.PINK,
    overflow: 'hidden'
  },
  startWorkout: {
    backgroundColor: COLORS.TEAL,
    borderRadius: '13%',
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 25
  },
  exerciseNameText: {
    color: COLORS.TEAL,
    fontSize: 16,
    //paddingLeft: 2,
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  exerciseText: {
    color: COLORS.PINK,
    fontSize: 14,
    height: '20%',
    marginLeft: 10
  },
  cardView: {
    flexDirection: 'row', 
    backgroundColor: COLORS.PURPLE, 
    borderRadius: "10%", 
    borderWidth: 2,
    borderColor: COLORS.PINK,
    width: '80%', 
    height: (Dimensions.get('window').height) * .15, 
    marginTop: 30,
    marginBottom: 25,
    padding: 10,
    paddingVertical: 15,
    overflow: 'hidden',
    alignSelf: 'center'
  },
  infoWindow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    padding: 5,
    position: 'absolute',
    left: 15, 
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.TEAL,
    alignSelf: 'center',
    marginHorizontal: 10
  },

});