import { SafeAreaView, Text, View } from "react-native";
import { COLORS, styles } from "./costants";
import { CatSelector } from "./(tabs)/shop";


export default function WardrobeScreen() {

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: COLORS.BACKGROUND_BROWN }]}>

            <Text style={[ styles.headerText, { fontSize: 40, textAlign: 'center', marginTop: 20 }]}>
                Wardrobe
            </Text>

            <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 25, marginTop: 20}}>
                
                <CatSelector />
                <CatSelector />
                <CatSelector />
                <CatSelector />
                
            </View>

            <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />
        </SafeAreaView>
    )
}