import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { COLORS } from '../app/costants'
import { useProfile } from '../app/hooks/useProfile'

export function GoldCounter(props: { goldCount: number | undefined }) {

    return(
        <View style={ styles.GoldCounter }>
            <Text style={{ fontSize: 20, color: '#FFFE00' }}> { props.goldCount } </Text>
        </View>
    )
}

export function XpDisplay(props: { userId: string | undefined }) {

    const profile = useProfile(props.userId).profile

    return (
        <View style={ styles.XpDisplay }> 
        
            <Text style={{ color: COLORS.PINK, fontSize: 20, alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>
              Lvl. { profile?.level }
            </Text>
        
            <View style={ styles.XpBar } />

            <Text style={{ color: COLORS.CYAN, fontSize: 18, marginLeft: '10%', marginTop: 10}}>
                Xp: { profile?.xp }
            </Text>
        
        </View>
    )
}


const styles = StyleSheet.create({
    GoldCounter: {
        flexDirection: 'row',
        columnGap: 5, 
        width: (Dimensions.get('window').width) * 0.15,
        position: 'absolute',
        top: 50,
        right: 0,
        zIndex: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.75) ',
        justifyContent: 'center'
    },
    XpDisplay: {
        height: '20%',
        width: '100%',
        backgroundColor: COLORS.BACKGROUND_BLUE,
        position: 'absolute',
        bottom: 0,

    },
    XpBar: {
        width: '80%',
        height: '20%',
        backgroundColor: COLORS.BLACK,
        borderRadius: '20%',
        borderWidth: 2,
        borderColor: COLORS.CYAN,
        alignSelf: 'center',
        marginTop: 10
        }
})