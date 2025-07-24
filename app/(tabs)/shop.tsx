import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, View, Text, Alert, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { COLORS, styles } from '../costants'
import { GoldCounter } from '../../components/UI'
import { useProfile } from '../../hooks/useProfile'
import LoadingScreen from '../../components/LoadingScreen'


export default function ShopScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const profile = useProfile(session?.user.id).profile
  const gold = profile?.gold_count
  const isDataReady = session && profile && gold !== undefined
  const shopImage = require('../../assets/images/ai_shop.png')


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
        <Text style={{ color: COLORS.TEAL, fontSize: 36, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 25, paddingHorizontal: 5  }}> Shop </Text>

        <View style={[ styles.horizontalLine, { width: '40%', position: 'absolute', bottom: '70%' } ]} />

        <View style={{ flexDirection: 'row', columnGap: 25, position: 'absolute', bottom: '40%' }}>
          <CatSelector />
          <CatSelector />
          <CatSelector />
          <CatSelector />
        </View>

        <Text style={{ color: COLORS.TEAL, fontSize: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 25, paddingHorizontal: 5, position: 'absolute', bottom: '15%'  }}> [Shop Category] </Text>
        <View style={[ styles.horizontalLine, { marginTop: 20, width: '60%', position: 'absolute', bottom: '10%'} ]} />
      </View>

      <View style={ styles.shopPic }>
        <Image 
          style={{ resizeMode: 'cover', width: '100%', height: "100%"}} 
          source={ shopImage }
        />
      </View>



      <ScrollView style={[ styles.scrollableView, { backgroundColor: '#25130f'} ]}>
        <View style={{ height: headerHeight}}/>
        <Text style={{ color: COLORS.TEAL, alignSelf: 'center', fontSize: 20}}> Daily </Text>
        <View style={[ styles.horizontalLine, { width: '30%', marginTop: 10 } ]} />

        <View style={{ marginTop: 20, rowGap: 15, alignItems: 'center'}}>
          <View style={{ flexDirection: 'row', columnGap: 15}}>
            <ItemSelector/>
            <ItemSelector/>
            <ItemSelector/>
          </View>

          <View style={{ flexDirection: 'row', columnGap: 15}}>
            <ItemSelector/>
            <ItemSelector/>
            <ItemSelector/>
          </View>
        </View>


        <Text style={{ color: COLORS.TEAL, alignSelf: 'center', fontSize: 20, marginTop: 50}}> Weekly </Text>
        <View style={[ styles.horizontalLine, { width: '30%', marginTop: 10 } ]} />

        <View style={{ marginBottom: 100, marginTop: 20, rowGap: 15, alignItems: 'center'}}>
          <View style={{ flexDirection: 'row', columnGap: 15}}>
            <ItemSelector/>
            <ItemSelector/>
            <ItemSelector/>
          </View>

          <View style={{ flexDirection: 'row', columnGap: 15}}>
            <ItemSelector/>
            <ItemSelector/>
            <ItemSelector/>
          </View>

          <View style={{ flexDirection: 'row', columnGap: 15}}>
            <ItemSelector/>
            <ItemSelector/>
            <ItemSelector/>
          </View>

          <View style={{ flexDirection: 'row', columnGap: 15}}>
            <ItemSelector/>
            <ItemSelector/>
            <ItemSelector/>
          </View>
        </View>

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

export function ItemSelector() {
  return (
    <View style={ styles.ItemSelector }>
        
    </View>
  )
}
