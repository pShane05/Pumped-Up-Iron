import { Stack, router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Session } from "@supabase/supabase-js"
import { ActivityIndicator, View } from "react-native"

export default function RootLayout() {
    const [session, setSession] = useState<Session | null>(null)
    const [profileComplete, setProfileComplete] = useState<boolean | null>(null)

    useEffect(() => {
        const loadSession = async () => {
            const { data } = await supabase.auth.getSession()
            const currentSession = data.session
            setSession(currentSession)

            if (!currentSession) {
                router.replace('/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('username, dob')
                .eq('id', currentSession.user.id)
                .single()

            if (!profile?.username) {
                console.log(profile?.username)
                router.replace('/makeProfile')

            } else if (!profile?.dob) {
                router.replace('/setBirthday')

            } else {
                setProfileComplete(true)
            }
        }

        loadSession()
    }, [])

   

    return (
        <>
            <StatusBar style="light"/>
            <Stack screenOptions={{ headerShown: false }}>
            
            </Stack>
        </>
    )
}