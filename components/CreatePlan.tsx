import { View, Text, Pressable, Alert, TextInput, ScrollView, FlatList } from "react-native";
import { COLORS, FONTS, styles } from "../app/costants";
import { useEffect, useState } from "react";
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import { useWindowDimensions } from "react-native";
import { supabase } from "../lib/supabase";
import {  useProfileData } from "../hooks/useProfile";
import { router } from "expo-router";
import { MultipleSelectList, SelectList } from "react-native-dropdown-select-list";
import { useAllPlans } from "../hooks/usePlan";


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
    {key: '10', value: "Athleticism", summary: "[summary]"},
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

export type Plan = {
    id: number
    name: string
    description: string
    focus: any[]
    days: number
    equipment: string
}

type GradedPlan = {
    plan: Plan
    grade: number
}


function handleConfirm() {


    router.replace('/')

}


export default function CreatePlanCard() {

    const { loading, session, updateProfile } = useProfileData()
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
    const [selectedFocusOne, setSelectedFocusOne] = useState<focusData | null>(null)
    const [selectedFocusTwo, setSelectedFocusTwo] = useState<focusData | null>(null)
    const [selectedGoalDays, setSelectedGoalDays] = useState<number | null>(null)

    const [isInfoComplete, setIsInfoComplete] = useState<boolean>(false)
    const [isInfoPopulated, setIsInfoPopulated] = useState<boolean>(false)

    const plans = useAllPlans().plans
    const [gradedPlans, setGradedPlans] = useState<GradedPlan[]>([])
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

    const [modalVisible, setModalVisible] = useState(false)


    useEffect(() => {
        const complete = (selectedEquipment.length > 0 && selectedFocusOne !== null && selectedFocusTwo !== null)
        console.log(selectedEquipment, selectedFocusOne, selectedFocusTwo, selectedGoalDays)
        setIsInfoComplete(complete)

    }, [selectedEquipment, selectedFocusOne, selectedFocusTwo, selectedGoalDays])

    useEffect(() => {
        console.log(modalVisible)
    }, [modalVisible])

    
    async function confirmPlanInfo() {

        try {
            const { data, error } = await supabase
            .from('user_plan_details')
            .upsert({ 
                user_id: session?.user.id,
                created_at: new Date(),
                workout_plan_id: selectedPlan?.id,
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
                plan_id: selectedPlan?.id,
                level: 1,
                gold_count: 50,
                
            })

        } catch (error) {
            console.error('Error creating plan: ', error)
            throw error
        }

        Alert.alert('Workout Plan Created!')
        router.replace('/')

    }

    function calculateGrade(plan: Plan) {
        if (!selectedGoalDays) return -1
        let grade = 0

        // grade by focus
        plan.focus.forEach(item => {
            console.log(item.name, selectedFocusOne, selectedFocusTwo)
            if(item.name == selectedFocusOne)
                grade += 5

            if (item.name == selectedFocusTwo)
                grade += 2
        })

        // grade by days
        if (plan.days == selectedGoalDays)
            grade += 2
        else if (plan.days - selectedGoalDays < 1 && plan.days - selectedGoalDays > -1)
            grade += 1

        // grade by equipment
        if (!(selectedEquipment.includes(plan.equipment) || plan.equipment == "none" || plan.equipment == "optional"))
            grade = 0
        else if (selectedEquipment.includes(plan.equipment))
            grade += 1

        return grade
    }

    useEffect(() => {
        const updateGradedPlans = async () => {
            if (!plans) return

            const graded = plans
                .map(plan => ({ plan, grade: calculateGrade(plan) }))
                .sort((a, b) => b.grade - a.grade)

            setGradedPlans(graded)
            console.log(graded)
        }

        updateGradedPlans()
    }, [plans, isInfoPopulated])
        


    const { height, width } = useWindowDimensions()
    const wheelHeight = height * 0.12;
    const wheelWidth = width * 0.20;

    const days = [...Array(7).keys()].map(i => (i + 1).toString());

    return (
        
        <View style={{ flex: 1 }}>

        {
            isInfoPopulated ?

            <View style={styles.authContainer}>

                

                <Text style={ styles.headerText }> Select a Plan </Text>
                <View style={ styles.horizontalLine } />

                <ScrollView style={{ flex: 1, width: '100%' }}>

                    <Text style={{ textAlign: 'center', fontSize: 20, color: COLORS.CYAN, fontFamily: FONTS.BODY, marginTop: 20, marginBottom: 10 }}>
                        Recommended
                    </Text>

                    <TopGraded gradedPlans={gradedPlans} setPlan={setSelectedPlan} selectedPlan={ selectedPlan } onConfirm={ confirmPlanInfo }/>

                    <Text style={{ textAlign: 'center', fontSize: 20, color: COLORS.CYAN, fontFamily: FONTS.BODY, marginTop: 20, marginBottom: 10 }}>
                        Other Related Plans
                    </Text>

                    <WellGraded gradedPlans={gradedPlans} setPlan={setSelectedPlan} selectedPlan={ selectedPlan } onConfirm={ confirmPlanInfo }/>

                </ScrollView>

            </View>

            :

            <View style={[ styles.authContainer]}>
                <Text style={ styles.headerText }> Plan Setup </Text>
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
                    onPress={() => setIsInfoPopulated(true)}>
                    <Text style={[ isInfoComplete ? styles.button : styles.buttonDisabled, { fontFamily: 'Electrolize-Regular' }]}> Confirm </Text> 
                </Pressable>


            </View>
        }

        </View>
    )
}

