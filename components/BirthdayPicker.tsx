import { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { View, Text, Pressable, Alert } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { COLORS, styles } from "../app/costants"
import { NavigatorContext } from "expo-router/build/views/Navigator"
import { updateProfile } from "../lib/profile"
import { router } from "expo-router"


export default function BirthdayPicker(props: {session: Session | null }) {

    const [session, setSession] = useState<Session | null>(props.session)
    const [loading, setLoading] = useState(false)
    const [updated, setUpdated] = useState(false)

    const [userBirthday, setUserBirthday] = useState<Date | undefined>(new Date())

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

    async function confirmBirthday() {
        
        if (!userBirthday) {
            Alert.alert("Please set a birth date")
            return
        }

        await updateProfile({
            session,
            setLoading,
            updates: {
                dob: userBirthday
            }
         })

         router.replace('/')
    }

    return (
        <View style={ styles.authContainer }>
            <Text style={{ color: COLORS.TEAL, fontSize: 16, fontWeight: 'bold'}}> Create Account</Text>
            <View style={ styles.horizontalLine } />

            <Text style={{ fontSize: 20, color: COLORS.TEAL, alignSelf: 'center', marginTop: 75}}> Enter your Birthday </Text>
            <View style={{ marginTop: 10, alignContent: 'center'}}>
                <RNDateTimePicker 
                    value={ userBirthday } 
                    display="spinner" 
                    textColor= {COLORS.TEAL} 
                    
                    onChange={( event, date ) => {
                        setUserBirthday(date)
                        setUpdated(true)
                    }}
                />
            </View>

            <Pressable style={{ marginTop: 40, position: 'absolute', bottom: 20, alignSelf: 'center'}} disabled={!updated} onPress={() => confirmBirthday()}>
                <Text style={[ styles.button]}> Confirm </Text> 
            </Pressable>
        </View>
    )
}
