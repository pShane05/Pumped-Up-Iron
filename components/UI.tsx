import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'

export function GoldCounter() {
    return(
        <View style={ styles.GoldCounter }>
            <Text style={{ fontSize: 20, color: '#FFFE00' }}> { 200 } </Text>
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
})