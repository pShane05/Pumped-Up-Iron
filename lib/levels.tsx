import { Session } from "@supabase/supabase-js";
import { Profile, updateProfile } from "./profile";


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


export async function giveUserXp(xpGain: number, session: Session | null, profile: Profile, setLoading: (item: any) => void ) {

    if (!session || !profile) return

    var currLevel = profile.level
    var xpToNextLvl = requireXp(currLevel)
    var userXp = profile?.xp + xpGain

    console.log("gain", xpGain)
    console.log("current", profile.xp)
    console.log("total", userXp)


    // loop when leveling up
    while (userXp >= xpToNextLvl) {
        ++currLevel
        userXp -= xpToNextLvl
        xpToNextLvl = requireXp(currLevel)
        console.log(currLevel)
        if (globalNotificaitonHandler)
            globalNotificaitonHandler(currLevel)
    }

    await updateProfile({
        session,
        setLoading,
        updates: {
            level: currLevel,
            xp: userXp,
            xp_to_next_lvl: xpToNextLvl
        }
    })

}