import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ScrollView, Image, Pressable, StyleSheet, View, Text, Alert, Dimensions, ActivityIndicator } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Link, useRouter } from "expo-router"
import { COLORS, styles } from '../costants'
import { GoldCounter } from '../../components/UI'
import { useProfile } from '../../hooks/useProfile'


export default function ShopScreen() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const profile = useProfile(session?.user.id).profile
  const gold = profile?.gold_count

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


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
    
  return (
    <View style={ styles.container}>

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
        <Image style={{ resizeMode: 'cover', width: '100%', height: "100%"}} source={require('../../assets/images/ai_shop.png')}/>
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
      

    </View>
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

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    alignContent: 'center',
    justifyContent: 'center',
  },
  shopPic: {
    flex: 0,
    backgroundColor: COLORS.GRAY,
    width: '100%',
    height: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  shopHeader: {
    width: '100%',
    height: '40%',
    paddingTop: '20%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 2,
    
  },
  boxView: {
    backgroundColor: '#10002b',
    borderRadius: 25,
    borderColor: '#cbeef3',
    borderWidth: 3,
    padding: 2,
  },
  button: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#0D6B93',
    borderColor: '#cbeef3',
    borderWidth: 2,
    marginTop: 10,
    alignSelf: 'center',
    color: '#cbeef3'
  },
  horizontalLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.TEAL, 
    alignSelf: 'center',
  },
  scrollableView: {
    flex: 1,
    paddingBottom: 200,
    rowGap: 20,
    backgroundColor: '#25130f'
  },
  CatSelector: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    height: (Dimensions.get('window').width) * 0.15,
    width: (Dimensions.get('window').width) * 0.15,      
  },
  ItemSelector: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    height: (Dimensions.get('window').width) * 0.25,
    width: (Dimensions.get('window').width) * 0.25,      
  }
});
*/