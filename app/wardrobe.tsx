import { SafeAreaView, Text, View, FlatList, Image } from "react-native";
import { COLORS, FONTS, imageMap, styles } from "./costants";
import { CatSelector, ItemSelector } from "./(tabs)/shop";
import { Item } from "../lib/Item";
import { useProfileData } from "../hooks/useProfile";


export default function WardrobeScreen() {

    const { profile, items } = useProfileData()

    function ItemDisplay(props: {item: Item}) {

        return (
            <View style={ styles.ItemSelector }>
                <View style={{ alignSelf: 'center', width: 50, height: 50, }}>
                    <Image style={{ resizeMode: 'contain', width: '100%', height: '100%',}} source={ imageMap[props.item.icon_url] }/>
                </View>
        
                <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY, fontSize: 10, textAlign: 'center', }}>
                {props.item.name}
                </Text>
        
            </View>
        )
    }

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

            {
                items && items?.length > 0   ?
                    <FlatList 
                        style={{ width: '100%', marginTop: 20 }}
                        contentContainerStyle={{justifyContent: 'space-around', alignItems: 'center', columnGap: 10}}
                        numColumns={3}
                        data={ items }
                        renderItem={({item}) => (
                            <ItemDisplay item={item} />
                        )}
                      
                    />
                :
                    
                    <Text style={[ styles.headerText, { alignSelf: 'center', textAlign: 'center' } ]} >
                        No Items in Wardrobe
                    </Text>

            }

        </SafeAreaView>

        
    )
}