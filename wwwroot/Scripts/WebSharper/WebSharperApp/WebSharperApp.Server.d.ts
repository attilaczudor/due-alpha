import { AuthResult } from "./WebSharperApp.AuthResult"
import AsyncBody from "../WebSharper.StdLib/WebSharper.Concurrency.AsyncBody`1"
export function Logout():((a:AsyncBody<AuthResult>) => void)
export function AttemptMagicLogin(token:string):((a:AsyncBody<AuthResult>) => void)
export function AttemptVerifyEmail(token:string):((a:AsyncBody<AuthResult>) => void)
export function ResetPassword(newPassword:string):((a:AsyncBody<AuthResult>) => void)
export function TriggerMagicLink(email:string):((a:AsyncBody<AuthResult>) => void)
export function CheckAuthState():((a:AsyncBody<AuthResult>) => void)
export function LoginUser(email:string, password:string):((a:AsyncBody<AuthResult>) => void)
export function RegisterUser(username:string, email:string, password:string):((a:AsyncBody<AuthResult>) => void)
