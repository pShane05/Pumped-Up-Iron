import { useEffect, useState } from "react";
import { Exercise } from "../lib/exercise";
import { useExercisesByTarget } from "../hooks/useExercises";
import { SafeAreaView, View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { COLORS, styles } from "../app/costants";
import { Set } from "../lib/sets";


export default function ExerciseModal(
    props: { 
        target: string | undefined, 
        showModal: boolean, 
        onClose: () => void, 
        onSelectExercise: (item: any) => void,  
        completedSets: Set[] | null,
        setCompletedSets: (item: any) => void

    }) {

    const [exerciseList, setExerciseList] = useState<Exercise[] | null>(null)
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
    const { exercises, loading, error } = useExercisesByTarget(props.target)

    useEffect(() => {
        if (exercises) {
            setExerciseList(exercises)
        }
    }, [exercises])
    

    const handleCardClick = (exercise: Exercise) => {
        setSelectedExercise(exercise)
    }

    const handleConfirm = () => {
        
        if (selectedExercise) {
            props.onSelectExercise(selectedExercise)
        }
        props.onClose()
    }

    const handleClose = () => {
        setSelectedExercise(null);
        props.onClose();
    }

    if (!props.showModal || !exerciseList) return null

    return (
        
        <View 
            style={[ 
                styles.container, 
                { flex: 1, paddingVertical: 50, backgroundColor: 'rgba(75, 75, 75, 0.25)', position: 'absolute', 
                top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%'}]}>
       
            <View 
                style={{ flex: 1, rowGap: 40, height: '100%', borderRadius: 20, alignSelf: 'center', alignItems: 'center', 
                backgroundColor: COLORS.BACKGROUND, padding: 20, margin: 20}}>
                
                {/* Header */}
                
                <Text style={[ styles.headerText, { textAlign: 'center'} ]}> 
                    Select an Exercise For { '\n' + props.target?.charAt(0).toUpperCase() + props.target?.slice(1) }
                </Text>


                {/* Exercise Cards Grid */}

                <ScrollView style={{flex: 1, marginBottom: 100}}>
                    { (loading || !props.target) && (
                        <ActivityIndicator size={'large'} color={COLORS.PURPLE}/>
                    )}

                    { (!loading && props.target) && (

                    <View style={{ rowGap: 5 }}>
                        {exerciseList.map((exercise) => (
                        <Pressable
                            key={exercise.id}
                            onPress={() => handleCardClick(exercise)}
                            style={[ 
                                styles.cardView, 
                                { flex: 1, justifyContent: 'space-around', alignContent: 'space-between', 
                                width: '100%', flexDirection: 'column', paddingHorizontal: 10, } 
                            ]}
                        >
                            <Text style={{ fontWeight: 'bold', color: COLORS.BORDER, fontFamily: 'Electrolize-Regular', fontSize: 14}}>
                                {exercise.name}
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
                        </Pressable>
                        ))}
                    </View>

                    )}
                </ScrollView>

                {/* Footer */}

                <View style={{flex: 1, width: '75%', position: 'absolute', bottom: 0, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Electrolize-Regular', color: COLORS.BORDER, fontWeight: 'semibold', fontSize: 20}}>
                        {selectedExercise ? `Selected: ${selectedExercise.name}` : 'No exercise selected'}
                    </Text>
                    <View style={{ width: '100%', flexDirection: 'row', columnGap: 25, justifyContent: 'center', marginBottom: 20}}>
                        <Pressable
                            onPress={handleClose}
                            style={ styles.altButton }>
                                <Text> Cancel </Text>
                        </Pressable>
                        <Pressable
                            onPress={handleConfirm}
                            disabled={!selectedExercise}
                            style={ styles.button}
                        >
                                <Text> Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
};