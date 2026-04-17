namespace WebSharperApp

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI
open WebSharper.UI.Server
open WebSharper.UI.Templating
open WebSharper.UI.Html

module Components =
    
    let NavBar (activePage: string) =
        nav [attr.``class`` "neo-flat rounded-full m-6 px-8 py-4 sticky top-6 z-50"] [
            div [attr.``class`` "mx-auto grid grid-cols-3 items-center"] [
                // Left: Logo
                div [attr.``class`` "flex justify-start"] [
                    a [attr.href "/"; attr.``class`` "text-2xl font-bold text-gray-800 tracking-widest uppercase"] [text "Due Alpha"]
                ]
                
                // Center: Navigation Menu
                div [attr.``class`` "flex justify-center"] [
                    ul [attr.``class`` "flex space-x-8"] [
                        let homeClass = 
                            "font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform active:scale-95 " +
                            if activePage = "Home" then "neo-pressed text-emerald-600 translate-y-px"
                            else "neo-flat text-gray-600 hover:text-gray-900 hover:neo-level-2"
                        li [] [a [attr.href "/"; attr.``class`` homeClass] [text "Home"]]
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

    /// <summary>Dynamic root-level HTML injection wrapper executing localized Client.fs interactive logic specifically within the global structurally styled Neomorphic boundary dynamically.</summary>
    let GenericPage ctx (title: string) comp =
        Templating.MainTemplate()
            .Title(title)
            .Body([
                Components.NavBar(title)
                
                div [attr.``class`` "container mx-auto flex-grow px-4 py-12 flex items-center justify-center"] [
                    div [attr.``class`` "w-full"] [
                        comp
                    ]
                ]

                Components.Footer()
            ])
            .Doc()
        |> Content.Page

    /// <summary>Standalone layout structurally isolating authenticated environments explicitly completely bypassing public Navbars or isolated structural Footers.</summary>
    let DashboardPage ctx (title: string) comp =
        Templating.MainTemplate()
            .Title(title)
            .Body([ 
                comp
                WebSharper.UI.ClientServer.client (Client.RenderToast())
            ])
            .Doc()
        |> Content.Page

    [<Website>]
    let Main =
        Application.MultiPage (fun (ctx: Context<EndPoint>) (endpoint: EndPoint) ->
            printfn "Matched Endpoint: %A" endpoint
            match endpoint with
            | EndPoint.Home -> GenericPage ctx "Home" (WebSharper.UI.ClientServer.client (Client.HomeHero()))
            | EndPoint.Auth -> GenericPage ctx "Authentication" (WebSharper.UI.ClientServer.client (Client.AuthCard()))
            | EndPoint.ForgotPassword -> GenericPage ctx "Reset Password" (WebSharper.UI.ClientServer.client (Client.ForgotPassword()))
            | EndPoint.VerifyEmail token -> GenericPage ctx "Verification" (WebSharper.UI.ClientServer.client (Client.VerifyEmail(token)))
            | EndPoint.MagicLogin token -> GenericPage ctx "Magic Login" (WebSharper.UI.ClientServer.client (Client.MagicLogin(token)))
            | EndPoint.ChangePassword -> GenericPage ctx "Set New Password" (WebSharper.UI.ClientServer.client (Client.ChangePassword()))
            | EndPoint.Dashboard -> DashboardPage ctx "Dashboard" (WebSharper.UI.ClientServer.client (Client.Dashboard()))
            | EndPoint.Planner -> DashboardPage ctx "Planner" (WebSharper.UI.ClientServer.client (Client.PlannerPage()))
            | EndPoint.Calendar -> DashboardPage ctx "Calendar" (WebSharper.UI.ClientServer.client (Client.CalendarPage()))
            | EndPoint.Products -> DashboardPage ctx "Products" (WebSharper.UI.ClientServer.client (Client.ProductsPage()))
            | EndPoint.Recipes -> DashboardPage ctx "Recipes" (WebSharper.UI.ClientServer.client (Client.RecipesPage()))
            | EndPoint.Records -> DashboardPage ctx "Records" (WebSharper.UI.ClientServer.client (Client.RecordsPage()))
            | EndPoint.Settings -> DashboardPage ctx "Settings" (WebSharper.UI.ClientServer.client (Client.SettingsPanel()))
            | EndPoint.Profile username -> GenericPage ctx (sprintf "@%s" username) (WebSharper.UI.ClientServer.client (Client.ProfilePage(username)))
            | EndPoint.VerifyEmailChange token -> GenericPage ctx "Verify Email Change" (WebSharper.UI.ClientServer.client (Client.VerifyEmailChange(token)))
        )

