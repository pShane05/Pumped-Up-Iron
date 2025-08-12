import { Pressable, Text, TouchableOpacity, View } from "react-native"
import { useProfile } from "../hooks/useProfile"
import { COLORS, styles } from "../app/costants"
import { Session } from "@supabase/supabase-js"
import { usePlanByProfile } from "../hooks/usePlan"
import React, { useState } from "react"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export function TargetPreview(props: { target: {id: number, name: string}}) {


    return (
        <View style={[ styles.cardView, { backgroundColor: COLORS.TRANSPURPLE, paddingVertical: 20} ]}>

                
            <View style={{ 
                alignItems: 'center',  width: '100%', height: '100%', marginBottom: 10, justifyContent: 'space-around'
            }}>

                <Text style={[ styles.exerciseNameText, { width: '80%'} ]}> { "Choose " + props.target.name.charAt(0).toUpperCase() + props.target.name.slice(1) + " Exercise"} </Text>
                <View style={[ styles.horizontalLine, {width: '20%', alignSelf: 'center'} ]} />

                <Text style={ styles.exerciseText }> reps:  6-8</Text>
            </View>  

            
        </View>
    )
}

