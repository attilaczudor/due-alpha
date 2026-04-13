import { FSharpOption } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1"
export function New(Id, PlanDate, MealType, RecipeId, Title, Notes)
export default interface MealPlanItem {
  Id:number;
  PlanDate:number;
  MealType:string;
  RecipeId:FSharpOption<number>;
  Title:string;
  Notes:string;
}
