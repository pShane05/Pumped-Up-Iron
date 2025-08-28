import { SafeAreaView, View, Text, Pressable } from "react-native"
import { Profile } from "../lib/profile"
import { COLORS, styles } from "../app/costants"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { cloneElement } from "react";
import ProfileScreen from "../app/makeProfile";
import { router } from "expo-router";


export default function VictoryScreen(
    props: {
        rewards: {
            xp: number,
            gold: number
        },
        title: string | undefined,
        profile: Profile | undefined,
        showVictory: boolean,
        onClose: (item: any) => void
    }
) {

    if (!props.title || !props.profile || !props.showVictory) return

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: COLORS.DARK_PURPLE, alignContent: 'center', justifyContent: 'center' } ]}>
            <View style={{ rowGap: 20, marginHorizontal: 40}}>

                <View style={{ alignSelf: 'center'}}>
                    <FontAwesome5 name="trophy" size={80} color="#fffe00" />
                </View>

                <Text style={{ textAlign: 'center', fontSize: 30, color: "#fffe00", fontFamily: 'Geo-Regular' }}>
                    Completed { props.title }!
                </Text>

                <Text style={{ textAlign: 'center', fontSize: 20, color: COLORS.BORDER, fontFamily: 'Electrolize-Regular' }}>
                    You gained: {
                        '\n\n' + props.rewards.xp + " xp\n"}
                        <Text style={{ color: "#fffe00"}}> {props.rewards.gold} gold </Text>
                    
                </Text>

                <Pressable 
                    style={[ styles.button, { marginTop: 20 }]}
                    onPress={ () => {
                        props.onClose(false)
                        router.replace('/')
                    }}
                >
                    <Text style={{ fontSize: 20, fontFamily: 'Electrolize-Regular'}}>
                        Claim
                    </Text>
                </Pressable>

            </View>
        </SafeAreaView>
    )
}