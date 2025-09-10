import { Session } from "@supabase/supabase-js";
import { Profile, updateProfile } from "./profile";
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


export async function giveUserXp(xpGain: number, session: Session | null, setLoading: (item: any) => void, setProfile: (item:any) => void ) {

    if (!session) return

    const { profile, loading, error } = useProfile(session.user.id)

    if (!profile) return
    if (error) console.error("Error loading profile: ", error)
    while (loading) {}

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

    setProfile(await updateProfile({
        session,
        setLoading,
        updates: {
            level: currLevel,
            xp: totalXp,
            xp_to_next_lvl: xpToNextLvl
        }
    }))

}