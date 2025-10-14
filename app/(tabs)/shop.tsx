import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, View, Text, Alert, Dimensions, ActivityIndicator, SafeAreaView, FlatList } from 'react-native'
import { COLORS, FONTS, imageMap, styles } from '../costants'
import { GoldCounter } from '../../components/UI'
import { useProfileData } from '../../hooks/useProfile'
import LoadingScreen from '../../components/LoadingScreen'
import { WeeklyCountdown } from '../../components/Countdowns'
import DailyCountdown from '../../components/Countdowns'
import { Item } from '../../lib/Item'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useItemsByCategory } from '../../hooks/useItem'
import PurchaseModal from '../../components/PurchaseItemModal'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import Entypo from '@expo/vector-icons/Entypo'
import { giveUserGold } from '../../lib/profile'
import { Catalogue } from '@react-three/fiber'

export type Category = {
  name: string,
  icon_url: string
}

export type ItemsByCategory = {
  all : Item[]
  weapons : Item[]
  armor : Item[]
  cosmetics : Item[]
}

export default function ShopScreen() {
  
  const {session, setSession, loading, setLoading, profile, updateProfile, items, setItems } = useProfileData()
  
  const today = new Date().toDateString()

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>({name: "All Items", icon_url: "boxes_icon.png" })

  const [dailyItems, setDailyItems] = useState<ItemsByCategory>({
    all: [],
    weapons: [],
    armor: [],
    cosmetics: [],
  })

  const [weeklyItems, setWeeklyItems] = useState<ItemsByCategory>({
    all: [],
    weapons: [],
    armor: [],
    cosmetics: [],
  })

  const dailyWeapons = useItemsByCategory("Weapons", 2).items
  const dailyArmor = useItemsByCategory("Armor", 2).items
  const dailyCosmetics = useItemsByCategory("Cosmetics", 2).items

  const newDailyItems = {
    all: [... dailyWeapons, ...dailyArmor, ...dailyCosmetics],
    weapons: dailyWeapons,
    armor: dailyArmor,
    cosmetics: dailyCosmetics
  }

  const weeklyWeapons = useItemsByCategory("Weapons", 4).items
  const weeklyArmor = useItemsByCategory("Armor", 4).items
  const weeklyCosmetics = useItemsByCategory("Cosmetics", 4).items

  const newWeeklyItems = {
    all: [... weeklyWeapons, ...weeklyArmor, ...weeklyCosmetics],
    weapons: weeklyWeapons,
    armor: weeklyArmor,
    cosmetics: weeklyCosmetics
  }

  const getCurrentDailyItems = () => {
    switch(activeCategory.name) {
      case "Weapons": return dailyItems.weapons
      case "Armor": return dailyItems.armor
      case "Cosmetics": return dailyItems.cosmetics
      default: return dailyItems.all
    }
  }

  const getCurrentWeeklyItems = () => {
    switch(activeCategory.name) {
      case "Weapons": return weeklyItems.weapons
      case "Armor": return weeklyItems.armor
      case "Cosmetics": return weeklyItems.cosmetics
      default: return weeklyItems.all
    }
  }

  const gold = profile?.gold_count

  const isDataReady = session && profile && gold !== undefined
  const shopImage = require('../../assets/images/ai_shop.png')

  const handleItemPress = (item: Item) => {
    setSelectedItem(item)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedItem(null)
  }

  const handlePurchase = async (item: Item) => {
    
    
    if (gold && gold >= item.price) {

      giveUserGold(0 - item.price, profile, profile.id, updateProfile)

      const addItemToUser = async () => {

        try {
          const { error } = await supabase
          .from('user_items')
          .insert({
            id: item.id,
            user_id: profile.id,
            purchased_at: new Date(),
            name: item.name,
            price: item.price,
            value: item.value,
            rarity: item.rarity,
            category: item.category,
            description: item.description,
            icon_url: item.icon_url
          })
          .single()

          if (error) throw error

          setItems((prev: Item[]) =>
            prev ? [...prev, item] : [item]
          )
          
        }

        catch (error) {
          console.log("Error adding item to collection: ", error)
          throw error
        }
        
      }

      addItemToUser()

      Alert.alert(`You purchased ${item.name} for ${item.price} gold!`)
      setModalVisible(false)
    } else {
      Alert.alert('Insufficient Gold', 'You do not have enough gold for this purchase.')
    }
  }


  // Async storage functions
  
  const saveDailyItemState = async (_dailyItems: ItemsByCategory) => {
    try {
      
      const data = {
        items: _dailyItems,
        lastReset: new Date().toISOString()
      }
      const strData = JSON.stringify(data)

      await AsyncStorage.setItem("daily-shop-items", strData)
  
    } catch (e) {
      alert(e)
    }
  }

  const saveWeeklyItemState = async (_weeklyItems: ItemsByCategory) => {
    try {
      
      const data = {
        items: _weeklyItems,
        lastReset: new Date().toISOString()
      }
      const strData = JSON.stringify(data)
      await AsyncStorage.setItem("weekly-shop-items", strData)
  
    } catch (e) {
      alert(e)
    }
  }
  
  
  // Load state function
  
  const loadDailyItemState = async () => {
    try {
      const stored = await AsyncStorage.getItem("daily-shop-items")
      
      if (!stored) {
        return { items: null, needsReset: true }
      }
      
      const data = JSON.parse(stored)
      const lastReset = new Date(data.lastReset)
      const now = new Date()
      
      // Check if we've passed midnight since last reset
      const lastResetDate = lastReset.toDateString()
      const currentDate = now.toDateString()
      
      const needsReset = (lastResetDate !== currentDate) || data.items.length < 1

      return { items: data.items, needsReset }
    } catch (e) {
      console.error('Error loading daily items:', e)
      return { items: null, needsReset: true }
    }
  }
  
  const loadWeeklyItemState = async () => {
    try {
      const stored = await AsyncStorage.getItem("weekly-shop-items")
      
      if (!stored) {
        return { items: null, needsReset: true }
      }
      
      const data = JSON.parse(stored)
      const lastReset = new Date(data.lastReset)
      const now = new Date()
      
      // Check if we've passed Sunday midnight since last reset
      const lastResetWeek = getWeekIdentifier(lastReset)
      const currentWeek = getWeekIdentifier(now)
      
      const needsReset = lastResetWeek !== currentWeek
      
      return { items: data.items, needsReset }
    } catch (e) {
      console.error('Error loading weekly items:', e)
      return { items: null, needsReset: true }
    }
  }

  const getWeekIdentifier = (date: Date): string => {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000
    const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
    return `${date.getFullYear()}-W${weekNumber}`
  }


  useEffect(() => {
    const initializeShop = async () => {
    
      const dailyCheck = await loadDailyItemState()
    
      if (dailyCheck.needsReset || dailyCheck.items.length < 1) {
        console.log("daily reset", dailyCheck.items)
        setDailyItems(newDailyItems)
        await saveDailyItemState(newDailyItems)
      } else {

        setDailyItems(dailyCheck.items)
      }
    
  
      const weeklyCheck = await loadWeeklyItemState()
    
      if (weeklyCheck.needsReset || weeklyCheck.items.length < 1) {
        console.log("weekly reset", weeklyCheck.items)
        setWeeklyItems(newWeeklyItems)
        await saveWeeklyItemState(newWeeklyItems)
      } else {
        console.log(weeklyCheck)
        setWeeklyItems(weeklyCheck.items)
      }
    }
  
    initializeShop()
  
 
    const interval = setInterval(async () => {
      const dailyCheck = await loadDailyItemState()
      const weeklyCheck = await loadWeeklyItemState()
      
      if (dailyCheck.needsReset) {
        setDailyItems(newDailyItems)
        saveDailyItemState(newDailyItems)
      }
      
      if (weeklyCheck.needsReset) {
        setWeeklyItems(newWeeklyItems)
        saveWeeklyItemState(newWeeklyItems)
      }
    }, 60000) 
  
    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    
    console.log(activeCategory)
  }, [activeCategory])
  


  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.4;  // Matches your titleView height

  async function onSelectCategory(cat: Category) {

    const isCatValid = cat.name == "All Items" || cat.name == "Weapons" || cat.name == "Armor" || cat.name == "Cosmetics"

    if(!cat || !isCatValid) {
      throw new Error("Provided category must be one of the 4 options: 'All Items', 'Weapons', 'Armor', 'Cosmetics'. You provided: " + cat.name)
    }

    setActiveCategory(cat)
  }


  if (loading || !isDataReady) {
    return (
      <LoadingScreen />
    )
  }
    
  return (
    <SafeAreaView style={ styles.container}>

      <GoldCounter goldCount={ gold }/> 

      <View style={ styles.shopHeader }>
        <Text style={{ color: COLORS.BORDER, fontSize: 40, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 25, paddingHorizontal: 5, fontFamily: FONTS.HEADER  }}> 
          Shop 
        </Text>

        <View style={[ styles.horizontalLine, { width: '40%', position: 'absolute', bottom: '70%' } ]} />

        <View style={{ flexDirection: 'row', columnGap: 25, position: 'absolute', bottom: '40%' }}>
          <CatSelector category={{ name: "All Items", icon_url: "boxes_icon.png" }} onCategorySelect={ onSelectCategory }/>
          <CatSelector category={{ name: "Weapons", icon_url: "sword_icon.png" }} onCategorySelect={ onSelectCategory }/>
          <CatSelector category={{ name: "Armor", icon_url: "armor_icon.png" }} onCategorySelect={ onSelectCategory }/>
          <CatSelector category={{ name: "Cosmetics", icon_url: "shades_icon.png" }} onCategorySelect={ onSelectCategory }/>
        </View>

        <Text style={{ 
          color: COLORS.CYAN, fontSize: 28, backgroundColor: 'rgba(0, 0, 0, 0.85)', borderRadius: 25, 
          paddingHorizontal: 5, position: 'absolute', bottom: 40, fontFamily: FONTS.HEADER  
        }}> 
          { activeCategory.name } 
        </Text>

        <View style={[ styles.horizontalLine, { marginTop: 20, width: '60%', position: 'absolute', bottom: '10%'} ]} />
      </View>

      <View style={ styles.shopPic }>
        <Image 
          style={{ resizeMode: 'cover', width: '100%', height: "100%"}} 
          source={ shopImage }
        />
      </View>



      <ScrollView style={[ styles.scrollableView, { backgroundColor: '#25130f'} ]}>
        <View style={{ height: headerHeight - 50}}/>
        <Text style={{ color: COLORS.TEAL, alignSelf: 'center', fontSize: 20, fontFamily: FONTS.BODY}}> 
          Daily 
        </Text>

        <View style={[ styles.horizontalLine, { width: '30%', marginTop: 10 } ]} />

        <FlatList 
          style={{ width: '100%', marginTop: 20 }}
          contentContainerStyle={{justifyContent: 'space-around', alignItems: 'center', columnGap: 10}}
          numColumns={3}
          scrollEnabled={false}
          data={getCurrentDailyItems()}
          renderItem={({item}) => (
            <ItemSelector item={item} onPress={() => handleItemPress(item)} userItems={items}/>
          )}
          
        />

        <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center'}}>
          <Text style={{ color: COLORS.CYAN, fontFamily: FONTS.BODY, fontSize: 14}}> Refreshes in: </Text>
          <DailyCountdown />
        </View>

        <Text style={{ color: COLORS.TEAL, alignSelf: 'center', fontSize: 20, marginTop: 50, fontFamily: FONTS.BODY}}> Weekly </Text>
        <View style={[ styles.horizontalLine, { width: '30%', marginTop: 10 } ]} />

        <FlatList 
          style={{ width: '100%', marginTop: 20 }}
          contentContainerStyle={{justifyContent: 'space-around', alignItems: 'center', columnGap: 10}}
          numColumns={3}
          scrollEnabled={false}
          data={getCurrentWeeklyItems()}
          renderItem={({item}) => (
            <ItemSelector item={item} onPress={() => handleItemPress(item)} userItems={items}/>
          )}
          
        />

        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
          <Text style={{ color: COLORS.CYAN, fontFamily: FONTS.BODY, fontSize: 16}}> Refreshes in: </Text>
          <WeeklyCountdown />
        </View>
        <View style={{ height: 50 }}/>

      </ScrollView>
      
      <PurchaseModal
          session={session}
          item={selectedItem}
          showModal={modalVisible}
          onClose={handleCloseModal}
          onPurchase={handlePurchase}
          profile={profile}
      />

    </SafeAreaView>
  )
}


