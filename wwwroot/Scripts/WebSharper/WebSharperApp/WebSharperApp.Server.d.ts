import GlobalSettings from "./WebSharperApp.GlobalSettings"
import { AuthResult } from "./WebSharperApp.AuthResult"
import AsyncBody from "../WebSharper.StdLib/WebSharper.Concurrency.AsyncBody`1"
import MealPlanItem from "./WebSharperApp.MealPlanItem"
import RecipeEntry from "./WebSharperApp.RecipeEntry"
import ProductItem from "./WebSharperApp.ProductItem"
import DailyRecord from "./WebSharperApp.DailyRecord"
import CalendarEvent from "./WebSharperApp.CalendarEvent"
export function UpdateUserSettings(s:GlobalSettings):((a:AsyncBody<AuthResult>) => void)
export function GetUserSettings():((a:AsyncBody<GlobalSettings>) => void)
export function AddMealPlan(m:MealPlanItem):((a:AsyncBody<AuthResult>) => void)
export function GetMealPlansRange(startDate:number, endDate:number):((a:AsyncBody<(MealPlanItem)[]>) => void)
export function AddRecipe(r:RecipeEntry):((a:AsyncBody<AuthResult>) => void)
export function GetRecipes():((a:AsyncBody<(RecipeEntry)[]>) => void)
export function DeleteProduct(id:number):((a:AsyncBody<AuthResult>) => void)
export function AddProduct(p:ProductItem):((a:AsyncBody<AuthResult>) => void)
export function GetProducts():((a:AsyncBody<(ProductItem)[]>) => void)
export function AddHealthRecord(r:DailyRecord):((a:AsyncBody<AuthResult>) => void)
export function GetHealthRecords():((a:AsyncBody<(DailyRecord)[]>) => void)
export function AddCalendarEvent(ev:CalendarEvent):((a:AsyncBody<AuthResult>) => void)
export function GetCalendarEvents(startDate:number, endDate:number):((a:AsyncBody<(CalendarEvent)[]>) => void)
export function Logout():((a:AsyncBody<AuthResult>) => void)
export function AttemptMagicLogin(token:string):((a:AsyncBody<AuthResult>) => void)
export function AttemptVerifyEmail(token:string):((a:AsyncBody<AuthResult>) => void)
export function UpdateUsername(newName:string):((a:AsyncBody<AuthResult>) => void)
export function ResetPassword(newPassword:string):((a:AsyncBody<AuthResult>) => void)
export function TriggerMagicLink(email:string):((a:AsyncBody<AuthResult>) => void)
export function CheckAuthState():((a:AsyncBody<AuthResult>) => void)
export function LoginUser(email:string, password:string):((a:AsyncBody<AuthResult>) => void)
export function RegisterUser(email:string, password:string):((a:AsyncBody<AuthResult>) => void)
