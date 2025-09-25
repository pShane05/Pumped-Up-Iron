import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Item } from "../lib/Item"
import { Profile } from "../lib/profile"

export function useItemsByRarity(rarity: string | undefined, amount: number) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!rarity) return

    const fetchItem = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('rarity', rarity)

        if (error) 
          throw error

        const shuffled = data.sort(() => Math.random() - .5)
        setItems(shuffled.slice(0, amount))


      } catch (error) {

        if (error instanceof Error)

          setError(error)
          console.log(error)

      } finally {
        
        setLoading(false)
      }
    }

    fetchItem()
  }, [rarity])

  return { items, loading, error }
}

export function useItemsByUser(profile: Profile | undefined) {

  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!profile) return

    const fetchItem = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('user_items')
          .select('*')
          .eq('user_id', profile.id)

        if (error) 
          throw error

        setItems(data)


      } catch (error) {

        if (error instanceof Error)

          setError(error)
          console.log(error)

      } finally {
        
        setLoading(false)
      }
    }

    fetchItem()
  }, [profile])

  return { items, loading, error }
}
