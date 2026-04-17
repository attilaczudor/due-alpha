import { Bind, Return } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import AjaxRemotingProvider from "../WebSharper.StdLib/WebSharper.Remoting.AjaxRemotingProvider.js"
import { DecodeJson_AuthResult, EncodeJson_GlobalSettings, DecodeJson_FSharpOption_1, DecodeJson_GlobalSettings, EncodeJson_MealPlanItem, DecodeJson_MealPlanItem, EncodeJson_DailyRecord, DecodeJson_DailyRecord, EncodeJson_CalendarEvent, DecodeJson_CalendarEvent } from "./$Generated.js"
import { EncodeDateTime, DecodeArray } from "../WebSharper.Web/WebSharper.ClientSideJson.Provider.js"
export function SaveHealthSettings(h){
  return Bind((new AjaxRemotingProvider()).Async("Server/SaveHealthSettings", [h]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function GetHealthSettings(){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetHealthSettings", []), (o) => Return(o));
}
export function ChangePassword(newPassword){
  return Bind((new AjaxRemotingProvider()).Async("Server/ChangePassword", [newPassword]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function SetProfileVisibility(isPublic){
  return Bind((new AjaxRemotingProvider()).Async("Server/SetProfileVisibility", [isPublic]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function UpdateUserSettings(s){
  return Bind((new AjaxRemotingProvider()).Async("Server/UpdateUserSettings", [(EncodeJson_GlobalSettings())(s)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function UploadAvatar(base64Data){
  return Bind((new AjaxRemotingProvider()).Async("Server/UploadAvatar", [base64Data]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function GetPublicProfile(username){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetPublicProfile", [username]), (o) => Return((DecodeJson_FSharpOption_1())(o)));
}
export function VerifyEmailChange(token){
  return Bind((new AjaxRemotingProvider()).Async("Server/VerifyEmailChange", [token]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function CancelEmailChange(){
  return Bind((new AjaxRemotingProvider()).Async("Server/CancelEmailChange", []), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function RequestEmailChange(newEmail){
  return Bind((new AjaxRemotingProvider()).Async("Server/RequestEmailChange", [newEmail]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function SaveUsername(newUsername){
  return Bind((new AjaxRemotingProvider()).Async("Server/SaveUsername", [newUsername]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function CheckUsernameAvailability(username){
  return Bind((new AjaxRemotingProvider()).Async("Server/CheckUsernameAvailability", [username]), (o) => Return(o));
}
export function GetUserSettings(){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetUserSettings", []), (o) => Return((DecodeJson_GlobalSettings())(o)));
}
export function AddMealPlan(m){
  return Bind((new AjaxRemotingProvider()).Async("Server/AddMealPlan", [(EncodeJson_MealPlanItem())(m)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function GetMealPlansRange(startDate, endDate){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetMealPlansRange", [((EncodeDateTime())())(startDate), ((EncodeDateTime())())(endDate)]), (o) => Return(((DecodeArray(DecodeJson_MealPlanItem))())(o)));
}
export function AddRecipe(r){
  return Bind((new AjaxRemotingProvider()).Async("Server/AddRecipe", [r]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function GetRecipes(){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetRecipes", []), (o) => Return(o));
}
export function DeleteProduct(id){
  return Bind((new AjaxRemotingProvider()).Async("Server/DeleteProduct", [id]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function AddProduct(p){
  return Bind((new AjaxRemotingProvider()).Async("Server/AddProduct", [p]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function GetProducts(){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetProducts", []), (o) => Return(o));
}
export function AddHealthRecord(r){
  return Bind((new AjaxRemotingProvider()).Async("Server/AddHealthRecord", [(EncodeJson_DailyRecord())(r)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function GetHealthRecords(){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetHealthRecords", []), (o) => Return(((DecodeArray(DecodeJson_DailyRecord))())(o)));
}
export function AddCalendarEvent(ev){
  return Bind((new AjaxRemotingProvider()).Async("Server/AddCalendarEvent", [(EncodeJson_CalendarEvent())(ev)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function GetCalendarEvents(startDate, endDate){
  return Bind((new AjaxRemotingProvider()).Async("Server/GetCalendarEvents", [((EncodeDateTime())())(startDate), ((EncodeDateTime())())(endDate)]), (o) => Return(((DecodeArray(DecodeJson_CalendarEvent))())(o)));
}
export function Logout(){
  return Bind((new AjaxRemotingProvider()).Async("Server/Logout", []), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function AttemptMagicLogin(token){
  return Bind((new AjaxRemotingProvider()).Async("Server/AttemptMagicLogin", [token]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function AttemptVerifyEmail(token){
  return Bind((new AjaxRemotingProvider()).Async("Server/AttemptVerifyEmail", [token]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function UpdateUsername(newName){
  return Bind((new AjaxRemotingProvider()).Async("Server/UpdateUsername", [newName]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function ResetPassword(newPassword){
  return Bind((new AjaxRemotingProvider()).Async("Server/ResetPassword", [newPassword]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function TriggerMagicLink(email){
  return Bind((new AjaxRemotingProvider()).Async("Server/TriggerMagicLink", [email]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function CheckAuthState(){
  return Bind((new AjaxRemotingProvider()).Async("Server/CheckAuthState", []), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function LoginUser(email, password){
  return Bind((new AjaxRemotingProvider()).Async("Server/LoginUser", [email, password]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function RegisterUser(email, password){
  return Bind((new AjaxRemotingProvider()).Async("Server/RegisterUser", [email, password]), (o) => Return((DecodeJson_AuthResult())(o)));
}
