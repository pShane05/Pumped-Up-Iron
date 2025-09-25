import { useState, useEffect, useContext, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Profile } from '../lib/profile'
import { ProfileContext, useProfileContext } from '../contexts/profileContext'

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = useCallback( async () => {

    if(!userId) {
      setProfile(undefined)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
      
    try {

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) 
        throw error
      
      setProfile(data)
      return data

    } catch (error) {

      if (error instanceof Error){

        setError(error)
        console.log("Profile fetch error: ", error)
      }
      throw error

    } finally {
        
      setLoading(false)
    }
  }, [userId])


  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])


  const refetch = useCallback(async () => {

    fetchProfile()

  }, [fetchProfile])

  return { 

    profile, 
    loading, 
    error,
    fetchProfile,
    refetch
  }
}

export const useProfileData = () => {
  const { profile, session, setSession, updateProfile, refreshProfile, dailyQuests, setDailyQuests, signOut, loading, setLoading } = useProfileContext()

  return {
    profile,
    updateProfile,
    refreshProfile,
    dailyQuests,
    setDailyQuests,
    session,
    setSession,
    signOut,
    loading,
    setLoading,
    user: session?.user,
  }
}