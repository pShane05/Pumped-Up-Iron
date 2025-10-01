import { View, Text, Pressable } from "react-native";
import { DailyQuest } from "../lib/dailyQuest";
import { COLORS, FONTS, styles } from "../app/costants";

export default function QuestCompleteModal(
    props: {
        quest: DailyQuest | null,
        showModal: boolean,
        onClose: () => void,
        allComplete: boolean
        rewards: {
            xp: number,
            gold: number
        }
    }) {

    if (!props.showModal || !props.quest) return
    console.log("Complete in modal: ", props.allComplete)

    return (
        <View
            style={[ 
                styles.container, 
                { flex: 1, paddingVertical: 50, zIndex: 2, backgroundColor: 'rgba(25, 25, 25, 0.5)', position: 'absolute', 
                top: 0, bottom: 0, left: 0, right: 0, height: '110%', width: '100%', justifyContent: 'center', alignItems: 'center'}]}
        >
            <View style={ styles.modalView}>
                <Text style={[ styles.headerText, { textAlign: 'center', fontSize: 28} ]}>
                    Daily Quest "{props.quest.name} {props.quest.goal} {props.quest.units}" Complete!
                </Text>

                <View style={[ styles.horizontalLine, { marginBottom: 25, marginTop: 15} ]}/>

                <Text style={{ fontSize: 16, textAlign: 'center', fontFamily: FONTS.BODY, color: COLORS.BORDER}}>
                    You've earned {}
                    <Text style={{ color: COLORS.CYAN}}>
                        {props.quest.xp} Xp 
                    </Text>
                    !
                </Text>
                { props.allComplete &&
                    <Text style={{ fontSize: 16, textAlign: 'center', fontFamily: FONTS.BODY, color: COLORS.BORDER}}>
                        {'\n\n'}Completing all daily quests has earned you
                        <Text style={{ color: COLORS.CYAN}}>
                            {' '}{props.rewards.xp} Xp 
                        </Text>
                        {' '}and
                        <Text style={{ color: COLORS.GOLD}}>
                            {'\n' + props.rewards.gold} Gold 
                        </Text>
                    </Text>
                }
                <Text style={{ fontSize: 16, textAlign: 'center', fontFamily: FONTS.BODY, color: COLORS.BORDER}}>
                    {'\n\n'} Nice Job!
                </Text>

                <Pressable
                    onPress={
                        props.onClose
                    }
                    style={[ styles.button, { marginTop: 20 } ]}
                >
                    <Text style={{ fontFamily: FONTS.BODY, fontSize: 16,}}>
                        Continue
                    </Text>
                </Pressable>
                
            </View>
            
        </View>
    )
}