import { Session } from "@supabase/supabase-js";
import { Profile } from "./profile";
import { supabase } from "./supabase";
import { useProfile } from "../hooks/useProfile";


type NotificationHandler = (level: number) => void

let globalNotificaitonHandler: NotificationHandler | null = null

export const setNotificationHandler = (handler: NotificationHandler): void => {
    globalNotificaitonHandler = handler
}


function requireXp(level: number) {

    return (
        Math.floor( 100 + (2 * (level * level)) - ( 2 * level) )
    )

}


export async function giveUserXp(xpGain: number, profile: Profile | null, updateProfile: (item:any) => void ) {

    if (!profile) return


    var currLevel = profile.level
    var xpToNextLvl = requireXp(currLevel)
    var totalXp = profile?.xp + xpGain

    console.log("gain", xpGain)
    console.log("current", profile.xp)
    console.log("total", totalXp)


    // loop when leveling up
    while (totalXp >= xpToNextLvl) {
        ++currLevel
        totalXp -= xpToNextLvl
        xpToNextLvl = requireXp(currLevel)
        console.log(currLevel)
        if (globalNotificaitonHandler)
            globalNotificaitonHandler(currLevel)
    }

    try {
        const { data, error } = await supabase
        .from('profiles')
        .update({ 
            level: currLevel,
            xp: totalXp,
            xp_to_next_lvl: xpToNextLvl
        })
        .eq('id', profile.id)
        .select('gold_count')
        .single()

        if (error) throw error

        updateProfile({ gold_count: data.gold_count})
    } catch (error) {
        console.error('Error giving xp: ', error)
        throw error
    }

    await updateProfile({
        updates: {
            level: currLevel,
            xp: totalXp,
            xp_to_next_lvl: xpToNextLvl
        }
    })

}