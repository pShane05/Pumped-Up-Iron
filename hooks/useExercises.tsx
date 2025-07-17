// hooks/useExercises.ts
import { useEffect, useState } from 'react';
import { fetchExercisesByBodyPart } from '../lib/fetchExercises';

export function useExercises(bodyPart: string) {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercisesByBodyPart(bodyPart).then((data) => {
      console.log('Recieved data:', data)
      setExercises(data.slice(0, 10));
      setLoading(false);
    });
  }, [bodyPart]);

  return { exercises, loading };
}
