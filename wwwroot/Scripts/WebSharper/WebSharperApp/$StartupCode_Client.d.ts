import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
import ToastMsg from "./WebSharperApp.Client.ToastMsg"
import { FSharpOption } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1"
export default class $StartupCode_Client {
  static isMenuCollapsed:Var<boolean>;
  static currentToast:Var<FSharpOption<ToastMsg>>;
}
