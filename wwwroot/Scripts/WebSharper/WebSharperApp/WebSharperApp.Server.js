import { Bind, Return } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import AjaxRemotingProvider from "../WebSharper.StdLib/WebSharper.Remoting.AjaxRemotingProvider.js"
import { DecodeJson_AuthResult } from "./$Generated.js"
export function Logout(){
  return Bind((new AjaxRemotingProvider()).Async("Server/Logout", []), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function AttemptMagicLogin(token){
  return Bind((new AjaxRemotingProvider()).Async("Server/AttemptMagicLogin", [token]), (o) => Return((DecodeJson_AuthResult())(o)));
}
export function AttemptVerifyEmail(token){
  return Bind((new AjaxRemotingProvider()).Async("Server/AttemptVerifyEmail", [token]), (o) => Return((DecodeJson_AuthResult())(o)));
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
export function RegisterUser(username, email, password){
  return Bind((new AjaxRemotingProvider()).Async("Server/RegisterUser", [username, email, password]), (o) => Return((DecodeJson_AuthResult())(o)));
}