function PlanCard(props: {plan: Plan, setPlan: (item: any) => void, selectedPlan: Plan | null, onConfirm: () => void }) {

    const isSelected = props.selectedPlan == props.plan

    return (
        <Pressable 
            style={[styles.cardView, { flexDirection: 'column', height: 'auto', padding: 20, backgroundColor: isSelected ? COLORS.DARK_GRAY : COLORS.PURPLE }]}
            onPress={ () => {
                
                props.setPlan(props.plan)
                
                
            }}
        >
            <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.HEADER, fontSize: 22, marginBottom: 5}}>
                {props.plan.name}
            </Text>

            <Text style={{ color: COLORS.PINK, fontFamily: FONTS.BODY, fontSize: 14  }}>
                Equipment: <Text style={{ color: COLORS.BORDER }}> {props.plan.equipment} </Text>
            </Text>

            <Text style={{ color: COLORS.PINK, fontFamily: FONTS.BODY, fontSize: 14  }}>
                Days: <Text style={{ color: COLORS.BORDER }}> {props.plan.days} </Text>
            </Text>

            {
                isSelected && (
                    <View>
                        <Text style={{ color: COLORS.PINK, fontFamily: FONTS.BODY, fontSize: 14  }}>
                            Description: <Text style={{ color: COLORS.BORDER }}> {props.plan.description} </Text>
                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: 'space-evenly', marginTop: 20 }}>

                            <Pressable 
                                style={[ styles.altButton ]}
                                onPress={ () => props.setPlan(null) }
                            >
                                <Text style={{ fontFamily: 'Electrolize-Regular' }}>
                                    Close
                                </Text>
                            </Pressable>

                            <Pressable 
                                style={[ styles.button ]}
                                onPress={ props.onConfirm }
                            >
                                <Text style={{ fontFamily: 'Electrolize-Regular' }}>
                                    Select
                                </Text>
                            </Pressable>

                        </View>
                    </View>
                    
                )

            }
        </Pressable>
    )
}

function TopGraded(props: {gradedPlans: GradedPlan[], setPlan: (item: any) => void, selectedPlan: Plan | null, onConfirm: () => void }) {

    const topGraded = props.gradedPlans
        .filter(gp => gp.grade >= 8)
        .map(gp => gp.plan)
        

    return (
        <FlatList 
            style={{ width: '100%' }}
            scrollEnabled={ false }
            data={topGraded}
            renderItem={ ({item}) => (

                <PlanCard plan={item} setPlan={props.setPlan} selectedPlan={ props.selectedPlan} onConfirm={ props.onConfirm } />
            )}
        />
    )
    
}

function WellGraded(props: {gradedPlans: GradedPlan[], setPlan: (item: any) => void, selectedPlan: Plan | null, onConfirm: () => void }) {

    const wellGraded = props.gradedPlans
        .filter(gp => gp.grade < 8 && gp.grade > 4)
        .map(gp => gp.plan)
        

    return (
        <FlatList 
            style={{ width: '100%' }}
            scrollEnabled={ false }
            data={wellGraded}
            renderItem={ ({item}) => (

                <PlanCard plan={item} setPlan={props.setPlan} selectedPlan={ props.selectedPlan} onConfirm={props.onConfirm}/>
            )}
        />
    )
    
}