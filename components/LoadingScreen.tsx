import { SafeAreaView, ActivityIndicator, Image, View } from "react-native";
import { COLORS, styles } from "../app/costants";

export default function LoadingScreen() {

    return (

        <SafeAreaView style={[ styles.container, { justifyContent: "center", alignItems: 'center'}]} >
            <View style={{ height: 200, width: 200, }}>
                <Image 
                style={{ marginTop: 15, resizeMode: 'contain', width: '100%', height: "100%"}} 
                source={require('../assets/images/crownbell-logo.png')}
            />
            </View>
            
            <ActivityIndicator size={'large'} color={ COLORS.SECONDARY} />

        </SafeAreaView>
    )
}