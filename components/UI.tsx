import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native'
import { COLORS, FONTS } from '../app/costants'
import { useProfile } from '../hooks/useProfile'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import * as Progress from 'react-native-progress';


export function GoldCounter(props: { goldCount: number | undefined }) {

    return(
        <View style={ styles.GoldCounter }>
            <FontAwesome6 name="coins" size={24} color="#fffe00" />
            <Text style={{ fontSize: 20, color: '#FFFE00', fontFamily: FONTS.BODY }}> { props.goldCount } </Text>
        </View>
    )
}

export function XpDisplay(props: { userId: string | undefined }) {
    
    var xpProgress = 0
    const profile = useProfile(props.userId).profile

    if (profile?.xp)
        xpProgress = (profile?.xp / profile.xp_to_next_lvl)

    return (
        <View style={ styles.XpDisplay }> 
        
            <Text style={{ color: COLORS.PINK, fontSize: 20, alignSelf: 'center', marginTop: 20, fontWeight: 'bold', fontFamily: FONTS.BODY}}>
              Lvl. { profile?.level }
            </Text>
        
            <View style={ styles.XpBar }>
                <Progress.Bar 
                    progress={ xpProgress } 
                    width={ null } 
                    height={ 50 } 
                    color= { COLORS.CYAN}
                    borderColor= { COLORS.PURPLE }
                />
                    
            </View>
           

            <Text style={{ color: COLORS.CYAN, fontSize: 18, marginLeft: '10%', marginTop: 10, fontFamily: FONTS.BODY}}>
                Xp: { profile ? (profile?.xp + ' / ' + profile?.xp_to_next_lvl) : '-' }
            </Text>
        
        </View>
    )
}


const styles = StyleSheet.create({
    GoldCounter: {
        flexDirection: 'row',
        columnGap: 5, 
        width: 100,
        position: 'absolute',
        top: 50,
        right: 0,
        zIndex: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.75) ',
        justifyContent: 'flex-start',
        padding: 2
    },
    XpDisplay: {
        height: '20%',
        width: '100%',
        backgroundColor: COLORS.BACKGROUND,
        position: 'absolute',
        bottom: 0,

    },
    XpBar: {
        width: '80%',
        height: '20%',
        borderRadius: '5%',
        borderWidth: 2,
        alignSelf: 'center',
        marginTop: 10,
        overflow: 'hidden',
        borderColor: COLORS.PURPLE
    }
})