import { View, Text, Pressable, Alert, TextInput, ScrollView } from "react-native";
import { COLORS, FONTS, styles } from "../app/costants";
import { useEffect, useState } from "react";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { useWindowDimensions } from "react-native";
import { supabase } from "../lib/supabase";
import { useProfile, useProfileData } from "../hooks/useProfile";
import { router } from "expo-router";
import { MultipleSelectList, SelectList } from "react-native-dropdown-select-list";

type focusData = {
    key: string
    value: string
    summary: string
}

type equipmentData = {
    key: string
    value: string
}

export const focusList: focusData[] = [
    {key: '1', value: "Strength", summary: "[summary]"},
    {key: '2', value: "Body Building", summary: "[summary]"},
    {key: '3', value: "Endurance", summary: "[summary]"},
    {key: '4', value: "Weight Loss", summary: "[summary]"},
    {key: '5', value: "Calisthenics", summary: "[summary]"},
    {key: '6', value: "Speed", summary: "[summary]"},
    {key: '7', value: "Distance Running", summary: "[summary]"},
    {key: '8', value: "Jump Height", summary: "[summary]"},
    {key: '9', value: "Calisthenics", summary: "[summary]"},
]

export const equipmentList: equipmentData[] = [
    {key: '1', value: "full gym"},
    {key: '2', value: "none"},
    {key: '3', value: "barbell"},
    {key: '4', value: "dumbbells"},
    {key: '5', value: "cables"},
    {key: '6', value: "cable rope"},
    {key: '7', value: "pull up bar"},
    {key: '8', value: "dip bar"},
    {key: '9', value: "row machine"},
    {key: '10', value: "leg press"},
    {key: '11', value: "seated calf raises"},
    {key: '12', value: "leg curl"},
    {key: '13', value: "leg extension"},
    {key: '14', value: "plate"},
    {key: '15', value: "kettlebell"},
]

