import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Profile } from "../lib/profile"

export function getTargetsByProfile(profile: Profile | undefined) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [targets, setTargets] = useState<string | null>(null)

    if (!profile) return 

  useEffect(() => {
    
    const fetchTargets = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('plan_days')
          .select('target_muscles')
          .eq('plan_id', profile.plan_id)
          .eq('plan_day', profile.plan_day)
          .single()

        if (error) 
          throw error

        setTargets(data.target_muscles)

      } catch (error) {

        if (error instanceof Error)

          setError(error)
          console.log(error)

      } finally {
        
        setLoading(false)
      }
    }

    fetchTargets()
  })

  return { targets, loading, error }
}