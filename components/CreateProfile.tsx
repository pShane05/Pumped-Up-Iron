import { View, Text, Pressable, Alert, TextInput } from "react-native";
import { COLORS, styles } from "../app/costants";
import { useEffect, useState } from "react";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { useWindowDimensions } from "react-native";
import { updateProfile } from "../lib/profile";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useProfile } from "../hooks/useProfile";
import { router } from "expo-router";


export default function CreateProfileCard(props: {session: Session | null}) {

    const [session, setSession] = useState<Session | null>(props.session)
    const [loading, setLoading] = useState(false)

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

    
    const [username, setUsername] = useState('')
    const feet = [...Array(10).keys()].map(i => (i + 1).toString());
    const inches = [...Array(12).keys()].map(i => (i).toString());
    const weights = [...Array(500).keys()].map(i => (i).toString());
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [userHeightFt, setUserHeightFt] = useState<number | undefined>(undefined)
    const [userHeightIn, setUserHeightIn] = useState<number | undefined>(undefined)
    const [userWeight, setUserWeight] = useState<number | undefined>(undefined)

    const { height, width } = useWindowDimensions()
    const wheelHeight = height * 0.12;
    const wheelWidth = width * 0.20;

    function capitalizeFirst(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    async function confirmProfileInfo() {

        if(!userHeightIn || !userHeightFt || !userWeight) {
            Alert.alert("Please fill out all fields to continue")
            return
        }
        if (!firstname || !lastname ) {
            Alert.alert("No name entered")
            return
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .limit(1)
        
        if (error) {
            console.error('Error checking username:', error.message);
            return false; // or handle error as needed
        }
        if ( data.length !> 0) {
            Alert.alert("Username already taken, please try another")
            return
        }
            

        const fullHeightIn = (userHeightIn + (userHeightFt * 12))
        const capFirstName = capitalizeFirst(firstname)
        const capLastName = capitalizeFirst(lastname)

        const fullName = capFirstName + ' ' + capLastName;

        await updateProfile({
            session,
            setLoading,
            updates: {
                full_name: fullName,
                username: username,
                height_in: fullHeightIn,
                weight_lbs: userWeight,
                date_started: new Date(),
            }
        })

        router.push('../setBirthday')
    }


    return (
        <View style={[ styles.authContainer]}>
            <Text style={ styles.headerText }> Create Account</Text>
            <View style={ styles.horizontalLine } />

            
                <View style={[styles.input, styles.mt25, { marginHorizontal: 20 }]}>
                    <TextInput
                        onChangeText={(text) => setUsername(text)}        // Username input
                        value={username}
                        placeholder="Username"
                        autoCapitalize={'none'}
                    />
                </View>

                <View style={[styles.row, { width: '100%', justifyContent: 'space-between'}]} >   

                    <View style={[styles.smallInput, styles.mt25, { marginLeft: 20 }]}>
                        <TextInput
                            onChangeText={(text) => setFirstname(text)}                     // Name input
                            value={firstname}
                            placeholder="First Name"
                            autoCapitalize={'none'}
                        />
                    </View>

                    <View style={[styles.smallInput, styles.mt25, {marginRight: 20}]}>
                        <TextInput
                            onChangeText={(text) => setLastname(text)}
                            value={lastname}
                            placeholder="Last Name"
                            autoCapitalize={'none'}
                        />
                    </View>

                </View>

                
                <Text style={{ color: COLORS.TEAL, marginLeft: 20, fontSize: 20 ,marginTop: 25, alignSelf: 'flex-start', fontFamily: 'Electrolize-Regular'}}> Height: </Text>

                <View style={[ 
                    styles.row, {height: '16%', width: '100%', justifyContent: 'flex-start', marginTop: 8, columnGap: 20,} ]} 
                    >

                    <View style={{ flexDirection: 'column', width: wheelWidth, marginLeft: 20 }} >

                        <Text style={{ color: COLORS.TEAL, fontFamily: 'Electrolize-Regular'}}> Ft </Text>
                        <View style={[styles.scrollWheel, { height: 65, width: '100%', marginTop: 5 }]}>
                            <WheelPickerExpo
                                height={ 150 }
                                width={ 75 }
                                initialSelectedIndex={0}   
                                haptics={ true }              
                                backgroundColor={ COLORS.BACKGROUND}           
                                items={feet.map(n => ({ label: n, value: n }))}

                                onChange={({ index }) => setUserHeightFt(index + 1)}
                            />  
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', width: wheelWidth}} >

                        <Text style={{ color: COLORS.TEAL, fontFamily: 'Electrolize-Regular'}}> In </Text>
                        <View style={[styles.scrollWheel, { height: 65, width: '100%', marginTop: 5}]}>
                            <WheelPickerExpo
                                height={ 150 }
                                width={ 75 }
                                initialSelectedIndex={0}
                                haptics= {true}
                                backgroundColor={ COLORS.BACKGROUND}    
                                items={inches.map(n => ({ label: n, value: n }))}

                                onChange={({ index }) => setUserHeightIn(index)}
                            />  
                        </View>
                    </View>
                </View>
                
                <View style={{ height: '16%', width: '100%', marginTop: 25, justifyContent: 'flex-start'}}>
                    <Text style={{ marginLeft: 20, color: COLORS.TEAL, fontSize: 20, fontFamily: 'Electrolize-Regular' }}> Weight </Text>
                    <View style={[styles.scrollWheel, { height: 65, width: wheelWidth, marginTop: 5, marginLeft: 20}]}>
                        {weights.length > 0 && (
                        <WheelPickerExpo
                            height={ 150 }
                            width={ 75 }
                            initialSelectedIndex={200}
                            haptics={ true}
                            backgroundColor={ COLORS.BACKGROUND}    
                            items={weights.map(n => ({ label: n, value: n }))}

                            onChange={({ index }) => setUserWeight(index)}
                        /> 
                        )}
                    </View>
                </View>

                <Pressable style={{ marginTop: 40, position: 'absolute', bottom: 20, alignSelf: 'center'}} disabled={loading} onPress={() => confirmProfileInfo()}>
                    <Text style={[ styles.button, { fontFamily: 'Electrolize-Regular' }]}> Confirm </Text> 
                </Pressable>

            </View>

    )
}

