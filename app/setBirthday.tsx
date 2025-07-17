import { View, Text, Pressable, Alert } from "react-native";
import { COLORS, styles } from "./costants"
import { Link, router, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import CreateProfileCard from "../components/CreateProfile";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import BirthdayPicker from "../components/BirthdayPicker";

export default function ProfileScreen() {

    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
          setLoading(false)
        })
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })

        return () => {
          listener?.subscription?.unsubscribe()     // cleanup the listener when the compnoent unmounts
        }
    }, [])

    return (

        <View style={ styles.container}>

            <View style={[styles.boxView, {height: '75%'}]}>
                <BirthdayPicker session={ session } />
            </View>

        </View>
        

    )

}