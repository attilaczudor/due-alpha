namespace WebSharperApp

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI
open WebSharper.UI.Server
open WebSharper.UI.Templating
open WebSharper.UI.Html

type EndPoint =
    | [<EndPoint "/">] Home
    | [<EndPoint "/auth">] Auth
    | [<EndPoint "/forgot-password">] ForgotPassword
    | [<EndPoint "/verify-email">] VerifyEmail of token: string
    | [<EndPoint "/magic-login">] MagicLogin of token: string
    | [<EndPoint "/change-password">] ChangePassword

module Components =
    
    let NavBar () =
        nav [attr.``class`` "neo-flat rounded-full m-6 px-8 py-4 sticky top-6 z-50"] [
            div [attr.``class`` "mx-auto grid grid-cols-3 items-center"] [
                // Left: Logo
                div [attr.``class`` "flex justify-start"] [
                    a [attr.href "/"; attr.``class`` "text-2xl font-bold text-gray-800 tracking-widest uppercase"] [text "Due Alpha"]
                ]
                
                // Center: Navigation Menu
                div [attr.``class`` "flex justify-center"] [
                    ul [attr.``class`` "flex space-x-8"] [
                        li [] [a [attr.href "/"; attr.``class`` "text-gray-600 hover:text-blue-500 font-medium transition duration-300"] [text "Home"]]
                    ]
                ]
                
                // Right: Login CTA Button / User Profile
                div [attr.``class`` "flex justify-end"] [
                    WebSharper.UI.ClientServer.client (Client.NavBarAuthWidget())
                ]
            ]
        ]
        
    let Footer () =
        footer [attr.``class`` "bg-transparent py-8 mt-auto text-gray-500 text-center text-sm"] [
            p [] [text "© 2026 Due Alpha Platform. All Rights Reserved."]
        ]

module Templating =
    type MainTemplate = Templating.Template<"Main.html", ClientLoad.FromDocument, ServerLoad.WhenChanged>

module Site =
    open type WebSharper.UI.ClientServer

    let GenericPage ctx (title: string) comp =
        Templating.MainTemplate()
            .Title(title)
            .Body([
                Components.NavBar()
                
                div [attr.``class`` "container mx-auto flex-grow px-4 py-12 flex items-center justify-center"] [
                    div [attr.``class`` "w-full"] [
                        comp
                    ]
                ]

                Components.Footer()
            ])
            .Doc()
        |> Content.Page

    [<Website>]
    let Main =
        Application.MultiPage (fun ctx endpoint ->
            match endpoint with
            | EndPoint.Home -> GenericPage ctx "Home" (WebSharper.UI.ClientServer.client (Client.HomeHero()))
            | EndPoint.Auth -> GenericPage ctx "Authentication" (WebSharper.UI.ClientServer.client (Client.AuthCard()))
            | EndPoint.ForgotPassword -> GenericPage ctx "Reset Password" (WebSharper.UI.ClientServer.client (Client.ForgotPassword()))
            | EndPoint.VerifyEmail token -> GenericPage ctx "Verification" (WebSharper.UI.ClientServer.client (Client.VerifyEmail(token)))
            | EndPoint.MagicLogin token -> GenericPage ctx "Magic Login" (WebSharper.UI.ClientServer.client (Client.MagicLogin(token)))
            | EndPoint.ChangePassword -> GenericPage ctx "Set New Password" (WebSharper.UI.ClientServer.client (Client.ChangePassword()))
        )

