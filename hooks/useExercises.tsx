// hooks/useExercises.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import { Exercise } from '../lib/exercise'

export function useExercises(muscle_group: string | undefined) {
  const [exercises, setProfile] = useState<Exercise[]> ([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!muscle_group) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('muscle_group', muscle_group)
          .limit(10)

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
  }, [muscle_group])

  return { exercises, loading, error }
}

