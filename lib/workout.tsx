import { Session } from "@supabase/supabase-js"
import { supabase } from "./supabase"
import { Alert } from "react-native"

export type Workout = {
    id: string
    userId: string
    completed: string
    duration: number
    notes: string
}

export async function logWorkout({
    session,
    setLoading,
    updates,
}:  {
        session: Session | null,
        setLoading: (loading: boolean) => void,
        updates: Partial<Workout>
    }) {
    
        try {
            setLoading(true)
    
            if (!session?.user) throw new Error("No user on the session!")
    
            const updateData = {
                ...updates,
                userId: session.user.id,
                completed_at: new Date(),
                updated_at: new Date()
            }
    
            console.log("Updates going to DB:", updateData)
            const { error }= await supabase.from("workout_logs").upsert(updateData, { onConflict: "id" })
            console.log ( error )
    
            if (error) throw error
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }