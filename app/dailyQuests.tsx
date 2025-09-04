import { SafeAreaView, Text, View } from "react-native";
import { BackButton } from "../components/WorkoutComponents";
import { COLORS, FONTS, styles } from "./costants";
import { useState } from "react";
import DailyQuestCard from "../components/DailyCard";

type Quest = {
    name: string,
    xp: number,
    goal: number,
    completion: number
}

const quests = [
    {
        name: "Shoot Free Throws",
        xp: 10,
        goal: 20,
        completion: 15
    },
    {
        name: "Pushups",
        xp: 25,
        goal: 50,
        completion: 15
    }]


export default function DailyQuestScreen() {

    const rewards = {
        xp: 10,
        gold: 10
    }

    return (
        <SafeAreaView style={[ styles.container,]}>

            <BackButton />

            { 
                // Header
            }
            <View style={{ marginTop: 60}}>
                <Text style={[ styles.headerText, { fontSize: 40, textAlign: 'center'}]}> 
                    Daily Quests
                </Text>

                <View style={[ styles.horizontalLine, { marginTop: 40, }]} />
                
                <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginTop: 10, fontFamily: FONTS.BODY }]}>
                    Total Rewards:
                </Text>

                <Text style={[ styles.exerciseNameText, { textAlign: 'center', color: COLORS.CYAN, marginVertical: 10, fontFamily: FONTS.BODY }]}>
                    { rewards.xp ? rewards.xp : "[xp]" } xp
                </Text>
                <Text style={{ textAlign: 'center', color: '#fffe00', fontFamily: FONTS.BODY }}>
                    { rewards.gold ? rewards.gold : "[gold]" } gold
                </Text>
                
                <View style={[ styles.horizontalLine, { width: '70%', marginTop: 25,  }]}/>
            </View>

            {
                // Quest cards
            }
            <View style={{ marginTop: 25}}>

                <DailyQuestCard quest={quests[0]}/>

                <View style={[ styles.horizontalLine, { marginVertical: 35, width: '50%' }]} />

                <DailyQuestCard quest={quests[1]} />

            </View>

        </SafeAreaView>
    )
}