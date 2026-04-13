namespace WebSharperApp

open WebSharper
open WebSharper.UI
open WebSharper.UI.Html
open WebSharper.UI.Client
open WebSharper.JavaScript

[<JavaScript>]
module Client =
    
    // Extracted shared UI wrapper since many cards share this
    let GlassCard content =
        div [attr.``class`` "w-full max-w-md mx-auto neo-flat p-8 rounded-3xl transform transition-all text-gray-800"] content

    let HomeHero () =
        div [attr.``class`` "text-center neo-flat p-12 rounded-3xl max-w-3xl mx-auto"] [
            h1 [attr.``class`` "text-5xl font-extrabold tracking-tight mb-4 text-gray-800"] [text "Due Alpha Authentication"]
            p [attr.``class`` "text-xl text-gray-500 font-light mb-8"] [text "Secure. Rapid. Magically passwordless."]
        ]

    let LoginForm () =
        let email = Var.Create ""
        let password = Var.Create ""
        let message = Var.Create ""
        let msgColor = Var.Create "text-red-700 bg-red-100 border-red-500"

        let submit () =
            async {
                message.Value <- "Logging in..."
                msgColor.Value <- "text-blue-700 bg-blue-100 border-blue-500"
                let! res = Server.LoginUser(email.Value, password.Value)
                match res with
                | AuthResult.NeedPasswordChange -> JS.Window.Location.Href <- "/change-password"
                | AuthResult.LoggedIn (user, verified) -> JS.Window.Location.Href <- "/"
                | AuthResult.Error err ->
                    msgColor.Value <- "text-red-700 bg-red-100 border-red-500"
                    message.Value <- err
                | _ -> ()
            } |> Async.StartImmediate

        div [] [
            div [attr.``class`` "mb-5"] [
                label [attr.``class`` "block text-gray-600 text-sm font-bold mb-3 pl-2"] [text "Email Address"]
                Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 leading-tight focus:outline-none transition" ; attr.name "email" ; attr.``type`` "email"] email
            ]
            div [attr.``class`` "mb-6"] [
                label [attr.``class`` "block text-gray-600 text-sm font-bold mb-3 pl-2"] [text "Password"]
                Doc.InputType.Password [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 leading-tight focus:outline-none transition"] password
                div [attr.``class`` "text-right mt-2"] [
                     a [attr.href "/forgot-password"; attr.``class`` "text-sm text-blue-500 hover:text-blue-800 transition font-medium"] [text "Forgot Password?"]
                ]
            ]
            button [
                attr.``class`` "w-full neo-button-blue font-bold py-4 px-4 rounded-xl mt-4"
                on.click (fun _ _ -> submit())
            ] [text "Log In"]
            
            div [attr.classDyn (message.View |> View.Map (fun m -> if m = "" then "hidden" else "mt-4 border-l-4 p-4 rounded text-sm " + msgColor.Value))] [textView message.View]
        ]

    let RegistrationForm () =
        let username = Var.Create ""
        let email = Var.Create ""
        let password = Var.Create ""
        let confirmPass = Var.Create ""
        let message = Var.Create ""
        let isError = Var.Create false

        let submit () =
            async {
                let u, e, p, cp = username.Value, email.Value, password.Value, confirmPass.Value
                if p <> cp then
                    isError.Value <- true; message.Value <- "Passwords do not match!"
                else
                    message.Value <- "Processing..."
                    isError.Value <- false
                    let! res = Server.RegisterUser(u, e, p)
                    match res with
                    | AuthResult.LoggedIn (usr, _) ->
                        isError.Value <- false
                        message.Value <- "Success! Please check your email inbox to verify your account."
                    | AuthResult.Error err ->
                        isError.Value <- true
                        message.Value <- err
                    | _ -> ()
            } |> Async.StartImmediate

        div [] [
            div [attr.``class`` "mb-5"] [
                label [attr.``class`` "block text-gray-600 text-sm font-bold mb-3 pl-2"] [text "Username"]
                Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 focus:outline-none transition"] username
            ]
            div [attr.``class`` "mb-5"] [
                label [attr.``class`` "block text-gray-600 text-sm font-bold mb-3 pl-2"] [text "Email Address"]
                Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 focus:outline-none transition" ; attr.``type`` "email"] email
            ]
            div [attr.``class`` "mb-5"] [
                label [attr.``class`` "block text-gray-600 text-sm font-bold mb-3 pl-2"] [text "Password"]
                Doc.InputType.Password [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 focus:outline-none transition"] password
                p [attr.``class`` "text-xs text-gray-400 mt-2 pl-2"] [text "A good password contains at least 8 characters."]
            ]
            div [attr.``class`` "mb-6"] [
                label [attr.``class`` "block text-gray-600 text-sm font-bold mb-3 pl-2"] [text "Confirm Password"]
                Doc.InputType.Password [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 focus:outline-none transition"] confirmPass
            ]
            button [
                attr.``class`` "w-full neo-button-blue font-bold py-4 px-4 rounded-xl mt-4"
                on.click (fun _ _ -> submit())
            ] [text "Register Securely"]

            div [attr.classDyn (message.View |> View.Map (fun m -> if m = "" then "hidden" elif isError.Value then "mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm" else "mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded text-sm"))] [textView message.View]
        ]

    let AuthCard () =
        let isLogin = Var.Create true
        
        GlassCard [
            // Tabs
            div [attr.``class`` "flex border-b border-gray-200 mb-8"] [
                button [
                    attr.classDyn (isLogin.View |> View.Map (fun l -> if l then "w-1/2 py-4 text-center font-bold text-blue-600 border-b-2 border-blue-600 outline-none" else "w-1/2 py-4 text-center font-medium text-gray-500 hover:text-gray-700 outline-none"))
                    on.click (fun _ _ -> isLogin.Value <- true)
                ] [text "Login"]
                button [
                    attr.classDyn (isLogin.View |> View.Map (fun l -> if not l then "w-1/2 py-4 text-center font-bold text-blue-600 border-b-2 border-blue-600 outline-none" else "w-1/2 py-4 text-center font-medium text-gray-500 hover:text-gray-700 outline-none"))
                    on.click (fun _ _ -> isLogin.Value <- false)
                ] [text "Register"]
            ]
            // Content
            div [] [
                isLogin.View |> View.Map (fun login ->
                    if login then LoginForm() else RegistrationForm()
                ) |> Doc.EmbedView
            ]
        ]

    let ForgotPassword () =
        let email = Var.Create ""
        let message = Var.Create ""
        let isSuccess = Var.Create false

        let submit () =
            async {
                message.Value <- "Dispatching magic link..."
                let! res = Server.TriggerMagicLink(email.Value)
                match res with
                | AuthResult.Success _ ->
                    isSuccess.Value <- true
                    message.Value <- "If that email exists, a magic link has been sent to it!"
                | AuthResult.Error e -> 
                    isSuccess.Value <- false; message.Value <- e
                | _ -> ()
            } |> Async.StartImmediate

        GlassCard [
            h2 [attr.``class`` "text-3xl font-extrabold text-gray-800 mb-4 text-center"] [text "Forgot Password"]
            p [attr.``class`` "text-gray-600 text-center mb-8"] [text "Enter your email to receive a magic login link."]
            
            div [attr.classDyn (isSuccess.View |> View.Map (fun s -> if s then "hidden" else "block"))] [
                div [attr.``class`` "mb-6"] [
                    label [attr.``class`` "block text-gray-600 text-sm font-bold mb-3 pl-2"] [text "Email Address"]
                    Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 focus:outline-none" ; attr.name "type" ; attr.``type`` "email"] email
                ]
                button [
                    attr.``class`` "w-full neo-button-blue font-bold py-4 px-4 rounded-xl mt-2"
                    on.click (fun _ _ -> submit())
                ] [text "Send Magic Link"]
            ]
            div [attr.classDyn (message.View |> View.Map (fun m -> if m = "" then "hidden" else "mt-4 p-4 rounded text-sm " + (if isSuccess.Value then "bg-green-100 text-green-800" else "bg-red-100 text-red-800")))] [textView message.View]
            div [attr.``class`` "text-center mt-6"] [ a [attr.href "/auth"; attr.``class`` "text-sm text-blue-500 font-medium"] [text "Back to Login"] ]
        ]

    let VerifyEmail (token: string) =
        let message = Var.Create "Validating token..."
        async {
            let! res = Server.AttemptVerifyEmail(token)
            match res with
            | AuthResult.Success _ -> message.Value <- "Your email was successfully verified! You may securely browse."
            | AuthResult.Error e -> message.Value <- e
            | _ -> ()
        } |> Async.StartImmediate

        GlassCard [
            h2 [attr.``class`` "text-2xl font-bold text-center mb-4"] [text "Email Verification"]
            p [attr.``class`` "text-center text-lg text-gray-700"] [textView message.View]
            div [attr.``class`` "text-center mt-8"] [ a [attr.href "/"; attr.``class`` "text-blue-500 font-bold hover:underline"] [text "Go Home"] ]
        ]

    let MagicLogin (token: string) =
        let message = Var.Create "Initiating magic entry sequence..."
        async {
            let! res = Server.AttemptMagicLogin(token)
            match res with
            | AuthResult.NeedPasswordChange -> JS.Window.Location.Href <- "/change-password"
            | AuthResult.Error e -> message.Value <- e
            | _ -> ()
        } |> Async.StartImmediate

        GlassCard [
            h2 [attr.``class`` "text-2xl font-bold text-center mb-4"] [text "Authenticating"]
            p [attr.``class`` "text-center text-lg text-gray-700 animate-pulse"] [textView message.View]
        ]
        
    let ChangePassword () =
        let newpass = Var.Create ""
        let message = Var.Create ""
        let submit () =
            async {
                let! res = Server.ResetPassword(newpass.Value)
                match res with
                | AuthResult.Success _ -> JS.Window.Location.Href <- "/"
                | AuthResult.Error e -> message.Value <- e
                | _ -> ()
            } |> Async.StartImmediate
            
        GlassCard [
            h2 [attr.``class`` "text-2xl font-bold text-center mb-4 text-gray-800"] [text "Update Forgotten Password"]
            p [attr.``class`` "text-sm text-center text-gray-500 mb-6"] [text "Since you used a Magic Link, you must establish a new password securely."]
            div [attr.``class`` "mb-8"] [
                label [attr.``class`` "block text-gray-600 font-bold mb-3 pl-2"] [text "New Password"]
                Doc.InputType.Password [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-700 focus:outline-none"] newpass
            ]
            button [attr.``class`` "w-full neo-button-blue font-bold py-4 px-4 rounded-xl"; on.click (fun _ _ -> submit())] [text "Update Credentials"]
            div [attr.classDyn (message.View |> View.Map(fun m -> if m = "" then "hidden" else "mt-4 p-4 text-sm bg-red-100 text-red-700 rounded"))] [textView message.View]
        ]

    let NavBarAuthWidget () =
        let state = Var.Create (AuthResult.Error "Loading...")
        async {
            let! res = Server.CheckAuthState()
            state.Value <- res
        } |> Async.StartImmediate

        div [] [
            state.View |> View.Map (fun s ->
                match s with
                | AuthResult.LoggedIn (username, isVerified) ->
                    div [attr.``class`` "flex items-center space-x-4"] [
                        // Unverified Indicator Logic
                        (if not isVerified then 
                             span [attr.``class`` "relative flex h-4 w-4 transform -translate-y-1"] [
                                span [attr.``class`` "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"] []
                                span [attr.``class`` "relative inline-flex rounded-full h-4 w-4 bg-red-500"] []
                                span [attr.title "Please verify your email!"; attr.``class`` "absolute w-4 h-4 cursor-pointer"] []
                             ]
                         else Doc.Empty)

                        span [attr.``class`` "text-gray-800 font-medium"] [text ("Hi, " + username)]
                        button [
                            attr.``class`` "neo-button bg-transparent text-gray-600 hover:text-red-500 font-medium py-2 px-6 rounded-full"
                            on.click (fun _ _ -> async { let! _ = Server.Logout() in JS.Window.Location.Href <- "/" } |> Async.StartImmediate)
                        ] [text "Logout"]
                    ]
                | _ ->
                    a [attr.href "/auth"; attr.``class`` "neo-button-blue font-bold py-3 px-8 rounded-full"] [text "Login"]
            ) |> Doc.EmbedView
        ]
