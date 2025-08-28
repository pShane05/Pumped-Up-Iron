import { Dispatch, SetStateAction } from "react";
import { Set } from "./sets"
import { Exercise } from "./exercise";

type CompleteSetsByExercise = {
  [exerciseName: string]: Set[]
}

export function addSetToExercise( setSets: Dispatch<SetStateAction<CompleteSetsByExercise>>, exercise: Exercise, set: Set, setNum: number) {
    setSets( prev => {

        const currentSets = prev[exercise.name] || []
        const newSet = set

        // assign the 'set_number' value
        newSet.set_number = setNum

        //const setExists = currentSets.some(set => set. === exercise.name)

        if(!currentSets) return {
            [exercise.name]: [set]
        }
        //else return currentSets.filter(set => set.exercise_name !== newSet.exercise_name) 
        
        else {
            return {
                [exercise.name]: [...currentSets, set]
            }
        }
        
    })
}