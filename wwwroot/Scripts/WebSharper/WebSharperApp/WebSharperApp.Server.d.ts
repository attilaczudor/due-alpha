import UserHealthSettings from "./WebSharperApp.UserHealthSettings"
import { AuthResult } from "./WebSharperApp.AuthResult"
import AsyncBody from "../WebSharper.StdLib/WebSharper.Concurrency.AsyncBody`1"
import GlobalSettings from "./WebSharperApp.GlobalSettings"
import PublicProfile from "./WebSharperApp.PublicProfile"
import { FSharpOption } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1"
import MealPlanItem from "./WebSharperApp.MealPlanItem"
import RecipeEntry from "./WebSharperApp.RecipeEntry"
import ProductItem from "./WebSharperApp.ProductItem"
import DailyRecord from "./WebSharperApp.DailyRecord"
import CalendarEvent from "./WebSharperApp.CalendarEvent"
export function SaveHealthSettings(h:UserHealthSettings):((a:AsyncBody<AuthResult>) => void)
export function GetHealthSettings():((a:AsyncBody<UserHealthSettings>) => void)
export function ChangePassword(newPassword:string):((a:AsyncBody<AuthResult>) => void)
export function SetProfileVisibility(isPublic:boolean):((a:AsyncBody<AuthResult>) => void)
export function UpdateUserSettings(s:GlobalSettings):((a:AsyncBody<AuthResult>) => void)
export function UploadAvatar(base64Data:string):((a:AsyncBody<AuthResult>) => void)
export function GetPublicProfile(username:string):((a:AsyncBody<FSharpOption<PublicProfile>>) => void)
export function VerifyEmailChange(token:string):((a:AsyncBody<AuthResult>) => void)
export function CancelEmailChange():((a:AsyncBody<AuthResult>) => void)
export function RequestEmailChange(newEmail:string):((a:AsyncBody<AuthResult>) => void)
export function SaveUsername(newUsername:string):((a:AsyncBody<AuthResult>) => void)
export function CheckUsernameAvailability(username:string):((a:AsyncBody<boolean>) => void)
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
