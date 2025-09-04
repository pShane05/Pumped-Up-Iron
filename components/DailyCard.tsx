import { View, Text } from "react-native";
import { COLORS, FONTS, styles } from "../app/costants";
import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Progress from 'react-native-progress';

type Quest = {
    name: string,
    xp: number,
    goal: number,
    completion: number
}


export default function DailyQuestCard(props: {
    quest: Quest
}) {
    
    const quest = props.quest    

    if (!quest) return
    const completion = quest.completion / quest.goal

    return (
        <View 
            style={questStyles.questView}
        >

            <View 
                style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
            >

                <Text style={[ styles.headerText, {fontSize: 28, width: '50%'} ]}>
                    { quest.name}
                    
                </Text>

                <Text style={[ styles.headerText, {fontSize: 20,} ]}>
                    [{quest.completion} / {quest.goal}]
                </Text>

            </View>

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
                    {completion * 100}% 
                </Text>
            </View>

            <Text style={{ fontFamily: FONTS.BODY, fontSize: 16, marginTop: 15, color: COLORS.CYAN}}>
                Rewards:  <Text style={{fontSize: 14}}>{quest.xp} xp </Text>
            </Text>
        </View>
    )
}

const questStyles = StyleSheet.create({
    questView: {
        width: '90%',
        backgroundColor: COLORS.BACKGROUND,
        alignSelf: 'center',
        //borderColor: COLORS.BORDER,
        //borderWidth: 1,
        paddingTop: 10,
        paddingHorizontal: 10,
        borderRadius: 20
    },
    box: {
        height: 30,
        width: 30,
        borderColor: COLORS.BORDER,
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: 'center',
        marginLeft: 25
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