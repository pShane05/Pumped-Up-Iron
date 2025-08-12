import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Profile } from "../lib/profile"
import { PlanDay } from "../lib/planDay"

export function usePlanDayByProfile(profile: Profile | undefined) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [day, setDay] = useState<PlanDay | null>(null)


  useEffect(() => {
    
    if (!profile) return 

    const fetchDay = async () => {
      setLoading(true)


      try {
        const { data, error } = await supabase
          .from('plan_days')
          .select('*')
          .eq('plan_id', profile.plan_id)
          .eq('plan_day', profile.plan_day)
          .single()

        if (error) 
          throw error

        setDay(data)

      } catch (error) {

        if (error instanceof Error)

          setError(error)

      } finally {
        
        setLoading(false)
      }
    }

    fetchDay()
  }, [profile])

  return { day, loading, error }
}

export function usePlanByProfile(profile: Profile | undefined) {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [plan, setPlan] = useState<{id: number, name: string, description: string, days: number} | null>(null)


  useEffect(() => {
    
    if (!profile) return 

    const fetchPlan = async () => {
      setLoading(true)

      try {
        const { data, error } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('id', profile.plan_id)
          .single()

          console.log(data)
        if (error) 
          throw error

        setPlan(data)
      }
      catch {
        if (error instanceof Error)

          setError(error)

      } finally {
        
        setLoading(false)
      }
    }

    fetchPlan()
  }, [profile])

   return { plan, loading, error }
}