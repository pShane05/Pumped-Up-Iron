import { Session } from "@supabase/supabase-js"
import { supabase } from "./supabase"
import { Alert } from "react-native"


export type Profile = {
  id: string
  username: string
  full_name: string
  dob: Date
  avatar_url: string
  level: number
  xp: number
  xp_to_next_lvl: number
  gold_count: number
  height_in: number
  weight_lbs: number
  plan_id: number
  plan_day: number
  date_started: Date
}



export async function giveUserGold(goldGain: number, profile: Profile | null, userId: string, updateProfile: (updates: Partial<Profile>) => void) {

    if (!profile) return

    var totalGold = profile?.gold_count + goldGain

    console.log("gain", goldGain)
    console.log("current", profile.gold_count)
    console.log("total", totalGold)

    try {
        const { data, error } = await supabase
        .from('profiles')
        .update({ 
            gold_count: totalGold
        })
        .eq('id', userId)
        .select('gold_count')
        .single()

        if (error) throw error

        updateProfile({ gold_count: data.gold_count})
    } catch (error) {
        console.error('Error giving gold: ', error)
        throw error
    }
}