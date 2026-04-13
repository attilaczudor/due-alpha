import { FSharpList_T } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1"
import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
import { View_T } from "../WebSharper.UI/WebSharper.UI.View`1"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc"
import IEnumerable from "../WebSharper.StdLib/System.Collections.Generic.IEnumerable`1"
export function Select<T0>(options:FSharpList_T<T0>, current:Var<T0>, toLabel:((a?:T0) => string), accent:View_T<string>, accentHover:View_T<string>, isRightAligned:boolean):Doc
export function IconButton(icon:Doc, accentHover:View_T<string>, onClick:(() => void)):Doc
export function Button(content:IEnumerable<Doc>, accent:View_T<string>, onClick:(() => void)):Doc
