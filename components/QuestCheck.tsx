import { Pressable, SafeAreaView, View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native"
import { COLORS, FONTS, styles } from "../app/costants"
import { useState } from "react"
import { DailyQuest, QuestMap, updateActiveDailies } from "../lib/dailyQuest"
import { supabase } from "../lib/supabase"
import { Session } from "@supabase/supabase-js"

export default function QuestCheckModal(
    props: {
        session: Session | null,
        quest: DailyQuest | null
        setQuestMap: (item:any) => void
        showModal: boolean,
        onClose: () => void
        setLoading: (item:any) => void
        onComplete: (item: any, item2:any) => void
        questMap: QuestMap | null
    }
) {

    if (!props.showModal || !props.quest) return

    const [addValue, setAddValue] = useState('')
    const session = props.session
    const setLoading = props.setLoading

    const onQuestComplete = async (quest: DailyQuest) => {
        if (!props.questMap) return

        const updatedQuestMap = {
            ...props.questMap,
            [quest.id]: quest
        }
        console.log("Updated map: ", updatedQuestMap)

        const areAllQuestsDone = await CheckAllQuestsCompleted(updatedQuestMap)
        console.log(areAllQuestsDone)
        props.onComplete(quest, areAllQuestsDone)
    }

    async function handleConfirm() {
  
        if (!props.quest?.completed && props.quest?.completed !== 0) return

        const totalCompleted = props.quest?.completed + Number(addValue)

        const { data } = await updateActiveDailies({
            session,
            setLoading,
            updates: {
                id: props.quest.id,
                completed: totalCompleted,
                is_completed: (totalCompleted >= props.quest.goal),
                completed_at: (totalCompleted >= props.quest.goal) ? new Date() : undefined
            }
        }) || { data: []}
        console.log(data)
        
        props.setQuestMap((prev: QuestMap | null) => {

            if (!props.quest?.id) return
    
            return {
                ...prev,
                [props.quest?.id]: data[0]
            }
        })

        if(data[0].completed >= data[0].goal) onQuestComplete(data[0])

        props.onClose()

    }

    return (
        <TouchableWithoutFeedback onPress={ props.onClose } accessible={false}>
        <SafeAreaView
            style={[ 
                styles.container, 
                { flex: 1, paddingVertical: 50, zIndex: 2, backgroundColor: 'rgba(25, 25, 25, 0.5)', position: 'absolute', 
                top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%', justifyContent: 'center', alignItems: 'center'}]}
        >
            <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>
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
            </TouchableWithoutFeedback>

            

        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

async function CheckAllQuestsCompleted(quests: QuestMap) {

    var isPassing = true;
    
    Object.values(quests).forEach(quest => {
        console.log(quest)
        if (quest.completed < quest.goal)
            isPassing = false
    })
    console.log("passing check: ", isPassing)
    return isPassing
}