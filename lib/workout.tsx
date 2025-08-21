import { Session } from "@supabase/supabase-js"
import { supabase } from "./supabase"
import { Alert } from "react-native"
import { Set } from "./sets"

export type Workout = {
    id: string
    completed: string
    duration_seconds: number
    notes: string
}

export async function logWorkout({
    session,
    setLoading,
    updates,
    sets,
}:  {
        session: Session | null,
        setLoading: (loading: boolean) => void,
        updates: Partial<Workout>
        sets: Set[]
    }) {
    
        try {
            setLoading(true)
    
            if (!session?.user) throw new Error("No user on the session!")
    
            const updateData = {
                ...updates,
                user_id: session.user.id,
                completed_at: new Date(),
                updated_at: new Date()
            }
    
            console.log("Updates going to DB:", updateData)
            const { data, error } = await supabase
                .from("workout_logs")
                .upsert(updateData, { onConflict: "id" })
                .select('id')
                .single()
            console.log ( error )
    
            if (error) throw error

            const workoutLogId = data?.id


            if (sets && sets.length > 0 && workoutLogId) {
            const setsWithWorkoutId = sets.map(set => ({
                ...set,
                workout_log_id: workoutLogId,
                created_at: new Date(),
            }))
            
            const { error: setsError } = await supabase
                .from("exercise_sets")
                .insert(setsWithWorkoutId)
            console.log(setsError)            
            if (setsError) throw setsError
        }

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }