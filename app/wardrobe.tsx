import { SafeAreaView, Text, View, FlatList, Image } from "react-native";
import { COLORS, FONTS, imageMap, styles } from "./costants";
import { Category, CatSelector, ItemSelector } from "./(tabs)/shop";
import { Item } from "../lib/Item";
import { useProfileData } from "../hooks/useProfile";
import { useEffect, useState } from "react";


export default function WardrobeScreen() {

    const { profile, items } = useProfileData()

    const [activeCategory, setActiveCategory] = useState<Category>({name: "All Items", icon_url: "boxes_icon.png"})
    const [filteredItems, setFilteredItems] = useState<Item[] | null>(items)

    function onSelectCategory(cat: Category) {

        const isCatValid = cat.name == "All Items" || cat.name == "Weapons" || cat.name == "Armor" || cat.name == "Cosmetics"

        if(!cat || !isCatValid) {
            throw new Error("Provided category must be one of the 4 options: 'All Items', 'Weapons', 'Armor', 'Cosmetics'. You provided: " + cat.name)
        }

        setActiveCategory(cat)
    }

    const filterItems = (items: Item[] | null) => {

        if (!items) return []
        if (activeCategory.name == "All Items") return items

        return items.filter(item => {
            return item.category === activeCategory.name
        })
    }

    useEffect(() => {
        setFilteredItems(filterItems(items))
    }, [activeCategory])

    

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
                
                <CatSelector category={{ name: "All Items", icon_url: "boxes_icon.png" }} onCategorySelect={ onSelectCategory }/>
                <CatSelector category={{ name: "Weapons", icon_url: "sword_icon.png" }} onCategorySelect={ onSelectCategory }/>
                <CatSelector category={{ name: "Armor", icon_url: "armor_icon.png" }} onCategorySelect={ onSelectCategory }/>
                <CatSelector category={{ name: "Cosmetics", icon_url: "shades_icon.png" }} onCategorySelect={ onSelectCategory }/>
                
            </View>

            <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />

            <View style={{ alignItems: 'center'}}>
                <Text style={{ 
                    color: COLORS.CYAN, fontSize: 28, backgroundColor: 'rgba(0, 0, 0, 0.85)', borderRadius: 25, 
                    paddingHorizontal: 5, marginTop: 10, fontFamily: FONTS.HEADER, textAlign: "center", 
                }}> 
                    { activeCategory.name } 
                </Text>
            </View>

            {
                filteredItems && filteredItems?.length > 0   ?
                    <FlatList 
                        style={{ width: '100%', marginTop: 20 }}
                        contentContainerStyle={{justifyContent: 'space-around', alignItems: 'center', columnGap: 10}}
                        numColumns={3}
                        data={ filterItems(items) }
                        renderItem={({item}) => (
                            <ItemDisplay item={item} />
                        )}
                      
                    />
                :   
                    items && items?.length > 0 ? 
                    
                        <View style={{ flex: 1, paddingTop: 100 }}>
                            <Text style={[ styles.headerText, { alignSelf: 'center', textAlign: 'center' } ]} >
                                No {activeCategory.name} in Wardrobe
                            </Text>
                        </View>
                    :
                        <View style={{ flex: 1, paddingTop: 100 }}>
                            <Text style={[ styles.headerText, { alignSelf: 'center', textAlign: 'center' } ]} >
                                No Items in Wardrobe
                            </Text>
                        </View>

            }

        </SafeAreaView>

        
    )
}