import { View, Text, SafeAreaView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { COLORS, styles } from "../app/costants";
import { Exercise } from "../lib/exercise";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { useEffect, useState } from "react";
import { Set } from "../lib/sets";

export default function SetLogModal(
    props: {
        exercise: Exercise | null,
        showModal: boolean,
        onClose: () => void
        updateSets: (set: Set, exersizeName: string | undefined) => void
        setNum: number
    }
) {

    const [stringWeight, setStringWeight] = useState<string>('')
    const [stringReps, setStringReps] = useState<string>('')
    const [stringRest, setStringRest] = useState<string>('')

    useEffect(() => {
        if (props.showModal && props.exercise) {
            setStringWeight('')
            setStringReps('')
            setStringRest('')
        }
    }, [props.showModal, props.exercise])

    function handleConfirm() {

        if (!stringReps || !stringWeight || !stringRest) {
            console.log("Set info missing")
            return
        }

        const newSet = {
            exercise_name: props.exercise?.name,
            reps: Number(stringReps),
            weight_lbs: Number(stringWeight),
            set_number: props.setNum,
            rest_seconds: Number(stringRest),
            
        }

        console.log(newSet)
        props.updateSets(newSet, props.exercise?.name)

        setStringWeight('')
        setStringReps('')
        setStringRest('')

        props.onClose()

    }

    if (!props.showModal || !props.exercise) return null

    return (
        <TouchableWithoutFeedback onPress={ props.onClose} accessible={false}>
        <SafeAreaView
            style={[ 
                styles.container, 
                { flex: 1, paddingVertical: 50, zIndex: 2, backgroundColor: 'rgba(25, 25, 25, 0.5)', position: 'absolute', 
                top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%', justifyContent: 'center', alignItems: 'center'}]}>
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
            <View style={[ styles.modalView ]} >

                <Pressable 
                    style={{ position: 'absolute', left: 10, top: 10, backgroundColor: COLORS.BORDER, borderRadius: 5, borderColor: COLORS.BORDER, borderWidth: 1 }}
                    onPress={ props.onClose }
                >
                    <Text> X </Text>
                </Pressable>

                <View style={{ }}>
                    <Text style={[ styles.headerText, { textAlign: 'center', } ]}> 
                        Log set of { '\n' + props.exercise?.name }
                    </Text>
                </View>

                <View style={{ marginTop: 20, rowGap: 10 }} >

                    {
                        // Reps select
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 20}}>

                        <Text style={{ fontFamily: 'Electrolize-Regular', fontSize: 20, color: COLORS.BORDER }}>Reps: </Text>

                        
                    
                        <TextInput
                            style={[styles.numberInput]}
                            onChangeText={setStringReps}
                            value={stringReps}
                            placeholder={stringReps}
                            placeholderTextColor={COLORS.CYAN}
                            keyboardType="numeric"

                        />

                    </View>

                    {
                        // Weight select
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 20}}>

                        <Text style={{ fontFamily: 'Electrolize-Regular', fontSize: 20, color: COLORS.BORDER }}>Weight: </Text>

                        <TextInput
                            style={[styles.numberInput]}
                            onChangeText={setStringWeight}
                            value={stringWeight}
                            placeholder={stringWeight}
                            placeholderTextColor={COLORS.CYAN}
                            keyboardType="numeric"

                        />
                    </View>

                    {
                        // Rest select
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 20}}>

                        <Text style={{ fontFamily: 'Electrolize-Regular', fontSize: 20, color: COLORS.BORDER, width: '50%' }}>Rest time (seconds): </Text>

                        <TextInput
                            style={[styles.numberInput]}
                            onChangeText={setStringRest}
                            value={stringRest}
                            placeholder={stringRest}
                            placeholderTextColor={COLORS.CYAN}
                            keyboardType="numeric"

                        />
                    </View>
                
                </View>
                
                {
                    //Button row
                }
                <View style={{ flexDirection: "row", justifyContent: 'space-evenly', marginTop: 20 }}>

                    <Pressable 
                        style={[ styles.altButton ]}
                        onPress={ props.onClose }
                    >
                        <Text style={{ fontFamily: 'Electrolize-Regular' }}>
                            Close
                        </Text>
                    </Pressable>

                    <Pressable 
                        style={[ styles.button ]}
                        onPress={ handleConfirm }
                    >
                        <Text style={{ fontFamily: 'Electrolize-Regular' }}>
                            Add Set
                        </Text>
                    </Pressable>

                </View>

            </View>
            </TouchableWithoutFeedback>

        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}