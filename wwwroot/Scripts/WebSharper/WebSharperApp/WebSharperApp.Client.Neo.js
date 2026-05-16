import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import { Dynamic, Handler } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import { Const, Map } from "../WebSharper.UI/WebSharper.UI.View.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { toSafe } from "../WebSharper.StdLib/WebSharper.Utils.js"
import { IsNullOrEmpty } from "../WebSharper.StdLib/Microsoft.FSharp.Core.StringModule.js"
import { map } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import { Equals } from "../WebSharper.StdLib/Microsoft.FSharp.Core.Operators.Unchecked.js"
export function Select(options, current, toLabel, placeholder, accent, accentHover, isRightAligned){
  const isOpen=Var.Create_1(false);
  return Doc.Element("div", [Dynamic("class", Const(isRightAligned?"relative":"relative w-full"))], [Doc.EmbedView(Map((openState) => openState?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[130]"), Handler("click", () =>() => isOpen.Set(false))], []):Doc.Empty, isOpen.View)), Doc.Element("button", [Dynamic("class", Map((a) =>(((_1) =>(_2) => _1("neo-flat px-6 py-4 rounded-2xl flex items-center justify-between space-x-3 "+toSafe(_2)+" font-bold transition-all duration-300 w-full"))((x) => x))(a), accent)), Handler("click", () =>() => isOpen.Set(!isOpen.Get()))], [Doc.EmbedView(Map((v) => {
    const label=toLabel(v);
    return IsNullOrEmpty(label)||label=="0"?Doc.Element("span", [Attr.Create("class", "text-gray-400 font-medium")], [Doc.TextNode(placeholder)]):Doc.TextNode(label);
  }, current.View)), Doc.Verbatim("<svg class=\"w-5 h-5 text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\"></path></svg>")]), Doc.EmbedView(Map((openState) => openState?Doc.Element("div", [Attr.Create("class", (((_1) =>(_2) => _1("absolute top-full "+toSafe(_2)+" mt-4 neo-flat rounded-3xl p-3 z-[140] overflow-hidden animate-in fade-in zoom-in-95 duration-200"))((x) => x))(isRightAligned?"right-0 w-48":"left-0 right-0"))], [Doc.Concat(map((opt) => Doc.Element("div", [Dynamic("class", Map(() => {
    const baseC="p-5 rounded-2xl cursor-pointer transition-all duration-200 font-bold text-gray-700 hover:neo-level-2 ";
    return Equals(current.Get(), opt)?baseC+"pl-8 text-emerald-600":baseC;
  }, accentHover)), Handler("click", () =>() => {
    current.Set(opt);
    return isOpen.Set(false);
  })], [Doc.TextNode(toLabel(opt))]), options))]):Doc.Empty, isOpen.View))]);
}
export function IconButton(icon, accentHover, onClick){
  return Doc.Element("button", [Dynamic("class", Map((ah) =>(((_1) =>(_2) => _1("w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 neo-level-0 hover:neo-level-2 "+toSafe(_2)+" active:scale-90 transform"))((x) => x))(ah), accentHover)), Handler("click", () =>() => onClick())], [icon]);
}
export function FullWidthButton(content, accent, onClick){
  return Doc.Element("button", [Dynamic("class", Map((a) =>(((_1) =>(_2) => _1("bg-transparent w-full neo-level-1 hover:neo-level-2 active:neo-level-1 px-6 py-3 rounded-xl "+toSafe(_2)+" font-bold transition-all duration-300 active:scale-95 transform"))((x) => x))(a), accent)), Handler("click", () =>() => onClick())], content);
}
export function Button(content, accent, onClick){
  return Doc.Element("button", [Dynamic("class", Map((a) =>(((_1) =>(_2) => _1("bg-transparent neo-level-1 hover:neo-level-2 active:neo-level-1 px-6 py-3 rounded-xl "+toSafe(_2)+" font-bold transition-all duration-300 active:scale-95 transform"))((x) => x))(a), accent)), Handler("click", () =>() => onClick())], content);
}
