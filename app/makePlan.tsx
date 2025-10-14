import { View, Text, Pressable, Alert, SafeAreaView } from "react-native";
import { COLORS, styles } from "./costants"
import { useRouter } from "expo-router";
import CreateProfileCard from "../components/CreateProfile";
import { useProfileData } from "../hooks/useProfile";
import CreatePlanCard from "../components/CreatePlan";

export default function PlanScreen() {

    const { session, signOut } = useProfileData()
    const router = useRouter()
    console.log("Make plan")

    return (

        <SafeAreaView style={[ styles.container, { justifyContent: 'center'}]}>

            <View style={[styles.boxView, {height: 600}]}>
                <CreatePlanCard />
            </View>

            <Pressable style={[  {  alignSelf: 'center', position: 'absolute', bottom: 50}]} 
                onPress={ async () => {
                    await signOut()
                    router.replace('../signup')
                }
            }> 
                <Text style={{ color: COLORS.PINK, fontSize: 16, fontFamily: 'Electrolize-Regular'}}> Back to Signup </Text>
            </Pressable>
        </SafeAreaView>
        
        
    )

}