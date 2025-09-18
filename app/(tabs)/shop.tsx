import 'react-native-url-polyfill/auto'
import { useState, useEffect, } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, View, Text, Alert, Dimensions, ActivityIndicator, SafeAreaView, FlatList } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { COLORS, FONTS, imageMap, styles } from '../costants'
import { GoldCounter } from '../../components/UI'
import { useProfile } from '../../hooks/useProfile'
import LoadingScreen from '../../components/LoadingScreen'
import CountdownTimers, { WeeklyCountdown } from '../../components/Countdowns'
import DailyCountdown from '../../components/Countdowns'
import { Item } from '../../lib/Item'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { commonUncommon } from '../../lib/randomValues'
import { useItemsByRarity } from '../../hooks/useItem'


export default function ShopScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toDateString()

  const router = useRouter()

  const dailies = useItemsByRarity("common", 6).items
  const weeklies = useItemsByRarity("common", 12).items

  const [dailyItems, setDailyItems] = useState<Item[]>()
  const [weeklyItems, setWeeklyItems] = useState<Item[]>()

  console.log(dailyItems)

  const profile = useProfile(session?.user.id).profile
  const gold = profile?.gold_count

  const isDataReady = session && profile && gold !== undefined
  const shopImage = require('../../assets/images/ai_shop.png')


  // Async storage functions
  
  const saveDailyItemState = async (_dailyItems: Item[]) => {
    try {
      
      let jsonValue = JSON.stringify(_dailyItems)
      await AsyncStorage.setItem("daily-shop-items", jsonValue)
  
    } catch (e) {
      alert(e)
    }
  }

  const saveWeeklyItemState = async (_weeklyItems: Item[]) => {
    try {
      
      let jsonValue = JSON.stringify(_weeklyItems)
      await AsyncStorage.setItem("daily-shop-items", jsonValue)
  
    } catch (e) {
      alert(e)
    }
  }
  
  
    // Load state function
  
  const loadDailyItemState = async () => {
    try {
  
      const dailyShopItems = await AsyncStorage.getItem("daily-shop-items")
  
      //if (dailyShopItems !== null) setDailyItems(JSON.parse(dailyShopItems))
  
    } catch (e) {
      alert(e)
    }
  }
  
  const loadWeeklyItemState = async () => {
    try {
  
      const weeklyShopItems = await AsyncStorage.getItem("weekly-shop-items")
  
      if (weeklyShopItems !== null) setWeeklyItems(JSON.parse(weeklyShopItems))
    } catch (e) {
      alert(e)
    }
   }
  
  const removeDailyShopItems = async () => {
  
    const key = 'daily-shop-items'
    try {
      await AsyncStorage.removeItem(key)
    } catch(e) {
      alert(e)
    }
  }

  const removeWeeklyShopItems = async () => {
  
    const key = 'weekly-shop-items'
    try {
      await AsyncStorage.removeItem(key)
    } catch(e) {
      alert(e)
    }
  }

  useEffect(() => {
    loadDailyItemState()
    loadWeeklyItemState()
  }, [])


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription?.unsubscribe()     // cleanup the listener when the compnoent unmounts
    }
  }, [])

  useEffect(() => {
    if (!loading && !session) {
      router.replace('../login')
    }
  }, [session])

  useEffect(() => {
    setDailyItems(dailies)
  }, [dailies])

  useEffect(() => {
    setWeeklyItems(weeklies)
  }, [weeklies])

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
            <ItemSelector item={item}/>
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
            <ItemSelector item={item}/>
          )}
          
        />

        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center'}}>
          <Text style={{ color: COLORS.CYAN, fontFamily: FONTS.BODY, fontSize: 16}}> Refreshes in: </Text>
          <WeeklyCountdown />
        </View>
        <View style={{ height: 50 }}/>

      </ScrollView>
      

    </SafeAreaView>
  )
}


export function CatSelector() {
  return (
    <View style={ styles.CatSelector }>
        
    </View>
  )
}

export function ItemSelector(props: { item: Item }) {
  return (
    <View style={ styles.ItemSelector }>

        <View style={{ alignSelf: 'center', width: 50, height: 50, }}>
          <Image style={{ resizeMode: 'contain', width: '100%', height: '100%',}} source={ imageMap[props.item.icon_url] }/>
        </View>
        
        <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY, fontSize: 12, textAlign: 'center'}}>
          {props.item.name}
        </Text>
    </View>
  )
}