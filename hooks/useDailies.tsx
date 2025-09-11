import { Alert } from "react-native"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"
import { DailyQuest } from "../lib/dailyQuest"

export function useDailyQuest(difficulty: string, rarity: string) {

    const [dailyQuest, setDailyQuest] = useState<DailyQuest | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!difficulty || !rarity) Alert.alert("Difficulty and rarity must be defined")

        const fetchDailyQuest = async () => {

            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('dailies')
                    .select('*')
                    .eq('difficulty', difficulty)
                    .eq('rarity', rarity)
                    .limit(1)
                    .order('random()')
                if (error) throw error

                setDailyQuest(data[0])
            } 
            catch (error) {
                if (error instanceof Error)

                setError(error)
                console.log(error)
            }
        }

        fetchDailyQuest()
    
    }, [difficulty, rarity])
    
    return { dailyQuest, loading, error }
    
}

export function useProfileQuests(userId: string | undefined) {

    const [dailyQuests, setDailyQuests] = useState<DailyQuest[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!userId) return

        const fetchDailyQuests = async () => {

            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('active_dailies')
                    .select('*')
                    //.eq('user_id', userId)
                    .limit(10)
                if (error) throw error

                setDailyQuests(data)
            } 
            catch (error) {
                if (error instanceof Error)

                setError(error)
                console.log(error)
            }
        }

        fetchDailyQuests()
    
    }, [userId])
    
    return { dailyQuests, loading, error }
}