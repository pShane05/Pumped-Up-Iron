import { Profile } from "./profile"
import { useDailyQuest, useProfileQuests } from "../hooks/useDailies"
import { supabase } from "./supabase"
import { randomRarity } from "./randomValues"
import { useState } from "react"
import { Session } from "@supabase/supabase-js"
import { Alert } from "react-native"

export type DailyQuest = {
    id: number,
    userId: string,
    name: string,
    goal: number,
    completed: number,
    is_completed: boolean,
    completed_at: Date,
    difficulty: string,
    rarity: string,
    xp: number
}

export type QuestMap = {
    [id: number]: DailyQuest
}

export async function rerollDailyQuests(profile: Profile) {

    /*
    const pastQuests = useProfileQuests(profile.id).questMap
    const [quests, setQuests] = useState<DailyQuest[] | null>(null)

    logCompletedQuests(pastQuests)
    deleteActiveQuests(profile)

    for (let index = 0; index < 4; ++index) {
        const rarity = randomRarity(false)
        const difficulty = "beginner"

        const quest = useDailyQuest(difficulty, rarity).dailyQuest
        //const data
    }
        // random rarity

        // difficulty

        //useDailyQuest()
        */
}

function logCompletedQuests(quests: DailyQuest[] | null) {

    if (!quests) return

}

async function deleteActiveQuests(profile: Profile) {

    if (!profile) {
        console.log("No profile found")
        return
    }

    const { error } = await supabase
        .from('active_dailies')
        .delete()
        .eq('user_id', profile.id)

    return error
}

export async function updateActiveDailies({
    session,
    setLoading,
    updates,
}:  {
        session: Session | null,
        setLoading: (loading: boolean) => void,
        updates: Partial<DailyQuest>
    }) {

        try {
            setLoading(true)
            console.log("enter update")
    
            if (!session?.user) throw new Error("No user on the session!")

            const updateData = {
                    ...updates
                }

            const { data, error } = await supabase
                .from('active_dailies')
                .update(updateData)
                .eq('id', updates.id)
                .select()
                
            if (error) throw error

            console.log("Data: ", data)
            return { data, error }

        }
        catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
        
    }