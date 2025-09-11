import { FlatList, SafeAreaView, Text, View } from "react-native";
import { BackButton } from "../components/WorkoutComponents";
import { COLORS, FONTS, styles } from "./costants";
import { useEffect, useState } from "react";
import DailyQuestCard from "../components/DailyCard";
import { DailyQuest } from "../lib/dailyQuest";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useProfile } from "../hooks/useProfile";
import { useProfileQuests } from "../hooks/useDailies";
import { Profile } from "../lib/profile";
import QuestCheckModal from "../components/QuestCheck";

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

    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>()

    const { profile: profileData } = useProfile(session?.user?.id)

    const { dailyQuests } = useProfileQuests(profile?.id)

    const [checkModalIsOpen, setCheckModalIsOpen] = useState(false)
    const [questToUpdate, setQuestToUpdate] = useState<DailyQuest | null>(null)

    const rewards = {
        xp: 10,
        gold: 10
    }



    // Get User Session Data //
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
          setLoading(false)
        })
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })
    
        return () => {
          listener?.subscription?.unsubscribe()     // cleanup the listener when the compnoent unmounts
        }
    }, [])
    
    
    // ROute to login if needed
    useEffect(() => {
        if (!loading && !session) {
            console.log(loading, session)
            router.replace('../login')
        }
    }, [session])

    // update profile when session updates
    useEffect(() => {
        if (session)
            setProfile(profileData)
    }, [session, profileData])


    // Log dailyQuests when they change
    useEffect(() => {
        if (!dailyQuests) return
           
        const completed = CheckQuestsCompleted(dailyQuests)
        //if (completed) 
            // grant rewards and show feedback
    }, [dailyQuests])

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
            <FlatList 
                style={{ width: '100%', marginTop: 20}}
                data={dailyQuests}
                renderItem={({ item }) => (
                    <>
                        <DailyQuestCard quest={item} setQuest={setQuestToUpdate} openModal={setCheckModalIsOpen}/>
                        <View style={[ styles.horizontalLine, { marginVertical: 35, width: '30%', backgroundColor: COLORS.TEAL }]} />
                    </>
                        
                )}
            />

            <QuestCheckModal 
                session={session} 
                quest={questToUpdate} 
                showModal={checkModalIsOpen} 
                onClose={ () => setCheckModalIsOpen(false) } 
                setLoading={setLoading}
            />

        </SafeAreaView>
    )
}

function CheckQuestsCompleted(quests: DailyQuest[]) {

    var isPassing = true;

    for (let questIndex = 0; questIndex < quests.length; questIndex++) {
        if (quests[questIndex].completed / quests[questIndex].goal < 1) {
            isPassing = false
            break
        }
    }

    return isPassing
}