import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import { Lazy } from "../WebSharper.Core.JavaScript/Runtime.js"
let _c=Lazy((_i) => class $StartupCode_Client {
  static {
    _c=_i(this);
  }
  static isMenuCollapsed;
  static currentToast;
  static {
    this.currentToast=Var.Create_1(null);
    this.isMenuCollapsed=Var.Create_1(false);
  }
});
export default _c;
