import Var from "../WebSharper.UI/WebSharper.UI.Var.js"
import { Error } from "./WebSharperApp.AuthResult.js"
import { StartImmediate, Delay, Bind, Zero } from "../WebSharper.StdLib/WebSharper.Concurrency.js"
import { CheckAuthState, Logout, ResetPassword, AttemptMagicLogin, AttemptVerifyEmail, TriggerMagicLink, RegisterUser, LoginUser } from "./WebSharperApp.Server.js"
import Doc from "../WebSharper.UI/WebSharper.UI.Doc.js"
import { Map } from "../WebSharper.UI/WebSharper.UI.View.js"
import Attr from "../WebSharper.UI/WebSharper.UI.Attr.js"
import { Handler, Dynamic } from "../WebSharper.UI/WebSharper.UI.Client.Attr.js"
export function NavBarAuthWidget(){
  const state=Var.Create_1(Error("Loading..."));
  StartImmediate(Delay(() => Bind(CheckAuthState(), (a) => {
    state.Set(a);
    return Zero();
  })), null);
  return Doc.Element("div", [], [Doc.EmbedView(Map((s) => {
    if(s.$==1){
      const username=s.$0;
      const isVerified=s.$1;
      return Doc.Element("div", [Attr.Create("class", "flex items-center space-x-4")], [!isVerified?Doc.Element("span", [Attr.Create("class", "relative flex h-4 w-4 transform -translate-y-1")], [Doc.Element("span", [Attr.Create("class", "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75")], []), Doc.Element("span", [Attr.Create("class", "relative inline-flex rounded-full h-4 w-4 bg-red-500")], []), Doc.Element("span", [Attr.Create("title", "Please verify your email!"), Attr.Create("class", "absolute w-4 h-4 cursor-pointer")], [])]):Doc.Empty, Doc.Element("span", [Attr.Create("class", "text-white font-medium")], [Doc.TextNode("Hi, "+username)]), Doc.Element("button", [Attr.Create("class", "bg-transparent text-white hover:text-red-300 font-medium py-2 px-4 transition"), Handler("click", () =>() => StartImmediate(Delay(() => Bind(Logout(), () => {
        globalThis.location.href="/";
        return Zero();
      })), null))], [Doc.TextNode("Logout")])]);
    }
    else return Doc.Element("a", [Attr.Create("href", "/auth"), Attr.Create("class", "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 transform hover:-translate-y-0.5")], [Doc.TextNode("Login")]);
  }, state.View))]);
}
export function ChangePassword(){
  const newpass=Var.Create_1("");
  const message=Var.Create_1("");
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4 text-gray-800")], [Doc.TextNode("Update Forgotten Password")]), Doc.Element("p", [Attr.Create("class", "text-sm text-center text-gray-500 mb-6")], [Doc.TextNode("Since you used a Magic Link, you must establish a new password securely.")]), Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 font-bold mb-2")], [Doc.TextNode("New Password")]), Doc.PasswordBox([Attr.Create("class", "w-full border rounded-lg py-3 px-4 shadow-sm focus:ring-blue-500")], newpass)]), Doc.Element("button", [Attr.Create("class", "w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg"), Handler("click", () =>() => StartImmediate(Delay(() => Bind(ResetPassword(newpass.Get()), (a) => a.$==0?(globalThis.location.href="/",Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero())), null))], [Doc.TextNode("Update Credentials")]), Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-4 p-4 text-sm bg-red-100 text-red-700 rounded", message.View))], [Doc.TextView(message.View)])]);
}
export function MagicLogin(token){
  const message=Var.Create_1("Initiating magic entry sequence...");
  StartImmediate(Delay(() => Bind(AttemptMagicLogin(token), (a) => a.$==2?(globalThis.location.href="/change-password",Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero())), null);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4")], [Doc.TextNode("Authenticating")]), Doc.Element("p", [Attr.Create("class", "text-center text-lg text-gray-700 animate-pulse")], [Doc.TextView(message.View)])]);
}
export function VerifyEmail(token){
  const message=Var.Create_1("Validating token...");
  StartImmediate(Delay(() => Bind(AttemptVerifyEmail(token), (a) => a.$==0?(message.Set("Your email was successfully verified! You may securely browse."),Zero()):a.$==3?(message.Set(a.$0),Zero()):Zero())), null);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-2xl font-bold text-center mb-4")], [Doc.TextNode("Email Verification")]), Doc.Element("p", [Attr.Create("class", "text-center text-lg text-gray-700")], [Doc.TextView(message.View)]), Doc.Element("div", [Attr.Create("class", "text-center mt-8")], [Doc.Element("a", [Attr.Create("href", "/"), Attr.Create("class", "text-blue-500 font-bold hover:underline")], [Doc.TextNode("Go Home")])])]);
}
export function ForgotPassword(){
  const email=Var.Create_1("");
  const message=Var.Create_1("");
  const isSuccess=Var.Create_1(false);
  return GlassCard([Doc.Element("h2", [Attr.Create("class", "text-3xl font-extrabold text-gray-800 mb-4 text-center")], [Doc.TextNode("Forgot Password")]), Doc.Element("p", [Attr.Create("class", "text-gray-600 text-center mb-8")], [Doc.TextNode("Enter your email to receive a magic login link.")]), Doc.Element("div", [Dynamic("class", Map((s) => s?"hidden":"block", isSuccess.View))], [Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 text-sm font-bold mb-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-blue-500"), Attr.Create("name", "type"), Attr.Create("type", "email")], email)]), Doc.Element("button", [Attr.Create("class", "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"), Handler("click", () =>() => StartImmediate(Delay(() => {
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
  }), null))], [Doc.TextNode("Send Magic Link")])]), Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-4 p-4 rounded text-sm "+(isSuccess.Get()?"bg-green-100 text-green-800":"bg-red-100 text-red-800"), message.View))], [Doc.TextView(message.View)]), Doc.Element("div", [Attr.Create("class", "text-center mt-6")], [Doc.Element("a", [Attr.Create("href", "/auth"), Attr.Create("class", "text-sm text-blue-500 font-medium")], [Doc.TextNode("Back to Login")])])]);
}
export function AuthCard(){
  const isLogin=Var.Create_1(true);
  return GlassCard([Doc.Element("div", [Attr.Create("class", "flex border-b border-gray-200 mb-8")], [Doc.Element("button", [Dynamic("class", Map((l) => l?"w-1/2 py-4 text-center font-bold text-blue-600 border-b-2 border-blue-600 outline-none":"w-1/2 py-4 text-center font-medium text-gray-500 hover:text-gray-700 outline-none", isLogin.View)), Handler("click", () =>() => isLogin.Set(true))], [Doc.TextNode("Login")]), Doc.Element("button", [Dynamic("class", Map((l) =>!l?"w-1/2 py-4 text-center font-bold text-blue-600 border-b-2 border-blue-600 outline-none":"w-1/2 py-4 text-center font-medium text-gray-500 hover:text-gray-700 outline-none", isLogin.View)), Handler("click", () =>() => isLogin.Set(false))], [Doc.TextNode("Register")])]), Doc.Element("div", [], [Doc.EmbedView(Map((login) => login?LoginForm():RegistrationForm(), isLogin.View))])]);
}
export function RegistrationForm(){
  const username=Var.Create_1("");
  const email=Var.Create_1("");
  const password=Var.Create_1("");
  const confirmPass=Var.Create_1("");
  const message=Var.Create_1("");
  const isError=Var.Create_1(false);
  return Doc.Element("div", [], [Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 text-sm font-bold mb-2")], [Doc.TextNode("Username")]), Doc.Input([Attr.Create("class", "shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-blue-500 transition")], username)]), Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 text-sm font-bold mb-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-blue-500 transition"), Attr.Create("type", "email")], email)]), Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 text-sm font-bold mb-2")], [Doc.TextNode("Password")]), Doc.PasswordBox([Attr.Create("class", "shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-blue-500 transition")], password), Doc.Element("p", [Attr.Create("class", "text-xs text-gray-500 mt-2")], [Doc.TextNode("A good password contains at least 8 characters.")])]), Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 text-sm font-bold mb-2")], [Doc.TextNode("Confirm Password")]), Doc.PasswordBox([Attr.Create("class", "shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 focus:ring-2 focus:ring-blue-500 transition")], confirmPass)]), Doc.Element("button", [Attr.Create("class", "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:-translate-y-1 shadow-lg"), Handler("click", () =>() => StartImmediate(Delay(() => {
    const _1=username.Get();
    const _2=email.Get();
    const _3=password.Get();
    return _3!=confirmPass.Get()?(isError.Set(true),message.Set("Passwords do not match!"),Zero()):(message.Set("Processing..."),isError.Set(false),Bind(RegisterUser(_1, _2, _3), (a) => {
      if(a.$==1){
        a.$0;
        isError.Set(false);
        message.Set("Success! Please check your email inbox to verify your account.");
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
  }), null))], [Doc.TextNode("Register Securely")]), Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":isError.Get()?"mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm":"mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded text-sm", message.View))], [Doc.TextView(message.View)])]);
}
export function LoginForm(){
  const email=Var.Create_1("");
  const password=Var.Create_1("");
  const message=Var.Create_1("");
  const msgColor=Var.Create_1("text-red-700 bg-red-100 border-red-500");
  return Doc.Element("div", [], [Doc.Element("div", [Attr.Create("class", "mb-5")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 text-sm font-bold mb-2")], [Doc.TextNode("Email Address")]), Doc.Input([Attr.Create("class", "shadow-sm appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition"), Attr.Create("name", "email"), Attr.Create("type", "email")], email)]), Doc.Element("div", [Attr.Create("class", "mb-6")], [Doc.Element("label", [Attr.Create("class", "block text-gray-700 text-sm font-bold mb-2")], [Doc.TextNode("Password")]), Doc.PasswordBox([Attr.Create("class", "shadow-sm appearance-none border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition")], password), Doc.Element("div", [Attr.Create("class", "text-right mt-2")], [Doc.Element("a", [Attr.Create("href", "/forgot-password"), Attr.Create("class", "text-sm text-blue-500 hover:text-blue-800 transition font-medium")], [Doc.TextNode("Forgot Password?")])])]), Doc.Element("button", [Attr.Create("class", "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 transform hover:-translate-y-1 shadow-lg"), Handler("click", () =>() => StartImmediate(Delay(() => {
    message.Set("Logging in...");
    msgColor.Set("text-blue-700 bg-blue-100 border-blue-500");
    return Bind(LoginUser(email.Get(), password.Get()), (a) => {
      if(a.$==2){
        globalThis.location.href="/change-password";
        return Zero();
      }
      else if(a.$==1){
        a.$1;
        a.$0;
        globalThis.location.href="/";
        return Zero();
      }
      else if(a.$==3){
        const err=a.$0;
        msgColor.Set("text-red-700 bg-red-100 border-red-500");
        message.Set(err);
        return Zero();
      }
      else return Zero();
    });
  }), null))], [Doc.TextNode("Log In")]), Doc.Element("div", [Dynamic("class", Map((m) => m==""?"hidden":"mt-4 border-l-4 p-4 rounded text-sm "+msgColor.Get(), message.View))], [Doc.TextView(message.View)])]);
}
export function HomeHero(){
  return Doc.Element("div", [Attr.Create("class", "text-center text-white")], [Doc.Element("h1", [Attr.Create("class", "text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg")], [Doc.TextNode("Due Alpha Authentication")]), Doc.Element("p", [Attr.Create("class", "text-xl text-blue-100 font-light mb-8 drop-shadow")], [Doc.TextNode("Secure. Rapid. Magically passwordless.")])]);
}
export function GlassCard(content){
  return Doc.Element("div", [Attr.Create("class", "w-full max-w-md mx-auto bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/40 transform transition-all")], content);
}
