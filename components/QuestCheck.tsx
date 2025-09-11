import { Pressable, SafeAreaView, View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native"
import { COLORS, FONTS, styles } from "../app/costants"
import { useState } from "react"
import { DailyQuest } from "../lib/dailyQuest"

export default function QuestCheckModal(
    props: {
        quest: DailyQuest | null
        addToQuest: (item: any) => void
        showModal: boolean,
        onClose: () => void
        
    }
) {

    if (!props.showModal || !props.quest) return

    const [addValue, setAddValue] = useState('')

    function handleConfirm() {

        props.addToQuest(addValue)
        props.onClose()

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView
            style={[ 
                styles.container, 
                { flex: 1, paddingVertical: 50, zIndex: 2, backgroundColor: 'rgba(25, 25, 25, 0.5)', position: 'absolute', 
                top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%', justifyContent: 'center', alignItems: 'center'}]}
        >

            <View style={ styles.modalView}>
                <Pressable 
                    style={{ position: 'absolute', left: 10, top: 10, backgroundColor: COLORS.BORDER, borderRadius: 5, borderColor: COLORS.BORDER, borderWidth: 1 }}
                    onPress={ props.onClose }
                >
                    <Text> X </Text>
                </Pressable>

                <Text style={[ styles.headerText, { textAlign: 'center'} ]}>
                    Add to "{ props.quest.name}" Quest
                </Text>

                <View style={[ styles.horizontalLine, { marginTop: 15 } ]} />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', columnGap: 20, marginTop: 30}}>


                    <Text style={{ fontFamily: 'Electrolize-Regular', fontSize: 20, color: COLORS.BORDER }}> Enter amount: </Text>

                    <TextInput
                        style={[styles.numberInput]}
                        onChangeText={setAddValue}
                        value={addValue}
                        placeholder="00"
                        placeholderTextColor={COLORS.CYAN}
                        keyboardType="numeric"
                    />
                </View>

                <Pressable 
                    style={[ styles.button, { marginTop: 20 } ]}
                    onPress={ handleConfirm }
                >
                    <Text style={{ fontFamily: FONTS.BODY}}>
                        Confirm
                    </Text>
                </Pressable>

            </View> 

            

        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}