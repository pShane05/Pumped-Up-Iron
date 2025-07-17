// hooks/useExercises.ts
import { useEffect, useState } from 'react';
import { fetchImage } from '../lib/fetchImage';

export function useImage(exerciseId: string) {
  const [image, setImage] = useState()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImage(exerciseId).then((data) => {
      setImage(data);
      setLoading(false);
    });
  }, [exerciseId]);

  return { image, loading };
}
