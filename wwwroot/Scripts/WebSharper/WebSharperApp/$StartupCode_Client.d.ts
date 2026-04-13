import ToastMsg from "./WebSharperApp.Client.ToastMsg"
import { FSharpOption } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1"
import Var from "../WebSharper.UI/WebSharper.UI.Var`1"
export default class $StartupCode_Client {
  static currentToast:Var<FSharpOption<ToastMsg>>;
}
