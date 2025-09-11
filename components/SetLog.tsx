import { View, Text, SafeAreaView, Pressable } from "react-native";
import { COLORS, styles } from "../app/costants";
import { Exercise } from "../lib/exercise";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { useState } from "react";
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

    if (!props.showModal || !props.exercise) return

    const weightsVals = [...Array(500).keys()].map(i => (i).toString())
    const repsVals = [...Array(100).keys()].map(i => (i).toString())
    const timesVals = [...Array(600).keys()].map(i => (i).toString())
    
    const [logWeight, setLogWeight] = useState<number>(50)
    const [logReps, setLogReps] = useState<number>(8)
    const [logRest, setLogRest] = useState<number>(120)



    function handleConfirm() {

        const newSet = {
            exercise_name: props.exercise?.name,
            reps: logReps,
            weight_lbs: logWeight,
            set_number: props.setNum,
            rest_seconds: logRest,
            
        }

        props.updateSets(newSet, props.exercise?.name)
        props.onClose()

    }

    return (
        <SafeAreaView
            style={[ 
                styles.container, 
                { flex: 1, paddingVertical: 50, zIndex: 2, backgroundColor: 'rgba(25, 25, 25, 0.5)', position: 'absolute', 
                top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%', justifyContent: 'center', alignItems: 'center'}]}>
            
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

                        <Text style={{ fontFamily: 'Electrolize-Regular', fontSize: 20, color: COLORS.BORDER }}> Reps: </Text>

                        <View style={[styles.scrollWheel, { height: 50, marginTop: 5}]}>

                            <WheelPickerExpo 
                                height={ 115 }
                                width={ 60 }
                                initialSelectedIndex={8}
                                haptics={ true}
                                backgroundColor={ COLORS.BACKGROUND}    
                                items={repsVals.map(n => ({ label: n, value: n }))}

                                onChange={({ index }) => setLogReps(index)}
                            />

                        </View>
                    </View>

                    {
                        // Weight select
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 20}}>

                        <Text style={{ fontFamily: 'Electrolize-Regular', fontSize: 20, color: COLORS.BORDER }}> Weight: </Text>

                        <View style={[styles.scrollWheel, { height: 50, marginTop: 5}]}>
                            <WheelPickerExpo 
                                height={ 115 }
                                width={ 60 }
                                initialSelectedIndex={50}
                                haptics={ true}
                                backgroundColor={ COLORS.BACKGROUND}    
                                items={weightsVals.map(n => ({ label: n, value: n }))}

                                onChange={({ index }) => setLogWeight(index)}
                            />
                        </View>
                    </View>

                    {
                        // Rest select
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 20}}>

                        <Text style={{ fontFamily: 'Electrolize-Regular', fontSize: 20, color: COLORS.BORDER }}> Rest time: </Text>

                        <View style={[styles.scrollWheel, { height: 50, marginTop: 5}]}>
                            <WheelPickerExpo 
                                height={ 115 }
                                width={ 60 }
                                initialSelectedIndex={120}
                                haptics={ true}
                                backgroundColor={ COLORS.BACKGROUND}    
                                items={timesVals.map(n => ({ label: n, value: n }))}

                                onChange={({ index }) => setLogRest(index)}
                            />
                        </View>
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

        </SafeAreaView>
    )
}