export function CatSelector(props: { category: Category, onCategorySelect: (cat: Category) => void }) {

  if (!props.category) return

  return (
    <Pressable 
      style={ styles.CatSelector }
      onPress={ () => props.onCategorySelect(props.category) }
    >
      
      <Image style={{ resizeMode: 'contain', width: '75%', height: '75%',}} source={ imageMap[props.category.icon_url] }/>
      
    </Pressable>
  )
}

export function ItemSelector(props: { item: Item, onPress: () => void, userItems: Item[] | null }) {

  if (!props.item) return

  let isOwned = false

  props.userItems?.forEach(item => {
    if (item.id == props.item.id)
    isOwned = true
  })

  return (
    <Pressable 
      style={ styles.ItemSelector }
      onPress={props.onPress}
    >

        <View style={{ alignSelf: 'center', width: 50, height: 50, }}>
          <Image style={{ resizeMode: 'contain', width: '100%', height: '100%',}} source={ imageMap[props.item.icon_url] }/>
        </View>
        
        <Text style={{ color: isOwned ? COLORS.GREEN : COLORS.BORDER, fontFamily: FONTS.BODY, fontSize: 10, textAlign: 'center', }}>
          {props.item.name}
        </Text>
        
        { isOwned ?
          (

            <View
              style={{ 
                height: 20, width: 20, backgroundColor: COLORS.GREEN_MUTED, borderColor: COLORS.BLACK, borderWidth: 1,
                borderRadius: 5, alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Entypo name="check" size={16} color="black" />
            </View>

          ) : (
          <View style={{ flexDirection: 'row', position: 'absolute', bottom: 5, alignItems: 'center', columnGap: 2,}}>
            <Text 
              style={{ color: COLORS.GOLD, fontFamily: FONTS.HEADER, fontSize: 16, textAlign: 'center', }}
            >
              {props.item.price}
            </Text>
            <FontAwesome6 name="coins" size={12} color="#fffe00" />
          </View>
          )}
    </Pressable>
  )
}