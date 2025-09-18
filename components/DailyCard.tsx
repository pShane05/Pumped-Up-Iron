import { View, Text, Pressable } from "react-native";
import { COLORS, FONTS, styles } from "../app/costants";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';
import { DailyQuest } from "../lib/dailyQuest";
import Entypo from '@expo/vector-icons/Entypo';



export default function DailyQuestCard(props: {
    quest: DailyQuest
    setQuest: (item:any) => void
    openModal: (item: any) => void
}) {
    
    const quest = props.quest    

    if (!quest) return
    const completion = quest.completed / quest.goal


    function AddButton() {
        return (
            <Pressable 
                style={ questStyles.addButton}
                onPress={ () => {
                    props.setQuest(props.quest)
                    props.openModal(true)
                }}
            >
                <Entypo name="plus" size={24} color="black" />
            </Pressable>
        )
    }

    function CheckBox() {
        return (
            <View
                style={ questStyles.checkBox}
            >
                <Entypo name="check" size={24} color="black" />
            </View>
        )
    }

    return (
        <View 
            style={[ questStyles.questView ]}
        >

            <View 
                style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
            >

                <Text style={[ styles.headerText, {fontSize: 28, width: '50%'} ]}>
                    { quest.name}  
                    
                </Text>

                <View style={{flexDirection: 'row', columnGap: 10, alignItems: 'center'}}>
                    <Text style={[ styles.headerText, {fontSize: 20,} ]}>
                        [{quest.completed} / {quest.goal} ]
                    </Text>
                    {completion < 1 ? <AddButton /> : <CheckBox />}
                </View>

            </View>

            <Text style={{ fontFamily: FONTS.BODY, fontSize: 16, marginTop: 15, color: COLORS.CYAN}}>
                Rewards:  <Text style={{fontSize: 14}}>{quest.xp} xp </Text>
            </Text>

            <View style={{ marginTop: 10, flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between'}}>
                <View style={ questStyles.completeBar }>
                    <Progress.Bar 
                        progress={ completion } 
                        width={ null } 
                        height={ 50 } 
                        color= { COLORS.BORDER}
                        borderColor= { COLORS.PURPLE }
                    />             
                </View>
                <Text 
                    style={{ color: completion < 1 ? COLORS.RED : COLORS.GREEN, } }
                > 
                    {Math.floor(completion > 1 ? 100 : completion * 100)}% 
                </Text>
            </View>

            
        </View>
    )
}



const questStyles = StyleSheet.create({
    questView: {
        width: '90%',
        backgroundColor: COLORS.BACKGROUND,
        alignSelf: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    addButton: {
        height: 30, 
        width: 30, 
        backgroundColor: COLORS.SECONDARY, 
        borderColor: COLORS.BORDER,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkBox: {
        height: 30, 
        width: 30, 
        backgroundColor: COLORS.GREEN_MUTED, 
        borderColor: COLORS.BLACK,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    completeBar: {
        width: '85%',
        height: 5,
        //borderRadius: '5%',
        borderWidth: 1,
        alignSelf: 'center',
        overflow: 'hidden',
        borderColor: COLORS.PURPLE,
        backgroundColor: COLORS.PURPLE
    }
})