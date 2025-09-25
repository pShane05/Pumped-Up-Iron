import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { Profile } from "../lib/profile"
import { Session } from "@supabase/supabase-js"
import { DailyQuest, QuestMap } from "../lib/dailyQuest"
import { useProfile } from "../hooks/useProfile"
import { useProfileQuests } from "../hooks/useDailies"
import { supabase } from "../lib/supabase"
import { router } from "expo-router"
import { Alert } from "react-native"

type ProfileContextType = {
    profile: Profile | null
    setProfile: (profile: Profile) => void
    updateProfile: (updates: Partial<Profile>) => void
    refreshProfile: () => void

    session: Session | null
    setSession: (session: Session | null) => void
    loading: boolean
    setLoading: (loading: boolean) => void
    signOut: () => void,

    dailyQuests: QuestMap | null
    setDailyQuests: React.Dispatch<React.SetStateAction<QuestMap | null>>

    workoutIsActive: boolean
    setWorkoutIsActive: (isActive: boolean) => void
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider( {children}: any) {

    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)

    const { profile: profileData, refetch: refetchProfile } = useProfile(session?.user.id)
    
    const [loading, setLoading] = useState(true)
    
    const [workoutIsActive, setWorkoutIsActive] = useState(false)

    const [dailyQuests, setDailyQuests] = useState<QuestMap | null>(null)
    const { dailyQuests: hookQuests } = useProfileQuests(profile?.id)
    

    


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
      
    // update profile when session updates
        useEffect(() => {
            if (session && profileData) {
                setProfile(profileData)
            } else if (!session) {
                setProfile(null)
            }
    }, [session, profileData])


    useEffect(() => {
    
        if (loading) return
        
        if (!profile || loading) {
        return // session still loading
        }
        else {
        if (!session) 
            router.replace("/login")

        else if (!profile?.username) {
            console.log("because no username: ", profile)
            console.log("session: ", session)
            router.replace('/makeProfile')
        
        }
        else if (!profile?.dob) 
            router.replace('/setBirthday')
        }
    }, [session, profile, loading])

    
    useEffect(() => {
        console.log("Hook quests updated")
        setDailyQuests(hookQuests)
    }, [hookQuests])

    useEffect(() => {
        console.log("Provider dailyQuests updated")
    }, [dailyQuests])

    // return functions

    const updateProfile = async ( updates: Partial<Profile> ) => {

        try {
            
            if (!session?.user) throw new Error("No user on the session!")

            const updateData = {
                ...updates,
                id: session.user.id,

                updated_at: new Date()
            }

            setLoading(true)

            console.log("Updates going to DB:", updateData)

            const { error } = await supabase.
                from("profiles")
                .upsert(updateData, { onConflict: "id" })

            console.log("Database operation completed")

            if (error) throw error

            setProfile( prev => prev ? { ...prev, ...updates} : null )

            await refetchProfile()
            
        } catch (error) {

            if (error instanceof Error) {

                Alert.alert(error.message)
            }
        } finally {

            setLoading(false)
        }

    }

    const refreshProfile = async () => {

        await refetchProfile()
    }

    const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setProfile(null)
      setWorkoutIsActive(false)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

    
    const value = useMemo(() => ({
        profile,
        setProfile,

        updateProfile,
        refreshProfile,

        session,
        setSession,
        loading,
        setLoading,
        signOut,

        dailyQuests,
        setDailyQuests,

        workoutIsActive,
        setWorkoutIsActive,
    }), [
        profile, session, loading, dailyQuests, workoutIsActive
    ])


    return (
        <ProfileContext.Provider value={ value }>
            {children}
        </ProfileContext.Provider>
    )

}

export const useProfileContext = () => {
  const context = useContext(ProfileContext)
  
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider')
  }
  
  return context
}