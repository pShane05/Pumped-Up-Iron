import React, { useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, FlatList } from 'react-native'
import { router, useRouter } from 'expo-router'
import { COLORS, FONTS, styles } from '../app/costants'
import { DailyQuest, QuestMap } from '../lib/dailyQuest'
import DailyCountdown from './Countdowns'

  export default function DailyPreviewCard(props: { quests: QuestMap | null}) {

  return (
    
    <Pressable 
      style={[ styles.boxView, {alignItems: 'center', paddingVertical: 15} ]} 
      onPress={() => router.push('../dailyQuests')}
    >
      
      <Text style={ styles.headerText }> 
          Daily Quests 
      </Text>
      
      <View style={ styles.horizontalLine }/>

      <FlatList 
        style={{ width: '100%'}}
        scrollEnabled={false}
        data={ props.quests ? Object.values(props.quests) : []}
        renderItem={({ item }) => (

          <QuestPreview quest={item}/>                  
        )}
      />
      

      <Text style={{ color: 'red', marginTop: 20, fontFamily: FONTS.BODY }}> * Required </Text>

      <View style={{ flexDirection: 'row', marginTop: 20}}>
        <Text style={{ color: COLORS.CYAN}}> Time Left: </Text>
        <DailyCountdown />
      </View>
      
    </Pressable>
  )
}

export function QuestPreview(props: {quest: DailyQuest}) {

  const isCompleted = (props.quest.completed / props.quest.goal) >= 1

  return (
    <View style={[ styles.singleQuest, { backgroundColor: isCompleted ? COLORS.GREEN_MUTED : '#20204b'} ]}>

      <Text 
        style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY}}
      > 
        {props.quest.name} 
      </Text>

      <Text
        style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY}}
      >
        [{props.quest.completed} / {props.quest.goal}]

      </Text>
    </View>
  )
}

