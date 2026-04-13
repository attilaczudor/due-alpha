import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import { Dynamic, Handler } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import { Const, Map } from "../WebSharper.UI/WebSharper.UI.View.js"
import { toSafe } from "../WebSharper.StdLib/WebSharper.Utils.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { map } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
export function Select(options, current, toLabel, accent, accentHover, isRightAligned){
  const isOpen=Var.Create_1(false);
  return Doc.Element("div", [Dynamic("class", Const(isRightAligned?"relative":"relative w-full"))], [Doc.Element("button", [Dynamic("class", Map((a) =>(((_1) =>(_2) => _1("neo-nav-item px-6 py-3 rounded-xl flex items-center justify-center space-x-3 "+toSafe(_2)+" font-bold transition w-full"))((x) => x))(a), accent)), Handler("click", () =>() => isOpen.Set(!isOpen.Get()))], [Doc.EmbedView(Map((v) => Doc.TextNode(toLabel(v)), current.View)), Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\"></path></svg>")]), Doc.EmbedView(Map((openState) => openState?Doc.Element("div", [Attr.Create("class", (((_1) =>(_2) => _1("absolute top-full "+toSafe(_2)+" mt-4 neo-flat rounded-2xl p-2 z-[140] overflow-hidden"))((x) => x))(isRightAligned?"right-0 w-48":"left-0 right-0"))], [Doc.Concat(map((opt) => Doc.Element("div", [Dynamic("class", Map((ah) =>(((_1) =>(_2) => _1("p-3 hover:bg-opacity-10 rounded-xl cursor-pointer transition-colors font-medium text-gray-800 hover:"+toSafe(_2)))((x) => x))(ah), accentHover)), Handler("click", () =>() => {
    current.Set(opt);
    return isOpen.Set(false);
  })], [Doc.TextNode(toLabel(opt))]), options))]):Doc.Empty, isOpen.View))]);
}
export function IconButton(icon, accentHover, onClick){
  return Doc.Element("button", [Dynamic("class", Map((ah) =>(((_1) =>(_2) => _1("w-12 h-12 flex items-center justify-center rounded-full neo-nav-item text-gray-700 hover:"+toSafe(_2)+" transition active:scale-95 transform"))((x) => x))(ah), accentHover)), Handler("click", () =>() => onClick())], [icon]);
}
export function Button(content, accent, onClick){
  return Doc.Element("button", [Dynamic("class", Map((a) =>(((_1) =>(_2) => _1("neo-nav-item px-6 py-3 rounded-xl "+toSafe(_2)+" font-bold transition active:scale-95 transform"))((x) => x))(a), accent)), Handler("click", () =>() => onClick())], content);
}
