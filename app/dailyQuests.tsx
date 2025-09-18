import { FlatList, SafeAreaView, Text, View, ActivityIndicatorBase, Alert } from "react-native";
import { BackButton } from "../components/WorkoutComponents";
import { COLORS, FONTS, styles } from "./costants";
import { use, useEffect, useState } from "react";
import DailyQuestCard from "../components/DailyCard";
import { DailyQuest, QuestMap } from "../lib/dailyQuest";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useProfile } from "../hooks/useProfile";
import { useProfileQuests } from "../hooks/useDailies";
import { giveUserGold, Profile } from "../lib/profile";
import QuestCheckModal from "../components/QuestCheck";
import QuestCompleteModal from "../components/QuestCompleteModal";
import { giveUserXp } from "../lib/levels";


export default function DailyQuestScreen() {

    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<Profile | null>()
    const [dailyQuests, setDailyQuests] = useState<QuestMap | null>(null)

    const { profile: profileData } = useProfile(session?.user?.id)

    const { dailyQuests: profileDailyQuests} = useProfileQuests(profile?.id)

    const [isAllDailiesComplete, setIsAllDailiesComplete] = useState(false)
    const [checkModalIsOpen, setCheckModalIsOpen] = useState(false)
    const [completeModalIsOpen, setCompleteModalIsOpen] = useState(true)
    const [questToUpdate, setQuestToUpdate] = useState<DailyQuest | null>(null)
    const [questToDisplay, setQuestToDisplay] = useState<DailyQuest | null>(null)

    const rewards = {
        xp: (profile?.level) ? Math.floor(profile.level / 10) * 8 : -1,
        gold: (profile?.level) ? Math.floor((profile.level) * .25) + 10 : -1
    }

    function onQuestComplete(quest: DailyQuest | null, allQuestsComplete: boolean) {

        if (!profile || !dailyQuests) return
        if (allQuestsComplete) setIsAllDailiesComplete(allQuestsComplete)

        if (!quest  ) {
            Alert.alert("Error displaying completed quest.")
            return
        }

        const xpGain = allQuestsComplete ? quest.xp + rewards.xp: quest.xp
        giveUserXp(xpGain, profile, session, setLoading, setProfile)

        if (allQuestsComplete) 
            giveUserGold(rewards.gold, profile, session, setLoading, setProfile)
        
        setQuestToDisplay(quest)
        setCompleteModalIsOpen(true)
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

    useEffect(() => {
        if (profileDailyQuests)
            setDailyQuests(profileDailyQuests)
    }, [profileDailyQuests])


    // Log dailyQuests when they change
    useEffect(() => {
        if (!dailyQuests) return
           
       // const completed = CheckAllQuestsCompleted(dailyQuests)
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

                <Text style={[ styles.exerciseNameText, { 
                        textAlign: 'center', color: isAllDailiesComplete ? COLORS.GREEN : COLORS.CYAN, marginVertical: 10, fontFamily: FONTS.BODY 
                    }]}>
                    { rewards.xp ? rewards.xp : "[xp]" } xp
                </Text>
                <Text style={{ 
                        textAlign: 'center', color: isAllDailiesComplete ? COLORS.GREEN : '#fffe00', fontFamily: FONTS.BODY 
                    }}>
                    { rewards.gold ? rewards.gold : "[gold]" } gold
                </Text>
                
                <View style={[ styles.horizontalLine, { width: '70%', marginTop: 25,  }]}/>
            </View>

            {
                // Quest cards
            }
            
            <FlatList 
                style={{ width: '100%', marginTop: 20}}
                data={dailyQuests ? Object.values(dailyQuests) : []}
                renderItem={({ item }) => (
                    <>
                        <DailyQuestCard quest={item} setQuest={setQuestToUpdate} openModal={setCheckModalIsOpen}/>
                        <View style={[ styles.horizontalLine, { marginVertical: 35, width: '30%', backgroundColor: COLORS.TEAL }]} />
                    </>
                        
                )}
            />

            <QuestCheckModal 
                session={session} 
                setQuestMap={setDailyQuests}
                quest={questToUpdate} 
                showModal={checkModalIsOpen} 
                onClose={ () => setCheckModalIsOpen(false) } 
                setLoading={setLoading}
                onComplete={ onQuestComplete }
                questMap={dailyQuests}
            />

            <QuestCompleteModal
                quest={ questToDisplay ? questToDisplay : null }
                showModal={completeModalIsOpen}
                onClose={ () => {
                    setCompleteModalIsOpen(false)
                    if (isAllDailiesComplete) router.replace('/')
                }}
                allComplete={ isAllDailiesComplete }
                rewards={rewards}
            />

        </SafeAreaView>
    )
}




