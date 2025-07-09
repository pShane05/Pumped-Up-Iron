import { Session } from "@supabase/supabase-js"
import { useState } from "react"
import { supabase } from "./supabase"
import { Alert } from "react-native"

const [loading, setLoading] = useState(true)
const [session, setSession] = useState<Session | null>(null)

export type Profile = {
  id: string
  username: string
  avatar_url: string
  level: number
}

async function updateProfile({ 
    username,
    avatar_url,
    level,

}:  {
    username: string,
    avatar_url: string,
    level: number,
})  {

    try {
        setLoading(true)

        if (!session?.user) throw new Error("No user on the session!")

        const updates = {
            id: session.user.id,
            username,
            avatar_url,
            level,
            updated_at: new Date()
        }

        const { error }= await supabase.from("profiles").upsert(updates)

        if (error) throw error
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message)
        }
    } finally {
        setLoading(false)
    }
}