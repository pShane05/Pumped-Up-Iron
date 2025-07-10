import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import { Profile } from '../lib/profile'

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

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

          setError(error)
          console.log(error)

      } finally {
        
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, error }
}
