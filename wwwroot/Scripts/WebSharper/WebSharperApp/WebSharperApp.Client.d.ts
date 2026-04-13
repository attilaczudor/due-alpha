import Doc from "../WebSharper.UI/WebSharper.UI.Doc"
import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
import { View_T } from "../WebSharper.UI/WebSharper.UI.View`1"
import IEnumerable from "../WebSharper.StdLib/System.Collections.Generic.IEnumerable`1"
import { FSharpOption } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1"
import { ToastType } from "./WebSharperApp.Client.ToastType"
import ToastMsg from "./WebSharperApp.Client.ToastMsg"
export function ProductsPage():Doc
export function RecordsPage():Doc
export function RecipesPage():Doc
export function CalendarPage():Doc
export function PlannerPage():Doc
export function SettingsPanel():Doc
export function Dashboard():Doc
export function Sidebar(active:string, username:Var<string>, season:View_T<string>):Doc
export function NavBarAuthWidget():Doc
export function ChangePassword():Doc
export function MagicLogin(token:string):Doc
export function VerifyEmail(token:string):Doc
export function ForgotPassword():Doc
export function AuthCard():Doc
export function RegistrationForm():Doc
export function LoginForm():Doc
export function PasswordStrengthView(passwordScore:View_T<number>):Doc
export function CalculatePasswordScore(p:string):number
export function HomeHero():Doc
export function GlassCard(content:IEnumerable<Doc>):Doc
export function renderDate(d:number, isMain:boolean, onClick:FSharpOption<((a:number) => void)>):Doc
export function getSeasonalInfo(d:number):FSharpOption<[string, string]>
export function getSeasonTheme(season:string, prefix:string, shade:string):string
export function getSeasonIconWithSeason(season:string):string
export function getSeason(d:number):string
export function getWeekNumber(d:number):number
export function getRecentNewMoon(date:number):number
export function getMoonInfo(date:number):[string, string, string]
export function RenderToast():Doc
export function showToast(content:string, t:ToastType):void
export function currentToast():Var<FSharpOption<ToastMsg>>
