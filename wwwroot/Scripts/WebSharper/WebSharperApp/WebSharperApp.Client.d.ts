import Doc from "../WebSharper.UI/WebSharper.UI.Doc"
import IEnumerable from "../WebSharper.StdLib/System.Collections.Generic.IEnumerable`1"
export function NavBarAuthWidget():Doc
export function ChangePassword():Doc
export function MagicLogin(token:string):Doc
export function VerifyEmail(token:string):Doc
export function ForgotPassword():Doc
export function AuthCard():Doc
export function RegistrationForm():Doc
export function LoginForm():Doc
export function HomeHero():Doc
export function GlassCard(content:IEnumerable<Doc>):Doc
