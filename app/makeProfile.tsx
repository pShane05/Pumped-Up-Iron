import { View, Text, Pressable, Alert, SafeAreaView } from "react-native";
import { COLORS, styles } from "./costants"
import { Link, router, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import CreateProfileCard from "../components/CreateProfile";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useProfileData } from "../hooks/useProfile";

export default function ProfileScreen() {

    const { session, signOut } = useProfileData()
    const router = useRouter()


    return (

        <SafeAreaView style={[ styles.container, { justifyContent: 'center'}]}>

            <View style={[styles.boxView, {height: 600}]}>
                <CreateProfileCard session={ session }/>
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