import { Pressable, Text } from "react-native"
import { useProfile } from "../hooks/useProfile"
import { styles } from "../app/costants"
import { Session } from "@supabase/supabase-js"
import { getPlanByProfile } from "../hooks/usePlan"
import { useState } from "react"


export function StartWorkoutButton() {

    const [session, setSession] = useState<Session | null>(null)

    return (
        <Pressable 
            style={[ styles.button, { marginTop: 15}]}
            onPress={() => {
                
                const profile = useProfile(session?.user.id).profile    
                if (!profile) return

                const plan = getPlanByProfile(profile).plan
                if (!plan) return

                const nextDay = (profile?.plan_day % plan?.days) + 1;
                
                console.log(nextDay)
                
                }}
        >
            <Text style={{ fontSize: 20,}}>
                Start Workout
            </Text>
        </Pressable>
    )
}