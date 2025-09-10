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

export async function updateProfile({ 
    session,
    setLoading,
    updates,
}:  {
    session: Session | null,
    setLoading: (loading: boolean) => void,
    updates: Partial<Profile>
}) {

    try {
        
        if (!session?.user) throw new Error("No user on the session!")

        const updateData = {
            ...updates,
            id: session.user.id,

            updated_at: new Date()
        }

        setLoading(true)

        console.log("Updates going to DB:", updateData)

        const { data, error } = await supabase.
            from("profiles")
            .upsert(updateData, { onConflict: "id" })
            .select()

        console.log("Database operation completed")

        if (error) throw error

        return data?.[0]
        
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    } finally {
        setLoading(false)
    }

}