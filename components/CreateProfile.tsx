import { View, Text, Pressable, Alert, TextInput } from "react-native";
import { COLORS, styles } from "../app/costants";
import { useEffect, useState } from "react";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { useWindowDimensions } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useProfile, useProfileData } from "../hooks/useProfile";
import { router } from "expo-router";


export default function CreateProfileCard() {

    const { session, loading, updateProfile } = useProfileData()

    
    const [username, setUsername] = useState('')
    const feet = [...Array(10).keys()].map(i => (i + 1).toString());
    const inches = [...Array(12).keys()].map(i => (i).toString());
    const weights = [...Array(500).keys()].map(i => (i).toString());
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [userHeightFt, setUserHeightFt] = useState<number | undefined>(undefined)
    const [userHeightIn, setUserHeightIn] = useState<number>(0)
    const [userWeight, setUserWeight] = useState<number | undefined>(undefined)

    const { height, width } = useWindowDimensions()
    const wheelHeight = height * 0.12;
    const wheelWidth = width * 0.20;

    function capitalizeFirst(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    async function confirmProfileInfo() {

        if(!userHeightFt || !userWeight) {
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


        try {
            const { data, error } = await supabase
            .from('profiles')
            .upsert({ 
                id: session?.user.id,
                full_name: fullName,
                username: username,
                height_in: fullHeightIn,
                weight_lbs: userWeight,
                date_started: new Date(),
            })
            .single()

            if (error) throw error

            updateProfile({
                full_name: fullName,
                username: username,
                height_in: fullHeightIn,
                weight_lbs: userWeight,
                date_started: new Date(),
            })
        } catch (error) {
            console.error('Error creating profile: ', error)
            throw error
        }

        router.push('../setBirthday')
    }


    return (
        <View style={[ styles.authContainer]}>
            <Text style={ styles.headerText }> Create Account</Text>
            <View style={ styles.horizontalLine } />

            
                <View style={[styles.input, styles.mt25, { marginHorizontal: 20 }]}>
                    <TextInput
                        style={{ color: COLORS.BORDER}}
                        onChangeText={(text) => setUsername(text)}        // Username input
                        value={username}
                        placeholder="Username"
                        autoCapitalize={'none'}
                        placeholderTextColor={ COLORS.LIGHT_GRAY }
                        selectionColor={ COLORS.CYAN }
                        
                    />
                </View>

                <View style={[styles.row, { width: '100%', justifyContent: 'space-between'}]} >   

                    <View style={[styles.smallInput, styles.mt25, { marginLeft: 20 }]}>
                        <TextInput
                            style={{ color: COLORS.BORDER}}
                            onChangeText={(text) => setFirstname(text)}                     // Name input
                            value={firstname}
                            placeholder="First Name"
                            autoCapitalize={'none'}
                            placeholderTextColor={ COLORS.LIGHT_GRAY }
                        />
                    </View>

                    <View style={[styles.smallInput, styles.mt25, {marginRight: 20}]}>
                        <TextInput
                            style={{ color: COLORS.BORDER}}
                            onChangeText={(text) => setLastname(text)}
                            value={lastname}
                            placeholder="Last Name"
                            autoCapitalize={'none'}
                            placeholderTextColor={ COLORS.LIGHT_GRAY }
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

