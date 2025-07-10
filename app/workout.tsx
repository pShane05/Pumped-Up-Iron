import { Link } from "expo-router";
import { COLORS } from "./costants";
import { StyleSheet, View, Text, Pressable, Dimensions, FlatList, ActivityIndicator } from 'react-native'
import { useExercises } from "../hooks/useExercises";

export default function WorkoutScreen() {


  return (
    
    <View style={ styles.container }>
            
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

      <ExerciseCards />

    </View>
  );
}

export function BackButton() {
  return (
    <Link href='/(tabs)' style={ styles.button }> Back </Link>
  )
}

export function ExerciseCards() {

  const { exercises, loading } = useExercises("chest")

  if (loading) return <ActivityIndicator size="large" color={COLORS.PINK}  />;
  
  else {  return (

    <FlatList
      style={{ width: '100%'}}
      data={exercises}
      renderItem={({ item }) => (

      <View style={ styles.cardView }>

        <View style={{ width: '25%', margin: '2%'}}></View>

      
        <View style={{ justifyContent: 'space-between', width: '60%'}}>
          <Text style={ styles.exerciseNameText }> {item.name} </Text>
          <Text style={ styles.exerciseText }> weight: [weight]</Text>
          <Text style={ styles.exerciseText }> reps:  8-10</Text>
        </View>        
      
      </View>
      )}
    />
  )}
}

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
    padding: 2,
    marginHorizontal: 30,
    paddingTop: 15,
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
  },
  exerciseText: {
    color: COLORS.PINK,
    fontSize: 14,
    height: '20%',
  },
  cardView: {
    flexDirection: 'row', 
    backgroundColor: COLORS.PURPLE, 
    borderRadius: "10%", 
    borderWidth: 2,
    borderColor: COLORS.PINK,
    width: '75%', 
    height: (Dimensions.get('window').height) * .15, 
    marginTop: 30,
    marginBottom: 25,
    padding: 5,
    paddingVertical: 15,
    overflow: 'hidden',
    alignSelf: 'center'
  }
});