export default function CreatePlanCard() {

    const { loading, session, updateProfile } = useProfileData()
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
    const [selectedFocusOne, setSelectedFocusOne] = useState<focusData | null>(null)
    const [selectedFocusTwo, setSelectedFocusTwo] = useState<focusData | null>(null)
    const [selectedGoalDays, setSelectedGoalDays] = useState<number | null>(null)

    const [isInfoComplete, setIsInfoComplete] = useState<boolean>(false)

    useEffect(() => {
        const complete = (selectedEquipment.length > 0 && selectedFocusOne !== null && selectedFocusTwo !== null)
        console.log(selectedEquipment, selectedFocusOne, selectedFocusTwo, selectedGoalDays)
        setIsInfoComplete(complete)

    }, [selectedEquipment, selectedFocusOne, selectedFocusTwo, selectedGoalDays])

    
    async function confirmPlanInfo() {

        try {
            const { data, error } = await supabase
            .from('user_plan_details')
            .upsert({ 
                user_id: session?.user.id,
                created_at: new Date(),
                workout_plan_id: 1,
                equipment: selectedEquipment,
                workouts_per_week: selectedGoalDays,
                primary_focus: selectedFocusOne,
                secondary_focus: selectedFocusTwo
            },
            { 
                onConflict: 'user_id' 
            })
            
            .single()

            if (error) throw error

            updateProfile({
                plan_id: 1
            })

        } catch (error) {
            console.error('Error creating plan: ', error)
            throw error
        }

        router.push('/')

    }

    async function assignPlan() {

    }

    const { height, width } = useWindowDimensions()
    const wheelHeight = height * 0.12;
    const wheelWidth = width * 0.20;

    const days = [...Array(7).keys()].map(i => (i + 1).toString());

    return (
        <View style={[ styles.authContainer]}>
            <Text style={ styles.headerText }> Create Plan</Text>
            <View style={ styles.horizontalLine } />
            
            <ScrollView style={{width: '100%', padding: 20, marginBottom: 75 }} nestedScrollEnabled={true}>


                <Text 
                    style={[styles.headerText, { fontSize: 24, color: COLORS.CYAN, marginBottom: 10, }]}
                > 
                    How many days to you want to workout each week?
                </Text>

                <View style={{ flexDirection: 'column', width: wheelWidth, alignSelf: 'center' }} >

                    <View style={[styles.scrollWheel, { height: 65, width: '100%', marginTop: 5 }]}>
                        <WheelPickerExpo
                            height={ 150 }
                            width={ 75 }
                            initialSelectedIndex={3}   
                            haptics={ true }              
                            backgroundColor={ COLORS.BACKGROUND}           
                            items={days.map(n => ({ label: n, value: n }))}

                            onChange={({ index }) => setSelectedGoalDays(index + 1)}
                        />  
                    </View>
                </View>



                <Text 
                    style={[styles.headerText, { fontSize: 24, color: COLORS.CYAN, marginBottom: 10, marginTop: 25 }]}
                > 
                    What is your primary focus?
                </Text>

                <SelectList
                    setSelected={(val: any) => setSelectedFocusOne(val)}
                    data={focusList}
                    notFoundText="No Matching Focus Found"
                    placeholder="Select Primary Focus"
                    fontFamily={FONTS.BODY}
                    boxStyles={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.CYAN}}
                    inputStyles={{color: COLORS.BORDER,}}
                    dropdownTextStyles={{color: COLORS.BORDER}}
                    dropdownStyles={{ borderColor: COLORS.BORDER }}
                    maxHeight={200}
                    save="value"
                />

                <Text 
                    style={[styles.headerText, { fontSize: 24, color: COLORS.CYAN, marginBottom: 10, marginTop: 25 }]}
                > 
                    What is your secondary focus
                </Text>

                <SelectList
                    setSelected={(val: any) => setSelectedFocusTwo(val)}
                    data={focusList}
                    notFoundText="No Matching Focus Found"
                    placeholder="Select Secondary Focus"
                    fontFamily={FONTS.BODY}
                    boxStyles={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.CYAN}}
                    inputStyles={{color: COLORS.BORDER,}}
                    dropdownTextStyles={{color: COLORS.BORDER}}
                    dropdownStyles={{ borderColor: COLORS.BORDER }}
                    maxHeight={200}
                    save="value"
                />

                <Text 
                    style={[styles.headerText, { fontSize: 24, color: COLORS.CYAN, marginBottom: 10, marginTop: 25 }]}
                > 
                    Select all available equipment
                </Text>


                <MultipleSelectList
                    
                    setSelected={(val: any) => setSelectedEquipment(val)}
                    data={equipmentList}
                    label="Equipment:"
                    save="value"
                    notFoundText="No Matching Equipment Found"
                    placeholder="Select Equipment"
                    fontFamily={FONTS.BODY}
                    boxStyles={{ borderColor: COLORS.BORDER, backgroundColor: COLORS.CYAN}}
                    inputStyles={{color: COLORS.BORDER,}}
                    dropdownTextStyles={{color: COLORS.BORDER}}
                    dropdownStyles={{ borderColor: COLORS.BORDER }}
                    maxHeight={300}
                    badgeStyles={{ backgroundColor: COLORS.DARK_PURPLE }}
                    labelStyles={{ color: COLORS.BORDER}}
                    checkBoxStyles={{ backgroundColor: COLORS.PINK}}
                />
                <View style={{ height: 50 }}/>
            </ScrollView>

            <Pressable 
                style={{ marginTop: 40, position: 'absolute', bottom: 20, alignSelf: 'center'}} 
                disabled={loading || !isInfoComplete } 
                onPress={() => confirmPlanInfo()}>
                <Text style={[ isInfoComplete ? styles.button : styles.buttonDisabled, { fontFamily: 'Electrolize-Regular' }]}> Confirm </Text> 
            </Pressable>

        </View>

    )
}

