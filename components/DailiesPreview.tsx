import React, { useEffect, useState } from 'react'
import { Text, Pressable, Alert, StyleSheet, View, FlatList } from 'react-native'
import { router, useRouter } from 'expo-router'
import { COLORS, FONTS, styles } from '../app/costants'
import { DailyQuest } from '../lib/dailyQuest'

  export default function DailyPreviewCard(props: { quests: DailyQuest[] | null}) {

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
        data={ props.quests }
        renderItem={({ item }) => (

          <QuestPreview quest={item}/>                  
        )}
      />
      

      <Text style={{ color: 'red', marginTop: 20, fontFamily: FONTS.BODY }}> * Required </Text>

      <Text>
        {} Remaining
      </Text>

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
