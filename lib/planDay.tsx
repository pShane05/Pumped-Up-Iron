export type PlanDay = {
    id: number,
    plan_id: number, 
    plan_day: number,
    name: string, 
    target_muscles: {id: number, name: string}[]
}