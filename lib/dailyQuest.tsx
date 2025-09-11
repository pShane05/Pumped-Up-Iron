import { Profile } from "./profile"
import { useDailyQuest, useProfileQuests } from "../hooks/useDailies"
import { supabase } from "./supabase"
import { randomRarity } from "./randomValues"
import { useState } from "react"

export type DailyQuest = {
    id: string,
    userId: string,
    name: string,
    goal: number,
    completed: number,
    is_completed: boolean,
    difficulty: string,
    rarity: string,
    xp: number
}

export async function rerollDailyQuests(profile: Profile) {

    const pastQuests = useProfileQuests(profile.id).dailyQuests
    const [quests, setQuests] = useState<DailyQuest[] | null>(null)

    logCompletedQuests(pastQuests)
    deleteActiveQuests(profile)

    for (let index = 0; index < 4; ++index) {
        const rarity = randomRarity(false)
        const difficulty = "beginner"

        const quest = useDailyQuest(difficulty, rarity).dailyQuest
        const data
    }
        // random rarity

        // difficulty

        //useDailyQuest()
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