import { Slot, Stack, router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Session } from "@supabase/supabase-js"
import { ActivityIndicator, View, Text } from "react-native"
import { useFonts } from 'expo-font';

export default function RootLayout() {
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [debugMessage, setDebugMessage] = useState('Initializing...')

    const [fontsLoaded] = useFonts({
        'Electrolize-Regular': require('../assets/fonts/Electrolize/Electrolize-Regular.ttf'),
        'Geo-Regular': require('../assets/fonts/Geo/Geo-Regular.ttf'),
    });
    

    useEffect(() => {
        const loadSession = async () => {
            const { data } = await supabase.auth.getSession()
            const currentSession = data.session
            setSession(currentSession)

            if (!currentSession) {
                setIsLoading(false)
                setTimeout(() => router.replace('/login'), 100)
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('username, dob')
                .eq('id', currentSession.user.id)
                .single()

            if (!profile?.username) {
                setIsLoading(false)
                setTimeout(() => router.replace('/makeProfile'), 100)
            } else if (!profile?.dob) {
                setIsLoading(false)
                setTimeout(() => router.replace('/setBirthday'), 100)

            } else {
                setIsLoading(false)
            }
        }

        loadSession()
    }, [])

    if (isLoading || !fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{ color: '#fff', marginTop: 20 }}>{debugMessage}</Text>
                <StatusBar style="light"/>
            </View>
        )
    }


    return (
        <>
            <StatusBar style="light"/>
            <Stack 
                screenOptions={{ headerShown: false }}
                
            >
                
            </Stack>

        </>
    )
}
