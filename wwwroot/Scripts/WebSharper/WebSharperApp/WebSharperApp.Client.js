import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import { Const, Map, Sink, Map2, Map3 } from "../WebSharper.UI/WebSharper.UI.View.js"
import { DatePortion, Create, AddMonths, AddYears } from "../WebSharper.StdLib/WebSharper.DateTimeHelpers.js"
import { StartImmediate, Delay, Bind, Zero, Sleep } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { GetProducts, CheckAuthState, AddProduct, DeleteProduct, GetHealthRecords, AddHealthRecord, GetRecipes, AddRecipe, GetUserSettings, GetCalendarEvents, AddCalendarEvent, GetMealPlansRange, AddMealPlan, UpdateUserSettings, UpdateUsername, Logout, ResetPassword, AttemptMagicLogin, AttemptVerifyEmail, TriggerMagicLink, RegisterUser, LoginUser } from "./WebSharperApp.Server.js"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { ofSeq, ofArray, map, init, append } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ListModule.js"
import { delay, append as append_1, take, map as map_1, collect } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.SeqModule.js"
import { Button, Select, IconButton } from "./WebSharperApp.Client.Neo.js"
import { Handler, Dynamic } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
import { New } from "./WebSharperApp.ProductItem.js"
import { length } from "../WebSharper.StdLib/Microsoft.FSharp.Core.LanguagePrimitives.IntrinsicFunctions.js"
import { New as New_1 } from "./WebSharperApp.DailyRecord.js"
import { DateFormatter } from "../WebSharper.StdLib/WebSharper.JavaScript.Pervasives.DateTime.js"
import { New as New_2 } from "./WebSharperApp.RecipeEntry.js"
import { toInt, range } from "../WebSharper.StdLib/Microsoft.FSharp.Core.Operators.js"
import { New as New_3 } from "./WebSharperApp.CalendarEvent.js"
import { Some } from "../WebSharper.StdLib/Microsoft.FSharp.Core.FSharpOption`1.js"
import { skip } from "../WebSharper.StdLib/WebSharper.CollectionInternals.js"
import { toSafe } from "../WebSharper.StdLib/WebSharper.Utils.js"
import { filter, map as map_2, tryFind } from "../WebSharper.StdLib/Microsoft.FSharp.Collections.ArrayModule.js"
import FSharpList from "../WebSharper.StdLib/Microsoft.FSharp.Collections.FSharpList`1.js"
import { New as New_4 } from "./WebSharperApp.MealPlanItem.js"
import { New as New_5 } from "./WebSharperApp.GlobalSettings.js"
import { IsNullOrWhiteSpace, Substring } from "../WebSharper.StdLib/Microsoft.FSharp.Core.StringModule.js"
import { Success, Error } from "./WebSharperApp.Client.ToastType.js"
import { Error as Error_1 } from "./WebSharperApp.AuthResult.js"
import { New as New_6 } from "./WebSharperApp.Client.ToastMsg.js"
import $StartupCode_Client from "./$StartupCode_Client.js"
export function ProductsPage(){
  const username=Var.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  const products=Var.Create_1([]);
  const showAddModal=Var.Create_1(false);
  const newName=Var.Create_1("");
  const newCategory=Var.Create_1("Groceries");
  const newStock=Var.Create_1("0");
  const newUnit=Var.Create_1("pcs");
  const loadProducts=() => {
    StartImmediate(Delay(() => Bind(GetProducts(), (a) => {
      products.Set(a);
      return Zero();
    })), null);
  };
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadProducts(),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Products", username, season), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-8")], ofSeq(delay(() => append_1([Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900")], [Doc.TextNode("Product Inventory")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("+ Add Product")], accent, () => {
      showAddModal.Set(true);
    })];
  }))))), Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showAddModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-md neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode("Add Warehouse Item")]), Doc.Element("div", [Attr.Create("class", "space-y-4")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Product Name")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newName)]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-2 gap-4")], [Doc.Element("div", [], ofSeq(delay(() => append_1([Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Category")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
    return[Select(ofArray(["Groceries", "Meat", "Dairy", "Veggie", "Treats"]), newCategory, (x) => x, accent, accentBg, false)];
  }))))), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Unit")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newUnit)])]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Current Stock")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newStock)]), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], ofSeq(delay(() => append_1([Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showAddModal.Set(false))], [Doc.TextNode("Cancel")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("Save Product")], Map((a) =>"flex-1 "+a, accent), () => {
      StartImmediate(Delay(() => newName.Get()!=""?Bind(AddProduct(New(0, newName.Get(), newCategory.Get(), Number(newStock.Get()), newUnit.Get(), 0, 0, 0, 0)), (a) => a.$==0?(newName.Set(""),newStock.Set("0"),showAddModal.Set(false),loadProducts(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero()):Zero()), null);
    })];
  })))))])])]):Doc.Empty, showAddModal.View)), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8")], [Doc.EmbedView(Map((a) => Doc.Concat(a), Map((ps) => length(ps)===0?ofArray([Doc.Element("div", [Attr.Create("class", "col-span-full neo-pressed p-20 rounded-3xl text-center opacity-40")], [Doc.Element("div", [Attr.Create("class", "text-gray-600 font-bold italic mb-2")], [Doc.TextNode("Inventory is empty")]), Doc.Element("div", [Attr.Create("class", "text-[10px] text-gray-600 uppercase tracking-widest")], [Doc.TextNode("Start by adding your first product")])])]):map((p) => {
    let _1=[Attr.Create("class", "neo-nav-item p-6 rounded-3xl group relative")];
    let _2=Doc.Element("div", [Attr.Create("class", "absolute top-4 right-4 text-xs font-bold text-emerald-600 opacity-60")], [Doc.TextNode(p.Category)]);
    let _3=[Attr.Create("class", "w-12 h-12 neo-pressed rounded-xl mb-4 flex items-center justify-center text-2xl")];
    const m=p.Category;
    let _4=[Doc.TextNode(m=="Meat"?"\ud83c\udf56":m=="Dairy"?"\ud83e\udd5b":m=="Veggie"?"\ud83e\udd66":m=="Treats"?"\ud83c\udf6c":"\ud83d\uded2")];
    let _5=Doc.Element("div", _3, _4);
    let _6=[_2, _5, Doc.Element("h3", [Attr.Create("class", "font-bold text-gray-800 text-lg mb-1")], [Doc.TextNode(p.Name)]), Doc.Element("div", [Attr.Create("class", "flex items-baseline space-x-1")], [Doc.Element("span", [Attr.Create("class", "text-2xl font-black text-gray-700")], [Doc.TextNode(String(p.Stock))]), Doc.Element("span", [Attr.Create("class", "text-xs font-bold text-gray-600 uppercase")], [Doc.TextNode(p.Unit)])]), Doc.Element("div", [Attr.Create("class", "mt-6 flex space-x-3")], ofSeq(delay(() => {
      const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
      return append_1([Button([Doc.TextNode("Update")], Map((a) =>"flex-1 text-[10px] uppercase tracking-tighter "+a, accent), () => { })], delay(() =>[IconButton(Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"></path></svg>"), Const("text-red-400"), () => {
        StartImmediate(Delay(() => Bind(DeleteProduct(p.Id), () => {
          loadProducts();
          return Zero();
        })), null);
      })]));
    })))];
    return Doc.Element("div", _1, _6);
  }, ofArray(ps)), products.View)))])])]);
}
export function RecordsPage(){
  const username=Var.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  const records=Var.Create_1([]);
  const newType=Var.Create_1("Blood Glucose");
  const newValue=Var.Create_1("");
  const newUnit=Var.Create_1("mmol/L");
  const loadRecords=() => {
    StartImmediate(Delay(() => Bind(GetHealthRecords(), (a) => {
      records.Set(a);
      return Zero();
    })), null);
  };
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadRecords(),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Records", username, season), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-800 mb-6")], [Doc.TextNode("Health Records")]), Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl mb-10")], [Doc.Element("h2", [Attr.Create("class", "text-xl font-bold mb-6 text-gray-700")], [Doc.TextNode("Add New Measurement")]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-4 gap-6 items-end")], ofSeq(delay(() => append_1([Doc.Element("div", [], ofSeq(delay(() => append_1([Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Type")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
    return[Select(ofArray(["Blood Glucose", "Weight", "Blood Pressure", "Heart Rate"]), newType, (x) => x, accent, accentBg, false)];
  })))))], delay(() => append_1([Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Value")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none placeholder:text-gray-400")], newValue)])], delay(() => append_1([Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Unit")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none placeholder:text-gray-400")], newUnit)])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
    Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("Save Entry")], accentBg, () => {
      StartImmediate(Delay(() => newValue.Get()!=""?Bind(AddHealthRecord(New_1(0, Date.now(), newType.Get(), newValue.Get(), newUnit.Get(), "Normal")), (a) => a.$==0?(newValue.Set(""),loadRecords(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero()):Zero()), null);
    })];
  })))))))))]), Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl")], [Doc.Element("table", [Attr.Create("class", "w-full text-left")], [Doc.Element("thead", [], [Doc.Element("tr", [Attr.Create("class", "text-gray-600 text-sm uppercase tracking-wider")], [Doc.Element("th", [Attr.Create("class", "pb-4 pl-4")], [Doc.TextNode("Date")]), Doc.Element("th", [Attr.Create("class", "pb-4")], [Doc.TextNode("Type")]), Doc.Element("th", [Attr.Create("class", "pb-4")], [Doc.TextNode("Value")]), Doc.Element("th", [Attr.Create("class", "pb-4 pr-4 text-right")], [Doc.TextNode("Status")])])]), Doc.Element("tbody", [], [Doc.EmbedView(Map((a) => Doc.Concat(a), Map((rs) => length(rs)===0?ofArray([Doc.Element("tr", [], [Doc.Element("td", [Attr.Create("colspan", "4"), Attr.Create("class", "text-center py-10 text-gray-600 italic")], [Doc.TextNode("No records found. Add your first measurement above.")])])]):map((r) => Doc.Element("tr", [Attr.Create("class", "border-t border-gray-100")], [Doc.Element("td", [Attr.Create("class", "py-4 pl-4 font-medium text-gray-600")], [Doc.TextNode(DateFormatter(r.RecordDate, "yyyy-MM-dd HH:mm"))]), Doc.Element("td", [Attr.Create("class", "py-4 text-gray-700")], [Doc.TextNode(r.Type)]), Doc.Element("td", [Attr.Create("class", "py-4 text-gray-700 font-bold")], [Doc.TextNode(r.Value+" "+r.Unit)]), Doc.Element("td", [Attr.Create("class", "py-4 pr-4 text-right")], [Doc.Element("span", [Attr.Create("class", "px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold")], [Doc.TextNode(r.Status)])])]), ofArray(rs)), records.View)))])])])])]);
}
export function RecipesPage(){
  const username=Var.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  const recipes=Var.Create_1([]);
  const showAddModal=Var.Create_1(false);
  const newName=Var.Create_1("");
  const newInst=Var.Create_1("");
  const newKcal=Var.Create_1("300");
  const newPrep=Var.Create_1("20");
  const newIcon=Var.Create_1("\ud83e\udd57");
  const loadRecipes=() => {
    StartImmediate(Delay(() => Bind(GetRecipes(), (a) => {
      recipes.Set(a);
      return Zero();
    })), null);
  };
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadRecipes(),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Recipes", username, season), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-8")], ofSeq(delay(() => append_1([Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-800")], [Doc.TextNode("My Recipes")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("+ Add Recipe")], accent, () => {
      showAddModal.Set(true);
    })];
  }))))), Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showAddModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-lg neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode("Cookbook Entry")]), Doc.Element("div", [Attr.Create("class", "space-y-4")], [Doc.Element("div", [Attr.Create("class", "grid grid-cols-3 gap-4 mb-4")], [Doc.Concat(map((i) => Doc.Element("button", [Dynamic("class", Map((current) => current==i?"neo-pressed p-4 rounded-xl text-2xl":"neo-flat p-4 rounded-xl text-2xl active:scale-95 transition", newIcon.View)), Handler("click", () =>() => newIcon.Set(i))], [Doc.TextNode(i)]), ofArray(["\ud83e\udd57", "\ud83e\udd69", "\ud83c\udf5d", "\ud83e\udd51", "\ud83e\udd6a", "\ud83c\udf70"])))]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Recipe Name")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newName)]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-2 gap-4")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Prep Time (min)")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newPrep)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Calories (kcal)")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newKcal)])]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Instructions")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newInst)]), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], ofSeq(delay(() => append_1([Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showAddModal.Set(false))], [Doc.TextNode("Cancel")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("Save Cookbook")], Map((a) =>"flex-1 "+a, accent), () => {
      StartImmediate(Delay(() => newName.Get()!=""?Bind(AddRecipe(New_2(0, newName.Get(), newInst.Get(), toInt(Number(newPrep.Get())), toInt(Number(newKcal.Get())), newIcon.Get())), (a) => a.$==0?(newName.Set(""),showAddModal.Set(false),loadRecipes(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero()):Zero()), null);
    })];
  })))))])])]):Doc.Empty, showAddModal.View)), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")], [Doc.EmbedView(Map((a) => Doc.Concat(a), Map((rs) => length(rs)===0?ofArray([Doc.Element("div", [Attr.Create("class", "col-span-full neo-pressed p-20 rounded-3xl text-center opacity-40")], [Doc.Element("div", [Attr.Create("class", "text-gray-600 font-bold italic mb-2")], [Doc.TextNode("Your cookbook is empty")]), Doc.Element("div", [Attr.Create("class", "text-[10px] text-gray-600 uppercase tracking-widest")], [Doc.TextNode("Share your first secret recipe")])])]):map((r) => Doc.Element("div", [Attr.Create("class", "neo-nav-item p-6 rounded-3xl group cursor-pointer hover:scale-[1.01] transition duration-300")], [Doc.Element("div", [Attr.Create("class", "w-full h-40 neo-pressed rounded-2xl mb-4 overflow-hidden flex items-center justify-center text-6xl")], [Doc.TextNode(r.Icon)]), Doc.Element("h3", [Attr.Create("class", "font-black text-gray-800 text-xl")], [Doc.TextNode(r.Name)]), Doc.Element("p", [Attr.Create("class", "text-sm text-gray-600 mt-2 line-clamp-2 italic")], [Doc.TextNode(r.Instructions)]), Doc.Element("div", [Attr.Create("class", "flex justify-between mt-6 pt-4 border-t border-gray-100")], [Doc.Element("div", [Attr.Create("class", "flex items-center space-x-1 text-gray-700")], [Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\"></path></svg>"), Doc.Element("span", [Attr.Create("class", "text-xs font-bold")], [Doc.TextNode(String(r.PrepTime)+"m")])]), Doc.Element("div", [Attr.Create("class", "flex items-center space-x-1 text-orange-400")], [Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 3 5.5 6 5.5 9.5a7 7 0 01-2.343 5.657z\"></path></svg>"), Doc.Element("span", [Attr.Create("class", "text-xs font-bold")], [Doc.TextNode(String(r.Kcal)+" kcal")])])])]), ofArray(rs)), recipes.View)))])])]);
}
export function CalendarPage(){
  const username=Var.Create_1("Loading...");
  const viewMode=Var.Create_1("Monthly");
  const refDate=Var.Create_1(DatePortion(Date.now()));
  const events=Var.Create_1([]);
  const showAddModal=Var.Create_1(false);
  const newEventTitle=Var.Create_1("");
  const newEventDesc=Var.Create_1("");
  const newEventType=Var.Create_1("Personal");
  const calendarStartDay=Var.Create_1("Monday");
  const selectedDateForSidebar=Var.Create_1(null);
  const isSidebarOpen=Var.Create_1(false);
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),Bind(GetUserSettings(), (a_1) => {
    calendarStartDay.Set(a_1.CalendarStartDay);
    return Zero();
  })):(globalThis.location.href="/",Zero()))), null);
  const loadEvents=() => {
    StartImmediate(Delay(() => {
      const start=Create((new Date(refDate.Get())).getFullYear(), (new Date(refDate.Get())).getMonth()+1, 1, 0, 0, 0, 0)+-7*864E5;
      return Bind(GetCalendarEvents(start, start+42*864E5), (a) => {
        events.Set(a);
        return Zero();
      });
    }), null);
  };
  Sink(() => {
    loadEvents();
  }, refDate.View);
  const currentSeason=Map(getSeason, refDate.View);
  const accent=Map((s) => getSeasonTheme(s, "text", "600"), currentSeason);
  const accentHover=Map((s) => getSeasonTheme(s, "hover:text", "500"), currentSeason);
  Map((s) => getSeasonTheme(s, "bg", "100"), currentSeason);
  const step=(direction) => {
    const multiplier=direction=="next"?1:-1;
    const m=viewMode.Get();
    if(m=="Daily")refDate.Set(refDate.Get()+multiplier*1*864E5);
    else if(m=="Weekly")refDate.Set(refDate.Get()+multiplier*7*864E5);
    else if(m=="Lunar")refDate.Set(refDate.Get()+multiplier*29.53*864E5);
    else if(m=="Monthly")refDate.Set(AddMonths(refDate.Get(), toInt(multiplier)));
    else if(m=="Year")refDate.Set(AddYears(refDate.Get(), toInt(multiplier)));
    else refDate.Set(refDate.Get()+multiplier*7*864E5);
  };
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Calendar", username, currentSeason), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full flex flex-col")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-10")], [Doc.Element("div", [], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900")], [Doc.EmbedView(Map((v) => Doc.TextNode(v+" View"), viewMode.View))]), Doc.Element("p", [Attr.Create("class", "text-gray-700 mt-2")], [Doc.EmbedView(Map2((_1, _2) => _1=="Year"?Doc.TextNode(DateFormatter(_2, "yyyy")):Doc.TextNode(DateFormatter(_2, "MMMM yyyy")), viewMode.View, refDate.View))])]), Doc.Element("div", [Attr.Create("class", "flex items-center space-x-6 relative")], [Button([Doc.TextNode("Today")], accent, () => {
    refDate.Set(DatePortion(Date.now()));
  }), Select(ofArray(["Weekly", "Monthly", "Lunar", "Year"]), viewMode, (x) => x, accent, accentHover, true), Doc.Element("div", [Attr.Create("class", "flex space-x-3")], [IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 19l-7-7 7-7\"></path></svg>"), accentHover, () => {
    step("prev");
  }), IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5l7 7-7 7\"></path></svg>"), accentHover, () => {
    step("next");
  })])])]), Doc.Element("div", [Attr.Create("class", "flex-1 w-full")], [Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showAddModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-md neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode("Create New Event")]), Doc.Element("div", [Attr.Create("class", "space-y-4")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-sm font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Title")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newEventTitle)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-sm font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Category")]), Select(ofArray(["Personal", "Work", "Important", "Health"]), newEventType, (x) => x, accent, accentHover, false)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-sm font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Description")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newEventDesc)]), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], [Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showAddModal.Set(false))], [Doc.TextNode("Cancel")]), Button([Doc.TextNode("Save Event")], Map((a) =>"flex-1 "+a, accent), () => {
    StartImmediate(Delay(() => {
      const m=newEventType.Get();
      const icon=m=="Work"?"\ud83d\udcbc":m=="Health"?"\ud83c\udfe5":m=="Important"?"\u26a0\ufe0f":"\ud83d\udcc5";
      return Bind(AddCalendarEvent(New_3(0, newEventTitle.Get(), newEventDesc.Get(), refDate.Get(), newEventType.Get(), icon)), (a) => a.$==0?(showAddModal.Set(false),newEventTitle.Set(""),newEventDesc.Set(""),loadEvents(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero());
    }), null);
  })])])])]):Doc.Empty, showAddModal.View)), Doc.EmbedView(Map3((_1, _2, _3) => {
    const startDayOffset=_3=="Sunday"?0:_3=="Monday"?1:_3=="Tuesday"?2:_3=="Wednesday"?3:_3=="Thursday"?4:_3=="Friday"?5:_3=="Saturday"?6:1;
    const onDateClick=(d) => {
      selectedDateForSidebar.Set(Some(d));
      isSidebarOpen.Set(true);
    };
    if(_1=="Weekly"){
      let _4=[Attr.Create("class", "flex flex-col space-y-4")];
      let _5=Doc.Element("div", [Attr.Create("class", "text-sm font-bold text-gray-600 pl-2 uppercase")], [Doc.TextNode("Week "+String(getWeekNumber(_2)))]);
      let _6=[Attr.Create("class", "grid grid-cols-7 gap-6")];
      const weekStart=_2+-((toInt(Number((new Date(_2)).getDay()))-startDayOffset+7)%7)*864E5;
      let _7=init(7, (i) => renderDate(weekStart+i*864E5, true, Some(onDateClick)));
      let _8=Doc.Element("div", _6, _7);
      let _9=[_5, _8];
      return Doc.Element("div", _4, _9);
    }
    else if(_1=="Monthly"){
      const startOfMonth=Create((new Date(_2)).getFullYear(), (new Date(_2)).getMonth()+1, 1, 0, 0, 0, 0);
      const firstDayOffset=(toInt(Number((new Date(startOfMonth)).getDay()))-startDayOffset+7)%7;
      const days=ofArray(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
      const rotatedHeaders=append(skip(startDayOffset, days), ofSeq(take(startDayOffset, days)));
      return Doc.Element("div", [Attr.Create("class", "grid grid-cols-[auto_repeat(7,1fr)] gap-4")], [Doc.Element("span", [Attr.Create("class", "w-10")], []), Doc.Concat(map((d) => Doc.Element("span", [Attr.Create("class", "text-center text-xs font-bold text-gray-700 mb-2")], [Doc.TextNode(d)]), rotatedHeaders)), Doc.Concat(init(6, (weekIdx) => {
        const weekStartDate=startOfMonth+(weekIdx*7-firstDayOffset)*864E5;
        return(new Date(weekStartDate)).getMonth()+1===(new Date(_2)).getMonth()+1||(new Date(weekStartDate+6*864E5)).getMonth()+1===(new Date(_2)).getMonth()+1?Doc.Concat([Doc.Element("div", [Attr.Create("class", "flex items-center justify-center text-[10px] font-black text-gray-700 uppercase vertical-lr py-4 border-r border-gray-100")], [Doc.TextNode("W"+String(getWeekNumber(weekStartDate)))]), Doc.Concat(init(7, (dayIdx) => {
          const d=weekStartDate+dayIdx*864E5;
          return(new Date(d)).getMonth()+1===(new Date(_2)).getMonth()+1?renderDate(d, true, Some(onDateClick)):Doc.Element("div", [Attr.Create("class", "opacity-0 pointer-events-none")], []);
        }))]):Doc.Empty;
      }))]);
    }
    else if(_1=="Lunar"){
      const lunarStart=getRecentNewMoon(_2);
      return Doc.Element("div", [Attr.Create("class", "flex-1 w-full flex flex-col")], [Doc.Element("div", [Attr.Create("class", "grid grid-cols-[80px_repeat(7,1fr)] gap-4 mb-8")], [Doc.Element("span", [], []), Doc.Concat(map((d) => Doc.Element("span", [Attr.Create("class", "text-center text-xs font-bold text-gray-700 uppercase opacity-60")], [Doc.TextNode((((_10) =>(_11) => _10("Day "+String(_11)))((x) => x))(d))]), ofSeq(range(1, 7))))]), Doc.Concat(init(4, (weekIdx) => {
        const weekStart_1=lunarStart+weekIdx*7*864E5;
        const p=weekIdx===0?["\ud83c\udf11", "New Moon"]:weekIdx===1?["\ud83c\udf13", "First Quarter"]:weekIdx===2?["\ud83c\udf15", "Full Moon"]:weekIdx===3?["\ud83c\udf17", "Last Quarter"]:["\ud83c\udf19", "Phase"];
        return Doc.Element("div", [Attr.Create("class", "grid grid-cols-[80px_repeat(7,1fr)] gap-4 mb-4 items-center")], [Doc.Element("div", [Attr.Create("class", "flex flex-col items-center justify-center p-2 neo-pressed rounded-xl")], [Doc.Element("span", [Attr.Create("class", "text-xl")], [Doc.TextNode(p[0])]), Doc.Element("span", [Attr.Create("class", "text-[8px] font-black text-gray-700 uppercase")], [Doc.TextNode(p[1])])]), Doc.Concat(init(7, (dayIdx) => renderDate(weekStart_1+dayIdx*864E5, true, Some(onDateClick))))]);
      }))]);
    }
    else return _1=="Year"?Doc.Element("div", [Attr.Create("class", "h-full overflow-y-auto space-y-10 pr-4 mt-2")], [Doc.Concat(init(12, (i) => {
      const month=AddMonths(Create((new Date(_2)).getFullYear(), 1, 1, 0, 0, 0, 0), i);
      return Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl")], [Doc.Element("h3", [Attr.Create("class", "text-2xl font-bold text-gray-800 mb-6")], [Doc.TextNode(DateFormatter(month, "MMMM yyyy"))]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-[auto_repeat(7,1fr)] gap-2")], ofSeq(delay(() => append_1([Doc.Element("span", [Attr.Create("class", "w-6")], [])], delay(() => {
        const daysShort=ofArray(["S", "M", "T", "W", "T", "F", "S"]);
        return append_1([Doc.Concat(map((d) => Doc.Element("span", [Attr.Create("class", "text-center text-[10px] font-bold text-gray-700")], [Doc.TextNode(d)]), append(skip(startDayOffset, daysShort), ofSeq(take(startDayOffset, daysShort)))))], delay(() => {
          const firstDayOffsetYear=(toInt(Number((new Date(month)).getDay()))-startDayOffset+7)%7;
          (new Date((new Date(month)).getFullYear(), (new Date(month)).getMonth()+1, 0)).getDate();
          return[Doc.Concat(init(6, (w) => {
            const ws=month+(w*7-firstDayOffsetYear)*864E5;
            return(new Date(ws)).getMonth()+1===(new Date(month)).getMonth()+1||(new Date(ws+6*864E5)).getMonth()+1===(new Date(month)).getMonth()+1?Doc.Concat([Doc.Element("div", [Attr.Create("class", "text-[8px] font-bold text-gray-700 flex items-center justify-center")], [Doc.TextNode(String(getWeekNumber(ws)))]), Doc.Concat(init(7, (d) => {
              const dayDate=ws+d*864E5;
              return(new Date(dayDate)).getMonth()+1===(new Date(month)).getMonth()+1?Doc.Element("div", [Dynamic("class", Map((a) => {
                const bc="aspect-square flex items-center justify-center neo-nav-item rounded-lg text-sm cursor-pointer ";
                return DatePortion(dayDate)==DatePortion(Date.now())?(((((_10) =>(_11) =>(_12) =>(_13) => _10(toSafe(_11)+" "+toSafe(_12)+" font-bold border "+toSafe(_13)))((x) => x))(bc))(a))(getSeasonTheme(getSeason(dayDate), "border", "200")):bc+"text-gray-700";
              }, accent)), Handler("click", () =>() => onDateClick(dayDate))], [Doc.TextNode(String((new Date(dayDate)).getDate()))]):Doc.Element("div", [], []);
            }))]):Doc.Empty;
          }))];
        }));
      })))))]);
    }))]):Doc.Empty;
  }, viewMode.View, refDate.View, calendarStartDay.View))])]), Doc.EmbedView(Map((openState) => {
    if(openState&&selectedDateForSidebar.Get()!=null){
      const d=selectedDateForSidebar.Get().$0;
      return Doc.Element("div", [Attr.Create("class", "w-[360px] neo-flat m-6 rounded-3xl p-6 flex flex-col animate-in slide-in-from-right duration-300")], [Doc.Element("div", [Attr.Create("class", "flex justify-end mb-4")], [Doc.Element("button", [Attr.Create("class", "w-10 h-10 flex items-center justify-center rounded-full neo-nav-item text-gray-600 hover:text-red-500 transition"), Handler("click", () =>() => isSidebarOpen.Set(false))], [Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\"></path></svg>")])]), Doc.Element("div", [Attr.Create("class", "mb-8 flex flex-col items-center")], [Doc.Element("div", [Attr.Create("class", "w-48 mb-6")], [renderDate(d, true, null)]), Doc.Element("div", [Attr.Create("class", "text-center")], [Doc.Element("h2", [Attr.Create("class", "text-sm font-bold text-gray-400 uppercase tracking-widest")], [Doc.TextNode(DateFormatter(d, "dddd"))]), Doc.Element("h3", [Attr.Create("class", "text-2xl font-black text-gray-800")], [Doc.TextNode(DateFormatter(d, "MMMM d"))])])]), Doc.Element("div", [Attr.Create("class", "flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar")], [Doc.Element("h4", [Attr.Create("class", "text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-2")], [Doc.TextNode("Scheduled Events")]), Doc.EmbedView(Map((evs) => {
        const dayEvents=filter((e) => DatePortion(e.EventDate)==DatePortion(d), evs);
        return length(dayEvents)===0?Doc.Element("div", [Attr.Create("class", "p-10 neo-pressed rounded-3xl text-center opacity-40")], [Doc.TextNode("No events for this day")]):Doc.Concat(map_2((e) => Doc.Element("div", [Attr.Create("class", "p-5 rounded-2xl neo-nav-item border-l-4 border-indigo-400 active:scale-95 transition")], [Doc.Element("div", [Attr.Create("class", "flex justify-between mb-1")], [Doc.Element("span", [Attr.Create("class", "text-[10px] font-bold text-indigo-600 uppercase")], [Doc.TextNode(e.EventType)]), Doc.Element("span", [Attr.Create("class", "text-xl")], [Doc.TextNode(e.Icon)])]), Doc.Element("p", [Attr.Create("class", "text-base font-bold text-gray-800")], [Doc.TextNode(e.Title)]), Doc.Element("p", [Attr.Create("class", "text-xs text-gray-600 mt-1")], [Doc.TextNode(e.Description)])]), dayEvents));
      }, events.View))])]);
    }
    else return Doc.Empty;
  }, isSidebarOpen.View))]);
}
export function PlannerPage(){
  const username=Var.Create_1("Loading...");
  const refDate=Var.Create_1(DatePortion(Date.now()));
  const currentSeason=Map(getSeason, refDate.View);
  const accent=Map((s) => getSeasonTheme(s, "text", "600"), currentSeason);
  const accentHover=Map((s) => getSeasonTheme(s, "hover:text", "500"), currentSeason);
  Map((s) => getSeasonTheme(s, "bg", "100"), currentSeason);
  const mealPlans=Var.Create_1([]);
  const recipesList=Var.Create_1([]);
  const showPlanModal=Var.Create_1(false);
  const selectedDay=Var.Create_1(DatePortion(Date.now()));
  const selectedMealType=Var.Create_1("Lunch");
  const selectedRecipeId=Var.Create_1(["-1", "Custom Meal"]);
  const customMealTitle=Var.Create_1("");
  const loadPlannerData=() => {
    StartImmediate(Delay(() => {
      const current=refDate.Get();
      const startOfWeek_1=current+(1-(toInt(Number((new Date(current)).getDay()))===0?7:toInt(Number((new Date(current)).getDay()))))*864E5;
      return Bind(GetMealPlansRange(startOfWeek_1, startOfWeek_1+6*864E5), (a) => {
        mealPlans.Set(a);
        return Bind(GetRecipes(), (a_1) => {
          recipesList.Set(a_1);
          return Zero();
        });
      });
    }), null);
  };
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadPlannerData(),Zero()):(globalThis.location.href="/",Zero()))), null);
  const startOfWeek=Map((d) => d+(1-(toInt(Number((new Date(d)).getDay()))===0?7:toInt(Number((new Date(d)).getDay()))))*864E5, refDate.View);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Planner", username, currentSeason), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-10")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900")], [Doc.TextNode("Meal Planner")]), Doc.Element("div", [Attr.Create("class", "flex space-x-3")], [IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 19l-7-7 7-7\"></path></svg>"), accentHover, () => {
    refDate.Set(refDate.Get()+-7*864E5);
    loadPlannerData();
  }), Button([Doc.TextNode("This Week")], accent, () => {
    refDate.Set(DatePortion(Date.now()));
    loadPlannerData();
  }), IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5l7 7-7 7\"></path></svg>"), accentHover, () => {
    refDate.Set(refDate.Get()+7*864E5);
    loadPlannerData();
  })])]), Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showPlanModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-md neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode((((_1) =>(_2) => _1("Plan for "+toSafe(_2)))((x) => x))(DateFormatter(selectedDay.Get(), "MMM dd")))]), Doc.Element("div", [Attr.Create("class", "space-y-6")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Meal Slot")]), Select(ofArray(["Breakfast", "Lunch", "Dinner", "Snack"]), selectedMealType, (x) => x, accent, accentHover, false)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Select Recipe")]), Select(FSharpList.Cons(["-1", "Custom Meal"], map((r) =>[String(r.Id), r.Name], ofArray(recipesList.Get()))), selectedRecipeId, (t) => t[1], accent, accentHover, false)]), Doc.EmbedView(Map((_1) => _1[0]=="-1"?Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Meal Title")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], customMealTitle)]):Doc.Empty, selectedRecipeId.View)), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], [Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showPlanModal.Set(false))], [Doc.TextNode("Cancel")]), Button([Doc.TextNode("Assign Meal")], Map((a) =>"flex-1 "+a, accent), () => {
    StartImmediate(Delay(() => {
      let title;
      const ridStr=(selectedRecipeId.Get())[0];
      const rid=ridStr=="-1"?null:Some(toInt(Number(ridStr)));
      if(rid!=null){
        const m=tryFind((r) => r.Id===rid.$0, recipesList.Get());
        title=m==null?customMealTitle.Get():m.$0.Name;
      }
      else title=customMealTitle.Get();
      return Bind(AddMealPlan(New_4(0, selectedDay.Get(), selectedMealType.Get(), rid, title, "")), (a) => a.$==0?(showPlanModal.Set(false),loadPlannerData(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero());
    }), null);
  })])])])]):Doc.Empty, showPlanModal.View)), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-7 gap-6")], map((i) => Doc.EmbedView(Map((start) => {
    const dayDate=start+i*864E5;
    return Doc.Element("div", [Attr.Create("class", "flex flex-col space-y-4")], [Doc.Element("div", [Attr.Create("class", "w-full")], [renderDate(dayDate, true, null)]), Doc.Element("div", [Attr.Create("class", "flex-1 space-y-4")], [Doc.Concat(map((mType) => Doc.Element("div", [Attr.Create("class", "neo-nav-item p-4 rounded-2xl min-h-[100px] flex flex-col group cursor-pointer active:scale-95 transition"), Handler("click", () =>() => {
      selectedDay.Set(dayDate);
      selectedMealType.Set(mType);
      return showPlanModal.Set(true);
    })], [Doc.Element("span", [Attr.Create("class", "text-[10px] font-bold text-gray-700 uppercase tracking-tighter mb-2")], [Doc.TextNode(mType)]), Doc.EmbedView(Map((plans) => {
      const a=tryFind((p_1) => DatePortion(p_1.PlanDate)==DatePortion(dayDate)&&p_1.MealType==mType, plans);
      if(a==null)return Doc.Element("div", [Attr.Create("class", "flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition")], [Doc.Element("span", [Attr.Create("class", "text-xs text-gray-600 italic")], [Doc.TextNode("+ Plan")])]);
      else {
        const p=a.$0;
        return Doc.Element("div", [Attr.Create("class", "flex-1")], [Doc.Element("span", [Attr.Create("class", "text-sm font-bold text-gray-700")], [Doc.TextNode(p.Title)])]);
      }
    }, mealPlans.View))]), ofArray(["Breakfast", "Lunch", "Dinner"])))])]);
  }, startOfWeek)), ofSeq(range(0, 6))))])]);
}
export function SettingsPanel(){
  const username=Var.Create_1("Loading...");
  const newUsername=Var.Create_1("");
  const email=Var.Create_1("user@example.com");
  const password=Var.Create_1("");
  const activeTab=Var.Create_1("Account");
  const calendarStartDay=Var.Create_1("Monday");
  const avatarUrl=Var.Create_1("");
  const season=Const(getSeason(DatePortion(Date.now())));
  const accentText=Map((s) => getSeasonTheme(s, "text", "600"), season);
  const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
  Map((s) => getSeasonTheme(s, "hover:text", "500"), season);
  const message=Var.Create_1("");
  const isSuccess=Var.Create_1(false);
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => {
    if(a.$==1){
      const u=a.$0;
      username.Set(u);
      newUsername.Set(u);
      return Bind(GetUserSettings(), (a_1) => {
        calendarStartDay.Set(a_1.CalendarStartDay);
        const x=a_1.AvatarUrl;
        let _1=x==null?"":x.$0;
        avatarUrl.Set(_1);
        return Zero();
      });
    }
    else {
      globalThis.location.href="/";
      return Zero();
    }
  })), null);
  Sink((day) => {
    if(day!="Loading..."&&username.Get()!="Loading...")StartImmediate(Delay(() => Bind(UpdateUserSettings(New_5(day, Some(avatarUrl.Get()))), () => Zero())), null);
  }, calendarStartDay.View);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Settings", username, season), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full flex flex-col")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900 mb-10")], [Doc.TextNode("Settings")]), Doc.Element("div", [Attr.Create("class", "flex space-x-6 mb-10")], ofSeq(delay(() => map_1((tab) => Doc.Element("button", [Dynamic("class", Map((t) => t==tab?"px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 "+"neo-pressed bg-opacity-20 translate-y-px":"px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 "+"neo-flat text-gray-600 hover:text-gray-900", activeTab.View)), Dynamic("class", Map((at) => activeTab.Get()==tab?at:"", accentText)), Handler("click", () =>() => activeTab.Set(tab))], [Doc.TextNode(tab)]), ["Account", "Calendar", "Other"])))), Doc.Element("div", [Attr.Create("class", "flex-grow")], [Doc.EmbedView(Map((t) => t=="Account"?Doc.Element("div", [Attr.Create("class", "max-w-md w-full")], [Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl mb-8")], [Doc.Element("div", [Attr.Create("class", "flex items-center space-x-6 mb-8 border-b border-gray-100 pb-8")], [Doc.Element("div", [Attr.Create("class", "w-20 h-20 rounded-full neo-flat flex items-center justify-center text-2xl font-bold overflow-hidden")], [Doc.EmbedView(Map((url) => IsNullOrWhiteSpace(url)?Doc.TextView(Map((u) => u.length>0?Substring(u, 0, 1).toUpperCase():"U", username.View)):Doc.Element("img", [Attr.Create("src", url), Attr.Create("class", "w-full h-full object-cover")], []), avatarUrl.View))]), Doc.Element("div", [], [Doc.Element("h3", [Attr.Create("class", "text-lg font-bold text-gray-800")], [Doc.TextNode("Profile Avatar")]), Doc.Element("p", [Attr.Create("class", "text-xs text-gray-500 mb-3")], [Doc.TextNode("Enter an image URL or Gravatar.")]), Button([Doc.TextNode("Change Avatar URL")], accentText, () => {
    const url=globalThis.prompt("Avatar Image URL:", avatarUrl.Get());
    if(!(url==null)){
      avatarUrl.Set(url);
      StartImmediate(Delay(() => Bind(UpdateUserSettings(New_5(calendarStartDay.Get(), Some(url))), () => Zero())), null);
    }
  })])]), Doc.Element("div", [Attr.Create("class", "space-y-6")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Username")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition")], newUsername)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.EmailInput([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition opacity-60")], email)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Password")]), Doc.PasswordBox([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition placeholder:text-gray-400")], password)])]), Button([Doc.TextNode("Save Account Changes")], accentBg, () => {
    StartImmediate(Delay(() => {
      message.Set("Updating...");
      return Bind(UpdateUsername(newUsername.Get()), (a) => {
        if(a.$==1){
          username.Set(a.$0);
          isSuccess.Set(true);
          message.Set("Account updated successfully!");
          showToast("Profile name updated!", Success);
          return Zero();
        }
        else if(a.$==3){
          const e=a.$0;
          isSuccess.Set(false);
          message.Set(e);
          showToast(e, Error);
          return Zero();
        }
        else return Zero();
      });
    }), null);
  }), Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-6 p-4 rounded-xl text-center text-sm "+(isSuccess.Get()?"bg-green-100 text-green-700":"bg-red-100 text-red-700"), message.View))], [Doc.TextView(message.View)])])]):t=="Calendar"?Doc.Element("div", [Attr.Create("class", "max-w-md w-full")], [Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl")], [Doc.Element("h3", [Attr.Create("class", "text-lg font-bold text-gray-800 mb-6")], [Doc.TextNode("Calendar Preferences")]), Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("First day of the week")]), Select(ofArray(["Monday", "Sunday", "Saturday"]), calendarStartDay, (x) => x, accentText, accentBg, false)]), Button([Doc.TextNode("Update Calendar")], accentBg, () => {
    StartImmediate(Delay(() => Bind(UpdateUserSettings(New_5(calendarStartDay.Get(), Some(avatarUrl.Get()))), (a) => a.$==0?(showToast("Calendar settings saved!", Success),Zero()):a.$==3?(showToast(a.$0, Error),Zero()):Zero())), null);
  })])]):t=="Other"?Doc.Element("div", [Attr.Create("class", "max-w-md w-full")], [Doc.Element("div", [Attr.Create("class", "neo-flat p-10 rounded-3xl flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 bg-opacity-30")], [Doc.Element("span", [Attr.Create("class", "text-4xl mb-4 grayscale opacity-40")], [Doc.TextNode("\u2699\ufe0f")]), Doc.Element("p", [Attr.Create("class", "text-gray-500 italic font-medium")], [Doc.TextNode("Additional settings will appear here soon.")])])]):Doc.Empty, activeTab.View))])])]);
}
export function Dashboard(){
  const username=Var.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Dashboard", username, season), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900 mb-6")], [Doc.TextNode("Welcome Back!")]), Doc.Element("p", [Attr.Create("class", "text-gray-800")], [Doc.TextNode("This is your newly generated workspace dashboard.")])])]);
}
export function Sidebar(active, username, season){
  const firstChar=Map((u) => u.length>0?Substring(u, 0, 1).toUpperCase():"U", username.View);
  const accentText=Map((s) => getSeasonTheme(s, "text", "600"), season);
  const accentHover=Map((s) => getSeasonTheme(s, "hover:text", "500"), season);
  const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
  return Doc.Element("div", [Attr.Create("class", "w-64 neo-flat flex flex-col justify-between m-6 rounded-3xl p-6")], [Doc.Element("div", [], [Doc.Element("ul", [Attr.Create("class", "space-y-4 mt-8 w-full")], ofSeq(delay(() => collect((m) => {
    const url=m[1];
    const name=m[0];
    return[Doc.Element("li", [Dynamic("class", Map2((_1) => active==name?"p-4 rounded-xl cursor-pointer text-center neo-nav-active font-bold "+getSeasonTheme(_1, "text", "600"):"p-4 rounded-xl cursor-pointer text-center "+(((_2) =>(_3) => _2("text-gray-800 neo-nav-item "+toSafe(_3)))((x) => x))(getSeasonTheme(_1, "hover:text", "500")), season, accentHover)), Handler("click", () =>() => {
      globalThis.location.href=url;
    })], [Doc.TextNode(name)])];
  }, ofArray([["Dashboard", "/dashboard"], ["Planner", "/planner"], ["Calendar", "/calendar"], ["Products", "/products"], ["Recipes", "/recipes"], ["Records", "/records"]])))))]), Doc.Element("div", [Attr.Create("class", "flex items-center justify-between mt-auto w-full")], [Doc.Element("div", [Attr.Create("class", "flex items-center space-x-3 overflow-hidden")], [Doc.Element("div", [Dynamic("class", Map((bg) =>(((_1) =>(_2) => _1("w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center "+toSafe(_2)+" font-bold"))((x) => x))(bg), accentBg)), Dynamic("class", Map((textCol) => textCol, accentText))], [Doc.TextView(firstChar)]), Doc.Element("span", [Attr.Create("class", "text-sm font-bold text-gray-800 truncate max-w-[90px]")], [Doc.TextView(username.View)])]), Doc.Element("a", [Attr.Create("href", "/settings"), Dynamic("class", Map2((_1, _2) => _2=="Settings"?"w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer flex-shrink-0 neo-nav-active "+getSeasonTheme(_1, "text", "600"):"w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer flex-shrink-0 text-gray-700 neo-nav-item", season, Const(active)))], [Doc.Verbatim("<svg class=\"w-5 h-5 transition-transform\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\"></path><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\"></path></svg>")])])]);
}
export function NavBarAuthWidget(){
  const state=Var.Create_1(Error_1("Loading..."));
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => {
    state.Set(a);
    return Zero();
  })), null);
  return Doc.Element("div", [], [Doc.EmbedView(Map((s) => {
    if(s.$==1){
      const username=s.$0;
      const isVerified=s.$1;
      return Doc.Element("div", [Attr.Create("class", "flex items-center space-x-4")], [!isVerified?Doc.Element("span", [Attr.Create("class", "relative flex h-4 w-4 transform -translate-y-1")], [Doc.Element("span", [Attr.Create("class", "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75")], []), Doc.Element("span", [Attr.Create("class", "relative inline-flex rounded-full h-4 w-4 bg-red-500")], []), Doc.Element("span", [Attr.Create("title", "Please verify your email!"), Attr.Create("class", "absolute w-4 h-4 cursor-pointer")], [])]):Doc.Empty, Doc.Element("span", [Attr.Create("class", "text-gray-900 font-medium")], [Doc.TextNode("Hi, "+username)]), Doc.Element("button", [Attr.Create("class", "neo-button bg-transparent text-gray-800 hover:text-red-500 font-medium py-2 px-6 rounded-full"), Handler("click", () =>() => StartImmediate(Delay(() => Bind(Logout(), () => {
        globalThis.location.href="/";
        return Zero();
      })), null))], [Doc.TextNode("Logout")])]);
    }
    else {
      const accentBg=Map((s_1) => getSeasonTheme(s_1, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
      return Doc.Element("a", [Attr.Create("href", "/auth"), Dynamic("class", Map((bg) =>(((_1) =>(_2) => _1("neo-nav-item font-bold py-3 px-8 rounded-full "+toSafe(_2)+" transition"))((x) => x))(bg), accentBg))], [Doc.TextNode("Login")]);
    }
  }, state.View))]);
}
export function ChangePassword(){
  const newpass=Var.Create_1("");
  const showPassword=Var.Create_1(false);
  const message=Var.Create_1("");
  return GlassCard(ofSeq(delay(() => append_1([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4 text-gray-900")], [Doc.TextNode("Update Forgotten Password")])], delay(() => append_1([Doc.Element("p", [Attr.Create("class", "text-sm text-center text-gray-700 mb-6")], [Doc.TextNode("Since you used a Magic Link, you must establish a new password securely.")])], delay(() => append_1([Doc.Element("div", [Attr.Create("class", "mb-8")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 font-bold mb-3 pl-2")], [Doc.TextNode("New Password")]), Doc.Element("div", [Attr.Create("class", "relative w-full")], [Doc.Input([Dynamic("class", Map(() =>"neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition pr-12", showPassword.View)), Dynamic("type", Map((show) => show?"text":"password", showPassword.View)), Attr.Create("maxlength", "16")], newpass), Doc.Element("button", [Attr.Create("type", "button"), Attr.Create("class", "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"), Handler("click", () =>() => showPassword.Set(!showPassword.Get()))], [Doc.EmbedView(Map((show) => show?Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" /></svg>"):Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" /></svg>"), showPassword.View))])]), PasswordStrengthView(Map(CalculatePasswordScore, newpass.View))])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return append_1([Button([Doc.TextNode("Update Credentials")], accentBg, () => {
      StartImmediate(Delay(() => {
        const p=newpass.Get();
        return CalculatePasswordScore(p)<5?(message.Set("Password does not meet the security requirements."),Zero()):Bind(ResetPassword(p), (a) => a.$==0?(globalThis.location.href="/",Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero());
      }), null);
    })], delay(() =>[Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-4 p-4 text-sm bg-red-100 text-red-700 rounded", message.View))], [Doc.TextView(message.View)])]));
  })))))))));
}
export function MagicLogin(token){
  const message=Var.Create_1("Initiating magic entry sequence...");
  StartImmediate(Delay(() => Bind(AttemptMagicLogin(token), (a) => a.$==2?(globalThis.location.href="/change-password",Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero())), null);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4")], [Doc.TextNode("Authenticating")]), Doc.Element("p", [Attr.Create("class", "text-center text-lg text-gray-800 animate-pulse")], [Doc.TextView(message.View)])]);
}
export function VerifyEmail(token){
  const message=Var.Create_1("Validating token...");
  StartImmediate(Delay(() => Bind(AttemptVerifyEmail(token), (a) => a.$==0?(message.Set("Your email was successfully verified! You may securely browse."),Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero())), null);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4")], [Doc.TextNode("Email Verification")]), Doc.Element("p", [Attr.Create("class", "text-center text-lg text-gray-800")], [Doc.TextView(message.View)]), Doc.Element("div", [Attr.Create("class", "text-center mt-8")], [Doc.Element("a", [Attr.Create("href", "/"), Attr.Create("class", "text-blue-500 font-bold hover:underline")], [Doc.TextNode("Go Home")])])]);
}
export function ForgotPassword(){
  const email=Var.Create_1("");
  const message=Var.Create_1("");
  const isSuccess=Var.Create_1(false);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-3xl font-extrabold text-gray-900 mb-4 text-center")], [Doc.TextNode("Forgot Password")]), Doc.Element("p", [Attr.Create("class", "text-gray-800 text-center mb-8")], [Doc.TextNode("Enter your email to receive a magic login link.")]), Doc.Element("div", [Dynamic("class", Map((s) => s?"hidden":"block", isSuccess.View))], ofSeq(delay(() => append_1([Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none"), Attr.Create("name", "type"), Attr.Create("type", "email")], email)])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return[Button([Doc.TextNode("Send Magic Link")], accentBg, () => {
      StartImmediate(Delay(() => {
        message.Set("Dispatching magic link...");
        return Bind(TriggerMagicLink(email.Get()), (a) => {
          if(a.$==0){
            isSuccess.Set(true);
            message.Set("If that email exists, a magic link has been sent to it!");
            return Zero();
          }
          else if(a.$==3){
            const e=a.$0;
            isSuccess.Set(false);
            message.Set(e);
            return Zero();
          }
          else return Zero();
        });
      }), null);
    })];
  }))))), Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-4 p-4 rounded text-sm "+(isSuccess.Get()?"bg-green-100 text-green-800":"bg-red-100 text-red-800"), message.View))], [Doc.TextView(message.View)]), Doc.Element("div", [Attr.Create("class", "text-center mt-6")], [Doc.Element("a", [Attr.Create("href", "/auth"), Attr.Create("class", "text-sm text-blue-500 font-medium")], [Doc.TextNode("Back to Login")])])]);
}
export function AuthCard(){
  const isLogin=Var.Create_1(true);
  return GlassCard(ofSeq(delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), Const(getSeason(DatePortion(Date.now()))));
    return append_1([Doc.Element("div", [Attr.Create("class", "flex border-b border-gray-200 mb-8")], [Doc.Element("button", [Dynamic("class", Map((l) => l?"w-1/2 py-4 text-center font-bold transition-all outline-none border-b-2":"w-1/2 py-4 text-center font-bold transition-all outline-none text-gray-500", isLogin.View)), Dynamic("class", Map2((_1, _2) => _1?"border-b-2 "+_2:"", isLogin.View, accent)), Handler("click", () =>() => isLogin.Set(true))], [Doc.TextNode("Login")]), Doc.Element("button", [Dynamic("class", Map((l) =>!l?"w-1/2 py-4 text-center font-bold transition-all outline-none border-b-2":"w-1/2 py-4 text-center font-bold transition-all outline-none text-gray-500", isLogin.View)), Dynamic("class", Map2((_1, _2) =>!_1?"border-b-2 "+_2:"", isLogin.View, accent)), Handler("click", () =>() => isLogin.Set(false))], [Doc.TextNode("Register")])])], delay(() =>[Doc.Element("div", [], [Doc.EmbedView(Map((login) => login?LoginForm():RegistrationForm(), isLogin.View))])]));
  })));
}
export function RegistrationForm(){
  const email=Var.Create_1("");
  const password=Var.Create_1("");
  const showPassword=Var.Create_1(false);
  const message=Var.Create_1("");
  const isError=Var.Create_1(false);
  const passwordStrength=Map(CalculatePasswordScore, password.View);
  const emailStrength=Map((e) => {
    if(e=="")return 0;
    else {
      const atIdx=e.indexOf("@");
      return atIdx>0?e.indexOf(".", atIdx)>atIdx+1?3:2:1;
    }
  }, email.View);
  return Doc.Element("div", [], ofSeq(delay(() => append_1([Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition"), Attr.Create("name", "email"), Attr.Create("type", "email")], email), Doc.Element("div", [Attr.Create("class", "w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden shadow-inner")], [Doc.Element("div", [Dynamic("class", Map((score) =>"h-full transition-all duration-300 "+(score===0?"w-0":score===1?"w-1/3":score===2?"w-2/3":score===3?"w-full":"w-0")+" "+(score===1?"bg-red-500":score===2?"bg-orange-500":score===3?"bg-green-500":"bg-transparent"), emailStrength))], [])]), Doc.Element("p", [Dynamic("class", Map((score) => score===3||email.Get()==""?"hidden":"text-xs text-red-500 mt-2 pl-2", emailStrength))], [Doc.TextNode("please provide a valid email address.")])])], delay(() => append_1([Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Password")]), Doc.Element("div", [Attr.Create("class", "relative w-full")], [Doc.Input([Dynamic("class", Map(() =>"neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition pr-12", showPassword.View)), Dynamic("type", Map((show) => show?"text":"password", showPassword.View)), Attr.Create("maxlength", "16")], password), Doc.Element("button", [Attr.Create("type", "button"), Attr.Create("class", "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"), Handler("click", () =>() => showPassword.Set(!showPassword.Get()))], [Doc.EmbedView(Map((show) => show?Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" /></svg>"):Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" /></svg>"), showPassword.View))])]), PasswordStrengthView(passwordStrength)])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return append_1([Button([Doc.TextNode("Register Securely")], accentBg, () => {
      StartImmediate(Delay(() => {
        const _1=email.Get();
        const p=password.Get();
        const atIdx=_1.indexOf("@");
        const isValid=atIdx>0&&_1.indexOf(".", atIdx)>atIdx+1;
        const pScore=CalculatePasswordScore(p);
        return!isValid?(isError.Set(true),message.Set("Please provide a valid email address."),Zero()):pScore<5?(isError.Set(true),message.Set("Password does not meet the security requirements."),Zero()):(message.Set("Processing..."),isError.Set(false),Bind(RegisterUser(_1, p), (a) => {
          if(a.$==1){
            a.$0;
            globalThis.location.href="/dashboard";
            return Zero();
          }
          else if(a.$==3){
            const err=a.$0;
            isError.Set(true);
            message.Set(err);
            return Zero();
          }
          else return Zero();
        }));
      }), null);
    })], delay(() =>[Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":isError.Get()?"mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm":"mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded text-sm", message.View))], [Doc.TextView(message.View)])]));
  })))))));
}
export function LoginForm(){
  const email=Var.Create_1("");
  const password=Var.Create_1("");
  const showPassword=Var.Create_1(false);
  const message=Var.Create_1("");
  const msgColor=Var.Create_1("text-red-700 bg-red-100 border-red-500");
  return Doc.Element("div", [], ofSeq(delay(() => append_1([Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 leading-tight focus:outline-none transition"), Attr.Create("name", "email"), Attr.Create("type", "email")], email)])], delay(() => append_1([Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Password")]), Doc.Element("div", [Attr.Create("class", "relative w-full")], [Doc.Input([Dynamic("class", Map(() =>"neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 leading-tight focus:outline-none transition pr-12", showPassword.View)), Dynamic("type", Map((show) => show?"text":"password", showPassword.View)), Attr.Create("maxlength", "16")], password), Doc.Element("button", [Attr.Create("type", "button"), Attr.Create("class", "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"), Handler("click", () =>() => showPassword.Set(!showPassword.Get()))], [Doc.EmbedView(Map((show) => show?Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" /></svg>"):Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" /></svg>"), showPassword.View))])]), Doc.Element("div", [Attr.Create("class", "text-right mt-2")], [Doc.Element("a", [Attr.Create("href", "/forgot-password"), Attr.Create("class", "text-sm text-blue-500 hover:text-blue-800 transition font-medium")], [Doc.TextNode("Forgot Password?")])])])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return append_1([Button([Doc.TextNode("Log In")], accentBg, () => {
      StartImmediate(Delay(() => {
        const e=email.Get();
        const atIdx=e.indexOf("@");
        return!(atIdx>0&&e.indexOf(".", atIdx)>atIdx+1)?(msgColor.Set("text-red-700 bg-red-100 border-red-500"),message.Set("Please provide a valid email address."),Zero()):(message.Set("Logging in..."),msgColor.Set("text-blue-700 bg-blue-100 border-blue-500"),Bind(LoginUser(e, password.Get()), (a) => {
          if(a.$==2){
            globalThis.location.href="/change-password";
            return Zero();
          }
          else if(a.$==1){
            a.$1;
            a.$0;
            globalThis.location.href="/dashboard";
            return Zero();
          }
          else if(a.$==3){
            const err=a.$0;
            msgColor.Set("text-red-700 bg-red-100 border-red-500");
            message.Set(err);
            return Zero();
          }
          else return Zero();
        }));
      }), null);
    })], delay(() =>[Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-4 border-l-4 p-4 rounded text-sm "+msgColor.Get(), message.View))], [Doc.TextView(message.View)])]));
  })))))));
}
export function PasswordStrengthView(passwordScore){
  return Doc.Element("div", [], [Doc.Element("div", [Attr.Create("class", "w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden shadow-inner")], [Doc.Element("div", [Dynamic("class", Map((score) =>"h-full transition-all duration-300 "+(score===-1?"w-0":score===0?"w-0":score===1?"w-1/5":score===2?"w-2/5":score===3?"w-3/5":score===4?"w-4/5":score===5?"w-full":"w-0")+" "+(score===-1?"bg-transparent":score===0?"bg-transparent":score===1?"bg-red-500":score===2?"bg-red-500":score===3?"bg-orange-500":score===4?"bg-yellow-400":score===5?"bg-green-500":"bg-transparent"), passwordScore))], [])]), Doc.Element("p", [Dynamic("class", Map((score) => score===-1?"text-xs text-red-500 font-bold mt-2 pl-2":"text-xs text-gray-600 mt-2 pl-2", passwordScore))], [Doc.TextView(Map((score) => score===-1?"Contains illegal injection characters!":"Requires 8-16 chars: Upper, Lower, Number, Special (!@#$%^&*_-+=?).", passwordScore))])]);
}
export function CalculatePasswordScore(p){
  if(p=="")return 0;
  else {
    const l=p.length>=8&&p.length<=16;
    const lo=(new RegExp("[a-z]")).test(p);
    const up=(new RegExp("[A-Z]")).test(p);
    const d=(new RegExp("[0-9]")).test(p);
    const s=(new RegExp("[!@#$%^&*_\\-+=?]")).test(p);
    return(new RegExp("[^a-zA-Z0-9!@#$%^&*_\\-+=?]")).test(p)?-1:(l?1:0)+(lo?1:0)+(up?1:0)+(d?1:0)+(s?1:0);
  }
}
export function HomeHero(){
  return Doc.Element("div", [Attr.Create("class", "text-center neo-flat p-12 rounded-3xl max-w-3xl mx-auto")], [Doc.Element("h1", [Attr.Create("class", "text-5xl font-extrabold tracking-tight mb-4 text-gray-900")], [Doc.TextNode("Due Alpha Authentication")]), Doc.Element("p", [Attr.Create("class", "text-xl text-gray-700 font-light mb-8")], [Doc.TextNode("Secure. Rapid. Magically passwordless.")])]);
}
export function GlassCard(content){
  return Doc.Element("div", [Attr.Create("class", "w-full max-w-md mx-auto neo-flat p-8 rounded-3xl transform transition-all text-gray-900")], content);
}
export function renderDate(d, isMain, onClick){
  const p=getMoonInfo(d);
  const moonLabel=p[2];
  const moonIcon=p[0];
  const moonDisplay=p[1];
  const seasonal=getSeasonalInfo(d);
  const season=getSeason(d);
  const seasonIcon=getSeasonIconWithSeason(season);
  const accent=getSeasonTheme(season, "text", "600");
  const borderAccent=getSeasonTheme(season, "border", "200");
  return Doc.Element("div", ofSeq(delay(() => append_1([Attr.Create("class", (DatePortion(d)==DatePortion(Date.now())?"p-4 rounded-xl flex flex-col items-center justify-center transition-all neo-flat ":"p-4 rounded-xl flex flex-col items-center justify-center transition-all neo-nav-item ")+(DatePortion(d)==DatePortion(Date.now())?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+" font-bold border-2 "+toSafe(_3)))((x) => x))(accent))(borderAccent):"text-gray-800 cursor-pointer")+(isMain?" min-h-[160px]":" min-h-[120px] opacity-60"))], delay(() => {
    let _1;
    if(seasonal!=null&&seasonal.$==1){
      const l=seasonal.$0[1];
      _1=((((_3) =>(_4) =>(_5) => _3(toSafe(_4)+" | "+toSafe(_5)))((x) => x))(moonLabel))(l);
    }
    else _1=moonLabel;
    let _2=[Attr.Create("title", _1)];
    return append_1(_2, delay(() => {
      if(onClick==null)return[Attr.Create("data-no-click", "true")];
      else {
        const f=onClick.$0;
        return[Handler("click", () =>() => f(d))];
      }
    }));
  })))), ofSeq(delay(() => append_1([Doc.Element("span", [Attr.Create("class", "text-xs font-bold text-gray-600 uppercase")], [Doc.TextNode(DateFormatter(d, "ddd"))])], delay(() => append_1([Doc.Element("div", [Attr.Create("class", "text-[10px] mb-1")], [Doc.TextNode(seasonIcon)])], delay(() => append_1([Doc.Element("div", [Attr.Create("class", "flex flex-col items-center mb-1")], [Doc.Element("span", [Attr.Create("class", "text-2xl")], [Doc.TextNode(moonIcon)]), Doc.Element("span", [Attr.Create("class", "text-sm font-black text-gray-800")], [Doc.TextNode(moonDisplay)])])], delay(() => {
    let _1;
    if(seasonal!=null&&seasonal.$==1){
      const label=seasonal.$0[1];
      const icon=seasonal.$0[0];
      _1=[Doc.Element("div", [Attr.Create("class", "flex flex-col items-center mb-1")], [Doc.Element("span", [Attr.Create("class", "text-base")], [Doc.TextNode(icon)]), Doc.Element("span", [Attr.Create("class", "text-[8px] font-black text-gray-700 uppercase text-center bg-white/20 rounded px-1")], [Doc.TextNode(label)])])];
    }
    else _1=[];
    return append_1(_1, delay(() => {
      let c;
      return[Doc.Element("span", [Attr.Create("class", "text-5xl font-black mt-2")], [Doc.TextNode((c=(new Date(d)).getDate(),String(c)))])];
    }));
  })))))))));
}
export function getSeasonalInfo(d){
  const _1=(new Date(d)).getMonth()+1;
  const _2=(new Date(d)).getDate();
  switch(_1===3?_2===20?0:_2===21?0:4:_1===6?_2===20?1:_2===21?1:4:_1===9?_2===22?2:_2===23?2:4:_1===12?_2===21?3:_2===22?3:4:4){
    case 0:
      return Some(["\ud83c\udf31", "Spring Equinox"]);
    case 1:
      return Some(["\u2600\ufe0f", "Summer Solstice"]);
    case 2:
      return Some(["\ud83c\udf42", "Autumn Equinox"]);
    case 3:
      return Some(["\u2744\ufe0f", "Winter Solstice"]);
    case 4:
      return null;
  }
}
export function getSeasonTheme(season, prefix, shade){
  return season=="Winter"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-blue-"+toSafe(_3)))((x) => x))(prefix))(shade):season=="Spring"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-emerald-"+toSafe(_3)))((x) => x))(prefix))(shade):season=="Summer"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-orange-"+toSafe(_3)))((x) => x))(prefix))(shade):season=="Autumn"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-orange-"+toSafe(_3)))((x) => x))(prefix))(shade):((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-blue-"+toSafe(_3)))((x) => x))(prefix))(shade);
}
export function getSeasonIconWithSeason(season){
  return season=="Winter"?"\u2744\ufe0f":season=="Spring"?"\ud83c\udf31":season=="Summer"?"\u2600\ufe0f":season=="Autumn"?"\ud83c\udf42":"\u2744\ufe0f";
}
export function getSeason(d){
  const _1=(new Date(d)).getMonth()+1;
  const _2=(new Date(d)).getDate();
  return _1===12&&_2>=21||_1<3||_1===3&&_2<20?"Winter":_1===3&&_2>=20||_1<6||_1===6&&_2<21?"Spring":_1===6&&_2>=21||_1<9||_1===9&&_2<22?"Summer":"Autumn";
}
export function getWeekNumber(d){
  const day=toInt(Number((new Date(d)).getDay()));
  const d2=d+(4-(day===0?7:day))*864E5;
  return toInt(Math.floor((d2-Create((new Date(d2)).getFullYear(), 1, 1, 0, 0, 0, 0))/864E5/7)+1);
}
export function getRecentNewMoon(date){
  const knownNewMoon=Create(2000, 1, 6, 18, 14, 0, 0);
  const lunarCycle=29.530588;
  return DatePortion(knownNewMoon+Math.floor((date-knownNewMoon)/864E5/lunarCycle)*lunarCycle*864E5);
}
export function getMoonInfo(date){
  let _1;
  const knownNewMoon=Create(2000, 1, 6, 18, 14, 0, 0);
  const lunarCycle=29.530588;
  const phase=(date-knownNewMoon)/864E5%lunarCycle;
  const normalizedPhase=phase<0?phase+lunarCycle:phase;
  const p=normalizedPhase<1||normalizedPhase>28.53?["\ud83c\udf11", "New Moon", true]:normalizedPhase>=6.38&&normalizedPhase<=8.38?["\ud83c\udf13", "1st Quarter", true]:normalizedPhase>=13.76&&normalizedPhase<=15.76?["\ud83c\udf15", "Full Moon", true]:normalizedPhase>=21.14&&normalizedPhase<=23.14?["\ud83c\udf17", "Last Quarter", true]:normalizedPhase<7.4?["\ud83c\udf12", "Waxing Crescent", false]:normalizedPhase<14.8?["\ud83c\udf14", "Waxing Gibbous", false]:normalizedPhase<22.1?["\ud83c\udf16", "Waning Gibbous", false]:["\ud83c\udf18", "Waning Crescent", false];
  const label=p[1];
  if(p[2])_1=label;
  else {
    let _2=((_4) =>(_5) => _4(String(_5)+"%"))((x) => x);
    const halfCycle=lunarCycle/2;
    let _3=toInt(normalizedPhase<=halfCycle?normalizedPhase/halfCycle*100:(1-(normalizedPhase-halfCycle)/halfCycle)*100);
    _1=_2(_3);
  }
  return[p[0], _1, label];
}
export function RenderToast(){
  return Doc.EmbedView(Map((toast) => {
    if(toast==null)return Doc.Empty;
    else {
      const t=toast.$0;
      const icon=t.Type.$==1?Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\"></path></svg>"):Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 13l4 4L19 7\"></path></svg>");
      return Doc.Element("div", [Attr.Create("class", "toast-container")], [Doc.Element("div", [Attr.Create("class", "toast-item neo-flat p-5 rounded-3xl animate-toast flex items-center space-x-4 border-l-4 "+(t.Type.$===0?"border-emerald-500":"border-red-500"))], [Doc.Element("div", [Attr.Create("class", "w-10 h-10 rounded-full neo-pressed flex items-center justify-center "+(t.Type.$==1?"text-red-500":"text-emerald-600"))], [icon]), Doc.Element("div", [Attr.Create("class", "flex-1")], [Doc.Element("h4", [Attr.Create("class", "text-xs font-black uppercase tracking-widest text-gray-500 mb-1")], [Doc.TextNode(t.Type.$===0?"Success":"System Message")]), Doc.Element("p", [Attr.Create("class", "text-sm font-bold text-gray-800")], [Doc.TextNode(t.Content)])])])]);
    }
  }, currentToast().View));
}
export function showToast(content, t){
  currentToast().Set(Some(New_6(content, t)));
  StartImmediate(Delay(() => Bind(Sleep(3500), () => {
    let _1;
    const m=currentToast().Get();
    return m!=null&&m.$==1&&(m.$0.Content==content&&(_1=m.$0,true))?(currentToast().Set(null),Zero()):Zero();
  })), null);
}
export function currentToast(){
  return $StartupCode_Client.currentToast;
}
