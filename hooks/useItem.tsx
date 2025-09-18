import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Item } from "../lib/Item"

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
          .limit(amount)

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
  }, [rarity])

  return { items, loading, error }
}
