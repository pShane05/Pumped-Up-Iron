import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Pressable, StyleSheet, View, Text, Alert, ActivityIndicator, SafeAreaView } from 'react-native'
import { Link, useRouter } from "expo-router"
import { GoldCounter, XpDisplay } from '../../components/UI'
import { COLORS, FONTS, styles } from '../costants'
import { useProfileData } from '../../hooks/useProfile'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import LoadingScreen from '../../components/LoadingScreen'
import { giveUserXp } from '../../lib/levels'


export default function AvatarScreen() {

  const { session, loading, profile, updateProfile } = useProfileData()

  
  const gold = profile?.gold_count
  const userId = profile?.id
  const startDate = profile?.date_started; // "2000-05-17T00:00:00.000Z"
  const isDataReady = session && profile && gold && startDate !== undefined

  const formattedDate = 
    startDate ?
      new Date(startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    :
    "---- -- --"


  if (loading || !isDataReady) {

    if (loading) console.log("loading")
    
    if (!isDataReady) console.log("Session: ", session, "Profile: ", profile, " Gold: ", gold, "Start date: ", startDate)

    return (
      <LoadingScreen />
    )
  }

  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'flex-start', height: '100%'}]}>

      <GoldCounter goldCount={ gold }/> 
      
      <Text style= {{ marginTop: 20, alignSelf: 'center', fontSize: 40, color: '#cbeef3', fontFamily: FONTS.HEADER}}> Avatar </Text>
      <View style={[ styles.horizontalLine, { width: '40%', marginTop: 30 } ]} />

      <Pressable style={[ styles.button, { marginTop: 30 } ]}>
        <Text style={{ color: COLORS.BLACK, fontSize: 20, fontFamily: FONTS.BODY }}> Wardrobe </Text>
      </Pressable>

      <View style={[ styles.horizontalLine, { width: '60%', marginTop: 40 } ]} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', columnGap: 20 }}>

        <Pressable 
          style={ styles.button }
          onPress={ async () => {
            await giveUserXp(100, profile, profile.id, updateProfile) 
          }}
        >
          <Text>
            +100 xp
          </Text>
        </Pressable>

        <Pressable 
          style={ styles.button }
          onPress={ async () => {
            await giveUserXp(100, profile, profile.id, updateProfile) 
          }}
        >
          <Text>
            +500 xp
          </Text>
        </Pressable>

      </View>

      

      <View style={{marginHorizontal: 50, position: 'absolute', bottom: '20%', paddingBottom: 20, height: '20%', justifyContent: 'space-between'}}>

        <Text style={{ color: COLORS.PINK, fontSize: 20, fontFamily: FONTS.BODY}}> Class: 
          <Text style={{ color: COLORS.TEAL}}>  {"Boxer"} </Text>

        </Text>

        <Text style={{ color: COLORS.PINK, fontSize: 20, fontFamily: FONTS.BODY}}> Lvl: 
          <Text style={{ color: COLORS.TEAL, fontFamily: FONTS.BODY}}>  { profile?.level}  </Text>
        </Text>

        <Text style={{ color: COLORS.PINK, fontSize: 20, fontFamily: FONTS.BODY}}> Started: 
          <Text style={{ color: COLORS.TEAL, fontFamily: FONTS.BODY}}>  { formattedDate }  </Text>
        </Text>

        <Text style={{ color: COLORS.PINK, fontSize: 20, fontFamily: FONTS.BODY}}> Streak: 
          <Text style={{ color: COLORS.TEAL, fontFamily: FONTS.BODY}}>  {"1 Day"} </Text>
          <FontAwesome6 name="fire-flame-curved" size={20} color="#ff5e00ff" />
        </Text>
        

      </View>

       <XpDisplay userId= { userId }/>
        
    </SafeAreaView>
  )
}

{/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    paddingTop: '20%',
    alignContent: 'center',
  },
  boxView: {
    backgroundColor: '#10002b',
    borderRadius: 25,
    borderColor: '#cbeef3',
    borderWidth: 3,
    padding: 2,
  },
  logout: {
    backgroundColor: '#cbeef3', 
    marginTop: 25,
    width: '20%',
    borderRadius: 20,
    alignItems: 'center',
    padding: 4,
    alignSelf: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.PINK,
    marginTop: 20,
    alignSelf: 'center',
  },
  horizontalLine: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.TEAL, 
    alignSelf: 'center',
  },
  
});*/}
