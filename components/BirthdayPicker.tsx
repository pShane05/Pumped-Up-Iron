import { useState } from "react"
import { View, Text, Pressable, Alert, Platform } from "react-native"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { COLORS, styles } from "../app/costants"
import { router } from "expo-router"
import { useProfileData } from "../hooks/useProfile"


export default function BirthdayPicker() {

    const { updateProfile } = useProfileData()
    const [updated, setUpdated] = useState(false)

    const [userBirthday, setUserBirthday] = useState<Date | undefined>(new Date())


    async function confirmBirthday() {
        
        if (!userBirthday) {
            Alert.alert("Please set a birth date")
            return
        }

        await updateProfile({
            dob: userBirthday
        })

        router.replace('/makePlan')
    }

    return (
        <View style={ styles.authContainer }>
            <Text style={{ color: COLORS.TEAL, fontSize: 16, fontWeight: 'bold'}}> Create Account</Text>
            <View style={ styles.horizontalLine } />

            <Text style={{ fontSize: 20, color: COLORS.TEAL, alignSelf: 'center', marginTop: 75}}> Enter your Birthday </Text>
            <View style={{ marginTop: 10, alignContent: 'center'}}>

                <RNDateTimePicker 
                    value={ userBirthday || new Date() } 
                    display={Platform.OS === 'ios' ? "spinner"  : 'default'}
                    textColor= {COLORS.TEAL} 
                    
                    onChange={( event, date ) => {
                        if (Platform.OS === 'android') {
                            setUserBirthday(date)
                            setUpdated(true)
                            confirmBirthday()
                        }

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
