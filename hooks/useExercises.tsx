// hooks/useExercises.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import { Exercise } from '../lib/exercise'

export function useExercisesByGroup(muscle_group: string | undefined) {
  const [exercises, setProfile] = useState<Exercise[]> ([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!muscle_group) return

    const fetchExercise = async () => {
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

    fetchExercise()
  }, [muscle_group])

  return { exercises, loading, error }
}

export function useExercisesByTarget(target: string | undefined) {
  const [exercises, setProfile] = useState<Exercise[]> ([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {

    if(!target) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('exercises')
          .select('*')
          .eq('target', target)

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
  }, [target])

  return { exercises, loading, error }
}
