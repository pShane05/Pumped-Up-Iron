import 'react-native-url-polyfill/auto'
import React, { useState, useEffect, } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, View, Text, Alert, Dimensions, ActivityIndicator, SafeAreaView, FlatList } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { COLORS, FONTS, imageMap, styles } from '../costants'
import { GoldCounter } from '../../components/UI'
import { useProfile, useProfileData } from '../../hooks/useProfile'
import LoadingScreen from '../../components/LoadingScreen'
import CountdownTimers, { WeeklyCountdown } from '../../components/Countdowns'
import DailyCountdown from '../../components/Countdowns'
import { Item } from '../../lib/Item'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { commonUncommon } from '../../lib/randomValues'
import { useItemsByRarity, useItemsByUser } from '../../hooks/useItem'
import PurchaseModal from '../../components/PurchaseItemModal'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import Entypo from '@expo/vector-icons/Entypo'
import { giveUserGold } from '../../lib/profile'

export default function ShopScreen() {
  
  const {session, setSession, loading, setLoading, profile, updateProfile, items, setItems } = useProfileData()
  
  const today = new Date().toDateString()

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const dailyRoll = useItemsByRarity("common", 6).items
  const weeklyRoll = useItemsByRarity("common", 12).items

  const [dailyItems, setDailyItems] = useState<Item[]>()
  const [weeklyItems, setWeeklyItems] = useState<Item[]>()

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
            effect: item.effect,
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
  
  const saveDailyItemState = async (_dailyItems: Item[]) => {
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

  const saveWeeklyItemState = async (_weeklyItems: Item[]) => {
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
      
      const needsReset = lastResetDate !== currentDate
      
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
    
      if (dailyCheck.needsReset || !dailyCheck.items) {
        console.log("daily reset", dailyCheck.items)
        setDailyItems(dailyRoll)
        saveDailyItemState(dailyRoll)
      } else {
        
        setDailyItems(dailyCheck.items)
      }
    
  
      const weeklyCheck = await loadWeeklyItemState()
    
      if (weeklyCheck.needsReset || !weeklyCheck.items) {
        console.log("weekly reset", weeklyCheck.items)
        setWeeklyItems(weeklyRoll)
        saveWeeklyItemState(weeklyRoll)
      } else {
        
        setWeeklyItems(weeklyCheck.items)
      }
    }
  
    initializeShop()
  
 
    const interval = setInterval(async () => {
      const dailyCheck = await loadDailyItemState()
      const weeklyCheck = await loadWeeklyItemState()
      
      if (dailyCheck.needsReset) {
        setDailyItems(dailyRoll)
        saveDailyItemState(dailyRoll)
      }
      
      if (weeklyCheck.needsReset) {
        setWeeklyItems(weeklyRoll)
        saveWeeklyItemState(weeklyRoll)
      }
    }, 60000) 
  
    return () => clearInterval(interval)
  }, [])
  


  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.4;  // Matches your titleView height


  if (loading || !isDataReady) {
    return (
      <LoadingScreen />
    )
  }
    
  return (
    <SafeAreaView style={ styles.container}>

      <GoldCounter goldCount={ gold }/> 

      <View style={ styles.shopHeader }>
        <Text style={{ color: COLORS.TEAL, fontSize: 40, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 25, paddingHorizontal: 5, fontFamily: FONTS.HEADER  }}> 
          Shop 
        </Text>

        <View style={[ styles.horizontalLine, { width: '40%', position: 'absolute', bottom: '70%' } ]} />

        <View style={{ flexDirection: 'row', columnGap: 25, position: 'absolute', bottom: '40%' }}>
          <CatSelector />
          <CatSelector />
          <CatSelector />
          <CatSelector />
        </View>

        <Text style={{ 
          color: COLORS.TEAL, fontSize: 24, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 25, 
          paddingHorizontal: 5, position: 'absolute', bottom: '15%', fontFamily: FONTS.HEADER  
        }}> 
          {
          //[Shop Category]
          } 
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
          data={dailyItems}
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
          data={weeklyItems}
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


export function CatSelector() {
  return (
    <View style={ styles.CatSelector }>
        
    </View>
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