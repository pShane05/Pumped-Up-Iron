// hooks/useProfile.ts
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Alert } from 'react-native'

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) 
          throw error

        setProfile(data)

      } catch (error) {

        if (error instanceof Error)
          Alert.alert(error.message)

      } finally {
        
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, error }
}
