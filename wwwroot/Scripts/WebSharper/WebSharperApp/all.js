export { default as Runtime } from "../WebSharper.Core.JavaScript/Runtime.js"
import { Lazy, Create as Create_2, GetOptional, SetOptional } from "../WebSharper.Core.JavaScript/Runtime.js"
function isIDisposable(x){
  return"Dispose"in x;
}
export function NavBarAuthWidget(){
  const state=_c.Create_1(Error_1("Loading..."));
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => {
    state.Set(a);
    return Zero();
  })), null);
  return Doc.Element("div", [], [Doc.EmbedView(Map((s) => {
    if(s.$==1){
      const username=s.$0;
      const isVerified=s.$1;
      return Doc.Element("div", [Attr.Create("class", "flex items-center space-x-4")], [!isVerified?Doc.Element("span", [Attr.Create("class", "relative flex h-4 w-4 transform -translate-y-1")], [Doc.Element("span", [Attr.Create("class", "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75")], []), Doc.Element("span", [Attr.Create("class", "relative inline-flex rounded-full h-4 w-4 bg-red-500")], []), Doc.Element("span", [Attr.Create("title", "Please verify your email!"), Attr.Create("class", "absolute w-4 h-4 cursor-pointer")], [])]):Doc.Empty, Doc.Element("span", [Attr.Create("class", "text-gray-900 font-medium")], [Doc.TextNode("Hi, "+username)]), Doc.Element("button", [Attr.Create("class", "neo-button bg-transparent text-gray-800 hover:text-red-500 font-medium py-2 px-6 rounded-full"), Handler("click", () =>() => StartImmediate(Delay(() => Bind_1(Logout(), () => {
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
export function HomeHero(){
  return Doc.Element("div", [Attr.Create("class", "text-center neo-flat p-12 rounded-3xl max-w-3xl mx-auto")], [Doc.Element("h1", [Attr.Create("class", "text-5xl font-extrabold tracking-tight mb-4 text-gray-900")], [Doc.TextNode("Due Alpha Authentication")]), Doc.Element("p", [Attr.Create("class", "text-xl text-gray-700 font-light mb-8")], [Doc.TextNode("Secure. Rapid. Magically passwordless.")])]);
}
export function AuthCard(){
  const isLogin=_c.Create_1(true);
  return GlassCard(ofSeq(delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), Const(getSeason(DatePortion(Date.now()))));
    return append([Doc.Element("div", [Attr.Create("class", "flex border-b border-gray-200 mb-8")], [Doc.Element("button", [Dynamic("class", Map((l) => l?"w-1/2 py-4 text-center font-bold outline-none border-b-2":"w-1/2 py-4 text-center font-bold outline-none text-gray-500", isLogin.View)), Dynamic("class", Map2((_1, _2) => _1?"border-b-2 "+_2:"", isLogin.View, accent)), Handler("click", () =>() => isLogin.Set(true))], [Doc.TextNode("Login")]), Doc.Element("button", [Dynamic("class", Map((l) =>!l?"w-1/2 py-4 text-center font-bold transition-all outline-none border-b-2":"w-1/2 py-4 text-center font-bold transition-all outline-none text-gray-500", isLogin.View)), Dynamic("class", Map2((_1, _2) =>!_1?"border-b-2 "+_2:"", isLogin.View, accent)), Handler("click", () =>() => isLogin.Set(false))], [Doc.TextNode("Register")])])], delay(() =>[Doc.Element("div", [], [Doc.EmbedView(Map((login) => login?LoginForm():RegistrationForm(), isLogin.View))])]));
  })));
}
export function ForgotPassword(){
  const email=_c.Create_1("");
  const message=_c.Create_1("");
  const isSuccess=_c.Create_1(false);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-3xl font-extrabold text-gray-900 mb-4 text-center")], [Doc.TextNode("Forgot Password")]), Doc.Element("p", [Attr.Create("class", "text-gray-800 text-center mb-8")], [Doc.TextNode("Enter your email to receive a magic login link.")]), Doc.Element("div", [Dynamic("class", Map((s) => s?"hidden":"block", isSuccess.View))], ofSeq(delay(() => append([Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none"), Attr.Create("name", "type"), Attr.Create("type", "email")], email)])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return[Button([Doc.TextNode("Send Magic Link")], accentBg, () => {
      StartImmediate(Delay(() => {
        message.Set("Dispatching magic link...");
        return Bind_1(TriggerMagicLink(email.Get()), (a) => {
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
export function VerifyEmail(token){
  const message=_c.Create_1("Validating token...");
  StartImmediate(Delay(() => Bind_1(AttemptVerifyEmail(token), (a) => a.$==0?(message.Set("Your email was successfully verified! You may securely browse."),Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero())), null);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4")], [Doc.TextNode("Email Verification")]), Doc.Element("p", [Attr.Create("class", "text-center text-lg text-gray-800")], [Doc.TextView(message.View)]), Doc.Element("div", [Attr.Create("class", "text-center mt-8")], [Doc.Element("a", [Attr.Create("href", "/"), Attr.Create("class", "text-blue-500 font-bold hover:underline")], [Doc.TextNode("Go Home")])])]);
}
export function MagicLogin(token){
  const message=_c.Create_1("Initiating magic entry sequence...");
  StartImmediate(Delay(() => Bind_1(AttemptMagicLogin(token), (a) => a.$==2?(globalThis.location.href="/change-password",Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero())), null);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4")], [Doc.TextNode("Authenticating")]), Doc.Element("p", [Attr.Create("class", "text-center text-lg text-gray-800 animate-pulse")], [Doc.TextView(message.View)])]);
}
export function ChangePassword(){
  const newpass=_c.Create_1("");
  const showPassword=_c.Create_1(false);
  const message=_c.Create_1("");
  return GlassCard(ofSeq(delay(() => append([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4 text-gray-900")], [Doc.TextNode("Update Forgotten Password")])], delay(() => append([Doc.Element("p", [Attr.Create("class", "text-sm text-center text-gray-700 mb-6")], [Doc.TextNode("Since you used a Magic Link, you must establish a new password securely.")])], delay(() => append([Doc.Element("div", [Attr.Create("class", "mb-8")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 font-bold mb-3 pl-2")], [Doc.TextNode("New Password")]), Doc.Element("div", [Attr.Create("class", "relative w-full")], [Doc.Input([Dynamic("class", Map(() =>"neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition pr-12", showPassword.View)), Dynamic("type", Map((show) => show?"text":"password", showPassword.View)), Attr.Create("maxlength", "16")], newpass), Doc.Element("button", [Attr.Create("type", "button"), Attr.Create("class", "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"), Handler("click", () =>() => showPassword.Set(!showPassword.Get()))], [Doc.EmbedView(Map((show) => show?Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" /></svg>"):Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" /></svg>"), showPassword.View))])]), PasswordStrengthView(Map(CalculatePasswordScore, newpass.View))])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return append([Button([Doc.TextNode("Update Credentials")], accentBg, () => {
      StartImmediate(Delay(() => {
        const p=newpass.Get();
        return CalculatePasswordScore(p)<5?(message.Set("Password does not meet the security requirements."),Zero()):Bind_1(ResetPassword(p), (a) => a.$==0?(globalThis.location.href="/",Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero());
      }), null);
    })], delay(() =>[Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-4 p-4 text-sm bg-red-100 text-red-700 rounded", message.View))], [Doc.TextView(message.View)])]));
  })))))))));
}
export function Dashboard(){
  const username=_c.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Dashboard", username, season, Const(false), () => { }), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900 mb-6")], [Doc.TextNode("Welcome Back!")]), Doc.Element("p", [Attr.Create("class", "text-gray-800")], [Doc.TextNode("This is your newly generated workspace dashboard.")])])]);
}
export function PlannerPage(){
  const username=_c.Create_1("Loading...");
  const refDate=_c.Create_1(DatePortion(Date.now()));
  const currentSeason=Map(getSeason, refDate.View);
  const accent=Map((s) => getSeasonTheme(s, "text", "600"), currentSeason);
  const accentHover=Map((s) => getSeasonTheme(s, "hover:text", "500"), currentSeason);
  Map((s) => getSeasonTheme(s, "bg", "100"), currentSeason);
  const mealPlans=_c.Create_1([]);
  const recipesList=_c.Create_1([]);
  const showPlanModal=_c.Create_1(false);
  const selectedDay=_c.Create_1(DatePortion(Date.now()));
  const selectedMealType=_c.Create_1("Lunch");
  const selectedRecipeId=_c.Create_1(["-1", "Custom Meal"]);
  const customMealTitle=_c.Create_1("");
  const loadPlannerData=() => {
    StartImmediate(Delay(() => {
      const current=refDate.Get();
      const startOfWeek_1=current+(1-(toInt(Number((new Date(current)).getDay()))===0?7:toInt(Number((new Date(current)).getDay()))))*864E5;
      return Bind_1(GetMealPlansRange(startOfWeek_1, startOfWeek_1+6*864E5), (a) => {
        mealPlans.Set(a);
        return Bind_1(GetRecipes(), (a_1) => {
          recipesList.Set(a_1);
          return Zero();
        });
      });
    }), null);
  };
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadPlannerData(),Zero()):(globalThis.location.href="/",Zero()))), null);
  const startOfWeek=Map((d) => d+(1-(toInt(Number((new Date(d)).getDay()))===0?7:toInt(Number((new Date(d)).getDay()))))*864E5, refDate.View);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Planner", username, currentSeason, Const(false), () => { }), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-10")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900")], [Doc.TextNode("Meal Planner")]), Doc.Element("div", [Attr.Create("class", "flex space-x-3")], [IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 19l-7-7 7-7\"></path></svg>"), accentHover, () => {
    refDate.Set(refDate.Get()+-7*864E5);
    loadPlannerData();
  }), Button([Doc.TextNode("This Week")], accent, () => {
    refDate.Set(DatePortion(Date.now()));
    loadPlannerData();
  }), IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5l7 7-7 7\"></path></svg>"), accentHover, () => {
    refDate.Set(refDate.Get()+7*864E5);
    loadPlannerData();
  })])]), Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showPlanModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-md neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode((((_1) =>(_2) => _1("Plan for "+toSafe(_2)))((x) => x))(DateFormatter(selectedDay.Get(), "MMM dd")))]), Doc.Element("div", [Attr.Create("class", "space-y-6")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Meal Slot")]), Select(ofArray(["Breakfast", "Lunch", "Dinner", "Snack"]), selectedMealType, (x) => x, accent, accentHover, false)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Select Recipe")]), Select(FSharpList.Cons(["-1", "Custom Meal"], map_1((r) =>[String(r.Id), r.Name], ofArray(recipesList.Get()))), selectedRecipeId, (t) => t[1], accent, accentHover, false)]), Doc.EmbedView(Map((_1) => _1[0]=="-1"?Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Meal Title")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], customMealTitle)]):Doc.Empty, selectedRecipeId.View)), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], [Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showPlanModal.Set(false))], [Doc.TextNode("Cancel")]), Button([Doc.TextNode("Assign Meal")], Map((a) =>"flex-1 "+a, accent), () => {
    StartImmediate(Delay(() => {
      let title;
      const ridStr=(selectedRecipeId.Get())[0];
      const rid=ridStr=="-1"?null:Some(toInt(Number(ridStr)));
      if(rid!=null){
        const m=tryFind((r) => r.Id===rid.$0, recipesList.Get());
        title=m==null?customMealTitle.Get():m.$0.Name;
      }
      else title=customMealTitle.Get();
      return Bind_1(AddMealPlan(New_2(0, selectedDay.Get(), selectedMealType.Get(), rid, title, "")), (a) => a.$==0?(showPlanModal.Set(false),loadPlannerData(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero());
    }), null);
  })])])])]):Doc.Empty, showPlanModal.View)), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-7 gap-6")], map_1((i) => Doc.EmbedView(Map((start) => {
    const dayDate=start+i*864E5;
    return Doc.Element("div", [Attr.Create("class", "flex flex-col space-y-4")], [Doc.Element("div", [Attr.Create("class", "w-full")], [renderDate(dayDate, true, null)]), Doc.Element("div", [Attr.Create("class", "flex-1 space-y-4")], [Doc.Concat(map_1((mType) => Doc.Element("div", [Attr.Create("class", "neo-nav-item p-4 rounded-2xl min-h-[100px] flex flex-col group cursor-pointer active:scale-95 transition"), Handler("click", () =>() => {
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
export function CalendarPage(){
  const username=_c.Create_1("Loading...");
  const viewMode=_c.Create_1("Monthly");
  const refDate=_c.Create_1(DatePortion(Date.now()));
  const events=_c.Create_1([]);
  const showAddModal=_c.Create_1(false);
  const newEventTitle=_c.Create_1("");
  const newEventDesc=_c.Create_1("");
  const newEventType=_c.Create_1("Personal");
  const calendarStartDay=_c.Create_1("Monday");
  const selectedDateForSidebar=_c.Create_1(null);
  const isSidebarOpen=_c.Create_1(false);
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),Bind_1(GetUserSettings(), (a_1) => {
    calendarStartDay.Set(a_1.CalendarStartDay);
    return Zero();
  })):(globalThis.location.href="/",Zero()))), null);
  const loadEvents=() => {
    StartImmediate(Delay(() => {
      const start=Create((new Date(refDate.Get())).getFullYear(), (new Date(refDate.Get())).getMonth()+1, 1, 0, 0, 0, 0)+-7*864E5;
      return Bind_1(GetCalendarEvents(start, start+42*864E5), (a) => {
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
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Calendar", username, currentSeason, isSidebarOpen.View, () => {
    isSidebarOpen.Set(false);
  }), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full flex flex-col")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-10")], [Doc.Element("div", [], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900")], [Doc.EmbedView(Map((v) => Doc.TextNode(v+" View"), viewMode.View))]), Doc.Element("p", [Attr.Create("class", "text-gray-700 mt-2")], [Doc.EmbedView(Map2((_1, _2) => _1=="Year"?Doc.TextNode(DateFormatter(_2, "yyyy")):Doc.TextNode(DateFormatter(_2, "MMMM yyyy")), viewMode.View, refDate.View))])]), Doc.Element("div", [Attr.Create("class", "flex items-center space-x-6 relative")], [Button([Doc.TextNode("Today")], accent, () => {
    refDate.Set(DatePortion(Date.now()));
  }), Select(ofArray(["Weekly", "Monthly", "Lunar", "Year"]), viewMode, (x) => x, accent, accentHover, true), Doc.Element("div", [Attr.Create("class", "flex space-x-3")], [IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 19l-7-7 7-7\"></path></svg>"), accentHover, () => {
    step("prev");
  }), IconButton(Doc.Verbatim("<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9 5l7 7-7 7\"></path></svg>"), accentHover, () => {
    step("next");
  })])])]), Doc.Element("div", [Attr.Create("class", "flex-1 w-full")], [Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showAddModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-md neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode("Create New Event")]), Doc.Element("div", [Attr.Create("class", "space-y-4")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-sm font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Title")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newEventTitle)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-sm font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Category")]), Select(ofArray(["Personal", "Work", "Important", "Health"]), newEventType, (x) => x, accent, accentHover, false)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-sm font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Description")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newEventDesc)]), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], [Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showAddModal.Set(false))], [Doc.TextNode("Cancel")]), Button([Doc.TextNode("Save Event")], Map((a) =>"flex-1 "+a, accent), () => {
    StartImmediate(Delay(() => {
      const m=newEventType.Get();
      const icon=m=="Work"?"\ud83d\udcbc":m=="Health"?"\ud83c\udfe5":m=="Important"?"\u26a0\ufe0f":"\ud83d\udcc5";
      return Bind_1(AddCalendarEvent(New_4(0, newEventTitle.Get(), newEventDesc.Get(), refDate.Get(), newEventType.Get(), icon)), (a) => a.$==0?(showAddModal.Set(false),newEventTitle.Set(""),newEventDesc.Set(""),loadEvents(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero());
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
      let _7=init_1(7, (i) => renderDate(weekStart+i*864E5, true, Some(onDateClick)));
      let _8=Doc.Element("div", _6, _7);
      let _9=[_5, _8];
      return Doc.Element("div", _4, _9);
    }
    else if(_1=="Monthly"){
      const startOfMonth=Create((new Date(_2)).getFullYear(), (new Date(_2)).getMonth()+1, 1, 0, 0, 0, 0);
      const firstDayOffset=(toInt(Number((new Date(startOfMonth)).getDay()))-startDayOffset+7)%7;
      const days=ofArray(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
      const rotatedHeaders=append_1(skip(startDayOffset, days), ofSeq(take(startDayOffset, days)));
      return Doc.Element("div", [Attr.Create("class", "grid grid-cols-[auto_repeat(7,1fr)] gap-4")], [Doc.Element("span", [Attr.Create("class", "w-10")], []), Doc.Concat(map_1((d) => Doc.Element("span", [Attr.Create("class", "text-center text-xs font-bold text-gray-700 mb-2")], [Doc.TextNode(d)]), rotatedHeaders)), Doc.Concat(init_1(6, (weekIdx) => {
        const weekStartDate=startOfMonth+(weekIdx*7-firstDayOffset)*864E5;
        return(new Date(weekStartDate)).getMonth()+1===(new Date(_2)).getMonth()+1||(new Date(weekStartDate+6*864E5)).getMonth()+1===(new Date(_2)).getMonth()+1?Doc.Concat([Doc.Element("div", [Attr.Create("class", "flex items-center justify-center text-[10px] font-black text-gray-700 uppercase vertical-lr py-4 border-r border-gray-100")], [Doc.TextNode("W"+String(getWeekNumber(weekStartDate)))]), Doc.Concat(init_1(7, (dayIdx) => {
          const d=weekStartDate+dayIdx*864E5;
          return(new Date(d)).getMonth()+1===(new Date(_2)).getMonth()+1?renderDate(d, true, Some(onDateClick)):Doc.Element("div", [Attr.Create("class", "opacity-0 pointer-events-none")], []);
        }))]):Doc.Empty;
      }))]);
    }
    else if(_1=="Lunar"){
      const lunarStart=getRecentNewMoon(_2);
      return Doc.Element("div", [Attr.Create("class", "flex-1 w-full flex flex-col")], [Doc.Element("div", [Attr.Create("class", "grid grid-cols-[80px_repeat(7,1fr)] gap-4 mb-8")], [Doc.Element("span", [], []), Doc.Concat(map_1((d) => Doc.Element("span", [Attr.Create("class", "text-center text-xs font-bold text-gray-700 uppercase opacity-60")], [Doc.TextNode((((_10) =>(_11) => _10("Day "+String(_11)))((x) => x))(d))]), ofSeq(range(1, 7))))]), Doc.Concat(init_1(4, (weekIdx) => {
        const weekStart_1=lunarStart+weekIdx*7*864E5;
        const p=weekIdx===0?["\ud83c\udf11", "New Moon"]:weekIdx===1?["\ud83c\udf13", "First Quarter"]:weekIdx===2?["\ud83c\udf15", "Full Moon"]:weekIdx===3?["\ud83c\udf17", "Last Quarter"]:["\ud83c\udf19", "Phase"];
        return Doc.Element("div", [Attr.Create("class", "grid grid-cols-[80px_repeat(7,1fr)] gap-4 mb-4 items-center")], [Doc.Element("div", [Attr.Create("class", "flex flex-col items-center justify-center p-2 neo-pressed rounded-xl")], [Doc.Element("span", [Attr.Create("class", "text-xl")], [Doc.TextNode(p[0])]), Doc.Element("span", [Attr.Create("class", "text-[8px] font-black text-gray-700 uppercase")], [Doc.TextNode(p[1])])]), Doc.Concat(init_1(7, (dayIdx) => renderDate(weekStart_1+dayIdx*864E5, true, Some(onDateClick))))]);
      }))]);
    }
    else return _1=="Year"?Doc.Element("div", [Attr.Create("class", "h-full overflow-y-auto space-y-10 pr-4 mt-2")], [Doc.Concat(init_1(12, (i) => {
      const month=AddMonths(Create((new Date(_2)).getFullYear(), 1, 1, 0, 0, 0, 0), i);
      return Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl")], [Doc.Element("h3", [Attr.Create("class", "text-2xl font-bold text-gray-800 mb-6")], [Doc.TextNode(DateFormatter(month, "MMMM yyyy"))]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-[auto_repeat(7,1fr)] gap-2")], ofSeq(delay(() => append([Doc.Element("span", [Attr.Create("class", "w-6")], [])], delay(() => {
        const daysShort=ofArray(["S", "M", "T", "W", "T", "F", "S"]);
        return append([Doc.Concat(map_1((d) => Doc.Element("span", [Attr.Create("class", "text-center text-[10px] font-bold text-gray-700")], [Doc.TextNode(d)]), append_1(skip(startDayOffset, daysShort), ofSeq(take(startDayOffset, daysShort)))))], delay(() => {
          const firstDayOffsetYear=(toInt(Number((new Date(month)).getDay()))-startDayOffset+7)%7;
          (new Date((new Date(month)).getFullYear(), (new Date(month)).getMonth()+1, 0)).getDate();
          return[Doc.Concat(init_1(6, (w) => {
            const ws=month+(w*7-firstDayOffsetYear)*864E5;
            return(new Date(ws)).getMonth()+1===(new Date(month)).getMonth()+1||(new Date(ws+6*864E5)).getMonth()+1===(new Date(month)).getMonth()+1?Doc.Concat([Doc.Element("div", [Attr.Create("class", "text-[8px] font-bold text-gray-700 flex items-center justify-center")], [Doc.TextNode(String(getWeekNumber(ws)))]), Doc.Concat(init_1(7, (d) => {
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
export function ProductsPage(){
  const username=_c.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  const products=_c.Create_1([]);
  const showAddModal=_c.Create_1(false);
  const newName=_c.Create_1("");
  const newCategory=_c.Create_1("Groceries");
  const newStock=_c.Create_1("0");
  const newUnit=_c.Create_1("pcs");
  const loadProducts=() => {
    StartImmediate(Delay(() => Bind_1(GetProducts(), (a) => {
      products.Set(a);
      return Zero();
    })), null);
  };
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadProducts(),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Products", username, season, Const(false), () => { }), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-8")], ofSeq(delay(() => append([Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900")], [Doc.TextNode("Product Inventory")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("+ Add Product")], accent, () => {
      showAddModal.Set(true);
    })];
  }))))), Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showAddModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-md neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode("Add Warehouse Item")]), Doc.Element("div", [Attr.Create("class", "space-y-4")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Product Name")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newName)]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-2 gap-4")], [Doc.Element("div", [], ofSeq(delay(() => append([Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Category")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
    return[Select(ofArray(["Groceries", "Meat", "Dairy", "Veggie", "Treats"]), newCategory, (x) => x, accent, accentBg, false)];
  }))))), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Unit")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newUnit)])]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Current Stock")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newStock)]), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], ofSeq(delay(() => append([Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showAddModal.Set(false))], [Doc.TextNode("Cancel")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("Save Product")], Map((a) =>"flex-1 "+a, accent), () => {
      StartImmediate(Delay(() => newName.Get()!=""?Bind_1(AddProduct(New_5(0, newName.Get(), newCategory.Get(), Number(newStock.Get()), newUnit.Get(), 0, 0, 0, 0)), (a) => a.$==0?(newName.Set(""),newStock.Set("0"),showAddModal.Set(false),loadProducts(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero()):Zero()), null);
    })];
  })))))])])]):Doc.Empty, showAddModal.View)), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8")], [Doc.EmbedView(Map((a) => Doc.Concat(a), Map((ps) => length(ps)===0?ofArray([Doc.Element("div", [Attr.Create("class", "col-span-full neo-pressed p-20 rounded-3xl text-center opacity-40")], [Doc.Element("div", [Attr.Create("class", "text-gray-600 font-bold italic mb-2")], [Doc.TextNode("Inventory is empty")]), Doc.Element("div", [Attr.Create("class", "text-[10px] text-gray-600 uppercase tracking-widest")], [Doc.TextNode("Start by adding your first product")])])]):map_1((p) => {
    let _1=[Attr.Create("class", "neo-nav-item p-6 rounded-3xl group relative")];
    let _2=Doc.Element("div", [Attr.Create("class", "absolute top-4 right-4 text-xs font-bold text-emerald-600 opacity-60")], [Doc.TextNode(p.Category)]);
    let _3=[Attr.Create("class", "w-12 h-12 neo-pressed rounded-xl mb-4 flex items-center justify-center text-2xl")];
    const m=p.Category;
    let _4=[Doc.TextNode(m=="Meat"?"\ud83c\udf56":m=="Dairy"?"\ud83e\udd5b":m=="Veggie"?"\ud83e\udd66":m=="Treats"?"\ud83c\udf6c":"\ud83d\uded2")];
    let _5=Doc.Element("div", _3, _4);
    let _6=[_2, _5, Doc.Element("h3", [Attr.Create("class", "font-bold text-gray-800 text-lg mb-1")], [Doc.TextNode(p.Name)]), Doc.Element("div", [Attr.Create("class", "flex items-baseline space-x-1")], [Doc.Element("span", [Attr.Create("class", "text-2xl font-black text-gray-700")], [Doc.TextNode(String(p.Stock))]), Doc.Element("span", [Attr.Create("class", "text-xs font-bold text-gray-600 uppercase")], [Doc.TextNode(p.Unit)])]), Doc.Element("div", [Attr.Create("class", "mt-6 flex space-x-3")], ofSeq(delay(() => {
      const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
      return append([Button([Doc.TextNode("Update")], Map((a) =>"flex-1 text-[10px] uppercase tracking-tighter "+a, accent), () => { })], delay(() =>[IconButton(Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"></path></svg>"), Const("text-red-400"), () => {
        StartImmediate(Delay(() => Bind_1(DeleteProduct(p.Id), () => {
          loadProducts();
          return Zero();
        })), null);
      })]));
    })))];
    return Doc.Element("div", _1, _6);
  }, ofArray(ps)), products.View)))])])]);
}
export function RecipesPage(){
  const username=_c.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  const recipes=_c.Create_1([]);
  const showAddModal=_c.Create_1(false);
  const newName=_c.Create_1("");
  const newInst=_c.Create_1("");
  const newKcal=_c.Create_1("300");
  const newPrep=_c.Create_1("20");
  const newIcon=_c.Create_1("\ud83e\udd57");
  const loadRecipes=() => {
    StartImmediate(Delay(() => Bind_1(GetRecipes(), (a) => {
      recipes.Set(a);
      return Zero();
    })), null);
  };
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadRecipes(),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Recipes", username, season, Const(false), () => { }), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("div", [Attr.Create("class", "flex justify-between items-center mb-8")], ofSeq(delay(() => append([Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-800")], [Doc.TextNode("My Recipes")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("+ Add Recipe")], accent, () => {
      showAddModal.Set(true);
    })];
  }))))), Doc.EmbedView(Map((show) => show?Doc.Element("div", [Attr.Create("class", "fixed inset-0 z-[200] flex items-center justify-center p-6")], [Doc.Element("div", [Attr.Create("class", "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"), Handler("click", () =>() => showAddModal.Set(false))], []), Doc.Element("div", [Attr.Create("class", "relative w-full max-w-lg neo-flat p-8 rounded-3xl")], [Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold mb-6 text-gray-900")], [Doc.TextNode("Cookbook Entry")]), Doc.Element("div", [Attr.Create("class", "space-y-4")], [Doc.Element("div", [Attr.Create("class", "grid grid-cols-3 gap-4 mb-4")], [Doc.Concat(map_1((i) => Doc.Element("button", [Dynamic("class", Map((current) => current==i?"neo-pressed p-4 rounded-xl text-2xl":"neo-flat p-4 rounded-xl text-2xl active:scale-95 transition", newIcon.View)), Handler("click", () =>() => newIcon.Set(i))], [Doc.TextNode(i)]), ofArray(["\ud83e\udd57", "\ud83e\udd69", "\ud83c\udf5d", "\ud83e\udd51", "\ud83e\udd6a", "\ud83c\udf70"])))]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Recipe Name")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newName)]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-2 gap-4")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Prep Time (min)")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newPrep)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Calories (kcal)")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newKcal)])]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Instructions")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none")], newInst)]), Doc.Element("div", [Attr.Create("class", "flex space-x-4 mt-8")], ofSeq(delay(() => append([Doc.Element("button", [Attr.Create("class", "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"), Handler("click", () =>() => showAddModal.Set(false))], [Doc.TextNode("Cancel")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("Save Cookbook")], Map((a) =>"flex-1 "+a, accent), () => {
      StartImmediate(Delay(() => newName.Get()!=""?Bind_1(AddRecipe(New_1(0, newName.Get(), newInst.Get(), toInt(Number(newPrep.Get())), toInt(Number(newKcal.Get())), newIcon.Get())), (a) => a.$==0?(newName.Set(""),showAddModal.Set(false),loadRecipes(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero()):Zero()), null);
    })];
  })))))])])]):Doc.Empty, showAddModal.View)), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8")], [Doc.EmbedView(Map((a) => Doc.Concat(a), Map((rs) => length(rs)===0?ofArray([Doc.Element("div", [Attr.Create("class", "col-span-full neo-pressed p-20 rounded-3xl text-center opacity-40")], [Doc.Element("div", [Attr.Create("class", "text-gray-600 font-bold italic mb-2")], [Doc.TextNode("Your cookbook is empty")]), Doc.Element("div", [Attr.Create("class", "text-[10px] text-gray-600 uppercase tracking-widest")], [Doc.TextNode("Share your first secret recipe")])])]):map_1((r) => Doc.Element("div", [Attr.Create("class", "neo-nav-item p-6 rounded-3xl group cursor-pointer hover:scale-[1.01] transition duration-300")], [Doc.Element("div", [Attr.Create("class", "w-full h-40 neo-pressed rounded-2xl mb-4 overflow-hidden flex items-center justify-center text-6xl")], [Doc.TextNode(r.Icon)]), Doc.Element("h3", [Attr.Create("class", "font-black text-gray-800 text-xl")], [Doc.TextNode(r.Name)]), Doc.Element("p", [Attr.Create("class", "text-sm text-gray-600 mt-2 line-clamp-2 italic")], [Doc.TextNode(r.Instructions)]), Doc.Element("div", [Attr.Create("class", "flex justify-between mt-6 pt-4 border-t border-gray-100")], [Doc.Element("div", [Attr.Create("class", "flex items-center space-x-1 text-gray-700")], [Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z\"></path></svg>"), Doc.Element("span", [Attr.Create("class", "text-xs font-bold")], [Doc.TextNode(String(r.PrepTime)+"m")])]), Doc.Element("div", [Attr.Create("class", "flex items-center space-x-1 text-orange-400")], [Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 3 5.5 6 5.5 9.5a7 7 0 01-2.343 5.657z\"></path></svg>"), Doc.Element("span", [Attr.Create("class", "text-xs font-bold")], [Doc.TextNode(String(r.Kcal)+" kcal")])])])]), ofArray(rs)), recipes.View)))])])]);
}
export function RecordsPage(){
  const username=_c.Create_1("Loading...");
  const season=Const(getSeason(DatePortion(Date.now())));
  const records=_c.Create_1([]);
  const newType=_c.Create_1("Blood Glucose");
  const newValue=_c.Create_1("");
  const newUnit=_c.Create_1("mmol/L");
  const loadRecords=() => {
    StartImmediate(Delay(() => Bind_1(GetHealthRecords(), (a) => {
      records.Set(a);
      return Zero();
    })), null);
  };
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => a.$==1?(username.Set(a.$0),loadRecords(),Zero()):(globalThis.location.href="/",Zero()))), null);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Records", username, season, Const(false), () => { }), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-800 mb-6")], [Doc.TextNode("Health Records")]), Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl mb-10")], [Doc.Element("h2", [Attr.Create("class", "text-xl font-bold mb-6 text-gray-700")], [Doc.TextNode("Add New Measurement")]), Doc.Element("div", [Attr.Create("class", "grid grid-cols-1 md:grid-cols-4 gap-6 items-end")], ofSeq(delay(() => append([Doc.Element("div", [], ofSeq(delay(() => append([Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Type")])], delay(() => {
    const accent=Map((s) => getSeasonTheme(s, "text", "600"), season);
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
    return[Select(ofArray(["Blood Glucose", "Weight", "Blood Pressure", "Heart Rate"]), newType, (x) => x, accent, accentBg, false)];
  })))))], delay(() => append([Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Value")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none placeholder:text-gray-400")], newValue)])], delay(() => append([Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-xs font-bold text-gray-700 mb-2 pl-2")], [Doc.TextNode("Unit")]), Doc.Input([Attr.Create("class", "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none placeholder:text-gray-400")], newUnit)])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
    Map((s) => getSeasonTheme(s, "text", "600"), season);
    return[Button([Doc.TextNode("Save Entry")], accentBg, () => {
      StartImmediate(Delay(() => newValue.Get()!=""?Bind_1(AddHealthRecord(New_6(0, Date.now(), newType.Get(), newValue.Get(), newUnit.Get(), "Normal")), (a) => a.$==0?(newValue.Set(""),loadRecords(),Zero()):a.$==3?(alert(a.$0),Zero()):Zero()):Zero()), null);
    })];
  })))))))))]), Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl")], [Doc.Element("table", [Attr.Create("class", "w-full text-left")], [Doc.Element("thead", [], [Doc.Element("tr", [Attr.Create("class", "text-gray-600 text-sm uppercase tracking-wider")], [Doc.Element("th", [Attr.Create("class", "pb-4 pl-4")], [Doc.TextNode("Date")]), Doc.Element("th", [Attr.Create("class", "pb-4")], [Doc.TextNode("Type")]), Doc.Element("th", [Attr.Create("class", "pb-4")], [Doc.TextNode("Value")]), Doc.Element("th", [Attr.Create("class", "pb-4 pr-4 text-right")], [Doc.TextNode("Status")])])]), Doc.Element("tbody", [], [Doc.EmbedView(Map((a) => Doc.Concat(a), Map((rs) => length(rs)===0?ofArray([Doc.Element("tr", [], [Doc.Element("td", [Attr.Create("colspan", "4"), Attr.Create("class", "text-center py-10 text-gray-600 italic")], [Doc.TextNode("No records found. Add your first measurement above.")])])]):map_1((r) => Doc.Element("tr", [Attr.Create("class", "border-t border-gray-100")], [Doc.Element("td", [Attr.Create("class", "py-4 pl-4 font-medium text-gray-600")], [Doc.TextNode(DateFormatter(r.RecordDate, "yyyy-MM-dd HH:mm"))]), Doc.Element("td", [Attr.Create("class", "py-4 text-gray-700")], [Doc.TextNode(r.Type)]), Doc.Element("td", [Attr.Create("class", "py-4 text-gray-700 font-bold")], [Doc.TextNode(r.Value+" "+r.Unit)]), Doc.Element("td", [Attr.Create("class", "py-4 pr-4 text-right")], [Doc.Element("span", [Attr.Create("class", "px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold")], [Doc.TextNode(r.Status)])])]), ofArray(rs)), records.View)))])])])])]);
}
export function SettingsPanel(){
  const username=_c.Create_1("Loading...");
  const newUsername=_c.Create_1("");
  const email=_c.Create_1("user@example.com");
  const password=_c.Create_1("");
  const activeTab=_c.Create_1("Account");
  const calendarStartDay=_c.Create_1("Monday");
  const avatarUrl=_c.Create_1("");
  const season=Const(getSeason(DatePortion(Date.now())));
  const accentText=Map((s) => getSeasonTheme(s, "text", "600"), season);
  const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
  Map((s) => getSeasonTheme(s, "hover:text", "500"), season);
  const message=_c.Create_1("");
  const isSuccess=_c.Create_1(false);
  StartImmediate(Delay(() => Bind_1(CheckAuthState(), (a) => {
    if(a.$==1){
      const u=a.$0;
      username.Set(u);
      newUsername.Set(u);
      return Bind_1(GetUserSettings(), (a_1) => {
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
    if(day!="Loading..."&&username.Get()!="Loading...")StartImmediate(Delay(() => Bind_1(UpdateUserSettings(New_3(day, Some(avatarUrl.Get()))), () => Zero())), null);
  }, calendarStartDay.View);
  return Doc.Element("div", [Attr.Create("class", "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0")], [Sidebar("Settings", username, season, Const(false), () => { }), Doc.Element("div", [Attr.Create("class", "flex-1 p-10 overflow-y-auto w-full flex flex-col")], [Doc.Element("h1", [Attr.Create("class", "text-4xl font-extrabold text-gray-900 mb-10")], [Doc.TextNode("Settings")]), Doc.Element("div", [Attr.Create("class", "flex space-x-6 mb-10")], ofSeq(delay(() => map((tab) => Doc.Element("button", [Dynamic("class", Map((t) => t==tab?"px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 "+"neo-pressed bg-opacity-20 translate-y-px":"px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 "+"neo-flat text-gray-600 hover:text-gray-900", activeTab.View)), Dynamic("class", Map((at) => activeTab.Get()==tab?at:"", accentText)), Handler("click", () =>() => activeTab.Set(tab))], [Doc.TextNode(tab)]), ["Account", "Calendar", "Other"])))), Doc.Element("div", [Attr.Create("class", "flex-grow")], [Doc.EmbedView(Map((t) => t=="Account"?Doc.Element("div", [Attr.Create("class", "max-w-md w-full")], [Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl mb-8")], [Doc.Element("div", [Attr.Create("class", "flex items-center space-x-6 mb-8 border-b border-gray-100 pb-8")], [Doc.Element("div", [Attr.Create("class", "w-20 h-20 rounded-full neo-flat flex items-center justify-center text-2xl font-bold overflow-hidden")], [Doc.EmbedView(Map((url) => IsNullOrWhiteSpace(url)?Doc.TextView(Map((u) => u.length>0?Substring(u, 0, 1).toUpperCase():"U", username.View)):Doc.Element("img", [Attr.Create("src", url), Attr.Create("class", "w-full h-full object-cover")], []), avatarUrl.View))]), Doc.Element("div", [], [Doc.Element("h3", [Attr.Create("class", "text-lg font-bold text-gray-800")], [Doc.TextNode("Profile Avatar")]), Doc.Element("p", [Attr.Create("class", "text-xs text-gray-500 mb-3")], [Doc.TextNode("Enter an image URL or Gravatar.")]), Button([Doc.TextNode("Change Avatar URL")], accentText, () => {
    const url=globalThis.prompt("Avatar Image URL:", avatarUrl.Get());
    if(!(url==null)){
      avatarUrl.Set(url);
      StartImmediate(Delay(() => Bind_1(UpdateUserSettings(New_3(calendarStartDay.Get(), Some(url))), () => Zero())), null);
    }
  })])]), Doc.Element("div", [Attr.Create("class", "space-y-6")], [Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Username")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition")], newUsername)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.EmailInput([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition opacity-60")], email)]), Doc.Element("div", [], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Password")]), Doc.PasswordBox([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition placeholder:text-gray-400")], password)])]), Button([Doc.TextNode("Save Account Changes")], accentBg, () => {
    StartImmediate(Delay(() => {
      message.Set("Updating...");
      return Bind_1(UpdateUsername(newUsername.Get()), (a) => {
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
          showToast(e, Error_2);
          return Zero();
        }
        else return Zero();
      });
    }), null);
  }), Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-6 p-4 rounded-xl text-center text-sm "+(isSuccess.Get()?"bg-green-100 text-green-700":"bg-red-100 text-red-700"), message.View))], [Doc.TextView(message.View)])])]):t=="Calendar"?Doc.Element("div", [Attr.Create("class", "max-w-md w-full")], [Doc.Element("div", [Attr.Create("class", "neo-flat p-8 rounded-3xl")], [Doc.Element("h3", [Attr.Create("class", "text-lg font-bold text-gray-800 mb-6")], [Doc.TextNode("Calendar Preferences")]), Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("First day of the week")]), Select(ofArray(["Monday", "Sunday", "Saturday"]), calendarStartDay, (x) => x, accentText, accentBg, false)]), Button([Doc.TextNode("Update Calendar")], accentBg, () => {
    StartImmediate(Delay(() => Bind_1(UpdateUserSettings(New_3(calendarStartDay.Get(), Some(avatarUrl.Get()))), (a) => a.$==0?(showToast("Calendar settings saved!", Success),Zero()):a.$==3?(showToast(a.$0, Error_2),Zero()):Zero())), null);
  })])]):t=="Other"?Doc.Element("div", [Attr.Create("class", "max-w-md w-full")], [Doc.Element("div", [Attr.Create("class", "neo-flat p-10 rounded-3xl flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 bg-opacity-30")], [Doc.Element("span", [Attr.Create("class", "text-4xl mb-4 grayscale opacity-40")], [Doc.TextNode("\u2699\ufe0f")]), Doc.Element("p", [Attr.Create("class", "text-gray-500 italic font-medium")], [Doc.TextNode("Additional settings will appear here soon.")])])]):Doc.Empty, activeTab.View))])])]);
}
function getSeasonTheme(season, prefix, shade){
  return season=="Winter"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-blue-"+toSafe(_3)))((x) => x))(prefix))(shade):season=="Spring"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-emerald-"+toSafe(_3)))((x) => x))(prefix))(shade):season=="Summer"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-orange-"+toSafe(_3)))((x) => x))(prefix))(shade):season=="Autumn"?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-orange-"+toSafe(_3)))((x) => x))(prefix))(shade):((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+"-blue-"+toSafe(_3)))((x) => x))(prefix))(shade);
}
function getSeason(d){
  const _1=(new Date(d)).getMonth()+1;
  const _2=(new Date(d)).getDate();
  return _1===12&&_2>=21||_1<3||_1===3&&_2<20?"Winter":_1===3&&_2>=20||_1<6||_1===6&&_2<21?"Spring":_1===6&&_2>=21||_1<9||_1===9&&_2<22?"Summer":"Autumn";
}
function currentToast(){
  return _c_1.currentToast;
}
function GlassCard(content){
  return Doc.Element("div", [Attr.Create("class", "w-full max-w-md mx-auto neo-flat p-8 rounded-3xl transform transition-all text-gray-900")], content);
}
function LoginForm(){
  const email=_c.Create_1("");
  const password=_c.Create_1("");
  const showPassword=_c.Create_1(false);
  const message=_c.Create_1("");
  const msgColor=_c.Create_1("text-red-700 bg-red-100 border-red-500");
  return Doc.Element("div", [], ofSeq(delay(() => append([Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 leading-tight focus:outline-none transition"), Attr.Create("name", "email"), Attr.Create("type", "email")], email)])], delay(() => append([Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Password")]), Doc.Element("div", [Attr.Create("class", "relative w-full")], [Doc.Input([Dynamic("class", Map(() =>"neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 leading-tight focus:outline-none transition pr-12", showPassword.View)), Dynamic("type", Map((show) => show?"text":"password", showPassword.View)), Attr.Create("maxlength", "16")], password), Doc.Element("button", [Attr.Create("type", "button"), Attr.Create("class", "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"), Handler("click", () =>() => showPassword.Set(!showPassword.Get()))], [Doc.EmbedView(Map((show) => show?Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" /></svg>"):Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" /></svg>"), showPassword.View))])]), Doc.Element("div", [Attr.Create("class", "text-right mt-2")], [Doc.Element("a", [Attr.Create("href", "/forgot-password"), Attr.Create("class", "text-sm text-blue-500 hover:text-blue-800 transition font-medium")], [Doc.TextNode("Forgot Password?")])])])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return append([Button([Doc.TextNode("Log In")], accentBg, () => {
      StartImmediate(Delay(() => {
        const e=email.Get();
        const atIdx=e.indexOf("@");
        return!(atIdx>0&&e.indexOf(".", atIdx)>atIdx+1)?(msgColor.Set("text-red-700 bg-red-100 border-red-500"),message.Set("Please provide a valid email address."),Zero()):(message.Set("Logging in..."),msgColor.Set("text-blue-700 bg-blue-100 border-blue-500"),Bind_1(LoginUser(e, password.Get()), (a) => {
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
function RegistrationForm(){
  const email=_c.Create_1("");
  const password=_c.Create_1("");
  const showPassword=_c.Create_1(false);
  const message=_c.Create_1("");
  const isError=_c.Create_1(false);
  const passwordStrength=Map(CalculatePasswordScore, password.View);
  const emailStrength=Map((e) => {
    if(e=="")return 0;
    else {
      const atIdx=e.indexOf("@");
      return atIdx>0?e.indexOf(".", atIdx)>atIdx+1?3:2:1;
    }
  }, email.View);
  return Doc.Element("div", [], ofSeq(delay(() => append([Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition"), Attr.Create("name", "email"), Attr.Create("type", "email")], email), Doc.Element("div", [Attr.Create("class", "w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden shadow-inner")], [Doc.Element("div", [Dynamic("class", Map((score) =>"h-full transition-all duration-300 "+(score===0?"w-0":score===1?"w-1/3":score===2?"w-2/3":score===3?"w-full":"w-0")+" "+(score===1?"bg-red-500":score===2?"bg-orange-500":score===3?"bg-green-500":"bg-transparent"), emailStrength))], [])]), Doc.Element("p", [Dynamic("class", Map((score) => score===3||email.Get()==""?"hidden":"text-xs text-red-500 mt-2 pl-2", emailStrength))], [Doc.TextNode("please provide a valid email address.")])])], delay(() => append([Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-800 text-sm font-bold mb-3 pl-2")], [Doc.TextNode("Password")]), Doc.Element("div", [Attr.Create("class", "relative w-full")], [Doc.Input([Dynamic("class", Map(() =>"neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition pr-12", showPassword.View)), Dynamic("type", Map((show) => show?"text":"password", showPassword.View)), Attr.Create("maxlength", "16")], password), Doc.Element("button", [Attr.Create("type", "button"), Attr.Create("class", "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"), Handler("click", () =>() => showPassword.Set(!showPassword.Get()))], [Doc.EmbedView(Map((show) => show?Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" /></svg>"):Doc.Verbatim("<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-6 w-6\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" /></svg>"), showPassword.View))])]), PasswordStrengthView(passwordStrength)])], delay(() => {
    const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), Const(getSeason(DatePortion(Date.now()))));
    return append([Button([Doc.TextNode("Register Securely")], accentBg, () => {
      StartImmediate(Delay(() => {
        const _1=email.Get();
        const p=password.Get();
        const atIdx=_1.indexOf("@");
        const isValid=atIdx>0&&_1.indexOf(".", atIdx)>atIdx+1;
        const pScore=CalculatePasswordScore(p);
        return!isValid?(isError.Set(true),message.Set("Please provide a valid email address."),Zero()):pScore<5?(isError.Set(true),message.Set("Password does not meet the security requirements."),Zero()):(message.Set("Processing..."),isError.Set(false),Bind_1(RegisterUser(_1, p), (a) => {
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
function PasswordStrengthView(passwordScore){
  return Doc.Element("div", [], [Doc.Element("div", [Attr.Create("class", "w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden shadow-inner")], [Doc.Element("div", [Dynamic("class", Map((score) =>"h-full transition-all duration-300 "+(score===-1?"w-0":score===0?"w-0":score===1?"w-1/5":score===2?"w-2/5":score===3?"w-3/5":score===4?"w-4/5":score===5?"w-full":"w-0")+" "+(score===-1?"bg-transparent":score===0?"bg-transparent":score===1?"bg-red-500":score===2?"bg-red-500":score===3?"bg-orange-500":score===4?"bg-yellow-400":score===5?"bg-green-500":"bg-transparent"), passwordScore))], [])]), Doc.Element("p", [Dynamic("class", Map((score) => score===-1?"text-xs text-red-500 font-bold mt-2 pl-2":"text-xs text-gray-600 mt-2 pl-2", passwordScore))], [Doc.TextView(Map((score) => score===-1?"Contains illegal injection characters!":"Requires 8-16 chars: Upper, Lower, Number, Special (!@#$%^&*_-+=?).", passwordScore))])]);
}
function CalculatePasswordScore(p){
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
function Sidebar(active, username, season, isCollapsed, onToggle){
  const accentText=Map((s) => getSeasonTheme(s, "text", "600"), season);
  const accentHover=Map((s) => getSeasonTheme(s, "hover:text", "500"), season);
  const accentBg=Map((s) => getSeasonTheme(s, "bg", "100"), season);
  const items=ofArray([["Dashboard", "/dashboard", "<path d=\"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z\"></path>"], ["Planner", "/planner", "<path d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4\"></path>"], ["Calendar", "/calendar", "<rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line>"], ["Products", "/products", "<path d=\"M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z\"></path><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line><path d=\"M16 10a4 4 0 01-8 0\"></path>"], ["Recipes", "/recipes", "<path d=\"M18 20V6a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z\"></path><path d=\"M18 20l4-4\"></path><path d=\"M18 6l4 4\"></path>"], ["Records", "/records", "<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"></polyline>"]]);
  return Doc.Element("div", [Dynamic("class", Map((collapsed) => collapsed?"neo-flat flex flex-col justify-between m-6 transition-all duration-300 ease-in-out w-20 p-4 rounded-full":"neo-flat flex flex-col justify-between m-6 transition-all duration-300 ease-in-out w-64 p-5 rounded-[2rem]", isCollapsed))], [Doc.Element("div", [Attr.Create("class", "w-full")], [Doc.Element("ul", [Dynamic("class", Map((collapsed) => collapsed?"flex flex-col space-y-4 mt-8 w-full items-center":"flex flex-col space-y-4 mt-8 w-full items-stretch", isCollapsed))], ofSeq(delay(() => collect((m) => {
    const url=m[1];
    const name=m[0];
    return[Doc.Element("li", [Dynamic("class", Map3((_1, _2, _3) =>"cursor-pointer flex items-center transition-all duration-300 "+(active==name?"neo-nav-active "+getSeasonTheme(_1, "text", "600"):(((_4) =>(_5) => _4("text-gray-800 neo-nav-item "+toSafe(_5)))((x) => x))(getSeasonTheme(_1, "hover:text", "500")))+(_3?"w-12 h-12 rounded-full aspect-square justify-center flex-shrink-0":"w-full p-4 rounded-2xl space-x-4"), season, accentHover, isCollapsed)), Handler("click", () =>() => {
      globalThis.location.href=url;
    })], [Doc.Verbatim((((_1) =>(_2) => _1("<svg class=\"w-6 h-6 flex-shrink-0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" viewBox=\"0 0 24 24\">"+toSafe(_2)+"</svg>"))((x) => x))(m[2])), Doc.EmbedView(Map((collapsed) =>!collapsed?Doc.Element("span", [Attr.Create("class", "ml-4 font-semibold text-sm")], [Doc.TextNode(name)]):Doc.Empty, isCollapsed))])];
  }, items))))]), Doc.Element("div", [Dynamic("class", Map((collapsed) => collapsed?"flex mt-auto w-full flex-col items-center space-y-4":"flex mt-auto w-full items-center justify-between", isCollapsed))], [Doc.Element("div", [Attr.Create("class", "flex items-center space-x-3 overflow-hidden")], [Doc.Element("div", [Dynamic("class", Map((bg) =>(((_1) =>(_2) => _1("w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center "+toSafe(_2)+" font-bold overflow-hidden"))((x) => x))(bg), accentBg)), Dynamic("class", Map((textCol) => textCol, accentText))], ofSeq(delay(() => {
    const v=_c.Create_1(Doc.Empty);
    StartImmediate(Delay(() => Bind_1(GetUserSettings(), (a) => Bind_1(CheckAuthState(), (a_1) => {
      let initial;
      let _1;
      if(a_1.$==1){
        const u=a_1.$0;
        initial=u.length>0?Substring(u, 0, 1).toUpperCase():"U";
      }
      else initial="U";
      const m=a.AvatarUrl;
      let _2=m!=null&&m.$==1&&(!IsNullOrWhiteSpace(m.$0)&&(_1=m.$0,true))?Doc.Element("img", [Attr.Create("src", _1), Attr.Create("class", "w-full h-full object-cover")], []):Doc.TextNode(initial);
      v.Set(_2);
      return Zero();
    }))), null);
    return[Doc.EmbedView(v.View)];
  }))), Doc.EmbedView(Map((collapsed) =>!collapsed?Doc.Element("div", [Attr.Create("class", "flex flex-col overflow-hidden")], [Doc.Element("span", [Attr.Create("class", "text-sm font-bold text-gray-800 truncate max-w-[120px]")], [Doc.TextView(username.View)])]):Doc.Empty, isCollapsed))]), Doc.Element("div", [Dynamic("class", Map((collapsed) => collapsed?"flex flex-col space-y-4 items-center":"flex items-center space-x-2", isCollapsed))], [Doc.Element("a", [Attr.Create("href", "/settings"), Dynamic("class", Map2((_1, _2) => _2=="Settings"?"w-12 h-12 flex items-center justify-center rounded-full transition cursor-pointer flex-shrink-0 neo-nav-active "+getSeasonTheme(_1, "text", "600"):"w-12 h-12 flex items-center justify-center rounded-full transition cursor-pointer flex-shrink-0 text-gray-700 neo-nav-item", season, Const(active)))], [Doc.Verbatim("<svg class=\"w-5 h-5 transition-transform\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\"></path><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\"></path></svg>")]), Doc.EmbedView(Map((collapsed) => collapsed?Doc.Element("button", [Attr.Create("class", "w-12 h-12 flex items-center justify-center rounded-full text-gray-700 neo-nav-item transition cursor-pointer active:scale-95"), Handler("click", () =>() => onToggle())], [Doc.Verbatim("<svg class=\"w-5 h-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 5l7 7-7 7M5 5l7 7-7 7\"></path></svg>")]):Doc.Element("button", [Attr.Create("class", "w-12 h-12 flex items-center justify-center rounded-full text-gray-700 neo-nav-item transition cursor-pointer active:scale-95"), Handler("click", () =>() => onToggle())], [Doc.Verbatim("<svg class=\"w-5 h-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M11 19l-7-7 7-7M19 19l-7-7 7-7\"></path></svg>")]), isCollapsed))])])]);
}
function renderDate(d, isMain, onClick){
  const p=getMoonInfo(d);
  const moonLabel=p[2];
  const moonIcon=p[0];
  const moonDisplay=p[1];
  const seasonal=getSeasonalInfo(d);
  const season=getSeason(d);
  const seasonIcon=getSeasonIconWithSeason(season);
  const accent=getSeasonTheme(season, "text", "600");
  const borderAccent=getSeasonTheme(season, "border", "200");
  return Doc.Element("div", ofSeq(delay(() => append([Attr.Create("class", (DatePortion(d)==DatePortion(Date.now())?"p-4 rounded-xl flex flex-col items-center justify-center transition-all neo-flat ":"p-4 rounded-xl flex flex-col items-center justify-center transition-all neo-nav-item ")+(DatePortion(d)==DatePortion(Date.now())?((((_1) =>(_2) =>(_3) => _1(toSafe(_2)+" font-bold border-2 "+toSafe(_3)))((x) => x))(accent))(borderAccent):"text-gray-800 cursor-pointer")+(isMain?" min-h-[160px]":" min-h-[120px] opacity-60"))], delay(() => {
    let _1;
    if(seasonal!=null&&seasonal.$==1){
      const l=seasonal.$0[1];
      _1=((((_3) =>(_4) =>(_5) => _3(toSafe(_4)+" | "+toSafe(_5)))((x) => x))(moonLabel))(l);
    }
    else _1=moonLabel;
    let _2=[Attr.Create("title", _1)];
    return append(_2, delay(() => {
      if(onClick==null)return[Attr.Create("data-no-click", "true")];
      else {
        const f=onClick.$0;
        return[Handler("click", () =>() => f(d))];
      }
    }));
  })))), ofSeq(delay(() => append([Doc.Element("span", [Attr.Create("class", "text-xs font-bold text-gray-600 uppercase")], [Doc.TextNode(DateFormatter(d, "ddd"))])], delay(() => append([Doc.Element("div", [Attr.Create("class", "text-[10px] mb-1")], [Doc.TextNode(seasonIcon)])], delay(() => append([Doc.Element("div", [Attr.Create("class", "flex flex-col items-center mb-1 w-full")], [Doc.Element("span", [Attr.Create("class", "text-2xl")], [Doc.TextNode(moonIcon)]), Doc.Element("span", [Attr.Create("class", "text-sm font-black text-gray-800 text-center px-2")], [Doc.TextNode(moonDisplay)])])], delay(() => {
    let _1;
    if(seasonal!=null&&seasonal.$==1){
      const label=seasonal.$0[1];
      const icon=seasonal.$0[0];
      _1=[Doc.Element("div", [Attr.Create("class", "flex flex-col items-center mb-1 w-full")], [Doc.Element("span", [Attr.Create("class", "text-base")], [Doc.TextNode(icon)]), Doc.Element("span", [Attr.Create("class", "text-[8px] font-black text-gray-700 uppercase text-center bg-white/20 rounded px-1 max-w-full truncate")], [Doc.TextNode(label)])])];
    }
    else _1=[];
    return append(_1, delay(() => {
      let c;
      return[Doc.Element("span", [Attr.Create("class", "text-5xl font-black mt-2")], [Doc.TextNode((c=(new Date(d)).getDate(),String(c)))])];
    }));
  })))))))));
}
function getWeekNumber(d){
  const day=toInt(Number((new Date(d)).getDay()));
  const d2=d+(4-(day===0?7:day))*864E5;
  return toInt(Math.floor((d2-Create((new Date(d2)).getFullYear(), 1, 1, 0, 0, 0, 0))/864E5/7)+1);
}
function getRecentNewMoon(date){
  const knownNewMoon=Create(2000, 1, 6, 18, 14, 0, 0);
  const lunarCycle=29.530588;
  return DatePortion(knownNewMoon+Math.floor((date-knownNewMoon)/864E5/lunarCycle)*lunarCycle*864E5);
}
function showToast(content, t){
  currentToast().Set(Some(New(content, t)));
  StartImmediate(Delay(() => Bind_1(Sleep(3500), () => {
    let _1;
    const m=currentToast().Get();
    return m!=null&&m.$==1&&(m.$0.Content==content&&(_1=m.$0,true))?(currentToast().Set(null),Zero()):Zero();
  })), null);
}
function getMoonInfo(date){
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
function getSeasonalInfo(d){
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
function getSeasonIconWithSeason(season){
  return season=="Winter"?"\u2744\ufe0f":season=="Spring"?"\ud83c\udf31":season=="Summer"?"\u2600\ufe0f":season=="Autumn"?"\ud83c\udf42":"\u2744\ufe0f";
}
class Object_1 {
  Equals(obj){
    return this===obj;
  }
  GetHashCode(){
    return -1;
  }
}
let _c=Lazy((_i) => class Var_1 extends Object_1 {
  static {
    _c=_i(this);
  }
  static Create_1(v){
    return new ConcreteVar(false, {s:Ready(v, [])}, v);
  }
  static { }
});
function Error_1(Item){
  return{$:3, $0:Item};
}
function toInt(x){
  const u=toUInt(x);
  return u>2147483647?u-4294967296:u;
}
function range(min, max_1){
  const count=1+max_1-min;
  return count<=0?[]:init(count, (x) => x+min);
}
function toUInt(x){
  return(x<0?Math.ceil(x):Math.floor(x))>>>0;
}
function FailWith(msg){
  throw new Error(msg);
}
function CheckAuthState(){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/CheckAuthState", []), (o) => Return((DecodeJson_AuthResult())(o)));
}
function Logout(){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/Logout", []), (o) => Return((DecodeJson_AuthResult())(o)));
}
function TriggerMagicLink(email){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/TriggerMagicLink", [email]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function AttemptVerifyEmail(token){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/AttemptVerifyEmail", [token]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function AttemptMagicLogin(token){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/AttemptMagicLogin", [token]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function ResetPassword(newPassword){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/ResetPassword", [newPassword]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function GetMealPlansRange(startDate, endDate){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/GetMealPlansRange", [((EncodeDateTime())())(startDate), ((EncodeDateTime())())(endDate)]), (o) => Return(((DecodeArray(DecodeJson_MealPlanItem))())(o)));
}
function GetRecipes(){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/GetRecipes", []), (o) => Return(o));
}
function AddMealPlan(m){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/AddMealPlan", [(EncodeJson_MealPlanItem())(m)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function GetUserSettings(){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/GetUserSettings", []), (o) => Return((DecodeJson_GlobalSettings())(o)));
}
function GetCalendarEvents(startDate, endDate){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/GetCalendarEvents", [((EncodeDateTime())())(startDate), ((EncodeDateTime())())(endDate)]), (o) => Return(((DecodeArray(DecodeJson_CalendarEvent))())(o)));
}
function AddCalendarEvent(ev){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/AddCalendarEvent", [(EncodeJson_CalendarEvent())(ev)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function GetProducts(){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/GetProducts", []), (o) => Return(o));
}
function DeleteProduct(id){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/DeleteProduct", [id]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function AddProduct(p){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/AddProduct", [p]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function AddRecipe(r){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/AddRecipe", [r]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function GetHealthRecords(){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/GetHealthRecords", []), (o) => Return(((DecodeArray(DecodeJson_DailyRecord))())(o)));
}
function AddHealthRecord(r){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/AddHealthRecord", [(EncodeJson_DailyRecord())(r)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function UpdateUserSettings(s){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/UpdateUserSettings", [(EncodeJson_GlobalSettings())(s)]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function UpdateUsername(newName){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/UpdateUsername", [newName]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function LoginUser(email, password){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/LoginUser", [email, password]), (o) => Return((DecodeJson_AuthResult())(o)));
}
function RegisterUser(email, password){
  return Bind_1((new AjaxRemotingProvider()).Async("Server/RegisterUser", [email, password]), (o) => Return((DecodeJson_AuthResult())(o)));
}
class Var extends Object_1 { }
function Map(fn, a){
  return CreateLazy(() => Map_1(fn, a()));
}
function Const(x){
  const o={s:Forever(x)};
  return() => o;
}
function Map2(fn, a, a_1){
  return CreateLazy(() => Map2_1(fn, a(), a_1()));
}
function Sink(act, a){
  function loop(){
    WhenRun(a(), act, () => {
      scheduler().Fork(loop);
    });
  }
  scheduler().Fork(loop);
}
function Map3(fn, a, a_1, a_2){
  return CreateLazy(() => Map3_1(fn, a(), a_1(), a_2()));
}
function CreateLazy(observe){
  const lv={c:null, o:observe};
  return() => {
    let c=lv.c;
    if(c===null){
      c=lv.o();
      lv.c=c;
      const _1=c.s;
      if(_1!=null&&_1.$==0)lv.o=null;
      else WhenObsoleteRun(c, () => {
        lv.c=null;
      });
      return c;
    }
    else return c;
  };
}
function Bind(fn, view){
  return Join(Map(fn, view));
}
function Map2Unit(a, a_1){
  return CreateLazy(() => Map2Unit_1(a(), a_1()));
}
function Join(a){
  return CreateLazy(() => Join_1(a()));
}
class attr extends Object_1 { }
class Doc extends Object_1 {
  docNode;
  updates;
  static get Empty(){
    return Doc.Mk(null, Const());
  }
  static Verbatim(html){
    return Doc.Mk(MapTreeReduce((n) => Equals(n.nodeType, Node.TEXT_NODE)?TextNodeDoc(n):ElemDoc(CreateElemNode(n, EmptyAttr(), null)), null, (_1, _2) => AppendDoc(_1, _2), ChildrenArray(ParseHTMLIntoFakeRoot(html))), Const());
  }
  static Concat(xs){
    return TreeReduce(Doc.Empty, Doc.Append, ofSeqNonCopying(xs));
  }
  static Mk(node, updates){
    return new Doc(node, updates);
  }
  static TextNode(v){
    return Doc.Mk(TextNodeDoc(globalThis.document.createTextNode(v)), Const());
  }
  static EmbedView(view){
    const node=CreateEmbedNode();
    return Doc.Mk(EmbedDoc(node), Map(() => { }, Bind((doc) => {
      UpdateEmbedNode(node, doc.docNode);
      return doc.updates;
    }, view)));
  }
  static Input(attr_1, var_1){
    return Doc.InputInternal("input", () => append(attr_1, [Value(var_1)]));
  }
  static Append(a, b){
    return Doc.Mk(AppendDoc(a.docNode, b.docNode), Map2Unit(a.updates, b.updates));
  }
  static EmailInput(attr_1, var_1){
    return Doc.InputInternal("input", () => append(attr_1, [Value(var_1), Attr.Create("type", "email")]));
  }
  static PasswordBox(attr_1, var_1){
    return Doc.InputInternal("input", () => append(attr_1, [Value(var_1), Attr.Create("type", "password")]));
  }
  static Element(name, attr_1, children){
    const a=Attr.Concat(attr_1);
    const c=Doc.Concat(children);
    return Elt.New(globalThis.document.createElement(name), a, c);
  }
  static InputInternal(elemTy, attr_1){
    const el=globalThis.document.createElement(elemTy);
    return Elt.New(el, Attr.Concat(attr_1(el)), Doc.Empty);
  }
  static TextView(txt){
    const node=CreateTextNode();
    return Doc.Mk(TextDoc(node), Map((t) => {
      UpdateTextNode(node, t);
    }, txt));
  }
  static RunBefore(rdelim, doc){
    const ldelim=globalThis.document.createTextNode("");
    rdelim.parentNode.insertBefore(ldelim, rdelim);
    Doc.RunBetween(ldelim, rdelim, doc);
  }
  static RunBetween(ldelim, rdelim, doc){
    LinkPrevElement(rdelim, doc.docNode);
    const st=CreateDelimitedRunState(ldelim, rdelim, doc.docNode);
    Sink(get_UseAnimations()||BatchUpdatesEnabled()?StartProcessor(PerformAnimatedUpdate(false, st, doc.docNode)):() => {
      PerformSyncUpdate(false, st, doc.docNode);
    }, doc.updates);
  }
  ReplaceInDom(elt){
    const rdelim=globalThis.document.createTextNode("");
    elt.parentNode.replaceChild(rdelim, elt);
    Doc.RunBefore(rdelim, this);
  }
  constructor(docNode, updates){
    super();
    this.docNode=docNode;
    this.updates=updates;
  }
}
function toSafe(s){
  return s==null?"":s;
}
function New(Content, Type){
  return{Content:Content, Type:Type};
}
function delay(f){
  return{GetEnumerator:() => Get(f())};
}
function append(s1, s2){
  return{GetEnumerator:() => {
    const e1=Get(s1);
    const first=[true];
    return new T(e1, null, (x) => {
      if(x.s.MoveNext()){
        x.c=x.s.Current;
        return true;
      }
      else {
        const x_1=x.s;
        if(!Equals(x_1, null))x_1.Dispose();
        x.s=null;
        return first[0]&&(first[0]=false,x.s=Get(s2),x.s.MoveNext()?(x.c=x.s.Current,true):(x.s.Dispose(),x.s=null,false));
      }
    }, (x) => {
      const x_1=x.s;
      if(!Equals(x_1, null))x_1.Dispose();
    });
  }};
}
function map(f, s){
  return{GetEnumerator:() => {
    const en=Get(s);
    return new T(null, null, (e) => en.MoveNext()&&(e.c=f(en.Current),true), () => {
      en.Dispose();
    });
  }};
}
function collect(f, s){
  return concat(map(f, s));
}
function init(n, f){
  return take(n, initInfinite(f));
}
function take(n, s){
  n<0?nonNegative():void 0;
  return{GetEnumerator:() => {
    const e=[Get(s)];
    return new T(0, null, (o) => {
      o.s=o.s+1;
      if(o.s>n)return false;
      else {
        const en=e[0];
        return Equals(en, null)?insufficient():en.MoveNext()?(o.c=en.Current,o.s===n?(en.Dispose(),e[0]=null):void 0,true):(en.Dispose(),e[0]=null,insufficient());
      }
    }, () => {
      const x=e[0];
      if(!Equals(x, null))x.Dispose();
    });
  }};
}
function concat(ss){
  return{GetEnumerator:() => {
    const outerE=Get(ss);
    function next(st){
      while(true)
        {
          const m=st.s;
          if(Equals(m, null)){
            if(outerE.MoveNext()){
              st.s=Get(outerE.Current);
              st=st;
            }
            else {
              outerE.Dispose();
              return false;
            }
          }
          else if(m.MoveNext()){
            st.c=m.Current;
            return true;
          }
          else {
            st.Dispose();
            st.s=null;
            st=st;
          }
        }
    }
    return new T(null, null, next, (st) => {
      const x=st.s;
      if(!Equals(x, null))x.Dispose();
      const x_1=outerE;
      if(!Equals(x_1, null))x_1.Dispose();
    });
  }};
}
function initInfinite(f){
  return{GetEnumerator:() => new T(0, null, (e) => {
    e.c=f(e.s);
    e.s=e.s+1;
    return true;
  }, void 0)};
}
function iter(p, s){
  const e=Get(s);
  try {
    while(e.MoveNext())
      p(e.Current);
  }
  finally {
    const _1=e;
    if(typeof _1=="object"&&isIDisposable(_1))e.Dispose();
  }
}
function nth(index, s){
  if(index<0)FailWith("negative index requested");
  let pos=-1;
  const e=Get(s);
  try {
    while(pos<index)
      {
        !e.MoveNext()?insufficient():void 0;
        pos=pos+1;
      }
    return e.Current;
  }
  finally {
    const _1=e;
    if(typeof _1=="object"&&isIDisposable(_1))e.Dispose();
  }
}
function forall(p, s){
  return!exists((x) =>!p(x), s);
}
function distinctBy(f, s){
  return{GetEnumerator:() => {
    const o=Get(s);
    const seen=new HashSet("New_3");
    return new T(null, null, (e) => {
      let cur;
      let has;
      if(o.MoveNext()){
        cur=o.Current;
        has=seen.SAdd(f(cur));
        while(!has&&o.MoveNext())
          {
            cur=o.Current;
            has=seen.SAdd(f(cur));
          }
        return has&&(e.c=cur,true);
      }
      else return false;
    }, () => {
      o.Dispose();
    });
  }};
}
function exists(p, s){
  const e=Get(s);
  try {
    let r=false;
    while(!r&&e.MoveNext())
      r=p(e.Current);
    return r;
  }
  finally {
    const _1=e;
    if(typeof _1=="object"&&isIDisposable(_1))e.Dispose();
  }
}
function max(s){
  const e=Get(s);
  try {
    if(!e.MoveNext())seqEmpty();
    let m=e.Current;
    while(e.MoveNext())
      {
        const x=e.Current;
        if(Compare(x, m)===1)m=x;
      }
    return m;
  }
  finally {
    const _1=e;
    if(typeof _1=="object"&&isIDisposable(_1))e.Dispose();
  }
}
function seqEmpty(){
  return FailWith("The input sequence was empty.");
}
function Button(content, accent, onClick){
  return Doc.Element("button", [Dynamic("class", Map((a) =>(((_1) =>(_2) => _1("neo-nav-item px-6 py-3 rounded-xl "+toSafe(_2)+" font-bold transition active:scale-95 transform"))((x) => x))(a), accent)), Handler("click", () =>() => onClick())], content);
}
function IconButton(icon, accentHover, onClick){
  return Doc.Element("button", [Dynamic("class", Map((ah) =>(((_1) =>(_2) => _1("w-12 h-12 flex items-center justify-center rounded-full neo-nav-item text-gray-700 hover:"+toSafe(_2)+" transition active:scale-95 transform"))((x) => x))(ah), accentHover)), Handler("click", () =>() => onClick())], [icon]);
}
function Select(options, current, toLabel, accent, accentHover, isRightAligned){
  const isOpen=_c.Create_1(false);
  return Doc.Element("div", [Dynamic("class", Const(isRightAligned?"relative":"relative w-full"))], [Doc.Element("button", [Dynamic("class", Map((a) =>(((_1) =>(_2) => _1("neo-nav-item px-6 py-3 rounded-xl flex items-center justify-center space-x-3 "+toSafe(_2)+" font-bold transition w-full"))((x) => x))(a), accent)), Handler("click", () =>() => isOpen.Set(!isOpen.Get()))], [Doc.EmbedView(Map((v) => Doc.TextNode(toLabel(v)), current.View)), Doc.Verbatim("<svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\"></path></svg>")]), Doc.EmbedView(Map((openState) => openState?Doc.Element("div", [Attr.Create("class", (((_1) =>(_2) => _1("absolute top-full "+toSafe(_2)+" mt-4 neo-flat rounded-2xl p-2 z-[140] overflow-hidden"))((x) => x))(isRightAligned?"right-0 w-48":"left-0 right-0"))], [Doc.Concat(map_1((opt) => Doc.Element("div", [Dynamic("class", Map((ah) =>(((_1) =>(_2) => _1("p-3 hover:bg-opacity-10 rounded-xl cursor-pointer transition-colors font-medium text-gray-800 hover:"+toSafe(_2)))((x) => x))(ah), accentHover)), Handler("click", () =>() => {
    current.Set(opt);
    return isOpen.Set(false);
  })], [Doc.TextNode(toLabel(opt))]), options))]):Doc.Empty, isOpen.View))]);
}
function ofArray(arr){
  let r=FSharpList.Empty;
  for(let i=length(arr)-1, _1=0;i>=_1;i--)r=FSharpList.Cons(get(arr, i), r);
  return r;
}
function map_1(f, x){
  let r;
  let l;
  let go;
  if(x.$==0)return x;
  else {
    const res=Create_2(FSharpList, {$:1});
    r=res;
    l=x;
    go=true;
    while(go)
      {
        r.$0=f(l.$0);
        l=l.$1;
        if(l.$==0)go=false;
        else {
          const t=Create_2(FSharpList, {$:1});
          r=(r.$1=t,t);
        }
      }
    r.$1=FSharpList.Empty;
    return res;
  }
}
function init_1(s, f){
  return ofArray(init_2(s, f));
}
function append_1(x, y){
  let r;
  let l;
  let go;
  if(x.$==0)return y;
  else if(y.$==0)return x;
  else {
    const res=Create_2(FSharpList, {$:1});
    r=res;
    l=x;
    go=true;
    while(go)
      {
        r.$0=l.$0;
        l=l.$1;
        if(l.$==0)go=false;
        else {
          const t=Create_2(FSharpList, {$:1});
          r=(r.$1=t,t);
        }
      }
    r.$1=y;
    return res;
  }
}
function ofSeq(s){
  if(s instanceof FSharpList)return s;
  else if(s instanceof Array)return ofArray(s);
  else {
    const e=Get(s);
    try {
      let r;
      let go=e.MoveNext();
      if(!go)return FSharpList.Empty;
      else {
        const res=Create_2(FSharpList, {$:1});
        r=res;
        while(go)
          {
            r.$0=e.Current;
            if(e.MoveNext()){
              const t=Create_2(FSharpList, {$:1});
              r=(r.$1=t,t);
            }
            else go=false;
          }
        r.$1=FSharpList.Empty;
        return res;
      }
    }
    finally {
      const _1=e;
      if(typeof _1=="object"&&isIDisposable(_1))e.Dispose();
    }
  }
}
function head(l){
  return l.$==1?l.$0:listEmpty();
}
function tail(l){
  return l.$==1?l.$1:listEmpty();
}
function listEmpty(){
  return FailWith("The input list was empty.");
}
function tryFind(f, arr){
  let res=null;
  let i=0;
  while(i<arr.length&&res==null)
    {
      f(arr[i])?res=Some(arr[i]):void 0;
      i=i+1;
    }
  return res;
}
function filter(f, arr){
  const r=[];
  for(let i=0, _1=arr.length-1;i<=_1;i++)if(f(arr[i]))r.push(arr[i]);
  return r;
}
function map_2(f, arr){
  const r=new Array(arr.length);
  for(let i=0, _1=arr.length-1;i<=_1;i++)r[i]=f(arr[i]);
  return r;
}
function init_2(size, f){
  if(size<0)FailWith("Negative size given.");
  else null;
  const r=new Array(size);
  for(let i=0, _1=size-1;i<=_1;i++)r[i]=f(i);
  return r;
}
function ofList(xs){
  const q=[];
  let l=xs;
  while(!(l.$==0))
    {
      q.push(head(l));
      l=tail(l);
    }
  return q;
}
function findIndex(f, arr){
  const m=tryFindIndex(f, arr);
  return m==null?FailWith("KeyNotFoundException"):m.$0;
}
function iter_1(f, arr){
  for(let i=0, _1=arr.length-1;i<=_1;i++)f(arr[i]);
}
function tryFindIndex(f, arr){
  let res=null;
  let i=0;
  while(i<arr.length&&res==null)
    {
      f(arr[i])?res=Some(i):void 0;
      i=i+1;
    }
  return res;
}
function foldBack(f, arr, zero){
  let acc=zero;
  const len=arr.length;
  for(let i=1, _1=len;i<=_1;i++)acc=f(arr[len-i], acc);
  return acc;
}
function create(size, value){
  const r=new Array(size);
  for(let i=0, _1=size-1;i<=_1;i++)r[i]=value;
  return r;
}
function ofSeq_1(xs){
  if(xs instanceof Array)return xs.slice();
  else if(xs instanceof FSharpList)return ofList(xs);
  else {
    const q=[];
    const o=Get(xs);
    try {
      while(o.MoveNext())
        q.push(o.Current);
      return q;
    }
    finally {
      const _1=o;
      if(typeof _1=="object"&&isIDisposable(_1))o.Dispose();
    }
  }
}
function distinctBy_1(f, a){
  return ofSeq_1(distinctBy(f, a));
}
function choose(f, arr){
  const q=[];
  for(let i=0, _1=arr.length-1;i<=_1;i++){
    const m=f(arr[i]);
    if(m==null){ }
    else q.push(m.$0);
  }
  return q;
}
function exists_1(f, x){
  let e=false;
  let i=0;
  const l=length(x);
  while(!e&&i<l)
    if(f(x[i]))e=true;
    else i=i+1;
  return e;
}
function forall_1(f, x){
  let a=true;
  let i=0;
  const l=length(x);
  while(a&&i<l)
    if(f(x[i]))i=i+1;
    else a=false;
  return a;
}
function New_1(Id_1, Name, Instructions, PrepTime, Kcal, Icon){
  return{
    Id:Id_1, 
    Name:Name, 
    Instructions:Instructions, 
    PrepTime:PrepTime, 
    Kcal:Kcal, 
    Icon:Icon
  };
}
class FSharpList {
  static Cons(Head, Tail){
    return Create_2(FSharpList, {
      $:1, 
      $0:Head, 
      $1:Tail
    });
  }
  static Empty=Create_2(FSharpList, {$:0});
  get_Item(x){
    return nth(x, this);
  }
  GetEnumerator(){
    return new T(this, null, (e) => {
      const m=e.s;
      if(m.$==0)return false;
      else {
        const xs=m.$1;
        e.c=m.$0;
        e.s=xs;
        return true;
      }
    }, void 0);
  }
  $;
  $0;
  $1;
}
function New_2(Id_1, PlanDate, MealType, RecipeId, Title, Notes){
  return{
    Id:Id_1, 
    PlanDate:PlanDate, 
    MealType:MealType, 
    RecipeId:RecipeId, 
    Title:Title, 
    Notes:Notes
  };
}
function Some(Value_1){
  return{$:1, $0:Value_1};
}
function New_3(CalendarStartDay, AvatarUrl){
  return{CalendarStartDay:CalendarStartDay, AvatarUrl:AvatarUrl};
}
function New_4(Id_1, Title, Description, EventDate, EventType, Icon){
  return{
    Id:Id_1, 
    Title:Title, 
    Description:Description, 
    EventDate:EventDate, 
    EventType:EventType, 
    Icon:Icon
  };
}
function New_5(Id_1, Name, Category, Stock, Unit, Calories, Carbs, Protein, Fat){
  return{
    Id:Id_1, 
    Name:Name, 
    Category:Category, 
    Stock:Stock, 
    Unit:Unit, 
    Calories:Calories, 
    Carbs:Carbs, 
    Protein:Protein, 
    Fat:Fat
  };
}
function New_6(Id_1, RecordDate, Type, Value_1, Unit, Status){
  return{
    Id:Id_1, 
    RecordDate:RecordDate, 
    Type:Type, 
    Value:Value_1, 
    Unit:Unit, 
    Status:Status
  };
}
let Success={$:0};
let Error_2={$:1};
function NewFromSeq(fields){
  const r={};
  const e=Get(fields);
  try {
    while(e.MoveNext())
      {
        const f=e.Current;
        r[f[0]]=f[1];
      }
  }
  finally {
    const _1=e;
    if(typeof _1=="object"&&isIDisposable(_1))e.Dispose();
  }
  return r;
}
class ConcreteVar extends Var {
  isConst;
  current;
  snap;
  view;
  id;
  get View(){
    return this.view;
  }
  Set(v){
    if(this.isConst)(((_1) => _1("WebSharper.UI: invalid attempt to change value of a Var after calling SetFinal"))((s) => {
      console.log(s);
    }));
    else {
      Obsolete(this.snap);
      this.current=v;
      this.snap={s:Ready(v, [])};
    }
  }
  Get(){
    return this.current;
  }
  UpdateMaybe(f){
    const m=f(this.Get());
    if(m!=null&&m.$==1)this.Set(m.$0);
  }
  constructor(isConst, initSnap, initValue){
    super();
    this.isConst=isConst;
    this.current=initValue;
    this.snap=initSnap;
    this.view=() => this.snap;
    this.id=Int();
  }
}
function Map_1(fn, sn){
  const m=sn.s;
  if(m!=null&&m.$==0)return{s:Forever(fn(m.$0))};
  else {
    const res={s:Waiting([], [])};
    When(sn, (a) => {
      MarkDone(res, sn, fn(a));
    }, res);
    return res;
  }
}
function Map2_1(fn, sn1, sn2){
  const _1=sn1.s;
  const _2=sn2.s;
  if(_1!=null&&_1.$==0)return _2!=null&&_2.$==0?{s:Forever(fn(_1.$0, _2.$0))}:Map2Opt1(fn, _1.$0, sn2);
  else if(_2!=null&&_2.$==0)return Map2Opt2(fn, _2.$0, sn1);
  else {
    const res={s:Waiting([], [])};
    const cont=() => {
      const m=res.s;
      if(!(m!=null&&m.$==0||m!=null&&m.$==2)){
        const _3=ValueAndForever(sn1);
        const _4=ValueAndForever(sn2);
        if(_3!=null&&_3.$==1)if(_4!=null&&_4.$==1)if(_3.$0[1]&&_4.$0[1])MarkForever(res, fn(_3.$0[0], _4.$0[0]));
        else MarkReady(res, fn(_3.$0[0], _4.$0[0]));
      }
    };
    When(sn1, cont, res);
    When(sn2, cont, res);
    return res;
  }
}
function WhenRun(snap, avail, obs){
  const m=snap.s;
  if(m==null)obs();
  else if(m!=null&&m.$==2){
    const v=m.$0;
    m.$1.push(obs);
    avail(v);
  }
  else if(m!=null&&m.$==3){
    const q2=m.$1;
    m.$0.push(avail);
    q2.push(obs);
  }
  else avail(m.$0);
}
function Map3_1(fn, sn1, sn2, sn3){
  const _1=sn1.s;
  const _2=sn2.s;
  const _3=sn3.s;
  if(_1!=null&&_1.$==0)return _2!=null&&_2.$==0?_3!=null&&_3.$==0?{s:Forever(fn(_1.$0, _2.$0, _3.$0))}:Map3Opt1(fn, _1.$0, _2.$0, sn3):_3!=null&&_3.$==0?Map3Opt2(fn, _1.$0, _3.$0, sn2):Map3Opt3(fn, _1.$0, sn2, sn3);
  else if(_2!=null&&_2.$==0)return _3!=null&&_3.$==0?Map3Opt4(fn, _2.$0, _3.$0, sn1):Map3Opt5(fn, _2.$0, sn1, sn3);
  else if(_3!=null&&_3.$==0)return Map3Opt6(fn, _3.$0, sn1, sn2);
  else {
    const res={s:Waiting([], [])};
    const cont=() => {
      const m=res.s;
      if(!(m!=null&&m.$==0||m!=null&&m.$==2)){
        const _4=ValueAndForever(sn1);
        const _5=ValueAndForever(sn2);
        const _6=ValueAndForever(sn3);
        if(_4!=null&&_4.$==1)if(_5!=null&&_5.$==1)if(_6!=null&&_6.$==1)if(_4.$0[1]&&_5.$0[1]&&_6.$0[1])MarkForever(res, fn(_4.$0[0], _5.$0[0], _6.$0[0]));
        else MarkReady(res, fn(_4.$0[0], _5.$0[0], _6.$0[0]));
      }
    };
    When(sn1, cont, res);
    When(sn2, cont, res);
    When(sn3, cont, res);
    return res;
  }
}
function WhenObsoleteRun(snap, obs){
  const m=snap.s;
  if(m==null)obs();
  else m!=null&&m.$==2?(m.$0,m.$1.push(obs)):m!=null&&m.$==3?(m.$0,m.$1.push(obs)):m.$0;
}
function When(snap, avail, obs){
  const m=snap.s;
  if(m==null)Obsolete(obs);
  else if(m!=null&&m.$==2){
    const v=m.$0;
    EnqueueSafe(m.$1, obs);
    avail(v);
  }
  else if(m!=null&&m.$==3){
    const q2=m.$1;
    m.$0.push(avail);
    EnqueueSafe(q2, obs);
  }
  else avail(m.$0);
}
function MarkDone(res, sn, v){
  const _1=sn.s;
  if(_1!=null&&_1.$==0)MarkForever(res, v);
  else MarkReady(res, v);
}
function Map2Opt1(fn, x, sn2){
  return Map_1((y) => fn(x, y), sn2);
}
function Map2Opt2(fn, y, sn1){
  return Map_1((x) => fn(x, y), sn1);
}
function ValueAndForever(snap){
  const m=snap.s;
  return m!=null&&m.$==0?Some([m.$0, true]):m!=null&&m.$==2?Some([m.$0, false]):null;
}
function MarkForever(sn, v){
  const m=sn.s;
  if(m!=null&&m.$==3){
    const q=m.$0;
    sn.s=Forever(v);
    for(let i=0, _1=length(q)-1;i<=_1;i++)(get(q, i))(v);
  }
  else void 0;
}
function MarkReady(sn, v){
  const m=sn.s;
  if(m!=null&&m.$==3){
    const q2=m.$1;
    const q1=m.$0;
    sn.s=Ready(v, q2);
    for(let i=0, _1=length(q1)-1;i<=_1;i++)(get(q1, i))(v);
  }
  else void 0;
}
function Map3Opt1(fn, x, y, sn3){
  return Map_1((z) => fn(x, y, z), sn3);
}
function Map3Opt2(fn, x, z, sn2){
  return Map_1((y) => fn(x, y, z), sn2);
}
function Map3Opt3(fn, x, sn2, sn3){
  return Map2_1((_1, _2) => fn(x, _1, _2), sn2, sn3);
}
function Map3Opt4(fn, y, z, sn1){
  return Map_1((x) => fn(x, y, z), sn1);
}
function Map3Opt5(fn, y, sn1, sn3){
  return Map2_1((_1, _2) => fn(_1, y, _2), sn1, sn3);
}
function Map3Opt6(fn, z, sn1, sn2){
  return Map2_1((_1, _2) => fn(_1, _2, z), sn1, sn2);
}
function EnqueueSafe(q, x){
  q.push(x);
  if(q.length%20===0){
    const qcopy=q.slice(0);
    Clear(q);
    for(let i=0, _1=length(qcopy)-1;i<=_1;i++){
      const o=get(qcopy, i);
      if(typeof o=="object")(((sn) => {
        if(sn.s)q.push(sn);
      })(o));
      else(((f) => {
        q.push(f);
      })(o));
    }
  }
  else void 0;
}
function Map2Unit_1(sn1, sn2){
  const _1=sn1.s;
  const _2=sn2.s;
  if(_1!=null&&_1.$==0)return _2!=null&&_2.$==0?{s:Forever(null)}:sn2;
  else if(_2!=null&&_2.$==0)return sn1;
  else {
    const res={s:Waiting([], [])};
    const cont=() => {
      const m=res.s;
      if(!(m!=null&&m.$==0||m!=null&&m.$==2)){
        const _3=ValueAndForever(sn1);
        const _4=ValueAndForever(sn2);
        if(_3!=null&&_3.$==1)if(_4!=null&&_4.$==1)if(_3.$0[1]&&_4.$0[1])MarkForever(res, null);
        else MarkReady(res, null);
      }
    };
    When(sn1, cont, res);
    When(sn2, cont, res);
    return res;
  }
}
function Join_1(snap){
  const res={s:Waiting([], [])};
  When(snap, (x) => {
    const y=x();
    When(y, (v) => {
      let _1;
      const _2=y.s;
      if(_2!=null&&_2.$==0){
        const _3=snap.s;
        _1=_3!=null&&_3.$==0;
      }
      else _1=false;
      if(_1)MarkForever(res, v);
      else MarkReady(res, v);
    }, res);
  }, res);
  return res;
}
function Copy(sn){
  const m=sn.s;
  if(m==null)return sn;
  else if(m!=null&&m.$==2){
    const res={s:Ready(m.$0, [])};
    WhenObsolete(sn, res);
    return res;
  }
  else if(m!=null&&m.$==3){
    const res_1={s:Waiting([], [])};
    When(sn, (v) => {
      MarkDone(res_1, sn, v);
    }, res_1);
    return res_1;
  }
  else return sn;
}
function WhenObsolete(snap, obs){
  const m=snap.s;
  if(m==null)Obsolete(obs);
  else m!=null&&m.$==2?(m.$0,EnqueueSafe(m.$1, obs)):m!=null&&m.$==3?(m.$0,EnqueueSafe(m.$1, obs)):m.$0;
}
function Delay(mk){
  return(c) => {
    try {
      (mk())(c);
    }
    catch(e){
      c.k(No(e));
    }
  };
}
function Bind_1(r, f){
  return checkCancel((c) => {
    r(New_7((a) => {
      if(a.$==0){
        const x=a.$0;
        scheduler().Fork(() => {
          try {
            (f(x))(c);
          }
          catch(e){
            c.k(No(e));
          }
        });
      }
      else scheduler().Fork(() => {
        c.k(a);
      });
    }, c.ct));
  });
}
function Zero(){
  return _c_2.Zero;
}
function StartImmediate(c, ctOpt){
  const d=(defCTS())[0];
  const ct=ctOpt==null?d:ctOpt.$0;
  if(!ct.c)c(New_7((a) => {
    if(a.$==1)UncaughtAsyncError(a.$0);
  }, ct));
}
function checkCancel(r){
  return(c) => {
    if(c.ct.c)cancel(c);
    else r(c);
  };
}
function defCTS(){
  return _c_2.defCTS;
}
function UncaughtAsyncError(e){
  console.log("WebSharper: Uncaught asynchronous exception", e);
}
function Sleep(ms){
  return(c) => {
    let pending;
    let creg;
    pending=void 0;
    creg=void 0;
    pending=setTimeout(() => {
      creg.Dispose();
      scheduler().Fork(() => {
        c.k(Ok(null));
      });
    }, ms);
    creg=Register(c.ct, () => {
      clearTimeout(pending);
      scheduler().Fork(() => {
        cancel(c);
      });
    });
  };
}
function cancel(c){
  c.k(Cc(new OperationCanceledException("New", c.ct)));
}
function scheduler(){
  return _c_2.scheduler;
}
function Return(x){
  return(c) => {
    c.k(Ok(x));
  };
}
function Register(ct, callback){
  if(ct===noneCT())return{Dispose(){
    return null;
  }};
  else {
    const i=ct.r.push(callback)-1;
    return{Dispose(){
      return set(ct.r, i, () => { });
    }};
  }
}
function noneCT(){
  return _c_2.noneCT;
}
function GetCT(){
  return _c_2.GetCT;
}
function FromContinuations(subscribe){
  return(c) => {
    const continued=[false];
    const once=(cont) => {
      if(continued[0])FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
      else {
        continued[0]=true;
        scheduler().Fork(cont);
      }
    };
    subscribe((a) => {
      once(() => {
        c.k(Ok(a));
      });
    }, (e) => {
      once(() => {
        c.k(No(e));
      });
    }, (e) => {
      once(() => {
        c.k(Cc(e));
      });
    });
  };
}
function Start(c, ctOpt){
  const d=(defCTS())[0];
  const ct=ctOpt==null?d:ctOpt.$0;
  scheduler().Fork(() => {
    if(!ct.c)c(New_7((a) => {
      if(a.$==1)UncaughtAsyncError(a.$0);
    }, ct));
  });
}
class AjaxRemotingProvider extends Object_1 {
  AsyncBase(m, data){
    return Delay(() => {
      const headers=makeHeaders(this.Headers);
      const payload=makePayload(data);
      return Bind_1(GetCT(), (a) => Bind_1(FromContinuations((ok, err, cc) => {
        const waiting=[true];
        const reg=Register(a, () => {
          if(waiting[0]){
            waiting[0]=false;
            cc(new OperationCanceledException("New", a));
          }
        });
        return AjaxProvider().Async(this.EndPoint+"/"+m, headers, payload, (x) => {
          if(waiting[0]){
            waiting[0]=false;
            reg.Dispose();
            ok(x);
          }
        }, (e) => {
          if(waiting[0]){
            waiting[0]=false;
            reg.Dispose();
            err(e);
          }
        });
      }), (a_1) => Return(JSON.parse(a_1))));
    });
  }
  get EndPoint(){
    return EndPoint();
  }
  get Headers(){
    return[];
  }
  Async(m, data){
    return this.AsyncBase(m, data);
  }
}
let Encoder_GlobalSettings;
let Decoder_AuthResult;
let Decoder_GlobalSettings;
let Encoder_MealPlanItem;
let Decoder_MealPlanItem;
let Encoder_DailyRecord;
let Decoder_DailyRecord;
let Encoder_CalendarEvent;
let Decoder_CalendarEvent;
function DecodeJson_AuthResult(){
  return Decoder_AuthResult?Decoder_AuthResult:Decoder_AuthResult=(DecodeUnion(void 0, "$", [[0, [["$0", "Item", Id(), 0]]], [1, [["$0", "Item1", Id(), 0], ["$1", "Item2", Id(), 0]]], [2, []], [3, [["$0", "Item", Id(), 0]]]]))();
}
function DecodeJson_MealPlanItem(){
  return Decoder_MealPlanItem?Decoder_MealPlanItem:Decoder_MealPlanItem=(DecodeRecord(void 0, [["Id", Id(), 0], ["PlanDate", DecodeDateTime(), 0], ["MealType", Id(), 0], ["RecipeId", Id(), 1], ["Title", Id(), 0], ["Notes", Id(), 0]]))();
}
function EncodeJson_MealPlanItem(){
  return Encoder_MealPlanItem?Encoder_MealPlanItem:Encoder_MealPlanItem=(EncodeRecord(void 0, [["Id", Id(), 0], ["PlanDate", EncodeDateTime(), 0], ["MealType", Id(), 0], ["RecipeId", Id(), 1], ["Title", Id(), 0], ["Notes", Id(), 0]]))();
}
function DecodeJson_GlobalSettings(){
  return Decoder_GlobalSettings?Decoder_GlobalSettings:Decoder_GlobalSettings=(DecodeRecord(void 0, [["CalendarStartDay", Id(), 0], ["AvatarUrl", Id(), 1]]))();
}
function DecodeJson_CalendarEvent(){
  return Decoder_CalendarEvent?Decoder_CalendarEvent:Decoder_CalendarEvent=(DecodeRecord(void 0, [["Id", Id(), 0], ["Title", Id(), 0], ["Description", Id(), 0], ["EventDate", DecodeDateTime(), 0], ["EventType", Id(), 0], ["Icon", Id(), 0]]))();
}
function EncodeJson_CalendarEvent(){
  return Encoder_CalendarEvent?Encoder_CalendarEvent:Encoder_CalendarEvent=(EncodeRecord(void 0, [["Id", Id(), 0], ["Title", Id(), 0], ["Description", Id(), 0], ["EventDate", EncodeDateTime(), 0], ["EventType", Id(), 0], ["Icon", Id(), 0]]))();
}
function DecodeJson_DailyRecord(){
  return Decoder_DailyRecord?Decoder_DailyRecord:Decoder_DailyRecord=(DecodeRecord(void 0, [["Id", Id(), 0], ["RecordDate", DecodeDateTime(), 0], ["Type", Id(), 0], ["Value", Id(), 0], ["Unit", Id(), 0], ["Status", Id(), 0]]))();
}
function EncodeJson_DailyRecord(){
  return Encoder_DailyRecord?Encoder_DailyRecord:Encoder_DailyRecord=(EncodeRecord(void 0, [["Id", Id(), 0], ["RecordDate", EncodeDateTime(), 0], ["Type", Id(), 0], ["Value", Id(), 0], ["Unit", Id(), 0], ["Status", Id(), 0]]))();
}
function EncodeJson_GlobalSettings(){
  return Encoder_GlobalSettings?Encoder_GlobalSettings:Encoder_GlobalSettings=(EncodeRecord(void 0, [["CalendarStartDay", Id(), 0], ["AvatarUrl", Id(), 1]]))();
}
class Attr {
  static Create(name, value){
    return Attr.A3((el) => {
      el.setAttribute(name, value);
    });
  }
  static Concat(xs){
    const x=ofSeqNonCopying(xs);
    return TreeReduce(EmptyAttr(), (_1, _2) => AppendTree(_1, _2), x);
  }
  static A3(init_3){
    return Create_2(Attr, {$:3, $0:init_3});
  }
  static A1(Item){
    return Create_2(Attr, {$:1, $0:Item});
  }
  static A2(Item1, Item2){
    return Create_2(Attr, {
      $:2, 
      $0:Item1, 
      $1:Item2
    });
  }
  $;
  $0;
  $1;
}
function Handler(name, callback){
  return Attr.A3((el) => {
    el.addEventListener(name, (d) =>(callback(el))(d), false);
  });
}
function Dynamic(name, view){
  return Dynamic_1(view, (el) =>(v) => el.setAttribute(name, v));
}
function Value(var_1){
  return ValueWith(StringApply(), var_1);
}
function ValueWith(bind, var_1){
  const p=bind(var_1);
  return AppendTree(Attr.A3(p[0]), DynamicCustom(p[1], p[2]));
}
function DynamicCustom(set_1, view){
  return Dynamic_1(view, set_1);
}
function Equals(a, b){
  if(a===b)return true;
  else {
    const m=typeof a;
    if(m=="object"){
      if(a===null||a===void 0||b===null||b===void 0||!Equals(typeof b, "object"))return false;
      else if("Equals"in a)return a.Equals(b);
      else if("Equals"in b)return false;
      else if(a instanceof Array&&b instanceof Array)return arrayEquals(a, b);
      else if(a instanceof Date&&b instanceof Date)return dateEquals(a, b);
      else {
        const a_1=a;
        const b_1=b;
        const eqR=[true];
        let k;
        for(var k_2 in a_1)if(((k_3) => {
          eqR[0]=!a_1.hasOwnProperty(k_3)||b_1.hasOwnProperty(k_3)&&Equals(a_1[k_3], b_1[k_3]);
          return!eqR[0];
        })(k_2))break;
        if(eqR[0]){
          let k_1;
          for(var k_3 in b_1)if(((k_4) => {
            eqR[0]=!b_1.hasOwnProperty(k_4)||a_1.hasOwnProperty(k_4);
            return!eqR[0];
          })(k_3))break;
        }
        return eqR[0];
      }
    }
    else return m=="function"&&("$Func"in a?a.$Func===b.$Func&&a.$Target===b.$Target:"$Invokes"in a&&"$Invokes"in b&&arrayEquals(a.$Invokes, b.$Invokes));
  }
}
function arrayEquals(a, b){
  let eq;
  let i;
  if(length(a)===length(b)){
    eq=true;
    i=0;
    while(eq&&i<length(a))
      {
        !Equals(get(a, i), get(b, i))?eq=false:void 0;
        i=i+1;
      }
    return eq;
  }
  else return false;
}
function dateEquals(a, b){
  return a.getTime()===b.getTime();
}
function Hash(o){
  const m=typeof o;
  return m=="function"?0:m=="boolean"?o?1:0:m=="number"?o:m=="string"?hashString(o):m=="object"?o==null?0:o instanceof Array?hashArray(o):hashObject(o):m=="bigint"?hashString(String(o)):m=="symbol"?hashString(o.description):0;
}
function hashString(s){
  let hash;
  if(s===null)return 0;
  else {
    hash=5381;
    for(let i=0, _1=s.length-1;i<=_1;i++)hash=hashMix(hash, s[i].charCodeAt());
    return hash;
  }
}
function hashArray(o){
  let h=-34948909;
  for(let i=0, _1=length(o)-1;i<=_1;i++)h=hashMix(h, Hash(get(o, i)));
  return h;
}
function hashObject(o){
  if("GetHashCode"in o)return o.GetHashCode();
  else {
    const ____=hashMix;
    const h=[0];
    let k;
    for(var k_1 in o)if(((key) => {
      h[0]=____(____(h[0], hashString(key)), Hash(o[key]));
      return false;
    })(k_1))break;
    return h[0];
  }
}
function Compare(a, b){
  if(a===b)return 0;
  else {
    const m=typeof a;
    switch(m=="boolean"?1:m=="number"?1:m=="bigint"?1:m=="string"?1:m=="object"?2:m=="function"?3:m=="symbol"?4:0){
      case 0:
        return typeof b=="undefined"?0:-1;
      case 1:
        return a<b?-1:1;
      case 2:
        if(a===null)return -1;
        else if(b===null)return 1;
        else if("CompareTo"in a)return a.CompareTo(b);
        else if("CompareTo0"in a)return a.CompareTo0(b);
        else if(a instanceof Array&&b instanceof Array)return compareArrays(a, b);
        else if(a instanceof Date&&b instanceof Date)return compareDates(a, b);
        else {
          const a_1=a;
          const b_1=b;
          const cmp=[0];
          let k;
          for(var k_2 in a_1)if(((k_3) =>!a_1.hasOwnProperty(k_3)?false:!b_1.hasOwnProperty(k_3)?(cmp[0]=1,true):(cmp[0]=Compare(a_1[k_3], b_1[k_3]),cmp[0]!==0))(k_2))break;
          if(cmp[0]===0){
            let k_1;
            for(var k_3 in b_1)if(((k_4) =>!b_1.hasOwnProperty(k_4)?false:!a_1.hasOwnProperty(k_4)&&(cmp[0]=-1,true))(k_3))break;
          }
          return cmp[0];
        }
        break;
      case 3:
        return FailWith("Cannot compare function values.");
      case 4:
        return FailWith("Cannot compare symbol values.");
    }
  }
}
function hashMix(x, y){
  return(x<<5)+x+y;
}
function compareArrays(a, b){
  let cmp;
  let i;
  if(length(a)<length(b))return -1;
  else if(length(a)>length(b))return 1;
  else {
    cmp=0;
    i=0;
    while(cmp===0&&i<length(a))
      {
        cmp=Compare(get(a, i), get(b, i));
        i=i+1;
      }
    return cmp;
  }
}
function compareDates(a, b){
  return Compare(a.getTime(), b.getTime());
}
let _c_1=Lazy((_i) => class $StartupCode_Client {
  static {
    _c_1=_i(this);
  }
  static currentToast;
  static {
    this.currentToast=_c.Create_1(null);
  }
});
function MapTreeReduce(mapping, defaultValue, reduction, array){
  const l=length(array);
  function loop(off){
    return(len) => {
      let _1;
      switch(len<=0?0:len===1?off>=0&&off<l?1:(_1=len,2):(_1=len,2)){
        case 0:
          return defaultValue;
        case 1:
          return mapping(get(array, off));
        case 2:
          const l2=len/2>>0;
          return reduction((loop(off))(l2), (loop(off+l2))(len-l2));
      }
    };
  }
  return(loop(0))(l);
}
function ofSeqNonCopying(xs){
  if(xs instanceof Array)return xs;
  else if(xs instanceof FSharpList)return ofList(xs);
  else if(xs===null)return[];
  else {
    const q=[];
    const o=Get(xs);
    try {
      while(o.MoveNext())
        q.push(o.Current);
      return q;
    }
    finally {
      const _1=o;
      if(typeof _1=="object"&&isIDisposable(_1))o.Dispose();
    }
  }
}
function TreeReduce(defaultValue, reduction, array){
  const l=length(array);
  function loop(off){
    return(len) => {
      let _1;
      switch(len<=0?0:len===1?off>=0&&off<l?1:(_1=len,2):(_1=len,2)){
        case 0:
          return defaultValue;
        case 1:
          return get(array, off);
        case 2:
          const l2=len/2>>0;
          return reduction((loop(off))(l2), (loop(off+l2))(len-l2));
      }
    };
  }
  return(loop(0))(l);
}
function AppendDoc(Item1, Item2){
  return{
    $:0, 
    $0:Item1, 
    $1:Item2
  };
}
function TextNodeDoc(Item){
  return{$:5, $0:Item};
}
function ElemDoc(Item){
  return{$:1, $0:Item};
}
function EmbedDoc(Item){
  return{$:2, $0:Item};
}
function TextDoc(Item){
  return{$:4, $0:Item};
}
function get(arr, n){
  checkBounds(arr, n);
  return arr[n];
}
function length(arr){
  return arr.dims===2?arr.length*arr.length:arr.length;
}
function checkBounds(arr, n){
  if(n<0||n>=arr.length)FailWith("Index was outside the bounds of the array.");
}
function set(arr, n, x){
  checkBounds(arr, n);
  arr[n]=x;
}
function CreateElemNode(el, attr_1, children){
  LinkElement(el, children);
  const attr_2=Insert(el, attr_1);
  return DocElemNode.New(attr_2, children, null, el, Int(), GetOptional(attr_2.OnAfterRender));
}
function CreateEmbedNode(){
  return{Current:null, Dirty:false};
}
function UpdateEmbedNode(node, upd){
  node.Current=upd;
  node.Dirty=true;
}
function LinkElement(el, children){
  InsertDoc(el, children, null);
}
function InsertDoc(parent, doc, pos){
  while(true)
    {
      if(doc!=null&&doc.$==1)return InsertNode(parent, doc.$0.El, pos);
      else if(doc!=null&&doc.$==2){
        const d=doc.$0;
        d.Dirty=false;
        doc=d.Current;
      }
      else if(doc==null)return pos;
      else if(doc!=null&&doc.$==4)return InsertNode(parent, doc.$0.Text, pos);
      else if(doc!=null&&doc.$==5)return InsertNode(parent, doc.$0, pos);
      else if(doc!=null&&doc.$==6)return foldBack((_1, _2) =>((((parent_1) =>(el) =>(pos_1) => el==null||el.constructor===Object?InsertDoc(parent_1, el, pos_1):InsertNode(parent_1, el, pos_1))(parent))(_1))(_2), doc.$0.Els, pos);
      else {
        const b=doc.$1;
        const a=doc.$0;
        doc=a;
        pos=InsertDoc(parent, b, pos);
      }
    }
}
function CreateTextNode(){
  return{
    Text:globalThis.document.createTextNode(""), 
    Dirty:false, 
    Value:""
  };
}
function UpdateTextNode(n, t){
  n.Value=t;
  n.Dirty=true;
}
function InsertNode(parent, node, pos){
  InsertAt(parent, pos, node);
  return node;
}
function LinkPrevElement(el, children){
  InsertDoc(el.parentNode, children, el);
}
function CreateDelimitedRunState(ldelim, rdelim, doc){
  return New_10(get_Empty_1(), CreateDelimitedElemNode(ldelim, rdelim, EmptyAttr(), doc));
}
function PerformAnimatedUpdate(childrenOnly, st, doc){
  return get_UseAnimations()?Delay(() => {
    const cur=FindAll(doc);
    const change=ComputeChangeAnim(st, cur);
    const enter=ComputeEnterAnim(st, cur);
    return Bind_1(Play(Append(change, ComputeExitAnim(st, cur))), () => Bind_1(SyncElemNodesNextFrame(childrenOnly, st), () => Bind_1(Play(enter), () => {
      st.PreviousNodes=cur;
      return Return(null);
    })));
  }):SyncElemNodesNextFrame(childrenOnly, st);
}
function PerformSyncUpdate(childrenOnly, st, doc){
  const cur=FindAll(doc);
  SyncElemNode(childrenOnly, st.Top);
  st.PreviousNodes=cur;
}
function CreateDelimitedElemNode(ldelim, rdelim, attr_1, children){
  const el=ldelim.parentNode;
  LinkPrevElement(rdelim, children);
  const attr_2=Insert(el, attr_1);
  return DocElemNode.New(attr_2, children, Some([ldelim, rdelim]), el, Int(), GetOptional(attr_2.OnAfterRender));
}
function SyncElemNodesNextFrame(childrenOnly, st){
  if(BatchUpdatesEnabled()){
    const c=(ok) => {
      requestAnimationFrame(() => {
        SyncElemNode(childrenOnly, st.Top);
        ok();
      });
    };
    return FromContinuations((_1, _2, _3) => c.apply(null, [_1, _2, _3]));
  }
  else {
    SyncElemNode(childrenOnly, st.Top);
    return Return(null);
  }
}
function ComputeExitAnim(st, cur){
  return Concat(map_2((n) => GetExitAnim(n.Attr), ToArray(Except(cur, Filter((n) => HasExitAnim(n.Attr), st.PreviousNodes)))));
}
function ComputeEnterAnim(st, cur){
  return Concat(map_2((n) => GetEnterAnim(n.Attr), ToArray(Except(st.PreviousNodes, Filter((n) => HasEnterAnim(n.Attr), cur)))));
}
function ComputeChangeAnim(st, cur){
  const f=(n) => HasChangeAnim(n.Attr);
  const relevant=(a) => Filter(f, a);
  return Concat(map_2((n) => GetChangeAnim(n.Attr), ToArray(Intersect(relevant(st.PreviousNodes), relevant(cur)))));
}
function SyncElemNode(childrenOnly, el){
  !childrenOnly?SyncElement(el):void 0;
  Sync(el.Children);
  AfterRender(el);
}
function SyncElement(el){
  function hasDirtyChildren(el_1){
    function dirty(doc){
      while(true)
        {
          if(doc!=null&&doc.$==0){
            const b=doc.$1;
            const a=doc.$0;
            if(dirty(a))return true;
            else doc=b;
          }
          else if(doc!=null&&doc.$==2){
            const d=doc.$0;
            if(d.Dirty)return true;
            else doc=d.Current;
          }
          else if(doc!=null&&doc.$==6){
            const t=doc.$0;
            return t.Dirty||exists_1(hasDirtyChildren, t.Holes);
          }
          else return false;
        }
    }
    return dirty(el_1.Children);
  }
  Sync_1(el.El, el.Attr);
  if(hasDirtyChildren(el))DoSyncElement(el);
}
function Sync(doc){
  while(true)
    {
      if(doc!=null&&doc.$==1)return SyncElemNode(false, doc.$0);
      else if(doc!=null&&doc.$==2){
        const n=doc.$0;
        doc=n.Current;
      }
      else if(doc==null)return null;
      else if(doc!=null&&doc.$==5)return null;
      else if(doc!=null&&doc.$==4){
        const d=doc.$0;
        return d.Dirty?(d.Text.nodeValue=d.Value,d.Dirty=false):null;
      }
      else if(doc!=null&&doc.$==6){
        const t=doc.$0;
        iter_1((h) => {
          SyncElemNode(false, h);
        }, t.Holes);
        iter_1((t_1) => {
          Sync_1(t_1[0], t_1[1]);
        }, t.Attrs);
        return AfterRender(t);
      }
      else {
        const b=doc.$1;
        const a=doc.$0;
        Sync(a);
        doc=b;
      }
    }
}
function AfterRender(el){
  const m=GetOptional(el.Render);
  if(m!=null&&m.$==1){
    m.$0(el.El);
    SetOptional(el, "Render", null);
  }
}
function DoSyncElement(el){
  const parent=el.El;
  function ins(doc, pos){
    while(true)
      {
        if(doc!=null&&doc.$==1)return doc.$0.El;
        else if(doc!=null&&doc.$==2){
          const d=doc.$0;
          if(d.Dirty){
            d.Dirty=false;
            return InsertDoc(parent, d.Current, pos);
          }
          else doc=d.Current;
        }
        else if(doc==null)return pos;
        else if(doc!=null&&doc.$==4)return doc.$0.Text;
        else if(doc!=null&&doc.$==5)return doc.$0;
        else if(doc!=null&&doc.$==6){
          const t=doc.$0;
          if(t.Dirty)t.Dirty=false;
          return foldBack((_3, _4) => _3==null||_3.constructor===Object?ins(_3, _4):_3, t.Els, pos);
        }
        else {
          const b=doc.$1;
          const a=doc.$0;
          doc=a;
          pos=ins(b, pos);
        }
      }
  }
  const p=el.El;
  Iter((e) => {
    RemoveNode(p, e);
  }, Except_2(DocChildren(el), Children(el.El, GetOptional(el.Delimiters))));
  let _1=el.Children;
  const m=GetOptional(el.Delimiters);
  let _2=m!=null&&m.$==1?m.$0[1]:null;
  ins(_1, _2);
}
function ParseHTMLIntoFakeRoot(elem){
  const root=globalThis.document.createElement("div");
  if(!rhtml().test(elem)){
    root.appendChild(globalThis.document.createTextNode(elem));
    return root;
  }
  else {
    const m=rtagName().exec(elem);
    const tag=Equals(m, null)?"":get(m, 1).toLowerCase();
    const w=(wrapMap())[tag];
    const p=w?w:defaultWrap();
    root.innerHTML=p[1]+elem.replace(rxhtmlTag(), "<$1></$2>")+p[2];
    function unwrap(elt, a){
      while(true)
        {
          if(a===0)return elt;
          else {
            const i=a;
            elt=elt.lastChild;
            a=i-1;
          }
        }
    }
    return(((a) => {
      const _1=a;
      return(_2) => unwrap(_1, _2);
    })(root))(p[0]);
  }
}
function ChildrenArray(element){
  const a=[];
  for(let i=0, _1=element.childNodes.length-1;i<=_1;i++)a.push(element.childNodes[i]);
  return a;
}
function rhtml(){
  return _c_4.rhtml;
}
function wrapMap(){
  return _c_4.wrapMap;
}
function defaultWrap(){
  return _c_4.defaultWrap;
}
function rxhtmlTag(){
  return _c_4.rxhtmlTag;
}
function rtagName(){
  return _c_4.rtagName;
}
function InsertAt(parent, pos, node){
  let _1;
  if(node.parentNode===parent){
    const m=node.nextSibling;
    let _2=Equals(m, null)?null:m;
    _1=pos===_2;
  }
  else _1=false;
  if(!_1)parent.insertBefore(node, pos);
}
function RemoveNode(parent, el){
  if(el.parentNode===parent)parent.removeChild(el);
}
function Get(x){
  return x instanceof Array?ArrayEnumerator(x):Equals(typeof x, "string")?StringEnumerator(x):x.GetEnumerator();
}
function ArrayEnumerator(s){
  return new T(0, null, (e) => {
    const i=e.s;
    return i<length(s)&&(e.c=get(s, i),e.s=i+1,true);
  }, void 0);
}
function StringEnumerator(s){
  return new T(0, null, (e) => {
    const i=e.s;
    return i<s.length&&(e.c=s[i],e.s=i+1,true);
  }, void 0);
}
class T extends Object_1 {
  s;
  c;
  n;
  d;
  e;
  MoveNext(){
    const m=this.n(this);
    this.e=m?1:2;
    return m;
  }
  get Current(){
    return this.e===1?this.c:this.e===0?FailWith("Enumeration has not started. Call MoveNext."):FailWith("Enumeration already finished.");
  }
  Dispose(){
    if(this.d)this.d(this);
  }
  constructor(s, c, n, d){
    super();
    this.s=s;
    this.c=c;
    this.n=n;
    this.d=d;
    this.e=0;
  }
}
function EncodeDateTime(){
  return() =>(x) =>(new Date(x)).toISOString();
}
function DecodeArray(decEl){
  return EncodeArray(decEl);
}
function DecodeUnion(t, discr, cases){
  return() =>(x) => {
    let tag;
    if(typeof x==="object"&&x!=null){
      const o={};
      if(typeof discr==="string"){
        const tagName=x[discr];
        tag=findIndex((case_1) =>!Equals(case_1, null)&&case_1[0]==tagName, cases);
      }
      else {
        const r=[void 0];
        let k;
        for(var k_1 in discr)if(((k_2) => x.hasOwnProperty(k_2)&&(r[0]=discr[k_2],true))(k_1))break;
        tag=r[0];
      }
      o.$=tag;
      iter_1((_1) => {
        const from=_1[0];
        const __to__=_1[1];
        const dec=_1[2];
        const kind=_1[3];
        if(from==null){
          const r_1=(dec())(x);
          if(__to__)delete r_1[discr];
          o.$0=r_1;
          return;
        }
        else return kind===0?void(o[from]=(dec())(x[__to__])):kind===1?void(o[from]=x.hasOwnProperty(__to__)?Some((dec())(x[__to__])):null):FailWith("Invalid field option kind");
      }, (get(cases, tag))[1]);
      return t===void 0?o:t(o);
    }
    else return x;
  };
}
function Id(){
  return() =>(x) => x;
}
function EncodeArray(encEl){
  return() =>(a) => map_2(encEl(), a);
}
function DecodeRecord(t, fields){
  return() =>(x) => {
    const o={};
    iter_1((_1) => {
      const name=_1[0];
      const dec=_1[1];
      const kind=_1[2];
      return kind===0?x.hasOwnProperty(name)?void(o[name]=(dec())(x[name])):FailWith("Missing mandatory field: "+name):kind===1?void(o[name]=x.hasOwnProperty(name)?Some((dec())(x[name])):null):kind===2?x.hasOwnProperty(name)?void(o[name]=(dec())(x[name])):null:kind===3?x[name]===void 0?void(o[name]=(dec())(x[name])):null:FailWith("Invalid field option kind");
    }, fields);
    return t===void 0?o:t(o);
  };
}
function DecodeDateTime(){
  return() =>(x) => x.hasOwnProperty("d")?(new Date(x.d)).getTime():(new Date(x)).getTime();
}
function EncodeRecord(_1, fields){
  return() =>(x) => {
    const o={};
    iter_1((_2) => {
      const name=_2[0];
      const enc=_2[1];
      const kind=_2[2];
      if(kind===0){
        o[name]=(enc())(x[name]);
        return;
      }
      else if(kind===1){
        const m=x[name];
        return m==null?null:void(o[name]=(enc())(m.$0));
      }
      else return kind===2?x.hasOwnProperty(name)?void(o[name]=(enc())(x[name])):null:kind===3?x[name]===void 0?void(o[name]=(enc())(x[name])):null:FailWith("Invalid field option kind");
    }, fields);
    return o;
  };
}
function DateFormatter(date, format){
  const d=new Date(date);
  switch(format){
    case"D":
      return String(longDays().get_Item(d.getDay()))+", "+padLeft(2, String(d.getDate()))+" "+String(longMonths().get_Item(d.getMonth()))+" "+String(d.getFullYear());
    case"d":
      return padLeft(2, String(d.getMonth()+1))+"/"+padLeft(2, String(d.getDate()))+"/"+String(d.getFullYear());
    case"T":
      return padLeft(2, String(d.getHours()))+":"+padLeft(2, String(d.getMinutes()))+":"+padLeft(2, String(d.getSeconds()));
    case"t":
      return padLeft(2, String(d.getHours()))+":"+padLeft(2, String(d.getMinutes()));
    case"o":
    case"O":
      return String(d.getFullYear())+"-"+padLeft(2, String(d.getMonth()+1))+"-"+padLeft(2, String(d.getDate()))+"T"+padLeft(2, String(d.getHours()))+":"+padLeft(2, String(d.getMinutes()))+":"+padLeft(2, String(d.getSeconds()))+"."+padLeft(3, String(d.getMilliseconds()))+dateOffsetString(d);
    default:
      return dateToStringWithCustomFormat(d, format);
  }
}
function longDays(){
  return _c_5.longDays;
}
function padLeft(minLength, x){
  return x.length<minLength?replicate(minLength-x.length, "0")+x:x;
}
function longMonths(){
  return _c_5.longMonths;
}
function dateOffsetString(d){
  const offset=d.getTimezoneOffset()*-60000;
  const offset_1=Math.abs(offset);
  return(offset<0?"-":"+")+padLeft(2, String(toInt(offset_1/3600000)))+":"+padLeft(2, String(toInt(offset_1%3600000/60000)));
}
function dateToStringWithCustomFormat(d, format){
  let cursorPos=0;
  let tokenLength=0;
  let result="";
  const appendToResult=(s) => {
    result=result+s;
  };
  while(cursorPos<format.length)
    ((() => {
      const token=format[cursorPos];
      switch(token){
        case"d":
          tokenLength=parseRepeatToken(format, cursorPos, "d");
          cursorPos=cursorPos+tokenLength;
          switch(tokenLength){
            case 1:
              return appendToResult(String(d.getDate()));
            case 2:
              return appendToResult(padLeft(2, String(d.getDate())));
            case 3:
              return appendToResult(String(shortDays().get_Item(d.getDay())));
            default:
            case 4:
              return appendToResult(String(longDays().get_Item(d.getDay())));
          }
          break;
        case"f":
          tokenLength=parseRepeatToken(format, cursorPos, "f");
          cursorPos=cursorPos+tokenLength;
          switch(tokenLength){
            case 3:
            case 2:
            case 1:
              const precision=toInt(10**(3-tokenLength));
              return appendToResult(padLeft(tokenLength, String(d.getMilliseconds()/precision>>0)));
            case 7:
            case 6:
            case 5:
            case 4:
              return appendToResult(padRight(tokenLength, String(d.getMilliseconds())));
            default:
              return FailWith("Input string was not in a correct format.");
          }
          break;
        case"F":
          tokenLength=parseRepeatToken(format, cursorPos, "F");
          cursorPos=cursorPos+tokenLength;
          switch(tokenLength){
            case 3:
            case 2:
            case 1:
              const precision_1=toInt(10**(3-tokenLength));
              const value=d.getMilliseconds()/precision_1>>0;
              return value!==0?appendToResult(padLeft(tokenLength, String(value))):null;
            case 7:
            case 6:
            case 5:
            case 4:
              const value_1=d.getMilliseconds();
              return value_1!==0?appendToResult(padLeft(3, String(value_1))):null;
            default:
              return FailWith("Input string was not in a correct format.");
          }
          break;
        case"g":
          tokenLength=parseRepeatToken(format, cursorPos, "g");
          cursorPos=cursorPos+tokenLength;
          return appendToResult("A.D.");
        case"h":
          tokenLength=parseRepeatToken(format, cursorPos, "h");
          cursorPos=cursorPos+tokenLength;
          const hours=d.getHours()%12;
          return appendToResult(tokenLength===1||tokenLength===2&&false?hours===0?"12":String(hours):hours===0?"12":padLeft(2, String(hours)));
        case"H":
          tokenLength=parseRepeatToken(format, cursorPos, "H");
          cursorPos=cursorPos+tokenLength;
          return appendToResult(tokenLength===1||tokenLength===2&&false?String(d.getHours()):padLeft(2, String(d.getHours())));
        case"K":
          tokenLength=parseRepeatToken(format, cursorPos, "K");
          cursorPos=cursorPos+tokenLength;
          return appendToResult(replicate(tokenLength, dateOffsetString(d)));
        case"m":
          tokenLength=parseRepeatToken(format, cursorPos, "m");
          cursorPos=cursorPos+tokenLength;
          return appendToResult(tokenLength===1||tokenLength===2&&false?String(d.getMinutes()):padLeft(2, String(d.getMinutes())));
        case"M":
          let _1;
          tokenLength=parseRepeatToken(format, cursorPos, "M");
          cursorPos=cursorPos+tokenLength;
          switch(tokenLength){
            case 1:
              _1=String(d.getMonth()+1);
              break;
            case 2:
              _1=padLeft(2, String(d.getMonth()+1));
              break;
            case 3:
              _1=String(shortMonths().get_Item(d.getMonth()));
              break;
            default:
            case 4:
              _1=String(longMonths().get_Item(d.getMonth()));
              break;
          }
          return appendToResult(_1);
        case"s":
          tokenLength=parseRepeatToken(format, cursorPos, "s");
          cursorPos=cursorPos+tokenLength;
          return appendToResult(tokenLength===1||tokenLength===2&&false?String(d.getSeconds()):padLeft(2, String(d.getSeconds())));
        case"t":
          tokenLength=parseRepeatToken(format, cursorPos, "t");
          cursorPos=cursorPos+tokenLength;
          return appendToResult(tokenLength===1||tokenLength===2&&false?d.getHours()<12?"A":"P":d.getHours()<12?"AM":"PM");
        case"y":
          tokenLength=parseRepeatToken(format, cursorPos, "y");
          cursorPos=cursorPos+tokenLength;
          return appendToResult(tokenLength===1?String(d.getFullYear()%100):tokenLength===2?padLeft(2, String(d.getFullYear()%100)):padLeft(tokenLength, String(d.getFullYear())));
        case"z":
          tokenLength=parseRepeatToken(format, cursorPos, "z");
          cursorPos=cursorPos+tokenLength;
          const utcOffsetText=dateOffsetString(d);
          const sign=Substring(utcOffsetText, 0, 1);
          const hours_1=Substring(utcOffsetText, 1, 2);
          const minutes=Substring(utcOffsetText, 4, 2);
          return appendToResult(tokenLength===1?sign+(StartsWith(hours_1, "0")?hours_1.substring(1):hours_1):tokenLength===2?sign+hours_1:sign+hours_1+":"+minutes);
        case":":
          cursorPos=cursorPos+1;
          return appendToResult(":");
        case"/":
          cursorPos=cursorPos+1;
          return appendToResult("/");
        case"'":
        case"\"":
          const p=parseQuotedString(format, cursorPos);
          cursorPos=cursorPos+p[1];
          return appendToResult(p[0]);
        case"%":
          const nextChar=parseNextChar(format, cursorPos);
          return nextChar!=null&&nextChar.$0!=="%"?(cursorPos=cursorPos+2,appendToResult(dateToStringWithCustomFormat(d, nextChar.$0))):FailWith("Invalid format string");
        case"\\":
          const m=parseNextChar(format, cursorPos);
          if(m==null)return FailWith("Invalid format string");
          else {
            const nextChar2=m.$0;
            cursorPos=cursorPos+2;
            return appendToResult(nextChar2);
          }
          break;
        default:
          appendToResult(token);
          {
            cursorPos=cursorPos+1;
            return;
          }
          break;
      }
    })());
  return result;
}
function parseRepeatToken(format, pos, patternChar){
  let tokenLength=0;
  let internalPos=pos;
  while(internalPos<format.length&&format[internalPos]===patternChar)
    {
      internalPos=internalPos+1;
      tokenLength=tokenLength+1;
    }
  return tokenLength;
}
function shortDays(){
  return _c_5.shortDays;
}
function padRight(minLength, x){
  return x.length<minLength?x+replicate(minLength-x.length, "0"):x;
}
function shortMonths(){
  return _c_5.shortMonths;
}
function parseQuotedString(format, pos){
  const quoteChar=format[pos];
  let result="";
  let foundQuote=false;
  let pos_1=pos;
  let earlyBreak=false;
  while(pos_1<format.length&&!earlyBreak)
    {
      pos_1=pos_1+1;
      const currentChar=format[pos_1];
      if(currentChar===quoteChar){
        foundQuote=true;
        earlyBreak=true;
      }
      else currentChar==="\\"?pos_1<format.length?(pos_1=pos_1+1,result=result+format[pos_1]):FailWith("Invalid string format"):result=result+currentChar;
    }
  if(!foundQuote)FailWith("Invalid string format could not find matching quote for "+String(quoteChar));
  return[result, pos_1-pos+1];
}
function parseNextChar(format, pos){
  return pos>=format.length-1?null:Some(format[pos+1]);
}
function TryParse(s, r){
  return TryParse_2(s, -2147483648, 2147483647, r);
}
function DatePortion(d){
  const e=new Date(d);
  return(new Date(e.getFullYear(), e.getMonth(), e.getDate())).getTime();
}
function Create(y, mo, d, h, m, s, ms){
  let d_1=new Date(y, mo-1, d, h, m, s, ms);
  if(y<99)d_1.setFullYear(y);
  return d_1.getTime();
}
function AddMonths(d, months){
  const e=new Date(d);
  return(new Date(e.getFullYear(), e.getMonth()+months, e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds())).getTime();
}
function AddYears(d, years){
  const e=new Date(d);
  return(new Date(e.getFullYear()+years, e.getMonth(), e.getDate(), e.getHours(), e.getMinutes(), e.getSeconds(), e.getMilliseconds())).getTime();
}
function TryParse_1(s){
  const d=Date.parse(s);
  return isNaN(d)?null:Some(d);
}
function skip(i, l){
  let res=l;
  for(let j=1, _1=i;j<=_1;j++)if(res.$==0)FailWith("Input list too short.");
  else res=res.$1;
  return res;
}
function nonNegative(){
  return FailWith("The input must be non-negative.");
}
function insufficient(){
  return FailWith("The input sequence has an insufficient number of elements.");
}
function arrContains(item, arr){
  let c=true;
  let i=0;
  const l=length(arr);
  while(c&&i<l)
    if(Equals(arr[i], item))c=false;
    else i=i+1;
  return!c;
}
function IsNullOrWhiteSpace(x){
  return x==null||(new RegExp("^\\s*$")).test(x);
}
function Substring(s, ix, ct){
  return s.substr(ix, ct);
}
function replicate(count, s){
  return create(count, s).join("");
}
function StartsWith(t, s){
  return t.substring(0, s.length)==s;
}
function forall_2(f, s){
  return forall(f, protect(s));
}
function protect(s){
  return s==null?"":s;
}
function Int(){
  set_counter(counter()+1);
  return counter();
}
function set_counter(_1){
  _c_6.counter=_1;
}
function counter(){
  return _c_6.counter;
}
function Ready(Item1, Item2){
  return{
    $:2, 
    $0:Item1, 
    $1:Item2
  };
}
function Forever(Item){
  return{$:0, $0:Item};
}
function Waiting(Item1, Item2){
  return{
    $:3, 
    $0:Item1, 
    $1:Item2
  };
}
function New_7(k, ct){
  return{k:k, ct:ct};
}
function No(Item){
  return{$:1, $0:Item};
}
function Ok(Item){
  return{$:0, $0:Item};
}
function Cc(Item){
  return{$:2, $0:Item};
}
let _c_2=Lazy((_i) => class $StartupCode_Concurrency {
  static {
    _c_2=_i(this);
  }
  static GetCT;
  static Zero;
  static defCTS;
  static scheduler;
  static noneCT;
  static {
    this.noneCT=New_8(false, []);
    this.scheduler=new Scheduler();
    this.defCTS=[new CancellationTokenSource()];
    this.Zero=Return();
    this.GetCT=(c) => {
      c.k(Ok(c.ct));
    };
  }
});
function New_8(IsCancellationRequested, Registrations){
  return{c:IsCancellationRequested, r:Registrations};
}
function Obsolete(sn){
  let _1;
  const m=sn.s;
  if(m==null||(m!=null&&m.$==2?(_1=m.$1,false):m!=null&&m.$==3?(_1=m.$1,false):true))void 0;
  else {
    sn.s=null;
    for(let i=0, _2=length(_1)-1;i<=_2;i++){
      const o=get(_1, i);
      if(typeof o=="object")(((sn_1) => {
        Obsolete(sn_1);
      })(o));
      else o();
    }
  }
}
function Dynamic_1(view, set_1){
  return Attr.A1(new DynamicAttrNode(view, set_1));
}
function Insert(elem, tree){
  const nodes=[];
  const oar=[];
  function loop(node){
    while(true)
      {
        if(!(node===null)){
          if(node!=null&&node.$==1)return nodes.push(node.$0);
          else if(node!=null&&node.$==2){
            const b=node.$1;
            const a=node.$0;
            loop(a);
            node=b;
          }
          else return node!=null&&node.$==3?node.$0(elem):node!=null&&node.$==4?oar.push(node.$0):null;
        }
        else return null;
      }
  }
  loop(tree);
  const arr=nodes.slice(0);
  let _1=New_9(elem, Flags(tree), arr, oar.length===0?null:Some((el) => {
    iter((f) => {
      f(el);
    }, oar);
  }));
  return _1;
}
function EmptyAttr(){
  return _c_3.EmptyAttr;
}
function Flags(a){
  return a!==null&&a.hasOwnProperty("flags")?a.flags:0;
}
function Updates(dyn){
  return MapTreeReduce((x) => x.NChanged, Const(), Map2Unit, dyn.DynNodes);
}
function AppendTree(a, b){
  if(a===null)return b;
  else if(b===null)return a;
  else {
    const x=Attr.A2(a, b);
    SetFlags(x, Flags(a)|Flags(b));
    return x;
  }
}
function SetFlags(a, f){
  a.flags=f;
}
function HasExitAnim(attr_1){
  const flag=2;
  return(attr_1.DynFlags&flag)===flag;
}
function GetExitAnim(dyn){
  return GetAnim(dyn, (_1, _2) => _1.NGetExitAnim(_2));
}
function HasEnterAnim(attr_1){
  const flag=1;
  return(attr_1.DynFlags&flag)===flag;
}
function GetEnterAnim(dyn){
  return GetAnim(dyn, (_1, _2) => _1.NGetEnterAnim(_2));
}
function HasChangeAnim(attr_1){
  const flag=4;
  return(attr_1.DynFlags&flag)===flag;
}
function GetChangeAnim(dyn){
  return GetAnim(dyn, (_1, _2) => _1.NGetChangeAnim(_2));
}
function GetAnim(dyn, f){
  return Concat(map_2((n) => f(n, dyn.DynElem), dyn.DynNodes));
}
function Sync_1(elem, dyn){
  iter_1((d) => {
    d.NSync(elem);
  }, dyn.DynNodes);
}
class View { }
class DocElemNode {
  Attr;
  Children;
  Delimiters;
  El;
  ElKey;
  Render;
  Equals(o){
    return this.ElKey===o.ElKey;
  }
  GetHashCode(){
    return this.ElKey;
  }
  static New(Attr_1, Children_1, Delimiters, El, ElKey, Render){
    const _1={
      Attr:Attr_1, 
      Children:Children_1, 
      El:El, 
      ElKey:ElKey
    };
    let _2=(SetOptional(_1, "Delimiters", Delimiters),SetOptional(_1, "Render", Render),_1);
    return Create_2(DocElemNode, _2);
  }
}
class Scheduler extends Object_1 {
  idle;
  robin;
  Fork(action){
    this.robin.push(action);
    this.idle?(this.idle=false,setTimeout(() => {
      this.tick();
    }, 0)):void 0;
  }
  tick(){
    const t=Date.now();
    let loop=true;
    while(loop)
      if(this.robin.length===0){
        this.idle=true;
        loop=false;
      }
      else {
        (this.robin.shift())();
        Date.now()-t>40?(setTimeout(() => {
          this.tick();
        }, 0),loop=false):void 0;
      }
  }
  constructor(){
    super();
    this.idle=true;
    this.robin=[];
  }
}
class CancellationTokenSource extends Object_1 {
  init;
  c;
  pending;
  r;
  constructor(){
    super();
    this.c=false;
    this.pending=null;
    this.r=[];
    this.init=1;
  }
}
class DynamicAttrNode extends Object_1 {
  push;
  value;
  dirty;
  updates;
  get NChanged(){
    return this.updates;
  }
  NGetExitAnim(parent){
    return get_Empty();
  }
  NGetEnterAnim(parent){
    return get_Empty();
  }
  NGetChangeAnim(parent){
    return get_Empty();
  }
  NSync(parent){
    if(this.dirty){
      (this.push(parent))(this.value);
      this.dirty=false;
    }
  }
  constructor(view, push){
    super();
    this.push=push;
    this.value=void 0;
    this.dirty=false;
    this.updates=Map((x) => {
      this.value=x;
      this.dirty=true;
    }, view);
  }
}
function New_9(DynElem, DynFlags, DynNodes, OnAfterRender){
  const _1={
    DynElem:DynElem, 
    DynFlags:DynFlags, 
    DynNodes:DynNodes
  };
  SetOptional(_1, "OnAfterRender", OnAfterRender);
  return _1;
}
let _c_3=Lazy((_i) => class Client {
  static {
    _c_3=_i(this);
  }
  static FloatApplyChecked;
  static FloatGetChecked;
  static FloatSetChecked;
  static FloatApplyUnchecked;
  static FloatGetUnchecked;
  static FloatSetUnchecked;
  static IntApplyChecked;
  static IntGetChecked;
  static IntSetChecked;
  static IntApplyUnchecked;
  static IntGetUnchecked;
  static IntSetUnchecked;
  static FileApplyUnchecked;
  static FileGetUnchecked;
  static FileSetUnchecked;
  static DateTimeApplyUnchecked;
  static DateTimeGetUnchecked;
  static DateTimeSetUnchecked;
  static StringListApply;
  static StringListGet;
  static StringListSet;
  static StringApply;
  static StringGet;
  static StringSet;
  static BoolCheckedApply;
  static EmptyAttr;
  static {
    this.EmptyAttr=null;
    this.BoolCheckedApply=(var_1) =>[(el) => {
      el.addEventListener("change", () => var_1.Get()!=el.checked?var_1.Set(el.checked):null);
    }, (_1) =>(_2) => _2!=null&&_2.$==1?void(_1.checked=_2.$0):null, Map((V) => Some(V), var_1.View)];
    this.StringSet=(el) =>(s_8) => {
      el.value=s_8;
    };
    this.StringGet=(el) => Some(el.value);
    const g=StringGet();
    const s=StringSet();
    this.StringApply=(v) => ApplyValue(g, s, v);
    this.StringListSet=(el) =>(s_8) => {
      const options_=el.options;
      for(let i=0, _1=options_.length-1;i<=_1;i++)((() => {
        const option=options_.item(i);
        option.selected=arrContains(option.value, s_8);
      })());
    };
    this.StringListGet=(el) => {
      const selectedOptions=el.selectedOptions;
      return Some(ofSeq_1(delay(() => collect((i) =>[selectedOptions.item(i).value], range(0, selectedOptions.length-1)))));
    };
    const g_1=StringListGet();
    const s_1=StringListSet();
    this.StringListApply=(v) => ApplyValue(g_1, s_1, v);
    this.DateTimeSetUnchecked=(el) =>(i) => {
      el.value=(new Date(i)).toLocaleString();
    };
    this.DateTimeGetUnchecked=(el) => {
      let o;
      let m;
      const s_8=el.value;
      if(isBlank(s_8))return Some(-8640000000000000);
      else {
        o=0;
        const m_1=TryParse_1(s_8);
        let _1=m_1!=null&&m_1.$==1&&(o=m_1.$0,true);
        m=[_1, o];
        return m[0]?Some(m[1]):null;
      }
    };
    const g_2=DateTimeGetUnchecked();
    const s_2=DateTimeSetUnchecked();
    this.DateTimeApplyUnchecked=(v) => ApplyValue(g_2, s_2, v);
    this.FileSetUnchecked=() =>() => null;
    this.FileGetUnchecked=(el) => {
      const files=el.files;
      return Some(ofSeq_1(delay(() => map((i) => files.item(i), range(0, files.length-1)))));
    };
    const g_3=FileGetUnchecked();
    const s_3=FileSetUnchecked();
    this.FileApplyUnchecked=(v) => FileApplyValue(g_3, s_3, v);
    this.IntSetUnchecked=(el) =>(i) => {
      el.value=String(i);
    };
    this.IntGetUnchecked=(el) => {
      const s_8=el.value;
      if(isBlank(s_8))return Some(0);
      else {
        const pd=+s_8;
        return pd!==pd>>0?null:Some(pd);
      }
    };
    const g_4=IntGetUnchecked();
    const s_4=IntSetUnchecked();
    this.IntApplyUnchecked=(v) => ApplyValue(g_4, s_4, v);
    this.IntSetChecked=(el) =>(i) => {
      const i_1=i.Input;
      return el.value!=i_1?void(el.value=i_1):null;
    };
    this.IntGetChecked=(el) => {
      let _1;
      let o;
      const s_8=el.value;
      if(isBlank(s_8))_1=(el.checkValidity?el.checkValidity():true)?CheckedInput.Blank(s_8):CheckedInput.Invalid(s_8);
      else {
        const m=(o=0,[TryParse(s_8, {get:() => o, set:(v) => {
          o=v;
        }}), o]);
        _1=m[0]?CheckedInput.Valid(m[1], s_8):CheckedInput.Invalid(s_8);
      }
      return Some(_1);
    };
    const g_5=IntGetChecked();
    const s_5=IntSetChecked();
    this.IntApplyChecked=(v) => ApplyValue(g_5, s_5, v);
    this.FloatSetUnchecked=(el) =>(i) => {
      el.value=String(i);
    };
    this.FloatGetUnchecked=(el) => {
      const s_8=el.value;
      if(isBlank(s_8))return Some(0);
      else {
        const pd=+s_8;
        return isNaN(pd)?null:Some(pd);
      }
    };
    const g_6=FloatGetUnchecked();
    const s_6=FloatSetUnchecked();
    this.FloatApplyUnchecked=(v) => ApplyValue(g_6, s_6, v);
    this.FloatSetChecked=(el) =>(i) => {
      const i_1=i.Input;
      return el.value!=i_1?void(el.value=i_1):null;
    };
    this.FloatGetChecked=(el) => {
      let _1;
      const s_8=el.value;
      if(isBlank(s_8))_1=(el.checkValidity?el.checkValidity():true)?CheckedInput.Blank(s_8):CheckedInput.Invalid(s_8);
      else {
        const i=+s_8;
        _1=isNaN(i)?CheckedInput.Invalid(s_8):CheckedInput.Valid(i, s_8);
      }
      return Some(_1);
    };
    const g_7=FloatGetChecked();
    const s_7=FloatSetChecked();
    this.FloatApplyChecked=(v) => ApplyValue(g_7, s_7, v);
  }
});
let _c_4=Lazy((_i) => class $StartupCode_DomUtility {
  static {
    _c_4=_i(this);
  }
  static defaultWrap;
  static wrapMap;
  static rhtml;
  static rtagName;
  static rxhtmlTag;
  static {
    this.rxhtmlTag=new RegExp("<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\\w:]+)[^>]*)\\/>", "gi");
    this.rtagName=new RegExp("<([\\w:]+)");
    this.rhtml=new RegExp("<|&#?\\w+;");
    const table=[1, "<table>", "</table>"];
    let _1=Object.fromEntries([["option", [1, "<select multiple='multiple'>", "</select>"]], ["legend", [1, "<fieldset>", "</fieldset>"]], ["area", [1, "<map>", "</map>"]], ["param", [1, "<object>", "</object>"]], ["thead", table], ["tbody", table], ["tfoot", table], ["tr", [2, "<table><tbody>", "</tbody></table>"]], ["col", [2, "<table><colgroup>", "</colgoup></table>"]], ["td", [3, "<table><tbody><tr>", "</tr></tbody></table>"]]]);
    this.wrapMap=_1;
    this.defaultWrap=[0, "", ""];
  }
});
function StringApply(){
  return _c_3.StringApply;
}
function ApplyValue(get_1, set_1, var_1){
  let expectedValue;
  expectedValue=null;
  return[(el) => {
    const onChange=() => {
      var_1.UpdateMaybe((v) => {
        let _1;
        expectedValue=get_1(el);
        return expectedValue!=null&&expectedValue.$==1&&(!Equals(expectedValue.$0, v)&&(_1=[expectedValue, expectedValue.$0],true))?_1[0]:null;
      });
    };
    el.addEventListener("change", onChange);
    el.addEventListener("input", onChange);
    el.addEventListener("keypress", onChange);
  }, (x) => {
    const _1=set_1(x);
    return(_2) => _2==null?null:_1(_2.$0);
  }, Map((v) => {
    let _1;
    return expectedValue!=null&&expectedValue.$==1&&(Equals(expectedValue.$0, v)&&(_1=expectedValue.$0,true))?null:Some(v);
  }, var_1.View)];
}
function StringSet(){
  return _c_3.StringSet;
}
function StringGet(){
  return _c_3.StringGet;
}
function StringListSet(){
  return _c_3.StringListSet;
}
function StringListGet(){
  return _c_3.StringListGet;
}
function DateTimeSetUnchecked(){
  return _c_3.DateTimeSetUnchecked;
}
function DateTimeGetUnchecked(){
  return _c_3.DateTimeGetUnchecked;
}
function FileApplyValue(get_1, set_1, var_1){
  let expectedValue;
  expectedValue=null;
  return[(el) => {
    el.addEventListener("change", () => {
      var_1.UpdateMaybe((v) => {
        let _1;
        expectedValue=get_1(el);
        return expectedValue!=null&&expectedValue.$==1&&(expectedValue.$0!==v&&(_1=[expectedValue, expectedValue.$0],true))?_1[0]:null;
      });
    });
  }, (x) => {
    const _1=set_1(x);
    return(_2) => _2==null?null:_1(_2.$0);
  }, Map((v) => {
    let _1;
    return expectedValue!=null&&expectedValue.$==1&&(Equals(expectedValue.$0, v)&&(_1=expectedValue.$0,true))?null:Some(v);
  }, var_1.View)];
}
function FileSetUnchecked(){
  return _c_3.FileSetUnchecked;
}
function FileGetUnchecked(){
  return _c_3.FileGetUnchecked;
}
function IntSetUnchecked(){
  return _c_3.IntSetUnchecked;
}
function IntGetUnchecked(){
  return _c_3.IntGetUnchecked;
}
function IntSetChecked(){
  return _c_3.IntSetChecked;
}
function IntGetChecked(){
  return _c_3.IntGetChecked;
}
function FloatSetUnchecked(){
  return _c_3.FloatSetUnchecked;
}
function FloatGetUnchecked(){
  return _c_3.FloatGetUnchecked;
}
function FloatSetChecked(){
  return _c_3.FloatSetChecked;
}
function FloatGetChecked(){
  return _c_3.FloatGetChecked;
}
let _c_5=Lazy((_i) => class Pervasives {
  static {
    _c_5=_i(this);
  }
  static longMonths;
  static shortMonths;
  static longDays;
  static shortDays;
  static {
    this.shortDays=ofArray(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    this.longDays=ofArray(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
    this.shortMonths=ofArray(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
    this.longMonths=ofArray(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
  }
});
class Exception extends Object_1 { }
let _c_6=Lazy((_i) => class $StartupCode_Abbrev {
  static {
    _c_6=_i(this);
  }
  static counter;
  static {
    this.counter=0;
  }
});
class OperationCanceledException extends Error {
  ct;
  constructor(i, _1, _2, _3){
    let ct;
    if(i=="New"){
      ct=_1;
      i="New_1";
      _1="The operation was canceled.";
      _2=null;
      _3=ct;
    }
    if(i=="New_1"){
      const message=_1;
      const inner=_2;
      const ct_1=_3;
      super(message);
      this.inner=inner;
      this.ct=ct_1;
    }
  }
}
class Elt extends Doc {
  docNode_1;
  updates_1;
  elt;
  rvUpdates;
  static New(el, attr_1, children){
    const node=CreateElemNode(el, attr_1, children.docNode);
    const rvUpdates=Updates_1.Create(children.updates);
    return new Elt(ElemDoc(node), Map2Unit(Updates(node.Attr), rvUpdates.v), el, rvUpdates);
  }
  constructor(docNode, updates, elt, rvUpdates){
    super(docNode, updates);
    this.docNode_1=docNode;
    this.updates_1=updates;
    this.elt=elt;
    this.rvUpdates=rvUpdates;
  }
}
function isBlank(s){
  return forall_2(IsWhiteSpace, s);
}
class CheckedInput {
  get Input(){
    return this.$==1?this.$0:this.$==2?this.$0:this.$1;
  }
  static Blank(inputText){
    return Create_2(CheckedInput, {$:2, $0:inputText});
  }
  static Invalid(inputText){
    return Create_2(CheckedInput, {$:1, $0:inputText});
  }
  static Valid(value, inputText){
    return Create_2(CheckedInput, {
      $:0, 
      $0:value, 
      $1:inputText
    });
  }
  $;
  $0;
  $1;
}
function get_UseAnimations(){
  return UseAnimations();
}
function Play(anim){
  return Delay(() => Bind_1(Run(() => { }, Actions(anim)), () => {
    Finalize(anim);
    return Return(null);
  }));
}
function Append(a, a_1){
  return Anim(Append_1(a.$0, a_1.$0));
}
function Run(k, anim){
  const dur=anim.Duration;
  if(dur===0)return Zero();
  else {
    const c=(ok) => {
      function loop(start){
        return(now) => {
          const t=now-start;
          anim.Compute(t);
          k();
          return t<=dur?void requestAnimationFrame((t_1) => {
            (loop(start))(t_1);
          }):ok();
        };
      }
      requestAnimationFrame((t) => {
        (loop(t))(t);
      });
    };
    return FromContinuations((_1, _2, _3) => c.apply(null, [_1, _2, _3]));
  }
}
function Anim(Item){
  return{$:0, $0:Item};
}
function Concat(xs){
  return Anim(Concat_1(map(List, xs)));
}
function get_Empty(){
  return Anim(Empty());
}
function BatchUpdatesEnabled(){
  return _c_7.BatchUpdatesEnabled;
}
function StartProcessor(procAsync){
  const st=[0];
  function work(){
    return Delay(() => Bind_1(procAsync, () => {
      const m=st[0];
      return Equals(m, 1)?(st[0]=0,Zero()):Equals(m, 2)?(st[0]=1,work()):Zero();
    }));
  }
  return() => {
    const m=st[0];
    if(Equals(m, 0)){
      st[0]=1;
      Start(work(), null);
    }
    else Equals(m, 1)?st[0]=2:void 0;
  };
}
function AjaxProvider(){
  return _c_8.AjaxProvider;
}
function makePayload(data){
  return JSON.stringify(data);
}
function makeHeaders(headers){
  return NewFromSeq(map_2((_1) =>[_1[0], _1[1]], distinctBy_1((t) => t[0], headers.concat([["content-type", "application/json"]]))));
}
function EndPoint(){
  return _c_8.EndPoint;
}
function ajax(async, url, headers, data, ok, err, csrf){
  let xhr=new XMLHttpRequest();
  let csrf_1=document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*csrftoken\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1");
  xhr.open("POST", url, async);
  if(async==true)xhr.withCredentials=true;
  let h;
  for(var h_1 in headers)xhr.setRequestHeader(h_1, headers[h_1]);
  if(csrf_1)xhr.setRequestHeader("x-csrftoken", csrf_1);
  function k(){
    if(xhr.status==200)ok(xhr.responseText);
    else if(csrf&&xhr.status==403&&xhr.responseText=="CSRF")csrf();
    else {
      let msg="Response status is not 200: ";
      err(new Error(msg+xhr.status));
    }
  }
  if("onload"in xhr)xhr.onload=xhr.onerror=xhr.onabort=k;
  else xhr.onreadystatechange=() => {
    if(xhr.readyState==4)k();
  };
  xhr.send(data);
}
class Updates_1 {
  c;
  s;
  v;
  static Create(v){
    let var_1;
    var_1=null;
    var_1=Updates_1.New(v, null, () => {
      let c;
      c=var_1.s;
      return c===null?(c=Copy(var_1.c()),var_1.s=c,WhenObsoleteRun(c, () => {
        var_1.s=null;
      }),c):c;
    });
    return var_1;
  }
  static New(Current, Snap, VarView){
    return Create_2(Updates_1, {
      c:Current, 
      s:Snap, 
      v:VarView
    });
  }
}
function Clear(a){
  a.splice(0, length(a));
}
function IsWhiteSpace(c){
  return c.match(new RegExp("\\s"))!==null;
}
function TryParse_2(s, min, max_1, r){
  const x=+s;
  const ok=x===x-x%1&&x>=min&&x<=max_1;
  if(ok)r.set(x);
  return ok;
}
function New_10(PreviousNodes, Top){
  return{PreviousNodes:PreviousNodes, Top:Top};
}
function get_Empty_1(){
  return NodeSet(new HashSet("New_3"));
}
function FindAll(doc){
  const q=[];
  function recF(recI, _1){
    while(true)
      switch(recI){
        case 0:
          if(_1!=null&&_1.$==0){
            const b=_1.$1;
            const a=_1.$0;
            recF(0, a);
            _1=b;
          }
          else if(_1!=null&&_1.$==1){
            const el=_1.$0;
            _1=el;
            recI=1;
          }
          else if(_1!=null&&_1.$==2){
            const em=_1.$0;
            _1=em.Current;
          }
          else if(_1!=null&&_1.$==6){
            const x=_1.$0.Holes;
            return(((a_1) =>(a_2) => {
              iter_1(a_1, a_2);
            })(loopEN))(x);
          }
          else return null;
          break;
        case 1:
          q.push(_1);
          _1=_1.Children;
          recI=0;
          break;
      }
  }
  function loop(node){
    return recF(0, node);
  }
  function loopEN(el){
    return recF(1, el);
  }
  loop(doc);
  return NodeSet(new HashSet("New_2", q));
}
function NodeSet(Item){
  return{$:0, $0:Item};
}
function Filter(f, a){
  return NodeSet(Filter_1(f, a.$0));
}
function Except(a, a_1){
  return NodeSet(Except_1(a.$0, a_1.$0));
}
function ToArray(a){
  return ToArray_2(a.$0);
}
function Intersect(a, a_1){
  return NodeSet(Intersect_1(a.$0, a_1.$0));
}
function UseAnimations(){
  return _c_9.UseAnimations;
}
function Actions(a){
  return ConcatActions(choose((a_1) => a_1.$==1?Some(a_1.$0):null, ToArray_1(a.$0)));
}
function Finalize(a){
  iter_1((a_1) => {
    if(a_1.$==0)a_1.$0();
  }, ToArray_1(a.$0));
}
function ConcatActions(xs){
  const xs_1=ofSeqNonCopying(xs);
  const m=length(xs_1);
  if(m===0)return Const_1();
  else if(m===1)return get(xs_1, 0);
  else {
    const dur=max(map((anim) => anim.Duration, xs_1));
    const xs_2=map_2((x) => Prolong(dur, x), xs_1);
    return Def(dur, (t) => {
      iter_1((anim) => {
        anim.Compute(t);
      }, xs_2);
    });
  }
}
function List(a){
  return a.$0;
}
function Const_1(v){
  return Def(0, () => v);
}
function Def(d, f){
  return{Compute:f, Duration:d};
}
function Prolong(nextDuration, anim){
  const comp=anim.Compute;
  const dur=anim.Duration;
  const last=Create_1(() => anim.Compute(anim.Duration));
  return{Compute:(t) => t>=dur?last.f():comp(t), Duration:nextDuration};
}
let _c_7=Lazy((_i) => class Proxy {
  static {
    _c_7=_i(this);
  }
  static BatchUpdatesEnabled;
  static {
    this.BatchUpdatesEnabled=true;
  }
});
let _c_8=Lazy((_i) => class $StartupCode_Remoting {
  static {
    _c_8=_i(this);
  }
  static AjaxProvider;
  static EndPoint;
  static {
    this.EndPoint=globalThis.location.origin;
    this.AjaxProvider=new XhrProvider();
  }
});
class HashSet extends Object_1 {
  equals;
  hash;
  data;
  count;
  SAdd(item){
    return this.add(item);
  }
  add(item){
    const h=this.hash(item);
    const arr=this.data[h];
    return arr==null?(this.data[h]=[item],this.count=this.count+1,true):this.arrContains(item, arr)?false:(arr.push(item),this.count=this.count+1,true);
  }
  ExceptWith(xs){
    const e=Get(xs);
    try {
      while(e.MoveNext())
        this.Remove(e.Current);
    }
    finally {
      const _1=e;
      if(typeof _1=="object"&&isIDisposable(_1))e.Dispose();
    }
  }
  get Count(){
    return this.count;
  }
  IntersectWith(xs){
    const other=new HashSet("New_4", xs, this.equals, this.hash);
    const all=concat_1(this.data);
    for(let i=0, _1=all.length-1;i<=_1;i++){
      const item=all[i];
      if(!other.Contains(item))this.Remove(item);
    }
  }
  GetEnumerator(){
    return Get(concat_1(this.data));
  }
  arrContains(item, arr){
    let c=true;
    let i=0;
    const l=arr.length;
    while(c&&i<l)
      if(this.equals.apply(null, [arr[i], item]))c=false;
      else i=i+1;
    return!c;
  }
  Remove(item){
    const arr=this.data[this.hash(item)];
    return arr==null?false:this.arrRemove(item, arr)&&(this.count=this.count-1,true);
  }
  CopyTo(arr, index){
    const all=concat_1(this.data);
    for(let i=0, _1=all.length-1;i<=_1;i++)set(arr, i+index, all[i]);
  }
  Contains(item){
    const arr=this.data[this.hash(item)];
    return arr==null?false:this.arrContains(item, arr);
  }
  arrRemove(item, arr){
    let c=true;
    let i=0;
    const l=arr.length;
    while(c&&i<l)
      if(this.equals.apply(null, [arr[i], item])){
        arr.splice(i, 1);
        c=false;
      }
      else i=i+1;
    return!c;
  }
  constructor(i, _1, _2, _3){
    let init_3;
    if(i=="New_2"){
      init_3=_1;
      i="New_4";
      _1=init_3;
      _2=Equals;
      _3=Hash;
    }
    if(i=="New_3"){
      i="New_4";
      _1=[];
      _2=Equals;
      _3=Hash;
    }
    if(i=="New_4"){
      const init_4=_1;
      const equals=_2;
      const hash=_3;
      super();
      this.equals=equals;
      this.hash=hash;
      this.data=[];
      this.count=0;
      const e=Get(init_4);
      try {
        while(e.MoveNext())
          this.add(e.Current);
      }
      finally {
        const _4=e;
        if(typeof _4=="object"&&isIDisposable(_4))e.Dispose();
      }
    }
  }
}
let _c_9=Lazy((_i) => class $StartupCode_Animation {
  static {
    _c_9=_i(this);
  }
  static UseAnimations;
  static CubicInOut;
  static {
    this.CubicInOut=Easing.Custom((t) => {
      const t2=t*t;
      return 3*t2-2*(t2*t);
    });
    this.UseAnimations=true;
  }
});
function Append_1(x, y){
  return x.$==0?y:y.$==0?x:{
    $:2, 
    $0:x, 
    $1:y
  };
}
function ToArray_1(xs){
  const out=[];
  function loop(xs_1){
    while(true)
      {
        if(xs_1.$==1)return out.push(xs_1.$0);
        else if(xs_1.$==2){
          const y=xs_1.$1;
          const x=xs_1.$0;
          loop(x);
          xs_1=y;
        }
        else return xs_1.$==3?iter_1((v) => {
          out.push(v);
        }, xs_1.$0):null;
      }
  }
  loop(xs);
  return out.slice(0);
}
function Concat_1(xs){
  const x=ofSeqNonCopying(xs);
  return TreeReduce(Empty(), Append_1, x);
}
function Empty(){
  return _c_10.Empty;
}
class XhrProvider extends Object_1 {
  Async(url, headers, data, ok, err){
    ajax(true, url, headers, data, ok, err, () => {
      ajax(true, url, headers, data, ok, err, void 0);
    });
  }
}
class Easing extends Object_1 {
  transformTime;
  static Custom(f){
    return new Easing(f);
  }
  constructor(transformTime){
    super();
    this.transformTime=transformTime;
  }
}
function Filter_1(ok, set_1){
  return new HashSet("New_2", filter(ok, ToArray_2(set_1)));
}
function Except_1(excluded, included){
  const set_1=new HashSet("New_2", ToArray_2(included));
  set_1.ExceptWith(ToArray_2(excluded));
  return set_1;
}
function ToArray_2(set_1){
  const arr=create(set_1.Count, void 0);
  set_1.CopyTo(arr, 0);
  return arr;
}
function Intersect_1(a, b){
  const set_1=new HashSet("New_2", ToArray_2(a));
  set_1.IntersectWith(ToArray_2(b));
  return set_1;
}
function Children(elem, delims){
  let n;
  if(delims!=null&&delims.$==1){
    const rdelim=delims.$0[1];
    const ldelim=delims.$0[0];
    const a=[];
    n=ldelim.nextSibling;
    while(n!==rdelim)
      {
        a.push(n);
        n=n.nextSibling;
      }
    return DomNodes(a);
  }
  else {
    let _1=elem.childNodes.length;
    const o=elem.childNodes;
    let _2=init_2(_1, (i) => o[i]);
    return DomNodes(_2);
  }
}
function Except_2(a, a_1){
  const excluded=a.$0;
  return DomNodes(filter((n) => forall_1((k) =>!(n===k), excluded), a_1.$0));
}
function Iter(f, a){
  iter_1(f, a.$0);
}
function DocChildren(node){
  const q=[];
  function loop(doc){
    while(true)
      {
        if(doc!=null&&doc.$==2){
          const d=doc.$0;
          doc=d.Current;
        }
        else if(doc!=null&&doc.$==1)return q.push(doc.$0.El);
        else if(doc==null)return null;
        else if(doc!=null&&doc.$==5)return q.push(doc.$0);
        else if(doc!=null&&doc.$==4)return q.push(doc.$0.Text);
        else if(doc!=null&&doc.$==6){
          const x=doc.$0.Els;
          return(((a_1) =>(a_2) => {
            iter_1(a_1, a_2);
          })((a_1) => {
            if(a_1==null||a_1.constructor===Object)loop(a_1);
            else q.push(a_1);
          }))(x);
        }
        else {
          const b=doc.$1;
          const a=doc.$0;
          loop(a);
          doc=b;
        }
      }
  }
  loop(node.Children);
  return DomNodes(ofSeqNonCopying(q));
}
function DomNodes(Item){
  return{$:0, $0:Item};
}
function Create_1(f){
  return New_11(false, f, forceLazy);
}
function forceLazy(){
  const v=this.v();
  this.c=true;
  this.v=v;
  this.f=cachedLazy;
  return v;
}
function cachedLazy(){
  return this.v;
}
let _c_10=Lazy((_i) => class $StartupCode_AppendList {
  static {
    _c_10=_i(this);
  }
  static Empty;
  static {
    this.Empty={$:0};
  }
});
function concat_1(o){
  let r=[];
  let k;
  for(var k_1 in o)r.push.apply(r, o[k_1]);
  return r;
}
function New_11(created, evalOrVal, force){
  return{
    c:created, 
    v:evalOrVal, 
    f:force
  };
}
