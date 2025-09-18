import { Profile } from "./profile"
import { useDailyQuests, useProfileQuests } from "../hooks/useDailies"
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

export async function rerollDailyQuests(session: Session | null, setLoading: (item:any) => void, profile: Profile) {


    const pastQuestsMap = useProfileQuests(profile.id).dailyQuests
    if (pastQuestsMap) {
        const pastQuestsArray = Object.values(pastQuestsMap)
        

        await logPastDailies({
            session,
            setLoading,
            quests: pastQuestsArray
        })
            
        deleteActiveQuests(profile)
    }        

}

export async function logPastDailies({
    session,
    setLoading,
    quests,
}:  {
        session: Session | null,
        setLoading: (loading: boolean) => void,
        quests: DailyQuest[]
    }) {
    
        try {
            setLoading(true)
    
            if (!session?.user) throw new Error("No user on the session!")
    
            const { data, error } = await supabase
                .from("past_dailies")
                .insert(quests)
            console.log ( error )
    
            if (error) throw error
        
        }

        catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
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
                .upsert(updateData, {onConflict: 'id'})
                .eq('id', updates.id)
                .select()
            console.log(data, error)
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