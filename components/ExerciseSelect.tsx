import { Dispatch, SetStateAction, useDebugValue, useEffect, useState } from "react";
import { Exercise } from "../lib/exercise";
import { useExercisesByTarget } from "../hooks/useExercises";
import { SafeAreaView, View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { COLORS, styles } from "../app/costants";
import { Set } from "../lib/sets";
import { SelectionsByTarget } from "../app/workout";
import { usePlanDetailsByProfile } from "../hooks/usePlan";
import { useProfile } from "../hooks/useProfile";
import { Profile } from "../lib/profile";


export default function ExerciseModal(
    props: { 
        target: string | undefined, 
        showModal: boolean, 
        onClose: () => void, 
        selectedExercises: SelectionsByTarget | null,
        setSelectedExercises: Dispatch<SetStateAction<SelectionsByTarget>>,
        onSelectExercise: (item: any) => void,
        profile: Profile | undefined
    }) {

    const [exerciseList, setExerciseList] = useState<Exercise[] | null>(null)
    const selectedForTarget = props.target ? props.selectedExercises?.[props.target] : undefined;
    const { exercises, loading, error } = useExercisesByTarget(props.target)
    const { planDetails } = usePlanDetailsByProfile(props.profile)

    useEffect(() => {
        if (exercises) {
            setExerciseList(exercises)
        }
    }, [exercises])
    

    /*const handleCardClick = (exercise: Exercise) => {

        props.(prev => {
            const currentExercises = prev || []

            const exerciseExists = currentExercises.some(ex => ex.id === exercise.id)

            if(!currentExercises) {
                return [exercise]
            }
            else if (exerciseExists) {
                return currentExercises.filter(ex => ex.id !== exercise.id)
                
            } else {
                return [...currentExercises, exercise]
                
            }
        })
    }*/

    const equipmentCheck = (equipment: string | undefined) => {
        
        if (!equipment) return

        if (planDetails?.equipment.includes(equipment) || planDetails?.equipment.includes("full gym"))
            return true
        if (equipment == "body-weight")
            return true
    }

    const handleConfirm = () => {
        
        props.onClose()
    }


    if (!props.showModal || !exerciseList || !props.target) return null


    return (
        
        <View 
            style={[ 
                styles.container, 
                { flex: 1, paddingVertical: 50, backgroundColor: 'rgba(25, 25, 25, 0.5)', position: 'absolute', 
                top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%'}]}>
       
            <View 
                style={[ styles.modalView, { flex: 1, rowGap: 40, height: '100%', borderRadius: 20, alignSelf: 'center', alignItems: 'center', 
                backgroundColor: COLORS.BACKGROUND, padding: 20, margin: 20}]}>
                
                {/* Header */}
                
                <Text style={[ styles.headerText, { textAlign: 'center'} ]}> 
                    Select Exercises For { props.target?.charAt(0).toUpperCase() + props.target?.slice(1) }
                </Text>


                {/* Exercise Cards Grid */}

                <ScrollView style={{flex: 1, marginBottom: 100}}>
                    { (loading || !props.target) && (
                        <ActivityIndicator size={'large'} color={COLORS.PURPLE}/>
                    )}

                    { (!loading && props.target) && (

                    <View style={{ rowGap: 5 }}>
                        {exerciseList.filter(ex => equipmentCheck(ex.equipment)).map((exercise) => (
                        <Pressable
                            key={exercise.id}
                            onPress={() => props.onSelectExercise(exercise)}
                            style={[ 
                                styles.cardView, 
                                { flex: 1, justifyContent: 'space-around', alignContent: 'space-between', 
                                width: '100%', flexDirection: 'column', paddingHorizontal: 10, 
                                backgroundColor: 
                                selectedForTarget?.some((ex: Exercise) => ex.id === exercise.id) ?
                                    COLORS.DARK_GRAY
                                :
                                    COLORS.PURPLE
                                }
                                
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

                <View style={{flex: 1, width: '90%', position: 'absolute', bottom: 0, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Electrolize-Regular', color: COLORS.BORDER, fontWeight: 'semibold', fontSize: 18, justifyContent: 'center', }}>
                        {props.selectedExercises && props.target ? 
                            props.selectedExercises[props.target] && props.selectedExercises[props.target].length > 0 ? 
                                props.selectedExercises[props.target].length > 1 ? 
                                    `Selected: ${props.selectedExercises[props.target].length} exercises`
                                :   `Selected: ${props.selectedExercises[props.target].at(0)?.name}` 
                            : 'No exercise selected'
                        : 'No exercise selected'}
                    </Text>
                    <View style={{ width: '100%', flexDirection: 'row', columnGap: 25, justifyContent: 'center', marginBottom: 20}}>
                        <Pressable
                            onPress={handleConfirm}
                            disabled={!props.selectedExercises}
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