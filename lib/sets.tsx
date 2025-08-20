import { Exercise } from "./exercise"

export type Set = {
    id: string
    workoutLogId: string
    exercise: Exercise
    reps: number
    weight: Weight
    setNum: number
}

export type Weight = {
    value: number
    isLbs: boolean
}