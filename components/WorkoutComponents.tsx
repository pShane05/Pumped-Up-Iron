import { FlatList, Modal, Text, TouchableOpacity, View, Image, SafeAreaView, Pressable } from "react-native"
import { COLORS, FONTS, styles, imageMap } from "../app/costants"
import { Exercise } from "../lib/exercise"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Link } from "expo-router";



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
        <Text style={[ styles.headerText, { color: COLORS.BORDER, fontSize: 24, }]}>
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


export function SelectedExerciseCard(props: {exercise: Exercise}) {

  const exercise = props.exercise

  return (
    <View 
      style={[
        styles.cardView,  {
        height: 120,
        flexDirection: 'row',
        padding: 20
      }]}>

      <View style={{ alignSelf: 'center', width: 50, height: 50, }}>
        <Image style={{ resizeMode: 'contain', width: '100%', height: '100%',}} source={ imageMap[props.exercise.icon] }/>
      </View>

      <View style={{ width: '60%', paddingLeft: 20}}>
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
  )
}


export function BackButton() {
  return (
    <Link href='/(tabs)' style={[ styles.logout, { position: 'absolute', top: 20, left: 0, fontFamily: FONTS.BODY} ]}> Back </Link>
  )
}


export function ConfirmCancelModal( 
  props: {

    showModal: boolean,
    onClose: () => void,
    onConfirm: () => void

  }) {

    if (!props.showModal) return

  return (
    <SafeAreaView 
      style={[ styles.container, 
        { flex: 1, paddingVertical: 50, backgroundColor: 'rgba(20, 20, 20, 0.5)', position: 'absolute', 
          top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%', justifyContent: 'center'
      }]}
    >

      <View 
        style={[ styles.cardView, { backgroundColor: COLORS.DARK_GRAY, alignSelf: 'center', 
          flexDirection: 'column', padding: 20, rowGap: 25, height: 'auto' } ]}>
        <Text style={[ styles.headerText, { textAlign: 'center'}]}>
          Do You Want to Cancel the Workout?
        </Text>

        <Text style={{ color: COLORS.BORDER, fontFamily: 'Electrolize-Regular', marginHorizontal: 20}}>
          This will remove your progress and cannot be undone.
        </Text>

        <Pressable 
          style={ styles.button}
          onPress={
            props.onClose
          }
        >
          <Text style={{ fontFamily: FONTS.BODY}}>
            Go Back
          </Text>
        </Pressable>

        <Pressable
          onPress={

            props.onConfirm
          }
        >
          <Text style={{ fontFamily: FONTS.BODY, alignSelf: 'center', marginBottom: 10, color: COLORS.RED}}>
            Yes, Cancel
          </Text>
        </Pressable>
      </View>

    </SafeAreaView>
  )
}
