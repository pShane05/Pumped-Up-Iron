import { FlatList, SafeAreaView, Text, View, ActivityIndicatorBase, Alert } from "react-native";
import { BackButton } from "../components/WorkoutComponents";
import { COLORS, FONTS, styles } from "./costants";
import { use, useEffect, useState } from "react";
import DailyQuestCard from "../components/DailyCard";
import { DailyQuest, QuestMap } from "../lib/dailyQuest";
import { getDailyQuests, supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useProfile, useProfileData } from "../hooks/useProfile";
import { useProfileQuests } from "../hooks/useDailies";
import { giveUserGold, Profile } from "../lib/profile";
import QuestCheckModal from "../components/QuestCheck";
import QuestCompleteModal from "../components/QuestCompleteModal";
import { giveUserXp } from "../lib/levels";


export default function DailyQuestScreen() {

    const { session, setSession, loading, setLoading, profile, dailyQuests, setDailyQuests, updateProfile} = useProfileData()
    const [error, setError] = useState(null)
    

    const [questArray, setQuestArray] = useState<DailyQuest[] | null>(null)


    const [isAllDailiesComplete, setIsAllDailiesComplete] = useState(false)
    const [checkModalIsOpen, setCheckModalIsOpen] = useState(false)
    const [completeModalIsOpen, setCompleteModalIsOpen] = useState(true)
    const [questToUpdate, setQuestToUpdate] = useState<DailyQuest | null>(null)
    const [questToDisplay, setQuestToDisplay] = useState<DailyQuest | null>(null)

    const rewards = {
        xp: (profile?.level) ? Math.floor(profile.level * 10) / 2 : -1,
        gold: (profile?.level) ? Math.floor((profile.level) * .25) + 10 : -1
    }

      console.log(rewards)

    function onQuestComplete(quest: DailyQuest | null, allQuestsComplete: boolean) {

        if (!profile || !dailyQuests) return
        if (allQuestsComplete) setIsAllDailiesComplete(allQuestsComplete)

        if (!quest  ) {
            Alert.alert("Error displaying completed quest.")
            return
        }

        const xpGain = allQuestsComplete ? quest.xp + rewards.xp: quest.xp
        giveUserXp(xpGain, profile, profile.id, updateProfile)

        if (allQuestsComplete) 
            giveUserGold(rewards.gold, profile, profile.id, updateProfile)
        
        setQuestToDisplay(quest)
        setCompleteModalIsOpen(true)
    }

    const loadDailyQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const questData = await getDailyQuests();
      setQuestArray(questData.quests || []);

      questArray?.forEach(quest => {

        setDailyQuests(prev => {
            return {
                ...prev,
                [quest.id]: quest
            }
        })
      })

      console.log("Daily Quests: ", dailyQuests)
      
      if (questData.is_new) {
        console.log('🎉 New daily quests generated!');
        // Maybe show a notification or animation
      }
      
    } catch (err) {
      throw(err)
    } finally {
      setLoading(false);
    }
  };


    // Load daily quests from supabase
    useEffect(() => {
        
        loadDailyQuests()           
        console.log(dailyQuests)
    }, [])


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
                    Completion Rewards:
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




