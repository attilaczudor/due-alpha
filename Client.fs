namespace WebSharperApp

open WebSharper
open WebSharper.UI
open WebSharper.UI.Html
open WebSharper.UI.Client
open WebSharper.JavaScript

[<JavaScript>]
module Client =
    
    [<JavaScript>]
    type ToastType = Success | Error | Warning | Info

    [<JavaScript>]
    type ToastMsg = { Content: string; Type: ToastType }

    [<JavaScript>]
    let private currentToast = Var.Create (None: ToastMsg option)

    [<JavaScript>]
    let isMenuCollapsed = Var.Create false

    [<JavaScript>]
    let disableTransitionsOnLoad () =
        async {
            JS.Document.Body.ClassList.Add("no-transitions")
            do! Async.Sleep 300
            JS.Document.Body.ClassList.Remove("no-transitions")
        } |> Async.StartImmediate

    [<JavaScript>]
    let showToast content t =
        currentToast.Value <- Some { Content = content; Type = t }
        async {
            do! Async.Sleep 3500
            // Only clear if it's the same message (prevents premature clearing of a new toast)
            match currentToast.Value with
            | Some m when m.Content = content -> currentToast.Value <- None
            | _ -> ()
        } |> Async.StartImmediate

    [<JavaScript>]
    let RenderToast () =
        currentToast.View |> View.Map (fun toast ->
            match toast with
            | Some t ->
                let colorClass = 
                    match t.Type with
                    | Success -> "text-emerald-600"
                    | Error -> "text-red-500"
                    | Warning -> "text-yellow-500"
                    | Info -> "text-blue-500"
                
                let icon = 
                    match t.Type with
                    | Success -> Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>"""
                    | Error -> Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>"""
                    | Warning -> Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>"""
                    | Info -> Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>"""

                let borderClass = 
                    match t.Type with
                    | Success -> "border-emerald-500"
                    | Error -> "border-red-500"
                    | Warning -> "border-yellow-500"
                    | Info -> "border-blue-500"

                let titleText = 
                    match t.Type with
                    | Success -> "Success"
                    | Error -> "Error"
                    | Warning -> "Warning"
                    | Info -> "Info"

                div [attr.``class`` "toast-container"] [
                    div [attr.``class`` ("toast-item neo-flat p-5 rounded-3xl animate-toast flex items-center space-x-4 border-l-4 " + borderClass)] [
                        div [attr.``class`` ("w-10 h-10 rounded-full neo-pressed flex items-center justify-center " + colorClass)] [icon]
                        div [attr.``class`` "flex-1"] [
                            h4 [attr.``class`` "text-xs font-black uppercase tracking-widest text-gray-500 mb-1"] [
                                text titleText
                            ]
                            p [attr.``class`` "text-sm font-bold text-gray-800"] [text t.Content]
                        ]
                    ]
                ]
            | None -> Doc.Empty
        ) |> Doc.EmbedView

    let getMoonInfo (date: System.DateTime) =
        // Reference: Known New Moon on Jan 6, 2000, 18:14 UTC
        let knownNewMoon = new System.DateTime(2000, 1, 6, 18, 14, 0)
        let lunarCycle = 29.530588
        let daysSince = (date - knownNewMoon).TotalDays
        let phase = daysSince % lunarCycle
        let normalizedPhase = if phase < 0.0 then phase + lunarCycle else phase
        
        let illumination = 
            let halfCycle = lunarCycle / 2.0
            if normalizedPhase <= halfCycle then
                (normalizedPhase / halfCycle) * 100.0
            else
                (1.0 - (normalizedPhase - halfCycle) / halfCycle) * 100.0

        // Divide the 29.53 day cycle into 8 distinct phases
        let (icon, label, isMajor) = 
            if normalizedPhase < 1.0 || normalizedPhase > 28.53 then ("🌑", "New Moon", true)
            elif normalizedPhase >= 6.38 && normalizedPhase <= 8.38 then ("🌓", "1st Quarter", true)
            elif normalizedPhase >= 13.76 && normalizedPhase <= 15.76 then ("🌕", "Full Moon", true)
            elif normalizedPhase >= 21.14 && normalizedPhase <= 23.14 then ("🌗", "Last Quarter", true)
            elif normalizedPhase < 7.4 then ("🌒", "Waxing Crescent", false)
            elif normalizedPhase < 14.8 then ("🌔", "Waxing Gibbous", false)
            elif normalizedPhase < 22.1 then ("🌖", "Waning Gibbous", false)
            else ("🌘", "Waning Crescent", false)
        
        let displayDetail = if isMajor then label else sprintf "%d%%" (int illumination)
        (icon, displayDetail, label)

    let getRecentNewMoon (date: System.DateTime) =
        let knownNewMoon = new System.DateTime(2000, 1, 6, 18, 14, 0)
        let lunarCycle = 29.530588
        let diff = (date - knownNewMoon).TotalDays
        let cycles = System.Math.Floor(diff / lunarCycle)
        knownNewMoon.AddDays(cycles * lunarCycle).Date

    let getWeekNumber (d: System.DateTime) =
        // ISO 8601 week calculation
        let day = int d.DayOfWeek
        let dayAdjusted = if day = 0 then 7 else day
        let d2 = d.AddDays(float (4 - dayAdjusted))
        let firstDayOfYear = new System.DateTime(d2.Year, 1, 1)
        int (System.Math.Floor((d2 - firstDayOfYear).TotalDays / 7.0) + 1.0)

    let getSeason (d: System.DateTime) =
        let m, day = d.Month, d.Day
        if (m = 12 && day >= 21) || (m < 3) || (m = 3 && day < 20) then "Winter"
        elif (m = 3 && day >= 20) || (m < 6) || (m = 6 && day < 21) then "Spring"
        elif (m = 6 && day >= 21) || (m < 9) || (m = 9 && day < 22) then "Summer"
        else "Autumn"

    let getSeasonIconWithSeason (season: string) =
        match season with
        | "Winter" -> "❄️"
        | "Spring" -> "🌱"
        | "Summer" -> "☀️"
        | "Autumn" -> "🍂"
        | _ -> "❄️"

    let getSeasonTheme (season: string) (prefix: string) (shade: string) =
        match season with
        | "Winter" -> sprintf "%s-blue-%s" prefix shade
        | "Spring" -> sprintf "%s-emerald-%s" prefix shade
        | "Summer" -> sprintf "%s-orange-%s" prefix shade // Use orange for summer sun
        | "Autumn" -> sprintf "%s-orange-%s" prefix shade
        | _ -> sprintf "%s-blue-%s" prefix shade

    [<JavaScript>]
    module Neo =
        let Button (content: seq<Doc>) (accent: View<string>) (onClick: unit -> unit) =
            button [
                attr.classDyn (accent |> View.Map (fun a -> 
                    // Default: elevation 1, Hover: elevation 2, Pressed: elevation 1
                    sprintf "bg-transparent neo-level-1 hover:neo-level-2 active:neo-level-1 px-6 py-3 rounded-xl %s font-bold transition-all duration-300 active:scale-95 transform" a))
                on.click (fun _ _ -> onClick())
            ] content

        let FullWidthButton (content: seq<Doc>) (accent: View<string>) (onClick: unit -> unit) =
            button [
                attr.classDyn (accent |> View.Map (fun a -> 
                    sprintf "bg-transparent w-full neo-level-1 hover:neo-level-2 active:neo-level-1 px-6 py-3 rounded-xl %s font-bold transition-all duration-300 active:scale-95 transform" a))
                on.click (fun _ _ -> onClick())
            ] content

        let IconButton (icon: Doc) (accentHover: View<string>) (onClick: unit -> unit) =
            button [
                attr.classDyn (accentHover |> View.Map (fun ah -> 
                    sprintf "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 neo-level-0 hover:neo-level-2 %s active:scale-90 transform" ah))
                on.click (fun _ _ -> onClick())
            ] [icon]

        let Select<'T when 'T : equality> (options: list<'T>) (current: Var<'T>) (toLabel: 'T -> string) (placeholder: string) (accent: View<string>) (accentHover: View<string>) (isRightAligned: bool) =
            let isOpen = Var.Create false
            div [attr.classDyn (View.Const (if isRightAligned then "relative" else "relative w-full"))] [
                // Click-outside overlay
                isOpen.View |> View.Map (fun openState ->
                    if openState then 
                        div [attr.``class`` "fixed inset-0 z-[130]"; on.click (fun _ _ -> isOpen.Value <- false)] []
                    else Doc.Empty
                ) |> Doc.EmbedView
                
                button [
                    attr.classDyn (accent |> View.Map (fun a -> sprintf "neo-flat px-6 py-4 rounded-2xl flex items-center justify-between space-x-3 %s font-bold transition-all duration-300 w-full" a))
                    on.click (fun _ _ -> isOpen.Value <- not isOpen.Value)
                ] [
                    current.View |> View.Map (fun v -> 
                        let label = toLabel v
                        if System.String.IsNullOrEmpty label || label = "0" then 
                            span [attr.``class`` "text-gray-400 font-medium"] [text placeholder]
                        else text label
                    ) |> Doc.EmbedView
                    Doc.Verbatim """<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>"""
                ]
                isOpen.View |> View.Map (fun openState ->
                    if openState then
                        let alignClass = if isRightAligned then "right-0 w-48" else "left-0 right-0"
                        div [attr.``class`` (sprintf "absolute top-full %s mt-4 neo-flat rounded-3xl p-3 z-[140] overflow-hidden animate-in fade-in zoom-in-95 duration-200" alignClass)] [
                            options |> List.map (fun opt ->
                                div [
                                    attr.classDyn (accentHover |> View.Map (fun ah -> 
                                        let baseC = "p-5 rounded-2xl cursor-pointer transition-all duration-200 font-bold text-gray-700 hover:neo-level-2 "
                                        if current.Value = opt then baseC + "pl-8 text-emerald-600"
                                        else baseC))
                                    on.click (fun _ _ -> current.Value <- opt; isOpen.Value <- false)
                                ] [text (toLabel opt)]
                            ) |> Doc.Concat
                        ]
                    else Doc.Empty
                ) |> Doc.EmbedView
            ]

    let getSeasonalInfo (d: System.DateTime) =
        match d.Month, d.Day with
        | 3, 20 | 3, 21 -> Some ("🌱", "Spring Equinox")
        | 6, 20 | 6, 21 -> Some ("☀️", "Summer Solstice")
        | 9, 22 | 9, 23 -> Some ("🍂", "Autumn Equinox")
        | 12, 21 | 12, 22 -> Some ("❄️", "Winter Solstice")
        | _ -> None

    let renderDate (d: System.DateTime) isMain (onClick: (System.DateTime -> unit) option) =
        let moonIcon, moonDisplay, moonLabel = getMoonInfo d
        let seasonal = getSeasonalInfo d
        let season = getSeason d
        let seasonIcon = getSeasonIconWithSeason season
        let accent = getSeasonTheme season "text" "600"
        let borderAccent = getSeasonTheme season "border" "200"

        div [
            attr.``class`` ((if d.Date = System.DateTime.Today then "p-4 rounded-xl flex flex-col items-center justify-center transition-all neo-flat " else "p-4 rounded-xl flex flex-col items-center justify-center transition-all neo-nav-item ") + 
                (if d.Date = System.DateTime.Today then sprintf "%s font-bold border-2 %s" accent borderAccent else "text-gray-800 cursor-pointer") +
                (if isMain then " min-h-[160px]" else " min-h-[120px] opacity-60"))
            attr.title (match seasonal with Some (_, l) -> sprintf "%s | %s" moonLabel l | _ -> moonLabel)
            match onClick with | Some f -> on.click (fun _ _ -> f d) | None -> Attr.Create "data-no-click" "true"
        ] [
            span [attr.``class`` "text-xs font-bold text-gray-600 uppercase"] [text (d.ToString("ddd"))]
            
            // Season Icon (Persistent)
            div [attr.``class`` "text-[10px] mb-1"] [text seasonIcon]

            // Moon phase
            div [attr.``class`` "flex flex-col items-center mb-1 w-full"] [
                span [attr.``class`` "text-2xl"] [text moonIcon]
                span [attr.``class`` "text-sm font-black text-gray-800 text-center px-2"] [text moonDisplay]
            ]
            // Seasonal Milestone
            match seasonal with
            | Some (icon, label) ->
                div [attr.``class`` "flex flex-col items-center mb-1 w-full"] [
                    span [attr.``class`` "text-base"] [text icon]
                    span [attr.``class`` "text-[8px] font-black text-gray-700 uppercase text-center bg-white/20 rounded px-1 max-w-full truncate"] [text label]
                ]
            | _ -> ()
            
            span [attr.``class`` "text-5xl font-black mt-2"] [text (d.Day.ToString())]
        ]

    
    /// <summary>Baseline visual component injecting uniform Neumorphic shadows and boundary padding into child document projections dynamically.</summary>
    let GlassCard content =
        div [attr.``class`` "w-full max-w-md mx-auto neo-flat p-8 rounded-3xl transform transition-all text-gray-900"] content

    /// <summary>Renders the explicit marketing copy and generic platform identification text prominently locally on public domains.</summary>
    let HomeHero () =
        div [attr.``class`` "text-center neo-flat p-12 rounded-3xl max-w-3xl mx-auto"] [
            h1 [attr.``class`` "text-5xl font-extrabold tracking-tight mb-4 text-gray-900"] [text "Due Alpha Authentication"]
            p [attr.``class`` "text-xl text-gray-700 font-light mb-8"] [text "Secure. Rapid. Magically passwordless."]
        ]

    let CalculatePasswordScore (p: string) =
        if p = "" then 0
        else
            let l = p.Length >= 8 && p.Length <= 16
            let lo = (new WebSharper.JavaScript.RegExp("[a-z]")).Test(p)
            let up = (new WebSharper.JavaScript.RegExp("[A-Z]")).Test(p)
            let d = (new WebSharper.JavaScript.RegExp("[0-9]")).Test(p)
            let s = (new WebSharper.JavaScript.RegExp("""[!@#$%^&*_\-+=?]""")).Test(p)
            let illegal = (new WebSharper.JavaScript.RegExp("""[^a-zA-Z0-9!@#$%^&*_\-+=?]""")).Test(p)
            if illegal then -1 
            else (if l then 1 else 0) + (if lo then 1 else 0) + (if up then 1 else 0) + (if d then 1 else 0) + (if s then 1 else 0)

    let PasswordStrengthView (passwordScore: View<int>) =
        div [] [
            div [attr.``class`` "w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden shadow-inner"] [
                div [
                    attr.classDyn (passwordScore |> View.Map (fun score ->
                        let widthClass = match score with | -1 | 0 -> "w-0" | 1 -> "w-1/5" | 2 -> "w-2/5" | 3 -> "w-3/5" | 4 -> "w-4/5" | 5 -> "w-full" | _ -> "w-0"
                        let colorClass = match score with | -1 | 0 -> "bg-transparent" | 1 | 2 -> "bg-red-500" | 3 -> "bg-orange-500" | 4 -> "bg-yellow-400" | 5 -> "bg-green-500" | _ -> "bg-transparent"
                        "h-full transition-all duration-300 " + widthClass + " " + colorClass
                    ))
                ] []
            ]
            p [
                attr.classDyn (passwordScore |> View.Map (fun score ->
                    if score = -1 then "text-xs text-red-500 font-bold mt-2 pl-2" else "text-xs text-gray-600 mt-2 pl-2"
                ))
            ] [
                textView (passwordScore |> View.Map (fun score ->
                    if score = -1 then "Contains illegal injection characters!" else "Requires 8-16 chars: Upper, Lower, Number, Special (!@#$%^&*_-+=?)."
                ))
            ]
        ]

    /// <summary>Standard visual structural input matrix connecting directly tightly natively unto `Server.LoginUser` to initialize identity states.</summary>
    let LoginForm () =
        let email = Var.Create ""
        let password = Var.Create ""
        let showPassword = Var.Create false
        

        let submit () =
            async {
                let e = email.Value
                let atIdx = e.IndexOf("@")
                let isValid = atIdx > 0 && e.IndexOf(".", atIdx) > atIdx + 1
                if not isValid then
                    showToast "Please provide a valid email address." Error
                else
                    showToast "Logging in..." Info
                    let! res = Server.LoginUser(e, password.Value)
                    match res with
                    | AuthResult.NeedPasswordChange -> JS.Window.Location.Href <- "/change-password"
                    | AuthResult.LoggedIn (user, verified) -> JS.Window.Location.Href <- "/dashboard"
                    | AuthResult.Error err ->
                        showToast err Error
                    | _ -> ()
            } |> Async.StartImmediate

        div [] [
            div [attr.``class`` "mb-5"] [
                label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Email Address"]
                Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 leading-tight focus:outline-none transition" ; attr.name "email" ; attr.``type`` "email"] email
            ]
            div [attr.``class`` "mb-6"] [
                label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Password"]
                div [attr.``class`` "relative w-full"] [
                    Doc.InputType.Text [
                        attr.classDyn (showPassword.View |> View.Map (fun show -> "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 leading-tight focus:outline-none transition pr-12"))
                        attr.typeDyn (showPassword.View |> View.Map (fun show -> if show then "text" else "password"))
                        attr.maxlength "16"
                    ] password
                    button [
                        attr.``type`` "button"
                        attr.``class`` "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"
                        on.click (fun _ _ -> showPassword.Value <- not showPassword.Value)
                    ] [
                        showPassword.View |> View.Map (fun show ->
                            if show then 
                                Doc.Verbatim """<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>"""
                            else 
                                Doc.Verbatim """<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>"""
                        ) |> Doc.EmbedView
                    ]
                ]
                div [attr.``class`` "text-right mt-2"] [
                     a [attr.href "/forgot-password"; attr.``class`` "text-sm text-blue-500 hover:text-blue-800 transition font-medium"] [text "Forgot Password?"]
                ]
            ]
            Neo.FullWidthButton [text "Log In"] (View.Const "text-gray-800") (fun () -> submit())
        ]

    /// <summary>Asynchronously processes user identities into `Server.RegisterUser` natively dynamically updating the underlying form tracking mechanics without traditional DOM reload transitions.</summary>
    let RegistrationForm () =
        let email = Var.Create ""
        let password = Var.Create ""
        let showPassword = Var.Create false
        
        let passwordStrength = password.View |> View.Map CalculatePasswordScore
        
        let emailStrength = email.View |> View.Map (fun e ->
            if e = "" then 0
            else
                let atIdx = e.IndexOf("@")
                if atIdx > 0 then
                    if e.IndexOf(".", atIdx) > atIdx + 1 then 3
                    else 2
                else 1
        )

        let submit () =
            async {
                let e, p = email.Value, password.Value
                let atIdx = e.IndexOf("@")
                let isValid = atIdx > 0 && e.IndexOf(".", atIdx) > atIdx + 1
                let pScore = CalculatePasswordScore p
                
                if not isValid then
                    showToast "Please provide a valid email address." Error
                elif pScore < 5 then
                    showToast "Password does not meet the security requirements." Error
                else
                    showToast "Processing..." Info
                    let! res = Server.RegisterUser(e, p)
                    match res with
                    | AuthResult.LoggedIn (usr, _) ->
                        JS.Window.Location.Href <- "/dashboard"
                    | AuthResult.Error err ->
                        showToast err Error
                    | _ -> ()
            } |> Async.StartImmediate

        div [] [
            div [attr.``class`` "mb-5"] [
                label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Email Address"]
                Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition" ; attr.name "email" ; attr.``type`` "email"] email
                
                div [attr.``class`` "w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden shadow-inner"] [
                    div [
                        attr.classDyn (emailStrength |> View.Map (fun score ->
                            let widthClass = match score with | 0 -> "w-0" | 1 -> "w-1/3" | 2 -> "w-2/3" | 3 -> "w-full" | _ -> "w-0"
                            let colorClass = match score with | 1 -> "bg-red-500" | 2 -> "bg-orange-500" | 3 -> "bg-green-500" | _ -> "bg-transparent"
                            "h-full transition-all duration-300 " + widthClass + " " + colorClass
                        ))
                    ] []
                ]
                p [
                    attr.classDyn (emailStrength |> View.Map (fun score -> 
                        if score = 3 || email.Value = "" then "hidden"  
                        else "text-xs text-red-500 mt-2 pl-2"
                    ))
                ] [text "please provide a valid email address."]
            ]
            div [attr.``class`` "mb-5"] [
                label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Password"]
                div [attr.``class`` "relative w-full"] [
                    Doc.InputType.Text [
                        attr.classDyn (showPassword.View |> View.Map (fun show -> "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition pr-12"))
                        attr.typeDyn (showPassword.View |> View.Map (fun show -> if show then "text" else "password"))
                        attr.maxlength "16"
                    ] password
                    button [
                        attr.``type`` "button"
                        attr.``class`` "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"
                        on.click (fun _ _ -> showPassword.Value <- not showPassword.Value)
                    ] [
                        showPassword.View |> View.Map (fun show ->
                            if show then 
                                Doc.Verbatim """<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>"""
                            else 
                                Doc.Verbatim """<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>"""
                        ) |> Doc.EmbedView
                    ]
                ]
                PasswordStrengthView passwordStrength
            ]
            Neo.FullWidthButton [text "Register Securely"] (View.Const "text-gray-800") (fun () -> submit())
        ]

    /// <summary>Dynamic wrapper automatically toggling securely between natively projected `LoginForm` and `RegistrationForm` identity mechanics gracefully within explicit runtime memory.</summary>
    let AuthCard () =
        let isLogin = Var.Create true
        
        GlassCard [
            let season = View.Const (getSeason System.DateTime.Today)
            let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
            // Tabs
            div [attr.``class`` "flex items-center justify-between space-x-4 mb-8 w-full"] [
                button [
                    attr.classDyn (isLogin.View |> View.Map (fun l -> 
                        let baseC = "w-1/2 py-3 rounded-2xl text-center font-bold outline-none transition-all duration-300 transform active:scale-95 flex items-center justify-center "
                        if l then baseC + "neo-pressed text-emerald-600 translate-y-px" else baseC + "neo-flat text-gray-600 hover:text-gray-900 hover:neo-level-2"
                    ))
                    on.click (fun _ _ -> isLogin.Value <- true)
                ] [text "Login"]
                button [
                    attr.classDyn (isLogin.View |> View.Map (fun l -> 
                        let baseC = "w-1/2 py-3 rounded-2xl text-center font-bold outline-none transition-all duration-300 transform active:scale-95 flex items-center justify-center "
                        if not l then baseC + "neo-pressed text-emerald-600 translate-y-px" else baseC + "neo-flat text-gray-600 hover:text-gray-900 hover:neo-level-2"
                    ))
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

    /// <summary>Structurally isolates explicit user magic link requests safely transmitting inputs deeply backwards synchronously into `Server.TriggerMagicLink` routines.</summary>
    let ForgotPassword () =
        let email = Var.Create ""
        let isSuccess = Var.Create false

        let submit () =
            async {
                showToast "Dispatching magic link..." Info
                let! res = Server.TriggerMagicLink(email.Value)
                match res with
                | AuthResult.Success _ ->
                    isSuccess.Value <- true
                    showToast "If that email exists, a magic link has been sent to it!" Success
                | AuthResult.Error e -> 
                    isSuccess.Value <- false; showToast e Error
                | _ -> ()
            } |> Async.StartImmediate

        GlassCard [
            h2 [attr.``class`` "text-3xl font-extrabold text-gray-900 mb-4 text-center"] [text "Forgot Password"]
            p [attr.``class`` "text-gray-800 text-center mb-8"] [text "Enter your email to receive a magic login link."]
            
            div [attr.classDyn (isSuccess.View |> View.Map (fun s -> if s then "hidden" else "block"))] [
                div [attr.``class`` "mb-6"] [
                    label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Email Address"]
                    Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none" ; attr.name "type" ; attr.``type`` "email"] email
                ]
                let season = View.Const (getSeason System.DateTime.Today)
                let accentBg = season |> View.Map (fun s -> getSeasonTheme s "bg" "100")
                Neo.Button [text "Send Magic Link"] accentBg (fun () -> submit())
            ]
            div [attr.``class`` "text-center mt-6"] [ a [attr.href "/auth"; attr.``class`` "text-sm text-blue-500 font-medium"] [text "Back to Login"] ]
        ]

    /// <summary>Automatic interception controller digesting `token` parameters seamlessly directly unto `Server.AttemptVerifyEmail` instantly providing explicit success confirmations gracefully.</summary>
    let VerifyEmail (token: string) =
        async {
            showToast "Validating token..." Info
            let! res = Server.AttemptVerifyEmail(token)
            match res with
            | AuthResult.Success _ -> showToast "Your email was successfully verified! You may securely browse." Success
            | AuthResult.Error e -> showToast e Error
            | _ -> ()
        } |> Async.StartImmediate

        GlassCard [
            h2 [attr.``class`` "text-2xl font-bold text-center mb-4"] [text "Email Verification"]
            div [attr.``class`` "text-center mt-8"] [ a [attr.href "/"; attr.``class`` "text-blue-500 font-bold hover:underline"] [text "Go Home"] ]
        ]

    /// <summary>Deep context wrapper bypassing explicit standard credential input paths systematically explicitly running identity mappings synchronously.</summary>
    let MagicLogin (token: string) =
        async {
            showToast "Initiating magic entry sequence..." Info
            let! res = Server.AttemptMagicLogin(token)
            match res with
            | AuthResult.NeedPasswordChange -> JS.Window.Location.Href <- "/change-password"
            | AuthResult.Error e -> showToast e Error
            | _ -> ()
        } |> Async.StartImmediate

        GlassCard [
            h2 [attr.``class`` "text-2xl font-bold text-center mb-4"] [text "Authenticating"]
        ]
        
    /// <summary>Restricted isolated structural payload permitting already-verified identities natively explicit modification access securely rewriting physical credentials back unto SQLite asynchronously.</summary>
    let ChangePassword () =
        let newpass = Var.Create ""
        let showPassword = Var.Create false
        let submit () =
            async {
                let p = newpass.Value
                let pScore = CalculatePasswordScore p
                
                if pScore < 5 then
                    showToast "Password does not meet the security requirements." Error
                else
                    showToast "Updating..." Info
                    let! res = Server.ResetPassword(p)
                    match res with
                    | AuthResult.Success _ -> JS.Window.Location.Href <- "/"
                    | AuthResult.Error e -> showToast e Error
                    | _ -> ()
            } |> Async.StartImmediate
            
        GlassCard [
            h2 [attr.``class`` "text-2xl font-bold text-center mb-4 text-gray-900"] [text "Update Forgotten Password"]
            p [attr.``class`` "text-sm text-center text-gray-700 mb-6"] [text "Since you used a Magic Link, you must establish a new password securely."]
            div [attr.``class`` "mb-8"] [
                label [attr.``class`` "block text-gray-800 font-bold mb-3 pl-2"] [text "New Password"]
                div [attr.``class`` "relative w-full"] [
                    Doc.InputType.Text [
                        attr.classDyn (showPassword.View |> View.Map (fun show -> "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition pr-12"))
                        attr.typeDyn (showPassword.View |> View.Map (fun show -> if show then "text" else "password"))
                        attr.maxlength "16"
                    ] newpass
                    button [
                        attr.``type`` "button"
                        attr.``class`` "absolute inset-y-0 right-0 px-4 flex items-center text-gray-700 hover:text-blue-500 transition focus:outline-none"
                        on.click (fun _ _ -> showPassword.Value <- not showPassword.Value)
                    ] [
                        showPassword.View |> View.Map (fun show ->
                            if show then 
                                Doc.Verbatim """<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>"""
                            else 
                                Doc.Verbatim """<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>"""
                        ) |> Doc.EmbedView
                    ]
                ]
                PasswordStrengthView (newpass.View |> View.Map CalculatePasswordScore)
            ]
            let season = View.Const (getSeason System.DateTime.Today)
            let accentBg = season |> View.Map (fun s -> getSeasonTheme s "bg" "100")
            Neo.Button [text "Update Credentials"] accentBg (fun () -> submit())
        ]

    /// <summary>Explicit top-level header logic routinely safely authenticating structural F# cookie variables directly backwards displaying User Verification mechanics natively asynchronously.</summary>
    let NavBarAuthWidget () =
        let state = Var.Create (AuthResult.Error "Loading...")
        async {
            let! res = Server.CheckAuthState()
            state.Value <- res
        } |> Async.StartImmediate

        div [] [
            state.View |> View.Map (fun s ->
                match s with
                | AuthResult.LoggedIn _ ->
                    div [attr.``class`` "flex items-center space-x-4"] [
                        a [
                            attr.href "/dashboard"
                            attr.``class`` "font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform active:scale-95 neo-flat text-gray-600 hover:text-gray-900 hover:neo-level-2"
                        ] [text "Dashboard"]
                    ]
                | _ ->
                    a [
                        attr.href "/auth"
                        attr.``class`` "font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform active:scale-95 neo-flat text-gray-600 hover:text-gray-900 hover:neo-level-2"
                    ] [text "Login"]
            ) |> Doc.EmbedView
        ]

    /// <summary>Global structural internal application routing safely inherently isolating authenticated endpoints projecting Neomorphic sidebar UI natively without refreshing.</summary>
    let Sidebar (active: string) (username: Var<string>) (season: View<string>) (isCollapsed: View<bool>) (onToggle: unit -> unit) =
        let getInitials (u: string) = if u.Length > 0 then u.Substring(0, 1).ToUpper() else "U"
        
        let accentText = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
        let accentHover = season |> View.Map (fun s -> getSeasonTheme s "hover:text" "500")
        let accentBg = season |> View.Map (fun s -> getSeasonTheme s "bg" "100")

        let items = [
            ("Dashboard", "/dashboard", """<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>""")
            ("Planner", "/planner", """<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>""")
            ("Calendar", "/calendar", """<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>""")
            ("Products", "/products", """<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path>""")
            ("Recipes", "/recipes", """<path d="M18 20V6a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2z"></path><path d="M18 20l4-4"></path><path d="M18 6l4 4"></path>""")
            ("Records", "/records", """<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>""")
        ]

        div [
            attr.classDyn (isCollapsed |> View.Map (fun collapsed -> 
                let baseC = "neo-flat flex flex-col justify-between m-6 "
                if collapsed then baseC + "w-20 p-4 rounded-full" else baseC + "w-64 p-5 rounded-[2rem]"
            ))
        ] [
            div [attr.``class`` "w-full"] [
                ul [
                    attr.classDyn (isCollapsed |> View.Map (fun collapsed -> 
                        let baseC = "flex flex-col space-y-4 mt-8 w-full "
                        if collapsed then baseC + "items-center" else baseC + "items-stretch"
                    ))
                ] [
                    for (name, url, iconPaths) in items do
                        li [
                            attr.classDyn (View.Map2 (fun s collapsed -> 
                                let baseClass = "cursor-pointer flex items-center transition-none duration-0 "
                                if active = name then 
                                    let shapeClass = if collapsed then "w-12 h-12 rounded-full justify-center" else "w-full p-4 rounded-2xl space-x-4"
                                    baseClass + "neo-pressed text-emerald-600 " + shapeClass
                                else
                                    let shapeClass = if collapsed then "w-12 h-12 rounded-full justify-center" else "w-full p-4 rounded-2xl space-x-4"
                                    baseClass + "text-gray-700 neo-level-0 hover:neo-level-2 active:neo-pressed hover:text-emerald-600 " + shapeClass
                            ) season isCollapsed)
                            on.click (fun _ _ -> JS.Window.Location.Href <- url)
                        ] [
                            Doc.Verbatim (sprintf """<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">%s</svg>""" iconPaths)
                            isCollapsed |> View.Map (fun collapsed -> 
                                if not collapsed then span [attr.``class`` "ml-4 font-bold text-sm"] [text name]
                                else Doc.Empty
                            ) |> Doc.EmbedView
                        ]
                ]
            ]
            
            // Bottom Section: Action Buttons (Avatar, Settings, Collapse)
            div [
                attr.classDyn (isCollapsed |> View.Map (fun collapsed -> 
                    if collapsed then "flex flex-col items-center space-y-4 w-full" 
                    else "flex items-center justify-between w-full"
                ))
            ] [
                // Avatar Button (Links to Public Profile)
                let userInitials = Var.Create "U"
                let userProfileUrl = Var.Create "/settings"
                
                async {
                    let! settings = Server.GetUserSettings()
                    let! auth = Server.CheckAuthState()
                    match auth with
                    | AuthResult.LoggedIn (u, _) -> 
                        userInitials.Value <- getInitials u
                        userProfileUrl.Value <- sprintf "/@%s" u
                    | _ -> ()
                } |> Async.StartImmediate

                button [
                    attr.classDyn (userProfileUrl.View |> View.Map (fun _ -> 
                        "w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center neo-level-0 hover:neo-level-2 p-0 overflow-hidden font-bold cursor-pointer active:scale-90 active:neo-pressed transition-none duration-0"))
                    on.click (fun _ _ -> JS.Window.Location.Href <- userProfileUrl.Value)
                ] [
                    let v = Var.Create (Doc.Empty)
                    async {
                        let! settings = Server.GetUserSettings()
                        v.Value <-
                            match settings.AvatarUrl with
                            | Some url when not (System.String.IsNullOrWhiteSpace(url)) ->
                                img [attr.src url; attr.``class`` "w-full h-full object-cover"] []
                            | _ -> span [attr.classDyn (season |> View.Map (fun s -> getSeasonTheme s "text" "500"))] [textView userInitials.View]
                    } |> Async.StartImmediate
                    v.View |> Doc.EmbedView
                ]

                // Actions: Gear and Expand/Collapse
                div [
                    attr.classDyn (isCollapsed |> View.Map (fun collapsed -> 
                        if collapsed then "flex flex-col space-y-4 items-center" 
                        else "flex items-center space-x-2"
                    ))
                ] [
                    // Settings Gear
                    button [
                        attr.classDyn (isCollapsed |> View.Map (fun _ ->
                            let baseC = "w-12 h-12 flex items-center justify-center rounded-full cursor-pointer flex-shrink-0 transition-none duration-0 "
                            if active = "Settings" then baseC + "neo-pressed text-emerald-600"
                            else baseC + "text-gray-700 neo-level-0 hover:neo-level-2 active:neo-pressed hover:text-emerald-600"
                        ))
                        on.click (fun _ _ -> JS.Window.Location.Href <- "/settings")
                    ] [
                        Doc.Verbatim """<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>"""
                    ]

                    // Collapse Toggle
                    button [
                        attr.classDyn (isCollapsed |> View.Map (fun _ -> 
                            "w-12 h-12 flex items-center justify-center rounded-full text-gray-700 neo-level-0 hover:neo-level-2 active:neo-pressed cursor-pointer active:scale-90 transition-none duration-0"
                        ))
                        on.click (fun _ _ -> onToggle())
                    ] [
                        isCollapsed |> View.Map (fun collapsed ->
                            if collapsed then Doc.Verbatim """<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>"""
                            else Doc.Verbatim """<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>"""
                        ) |> Doc.EmbedView
                    ]
                ]
            ]
        ]

    let Dashboard () =
        disableTransitionsOnLoad()
        let username = Var.Create "Loading..."
        let season = View.Const (getSeason System.DateTime.Today)
        async {
            let! res = Server.CheckAuthState()
            match res with
            | AuthResult.LoggedIn (u, _) -> username.Value <- u
            | _ -> JS.Window.Location.Href <- "/"
        } |> Async.StartImmediate

        div [attr.``class`` "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0"] [
            Sidebar "Dashboard" username season isMenuCollapsed.View (fun () -> isMenuCollapsed.Value <- not isMenuCollapsed.Value)
            div [attr.``class`` "flex-1 p-10 overflow-y-auto w-full"] [
                h1 [attr.``class`` "text-4xl font-extrabold text-gray-900 mb-6"] [text "Welcome Back!"]
                p [attr.``class`` "text-gray-800"] [text "This is your newly generated workspace dashboard."]
            ]
        ]

    let SettingsPanel () =
        let usernameStatus = Var.Create (None : bool option)
        let usernameMessage = Var.Create ""
        let userSettings = Var.Create { Username = ""; Email = ""; PendingEmail = None; CalendarStartDay = "Monday"; AvatarUrl = None; IsProfilePublic = true }
        let healthSettings = Var.Create { Sex = "Male"; BloodType = ""; JobType = ""; ExerciseFrequency = ""; ExerciseTypes = ""; HeightCm = 175.0; WeightKg = 70.0; BirthYear = 1990; BirthMonth = 1; BirthDay = 1; MealFrequency = 3; DietType = ""; Allergies = ""; OtherAllergies = "" }
        
        let username = Var.Create "Loading..."
        let newUsername = Var.Create ""
        let email = Var.Create "user@example.com"
        let isProfilePublic = Var.Create true
        let activeTab = Var.Create "Account"
        let calendarStartDay = Var.Create "Monday"
        let avatarUrl = Var.Create ""
        let newPassword = Var.Create ""
        let confirmPassword = Var.Create ""
        let isValidEmail (e: string) = e.Length > 3 && e.Contains("@")
        
        // Debounced username check
        newUsername.View 
        |> View.Sink (fun u ->
            if u <> username.Value && u.Length >= 3 then
                async {
                    usernameMessage.Value <- "Checking..."
                    let! available = Server.CheckUsernameAvailability u
                    usernameStatus.Value <- Some available
                    usernameMessage.Value <- if available then "Available" else "Taken"
                } |> Async.StartImmediate
            else
                usernameStatus.Value <- None
                usernameMessage.Value <- ""
        )
        
        let season = View.Const (getSeason System.DateTime.Today)
        let accentText = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
        let accentBg = season |> View.Map (fun s -> getSeasonTheme s "bg" "100")
        let accentHoverCol = season |> View.Map (fun s -> getSeasonTheme s "hover:text" "500")
        

        async {
            let! res = Server.CheckAuthState()
            match res with
            | AuthResult.LoggedIn (u, _) -> 
                username.Value <- u
                newUsername.Value <- u
                let! settings = Server.GetUserSettings()
                userSettings.Value <- settings
                calendarStartDay.Value <- settings.CalendarStartDay
                avatarUrl.Value <- defaultArg settings.AvatarUrl ""
                email.Value <- settings.Email
                isProfilePublic.Value <- settings.IsProfilePublic

                let! health = Server.GetHealthSettings()
                healthSettings.Value <- health
            | _ -> JS.Window.Location.Href <- "/"
        } |> Async.StartImmediate

        // Auto-save calendar settings when changed
        calendarStartDay.View 
        |> View.Sink (fun day ->
            if day <> "Loading..." && username.Value <> "Loading..." then 
                async {
                    let! _ = Server.UpdateUserSettings { userSettings.Value with CalendarStartDay = day; AvatarUrl = Some avatarUrl.Value }
                    ()
                } |> Async.StartImmediate
        )

        let submit () =
            async {
                showToast "Updating..." Info
                let! res = Server.UpdateUsername newUsername.Value
                match res with
                | AuthResult.LoggedIn (u, _) ->
                    username.Value <- u
                    showToast "Profile name updated!" Success
                | AuthResult.Error e ->
                    showToast e Error
                | _ -> ()
            } |> Async.StartImmediate

        let saveHealth () =
            async {
                let! res = Server.SaveHealthSettings healthSettings.Value
                match res with
                | AuthResult.Success _ -> showToast "Health profile saved!" Success
                | AuthResult.Error e -> showToast e Error
                | _ -> ()
            } |> Async.StartImmediate

        let saveButton textContent =
            button [
                attr.``class`` "w-full py-4 mt-6 rounded-2xl font-bold text-gray-700 transition-all duration-300 neo-level-1 hover:neo-level-2 active:neo-pressed active:translate-y-px"
                on.click (fun _ _ -> saveHealth())
            ] [text textContent]

        let healthTab () =
            div [attr.``class`` "flex flex-col lg:flex-row gap-8 w-full max-w-7xl"] [
                // Box 1: Health Information
                div [attr.``class`` "flex-1 neo-flat p-8 rounded-3xl flex flex-col"] [
                    h3 [attr.``class`` "text-lg font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4"] [text "Health Information"]
                    
                    div [attr.``class`` "space-y-8"] [
                        // Biological Sex
                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-4 pl-2"] [text "Biological Sex"]
                            div [attr.``class`` "flex space-x-4"] [
                                for sex in ["Male"; "Female"] do
                                    button [
                                        attr.classDyn (healthSettings.View |> View.Map (fun hs -> 
                                            let baseClass = "flex-1 py-4 rounded-2xl font-bold transition-all duration-300 "
                                            if hs.Sex = sex then baseClass + "neo-pressed text-emerald-600"
                                            else baseClass + "neo-flat text-gray-600 hover:text-gray-900"
                                        ))
                                        on.click (fun _ _ -> healthSettings.Value <- { healthSettings.Value with Sex = sex })
                                    ] [text sex]
                            ]
                        ]

                        // Dropdowns
                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Blood Type"]
                            Neo.Select ["A+"; "A-"; "B+"; "B-"; "AB+"; "AB-"; "O+"; "O-"] 
                                (healthSettings.Lens (fun hs -> hs.BloodType) (fun hs v -> { hs with BloodType = v })) 
                                id "Select Bloodtype" accentText accentBg false
                        ]

                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Type of Job"]
                            Neo.Select ["Sedentary"; "Lightly Active"; "Moderately Active"; "Very Active"; "Extreme"] 
                                (healthSettings.Lens (fun hs -> hs.JobType) (fun hs v -> { hs with JobType = v })) 
                                id "Select Type of Job" accentText accentBg false
                        ]

                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Exercise Frequency"]
                            Neo.Select ["Never"; "1-2 times/week"; "3-4 times/week"; "Daily"] 
                                (healthSettings.Lens (fun hs -> hs.ExerciseFrequency) (fun hs v -> { hs with ExerciseFrequency = v })) 
                                id "Select Exercise Frequency" accentText accentBg false
                        ]

                        // Multiselect Exercise Types
                        healthSettings.View |> View.Map (fun hs ->
                            if hs.ExerciseFrequency <> "Never" then
                                div [] [
                                    label [attr.``class`` "block text-gray-800 text-sm font-bold mb-4 pl-2"] [text "Type of Exercise"]
                                    div [attr.``class`` "flex flex-wrap gap-3"] [
                                        for exercise in ["Running"; "Swimming"; "Cycling"; "Gym"; "Yoga"; "Sports"; "Hiking"; "Pilates"] do
                                            button [
                                                let baseClass = "py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 "
                                                let selected = hs.ExerciseTypes.Split([|','|], System.StringSplitOptions.RemoveEmptyEntries)
                                                attr.``class`` (if selected |> Array.contains exercise then baseClass + "neo-pressed text-emerald-600" else baseClass + "neo-flat text-gray-600 hover:text-emerald-400")
                                                on.click (fun _ _ -> 
                                                    let current = healthSettings.Value.ExerciseTypes.Split([|','|], System.StringSplitOptions.RemoveEmptyEntries)
                                                    let next = 
                                                        if current |> Array.contains exercise then current |> Array.filter (fun e -> e <> exercise)
                                                        else Array.append current [|exercise|]
                                                    healthSettings.Value <- { healthSettings.Value with ExerciseTypes = String.concat "," next }
                                                )
                                            ] [text exercise]
                                    ]
                                ]
                            else Doc.Empty
                        ) |> Doc.EmbedView
                    ]
                    div [attr.``class`` "mt-auto pt-6"] [
                        saveButton "Save"
                    ]
                ]
                
                // Box 2: Meal Preferences
                div [attr.``class`` "flex-1 neo-flat p-8 rounded-3xl flex flex-col"] [
                    h3 [attr.``class`` "text-lg font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4"] [text "Meal Preferences"]
                    
                    div [attr.``class`` "space-y-8"] [
                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Meals per day"]
                            Doc.InputType.Text [
                                WebSharper.UI.Attr.Create "type" "number"
                                attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition mb-2"
                                attr.min "1"
                                attr.max "10"
                            ] (healthSettings.Lens 
                                (fun hs -> string hs.MealFrequency) 
                                (fun hs v -> 
                                    match System.Int32.TryParse(v) with
                                    | true, n -> { hs with MealFrequency = max 1 (min 10 n) }
                                    | _ -> hs
                                ))
                            p [attr.``class`` "text-xs text-gray-500 pl-2"] [text "How many times do you want to eat per day (1-10)?"]
                        ]
                        
                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Diet Preference"]
                            Neo.Select ["None"; "Keto"; "Vegan"; "Vegetarian"; "Paleo"; "Mediterranean"] 
                                (healthSettings.Lens (fun hs -> hs.DietType) (fun hs v -> { hs with DietType = v })) 
                                id "Select Diet" accentText accentBg false
                        ]
                    ]
                    div [attr.``class`` "mt-auto pt-6"] [
                        saveButton "Save"
                    ]
                ]

                // Box 3: Allergies
                div [attr.``class`` "flex-1 neo-flat p-8 rounded-3xl flex flex-col"] [
                    h3 [attr.``class`` "text-lg font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4"] [text "Allergies"]
                    
                    div [attr.``class`` "space-y-8"] [
                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-4 pl-2"] [text "Common Allergies"]
                            div [attr.``class`` "flex flex-wrap gap-3"] [
                                for allergy in ["None"; "Gluten"; "Dairy"; "Nuts"; "Other"] do
                                    button [
                                        attr.classDyn (healthSettings.View |> View.Map (fun hs -> 
                                            let baseClass = "py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 "
                                            let selected = hs.Allergies.Split([|','|], System.StringSplitOptions.RemoveEmptyEntries)
                                            if selected |> Array.contains allergy then baseClass + "neo-pressed text-emerald-600"
                                            else baseClass + "neo-flat text-gray-600 hover:text-gray-900"
                                        ))
                                        on.click (fun _ _ -> 
                                            let current = healthSettings.Value.Allergies.Split([|','|], System.StringSplitOptions.RemoveEmptyEntries)
                                            let next = 
                                                if allergy = "None" then [|"None"|]
                                                else
                                                    let withoutNone = current |> Array.filter (fun a -> a <> "None")
                                                    if withoutNone |> Array.contains allergy then 
                                                        withoutNone |> Array.filter (fun a -> a <> allergy)
                                                    else 
                                                        Array.append withoutNone [|allergy|]
                                            healthSettings.Value <- { healthSettings.Value with Allergies = String.concat "," next }
                                        )
                                    ] [text allergy]
                                
                                healthSettings.View |> View.Map (fun hs ->
                                    let selected = hs.Allergies.Split([|','|], System.StringSplitOptions.RemoveEmptyEntries)
                                    if selected |> Array.contains "Other" then
                                        Doc.InputType.Text [
                                            attr.``class`` "neo-pressed rounded-xl py-3 px-5 text-sm font-bold text-gray-800 focus:outline-none transition min-w-[120px]"
                                            attr.placeholder "Specify..."
                                        ] (healthSettings.Lens (fun h -> h.OtherAllergies) (fun h v -> { h with OtherAllergies = v }))
                                    else Doc.Empty
                                ) |> Doc.EmbedView
                            ]
                        ]
                    ]
                    div [attr.``class`` "mt-auto pt-6"] [
                        saveButton "Save"
                    ]
                ]
            ]

        let accountTab () =
            div [attr.``class`` "max-w-md w-full"] [
                 div [attr.``class`` "neo-flat p-8 rounded-3xl mb-8"] [
                    
                    // Avatar Upload Section
                    div [attr.``class`` "flex flex-col items-center justify-center mb-10 w-full"] [
                        div [attr.``class`` "relative group"] [
                            div [attr.``class`` "w-32 h-32 rounded-full neo-level-1 hover:neo-level-2 transition-all duration-300 flex items-center justify-center text-4xl font-bold overflow-hidden cursor-pointer relative"] [
                                avatarUrl.View |> View.Map (fun url ->
                                    if System.String.IsNullOrWhiteSpace(url) then
                                        username.View |> View.Map (fun u -> if u.Length > 0 then u.Substring(0,1).ToUpper() else "U") |> textView
                                    else
                                        img [attr.src url; attr.``class`` "w-full h-full object-cover"] []
                                ) |> Doc.EmbedView
                                
                                // Hidden file input covering the whole avatar
                                Elt.input [
                                    attr.``type`` "file"
                                    attr.accept "image/*"
                                    attr.``class`` "absolute inset-0 opacity-0 cursor-pointer w-full h-full z-50"
                                    on.change (fun el _ ->
                                        JS.Inline("""
                                            var file = $0.files[0];
                                            if (file) {
                                                var reader = new FileReader();
                                                reader.onload = function(e) {
                                                    $1(e.target.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        """, el, fun (b64: string) ->
                                            async {
                                                showToast "Uploading avatar..." Info
                                                let! res = Server.UploadAvatarBase64(b64)
                                                match res with
                                                | Result.Ok newUrl -> 
                                                    avatarUrl.Value <- newUrl
                                                    userSettings.Value <- { userSettings.Value with AvatarUrl = Some newUrl }
                                                    showToast "Avatar updated!" Success
                                                | Result.Error e -> showToast e Error
                                            } |> Async.StartImmediate
                                        )
                                    )
                                ] []
                            ]
                        ]
                    ]
                    
                    div [attr.``class`` "h-px w-full bg-white opacity-40 my-10"] []

                    // Username Section
                    div [attr.``class`` "space-y-4"] [
                        label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Username"]
                        div [attr.``class`` "relative"] [
                            Doc.InputType.Text [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition"] newUsername
                            div [attr.``class`` "absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2"] [
                                usernameStatus.View |> View.Map (fun status ->
                                    match status with
                                    | Some true -> Doc.Verbatim """<svg class="w-5 h-5 text-emerald-500 animate-in fade-in zoom-in" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>"""
                                    | Some false -> Doc.Verbatim """<svg class="w-5 h-5 text-red-500 animate-in fade-in zoom-in" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>"""
                                    | None -> Doc.Empty
                                ) |> Doc.EmbedView
                            ]
                        ]
                        Neo.FullWidthButton [text "Save"] (View.Const "text-gray-800") (fun () -> submit())
                    ]
                    
                    div [attr.``class`` "h-px w-full bg-white opacity-40 my-10"] []

                    // Email Address Section
                    div [attr.``class`` "space-y-4"] [
                        label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Email Address"]
                        div [attr.``class`` "relative w-full"] [
                            Doc.InputType.Email [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition"] email
                            div [attr.``class`` "pt-2"] [
                                div [attr.``class`` "h-1 w-full bg-gray-200 rounded-full overflow-hidden"] [
                                    div [
                                        attr.classDyn (email.View |> View.Map (fun e -> 
                                            if isValidEmail e then "h-full bg-emerald-500 transition-all duration-300 w-full"
                                            else if e.Length > 0 then "h-full bg-red-500 transition-all duration-300 w-1/4"
                                            else "h-full bg-transparent"
                                        ))
                                    ] []
                                ]
                            ]
                        ]
                        Neo.FullWidthButton [text "Save"] (View.Const "text-gray-800") (fun () -> 
                            if not (isValidEmail email.Value) then showToast "Invalid email!" Error
                            else
                                async {
                                    let! res = Server.ChangeEmailDirect(email.Value)
                                    match res with
                                    | AuthResult.Success _ -> showToast "Email updated!" Success
                                    | AuthResult.Error e -> showToast e Error
                                    | _ -> ()
                                } |> Async.StartImmediate
                        )
                    ]
                    
                    div [attr.``class`` "h-px w-full bg-white opacity-40 my-10"] []

                    // Change Password Section
                    div [attr.``class`` "space-y-4"] [
                        label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "Change Password"]
                        div [attr.``class`` "relative"] [
                            Doc.InputType.Password [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition"; attr.placeholder "New Password"] newPassword
                        ]
                        div [attr.``class`` "relative"] [
                            Doc.InputType.Password [attr.``class`` "neo-pressed rounded-xl w-full py-3 px-5 text-gray-800 focus:outline-none transition"; attr.placeholder "Confirm Password"] confirmPassword
                        ]
                        PasswordStrengthView (newPassword.View |> View.Map CalculatePasswordScore)
                        Neo.FullWidthButton [text "Update Password"] (View.Const "text-gray-800") (fun () -> 
                            if newPassword.Value <> confirmPassword.Value then showToast "Passwords do not match!" Error
                            else if newPassword.Value = "" then showToast "Password cannot be empty!" Error
                            else 
                                async {
                                    let! res = Server.ChangePassword(newPassword.Value)
                                    match res with
                                    | AuthResult.Success _ -> showToast "Password updated!" Success; newPassword.Value <- ""; confirmPassword.Value <- ""
                                    | AuthResult.Error e -> showToast e Error
                                    | _ -> ()
                                } |> Async.StartImmediate
                        )
                    ]
                    
                    div [attr.``class`` "h-px w-full bg-white opacity-40 my-10"] []

                    // Profile Privacy Switch
                    div [attr.``class`` "flex items-center justify-between"] [
                        div [] [
                            label [attr.``class`` "block text-gray-800 text-sm font-bold mb-1 pl-2"] [text "Public Profile"]
                            p [attr.``class`` "text-xs text-gray-500 pl-2"] [text "Make your @username profile available to others."]
                        ]
                        label [attr.``class`` "cursor-pointer relative"] [
                            Doc.InputType.CheckBox [
                                attr.``class`` "sr-only peer"
                                on.change (fun _ _ ->
                                    async {
                                        let! res = Server.ToggleProfilePublic(isProfilePublic.Value)
                                        match res with
                                        | AuthResult.Success _ -> showToast "Privacy updated!" Success
                                        | AuthResult.Error e -> showToast e Error
                                        | _ -> ()
                                    } |> Async.StartImmediate
                                )
                            ] isProfilePublic
                            div [attr.``class`` "w-11 h-6 neo-pressed rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:neo-level-1 after:bg-[#e0e5ec] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"] []
                        ]
                    ]
                ]
            ]

        let calendarTab () =
            div [attr.``class`` "max-w-md w-full"] [
                div [attr.``class`` "neo-flat p-8 rounded-3xl"] [
                    h3 [attr.``class`` "text-lg font-bold text-gray-800 mb-6"] [text "Calendar Preferences"]
                    
                    div [attr.``class`` "mb-6"] [
                        label [attr.``class`` "block text-gray-800 text-sm font-bold mb-3 pl-2"] [text "First day of the week"]
                        Neo.Select ["Monday"; "Sunday"; "Saturday"] calendarStartDay id "Select Day" accentText accentBg false
                    ]

                    Neo.Button [text "Update Calendar"] accentBg (fun () -> 
                        async {
                            let! res = Server.UpdateUserSettings { userSettings.Value with CalendarStartDay = calendarStartDay.Value }
                            match res with
                            | AuthResult.Success _ -> showToast "Calendar settings saved!" Success
                            | AuthResult.Error e -> showToast e Error
                            | _ -> ()
                        } |> Async.StartImmediate
                    )
                ]
            ]

        let otherTab () =
            div [attr.``class`` "max-w-md w-full"] [
                div [attr.``class`` "neo-flat p-10 rounded-3xl flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 bg-opacity-30"] [
                    span [attr.``class`` "text-4xl mb-4 grayscale opacity-40"] [text "⚙️"]
                    p [attr.``class`` "text-gray-500 italic font-medium"] [text "Additional settings will appear here soon."]
                ]
            ]

        disableTransitionsOnLoad()
        div [attr.``class`` "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0"] [
            Sidebar "Settings" username season isMenuCollapsed.View (fun () -> isMenuCollapsed.Value <- not isMenuCollapsed.Value)
            div [attr.``class`` "flex-1 p-10 overflow-y-auto w-full flex flex-col"] [
                h1 [attr.``class`` "text-4xl font-extrabold text-gray-900 mb-10"] [text "Settings"]
                
                // Tabs Navigation Header
                div [attr.``class`` "flex items-center justify-between mb-10"] [
                    div [attr.``class`` "flex flex-wrap gap-4"] [
                        let tabs = [
                            ("Account", """<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>""")
                            ("Health", """<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>""")
                            ("Calendar", """<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>""")
                            ("Other", """<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>""")
                        ]
                        for (tabName, iconSvg) in tabs do
                            button [
                                attr.classDyn (activeTab.View |> View.Map (fun t -> 
                                    let baseClass = "flex items-center space-x-3 px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 "
                                    if t = tabName then 
                                        baseClass + "neo-pressed text-emerald-600 bg-opacity-20 translate-y-px"
                                    else 
                                        baseClass + "neo-flat text-gray-600 hover:text-gray-900"
                                ))
                                on.click (fun _ _ -> activeTab.Value <- tabName)
                            ] [
                                Doc.Verbatim (sprintf """<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">%s</svg>""" iconSvg)
                                span [] [text tabName]
                            ]
                    ]
                    
                    // Logout Button in Header matching Tab Style
                    button [
                        attr.``class`` "flex items-center space-x-3 px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 text-red-500 neo-flat hover:text-red-700 ml-4 active:neo-pressed active:translate-y-px"
                        on.click (fun _ _ -> 
                            async {
                                let! _ = Server.Logout()
                                JS.Window.Location.Href <- "/"
                            } |> Async.StartImmediate
                        )
                    ] [
                       Doc.Verbatim """<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>"""
                       span [] [text "Logout"]
                    ]
                ]

                // Tab Content
                div [attr.``class`` "flex-grow"] [
                    activeTab.View |> View.Map (fun t ->
                        match t with
                        | "Account" -> accountTab()
                        | "Health" -> healthTab()
                        | "Calendar" -> calendarTab()
                        | "Other" -> otherTab()
                        | _ -> Doc.Empty
                    ) |> Doc.EmbedView
                ]
            ]
        ]

    let PlannerPage () =
        disableTransitionsOnLoad()
        let username = Var.Create "Loading..."
        let refDate = Var.Create System.DateTime.Today
        let currentSeason = refDate.View |> View.Map getSeason
        let accent = currentSeason |> View.Map (fun s -> getSeasonTheme s "text" "600")
        let accentHover = currentSeason |> View.Map (fun s -> getSeasonTheme s "hover:text" "500")
        let accentBg = currentSeason |> View.Map (fun s -> getSeasonTheme s "bg" "100")
        let mealPlans = Var.Create ([||] : MealPlanItem[])
        let recipesList = Var.Create ([||] : RecipeEntry[])
        let showPlanModal = Var.Create false
        let selectedDay = Var.Create System.DateTime.Today
        let selectedMealType = Var.Create "Lunch"
        let selectedRecipeId = Var.Create ("-1", "Custom Meal")
        let customMealTitle = Var.Create ""
        let mealFrequency = Var.Create 3
        
        let generateSlots freq =
            if freq = 1 then ["Meal 1"]
            elif freq = 2 then ["Breakfast"; "Dinner"]
            elif freq = 3 then ["Breakfast"; "Lunch"; "Dinner"]
            elif freq = 4 then ["Breakfast"; "Lunch"; "Dinner"; "Snack"]
            elif freq = 5 then ["Breakfast"; "Snack 1"; "Lunch"; "Snack 2"; "Dinner"]
            else [1..freq] |> List.map (fun i -> sprintf "Meal %d" i)
        
        let loadPlannerData () =
            async {
                let current = refDate.Value
                let startOfWeek = current.AddDays(float (1 - (if int current.DayOfWeek = 0 then 7 else int current.DayOfWeek)))
                let endOfWeek = startOfWeek.AddDays(6.0)
                let! p = Server.GetMealPlansRange(startOfWeek, endOfWeek)
                mealPlans.Value <- p
                let! r = Server.GetRecipes()
                recipesList.Value <- r
                let! h = Server.GetHealthSettings()
                mealFrequency.Value <- h.MealFrequency
            } |> Async.StartImmediate

        async {
            let! res = Server.CheckAuthState()
            match res with
            | AuthResult.LoggedIn (u, _) -> 
                username.Value <- u
                loadPlannerData()
            | _ -> JS.Window.Location.Href <- "/"
        } |> Async.StartImmediate

        let saveMeal () =
            async {
                let ridStr, ridName = selectedRecipeId.Value
                let rid = if ridStr = "-1" then None else Some (int ridStr)
                let title = 
                    if rid.IsSome then 
                        match recipesList.Value |> Array.tryFind (fun r -> r.Id = rid.Value) with
                        | Some r -> r.Name
                        | None -> customMealTitle.Value
                    else customMealTitle.Value
                
                let plan = { Id = 0; PlanDate = selectedDay.Value; MealType = selectedMealType.Value; RecipeId = rid; Title = title; Notes = "" }
                let! res = Server.AddMealPlan plan
                match res with
                | AuthResult.Success _ -> 
                    showPlanModal.Value <- false
                    loadPlannerData()
                | AuthResult.Error e -> JS.Alert e
                | _ -> ()
            } |> Async.StartImmediate

        let startOfWeek = refDate.View |> View.Map (fun d -> d.AddDays(float (1 - (if int d.DayOfWeek = 0 then 7 else int d.DayOfWeek))))

        div [attr.``class`` "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0"] [
            Sidebar "Planner" username currentSeason isMenuCollapsed.View (fun () -> isMenuCollapsed.Value <- not isMenuCollapsed.Value)
            div [attr.``class`` "flex-1 p-10 overflow-y-auto w-full"] [
                div [attr.``class`` "flex justify-between items-center mb-10"] [
                    h1 [attr.``class`` "text-4xl font-extrabold text-gray-900"] [text "Meal Planner"]
                    div [attr.``class`` "flex space-x-3"] [
                        Neo.IconButton (Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg>""") accentHover (fun () -> refDate.Value <- refDate.Value.AddDays(-7.0); loadPlannerData())
                        Neo.Button [text "This Week"] accent (fun () -> refDate.Value <- System.DateTime.Today; loadPlannerData())
                        Neo.IconButton (Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>""") accentHover (fun () -> refDate.Value <- refDate.Value.AddDays(7.0); loadPlannerData())
                    ]
                ]

                // Planning Modal
                showPlanModal.View |> View.Map (fun show ->
                    if show then
                        div [attr.``class`` "fixed inset-0 z-[200] flex items-center justify-center p-6"] [
                            div [attr.``class`` "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"; on.click (fun _ _ -> showPlanModal.Value <- false)] []
                            div [attr.``class`` "relative w-full max-w-md neo-flat p-8 rounded-3xl"] [
                                h2 [attr.``class`` "text-2xl font-bold mb-6 text-gray-900"] [
                                    text (sprintf "Plan for %s" (selectedDay.Value.ToString("MMM dd")))
                                ]
                                div [attr.``class`` "space-y-6"] [
                                    div [] [
                                        label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Meal Slot"]
                                        mealFrequency.View |> View.Map (fun freq ->
                                            Neo.Select (generateSlots freq) selectedMealType id "Select Slot" accent accentHover false
                                        ) |> Doc.EmbedView
                                    ]
                                    div [] [
                                        label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Select Recipe"]
                                        Neo.Select (("-1", "Custom Meal") :: (recipesList.Value |> Array.toList |> List.map (fun r -> string r.Id, r.Name))) selectedRecipeId snd "Select Recipe" accent accentHover false
                                    ]
                                    selectedRecipeId.View |> View.Map (fun (rid, _) ->
                                        if rid = "-1" then
                                            div [] [
                                                label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Meal Title"]
                                                Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] customMealTitle
                                            ]
                                        else Doc.Empty
                                    ) |> Doc.EmbedView
                                    
                                    div [attr.``class`` "flex space-x-4 mt-8"] [
                                        button [
                                            attr.``class`` "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"
                                            on.click (fun _ _ -> showPlanModal.Value <- false)
                                        ] [text "Cancel"]
                                        Neo.Button [text "Assign Meal"] (accent |> View.Map (fun a -> "flex-1 " + a)) (fun () -> saveMeal())
                                    ]
                                ]
                            ]
                        ]
                    else Doc.Empty
                ) |> Doc.EmbedView

                // Weekly Grid
                div [attr.``class`` "grid grid-cols-1 md:grid-cols-7 gap-6"] (
                    [0..6] |> List.map (fun i ->
                        startOfWeek |> View.Map (fun start ->
                            let dayDate = start.AddDays(float i)
                            div [attr.``class`` "flex flex-col space-y-4"] [
                                div [attr.``class`` "w-full"] [
                                    renderDate dayDate true None
                                ]
                                
                                mealFrequency.View |> View.Map (fun freq ->
                                    let slots = generateSlots freq
                                    div [attr.``class`` "flex-1 space-y-4"] [
                                        slots |> List.map (fun mType ->
                                            div [
                                                attr.``class`` "neo-nav-item p-4 rounded-2xl min-h-[100px] flex flex-col group cursor-pointer active:scale-95 transition"
                                                on.click (fun _ _ -> 
                                                    selectedDay.Value <- dayDate
                                                    selectedMealType.Value <- mType
                                                    showPlanModal.Value <- true
                                                )
                                            ] [
                                                span [attr.``class`` "text-[10px] font-bold text-gray-700 uppercase tracking-tighter mb-2"] [text mType]
                                                mealPlans.View |> View.Map (fun plans ->
                                                    plans |> Array.tryFind (fun p -> p.PlanDate.Date = dayDate.Date && p.MealType = mType)
                                                    |> function
                                                    | Some p -> 
                                                        div [attr.``class`` "flex-1"] [
                                                            span [attr.``class`` "text-sm font-bold text-gray-700"] [text p.Title]
                                                        ]
                                                    | None -> 
                                                        div [attr.``class`` "flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"] [
                                                            span [attr.``class`` "text-xs text-gray-600 italic"] [text "+ Plan"]
                                                        ]
                                                ) |> Doc.EmbedView
                                            ]
                                        ) |> Doc.Concat
                                    ]
                                ) |> Doc.EmbedView
                            ]
                        ) |> Doc.EmbedView
                    )
                )
            ]
        ]

    let CalendarPage () =
        disableTransitionsOnLoad()
        let username = Var.Create "Loading..."
        let viewMode = Var.Create "Monthly"
        let refDate = Var.Create System.DateTime.Today
        let events = Var.Create ([||] : CalendarEvent[])
        let showAddModal = Var.Create false
        let newEventTitle = Var.Create ""
        let newEventDesc = Var.Create ""
        let newEventType = Var.Create "Personal"
        let calendarStartDay = Var.Create "Monday"
        let selectedDateForSidebar = Var.Create (None: System.DateTime option)
        let isSidebarOpen = Var.Create false
        
        async {
            let! res = Server.CheckAuthState()
            match res with
            | AuthResult.LoggedIn (u, _) -> 
                username.Value <- u
                let! settings = Server.GetUserSettings()
                calendarStartDay.Value <- settings.CalendarStartDay
            | _ -> JS.Window.Location.Href <- "/"
        } |> Async.StartImmediate

        let loadEvents () =
            async {
                // Fetch for the current visible month (rough approximation)
                let start = (new System.DateTime(refDate.Value.Year, refDate.Value.Month, 1)).AddDays(-7.0)
                let endDate = start.AddDays(42.0)
                let! evs = Server.GetCalendarEvents(start, endDate)
                events.Value <- evs
            } |> Async.StartImmediate

        // Reload whenever refDate changes
        refDate.View |> View.Sink (fun _ -> loadEvents())

        let currentSeason = refDate.View |> View.Map getSeason
        let accent = currentSeason |> View.Map (fun s -> getSeasonTheme s "text" "600")
        let accentHover = currentSeason |> View.Map (fun s -> getSeasonTheme s "hover:text" "500")
        let accentBg = currentSeason |> View.Map (fun s -> getSeasonTheme s "bg" "100")

        let step direction =
            let multiplier = if direction = "next" then 1.0 else -1.0
            match viewMode.Value with
            | "Daily" -> refDate.Value <- refDate.Value.AddDays(multiplier * 1.0)
            | "Weekly" -> refDate.Value <- refDate.Value.AddDays(multiplier * 7.0)
            | "Lunar" -> refDate.Value <- refDate.Value.AddDays(multiplier * 29.53)
            | "Monthly" -> refDate.Value <- refDate.Value.AddMonths(int multiplier)
            | "Year" -> refDate.Value <- refDate.Value.AddYears(int multiplier)
            | _ -> refDate.Value <- refDate.Value.AddDays(multiplier * 7.0)


        div [attr.``class`` "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0"] [
            Sidebar "Calendar" username currentSeason isMenuCollapsed.View (fun () -> isMenuCollapsed.Value <- not isMenuCollapsed.Value)
            div [attr.``class`` "flex-1 p-10 overflow-y-auto w-full flex flex-col"] [
                div [attr.``class`` "flex justify-between items-center mb-10"] [
                    div [] [
                        h1 [attr.``class`` "text-4xl font-extrabold text-gray-900"] [
                            viewMode.View |> View.Map (fun v -> text (v + " View")) |> Doc.EmbedView
                        ]
                        p [attr.``class`` "text-gray-700 mt-2"] [
                            View.Map2 (fun (mode: string) (r: System.DateTime) -> 
                                if mode = "Year" then text (r.ToString("yyyy"))
                                else text (r.ToString("MMMM yyyy"))
                            ) viewMode.View refDate.View |> Doc.EmbedView
                        ]
                    ]
                    
                    div [attr.``class`` "flex items-center space-x-6 relative"] [
                        Neo.Button [text "Today"] accent (fun () -> refDate.Value <- System.DateTime.Today)
                        Neo.Select ["Weekly"; "Monthly"; "Lunar"; "Year"] viewMode id "Select View" accent accentHover true
                        div [attr.``class`` "flex space-x-3"] [
                            Neo.IconButton (Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>""") accentHover (fun () -> step "prev")
                            Neo.IconButton (Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>""") accentHover (fun () -> step "next")
                        ]
                    ]
                ]

                // Main Calendar Content
                div [attr.``class`` "flex-1 w-full"] [
                    // Add Event Modal
                    // Add Event Modal
                    showAddModal.View |> View.Map (fun show ->
                        if show then
                            div [attr.``class`` "fixed inset-0 z-[200] flex items-center justify-center p-6"] [
                                div [attr.``class`` "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"; on.click (fun _ _ -> showAddModal.Value <- false)] []
                                div [attr.``class`` "relative w-full max-w-md neo-flat p-8 rounded-3xl"] [
                                    h2 [attr.``class`` "text-2xl font-bold mb-6 text-gray-900"] [text "Create New Event"]
                                    div [attr.``class`` "space-y-4"] [
                                        div [] [
                                            label [attr.``class`` "block text-sm font-bold text-gray-700 mb-2 pl-2"] [text "Title"]
                                            Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newEventTitle
                                        ]
                                        div [] [
                                            label [attr.``class`` "block text-sm font-bold text-gray-700 mb-2 pl-2"] [text "Category"]
                                            Neo.Select ["Personal"; "Work"; "Important"; "Health"] newEventType id "Select Category" accent accentHover false
                                        ]
                                        div [] [
                                            label [attr.``class`` "block text-sm font-bold text-gray-700 mb-2 pl-2"] [text "Description"]
                                            Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newEventDesc
                                        ]
                                        
                                        div [attr.``class`` "flex space-x-4 mt-8"] [
                                            button [
                                                attr.``class`` "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"
                                                on.click (fun _ _ -> showAddModal.Value <- false)
                                            ] [text "Cancel"]
                                            Neo.Button [text "Save Event"] (accent |> View.Map (fun a -> "flex-1 " + a)) (fun () -> 
                                                async {
                                                    let icon = match newEventType.Value with | "Work" -> "💼" | "Health" -> "🏥" | "Important" -> "⚠️" | _ -> "📅"
                                                    let ev = { Id = 0; Title = newEventTitle.Value; Description = newEventDesc.Value; EventDate = refDate.Value; EventType = newEventType.Value; Icon = icon }
                                                    let! res = Server.AddCalendarEvent ev
                                                    match res with
                                                    | AuthResult.Success _ -> 
                                                        showAddModal.Value <- false
                                                        newEventTitle.Value <- ""
                                                        newEventDesc.Value <- ""
                                                        loadEvents()
                                                    | AuthResult.Error e -> JS.Alert e
                                                    | _ -> ()
                                                } |> Async.StartImmediate
                                            )
                                        ]
                                    ]
                                ]
                            ]
                        else Doc.Empty
                    ) |> Doc.EmbedView

                    View.Map3 (fun v currentRef startDayName ->
                        let startDayOffset = 
                            match startDayName with
                            | "Sunday" -> 0 | "Monday" -> 1 | "Tuesday" -> 2 | "Wednesday" -> 3 
                            | "Thursday" -> 4 | "Friday" -> 5 | "Saturday" -> 6 | _ -> 1

                        let onDateClick d =
                            selectedDateForSidebar.Value <- Some d
                            isSidebarOpen.Value <- true

                        match v with
                        | "Weekly" ->
                            div [attr.``class`` "flex flex-col space-y-4"] [
                                div [attr.``class`` "text-sm font-bold text-gray-600 pl-2 uppercase"] [
                                    text ("Week " + string (getWeekNumber currentRef))
                                ]
                                div [attr.``class`` "grid grid-cols-7 gap-6"] (
                                    // Calculate relative week start based on setting
                                    let currentDayIdx = int currentRef.DayOfWeek
                                    let offset = (currentDayIdx - startDayOffset + 7) % 7
                                    let weekStart = currentRef.AddDays(float -offset)
                                    List.init 7 (fun i ->
                                        renderDate (weekStart.AddDays(float i)) true (Some onDateClick)
                                    )
                                )
                            ]
                        | "Monthly" ->
                            let startOfMonth = new System.DateTime(currentRef.Year, currentRef.Month, 1)
                            let dayOfWeek = int startOfMonth.DayOfWeek
                            let firstDayOffset = (dayOfWeek - startDayOffset + 7) % 7
                            
                            let days = ["Sun"; "Mon"; "Tue"; "Wed"; "Thu"; "Fri"; "Sat"]
                            let rotatedHeaders = 
                                List.append (days |> List.skip startDayOffset) (days |> List.take startDayOffset)

                            div [attr.``class`` "grid grid-cols-[auto_repeat(7,1fr)] gap-4"] [
                                // Headers
                                span [attr.``class`` "w-10"] []
                                rotatedHeaders |> List.map (fun d ->
                                    span [attr.``class`` "text-center text-xs font-bold text-gray-700 mb-2"] [text d]
                                ) |> Doc.Concat
                                
                                // Rows with Week Numbers
                                List.init 6 (fun weekIdx ->
                                    let weekStartDate = startOfMonth.AddDays(float (weekIdx * 7 - firstDayOffset))
                                    if weekStartDate.Month = currentRef.Month || weekStartDate.AddDays(6.0).Month = currentRef.Month then
                                        Doc.Concat [
                                            div [attr.``class`` "flex items-center justify-center text-[10px] font-black text-gray-700 uppercase vertical-lr py-4 border-r border-gray-100"] [
                                                text ("W" + string (getWeekNumber weekStartDate))
                                            ]
                                            List.init 7 (fun dayIdx ->
                                                let d = weekStartDate.AddDays(float dayIdx)
                                                if d.Month = currentRef.Month then
                                                    renderDate d true (Some onDateClick)
                                                else
                                                    div [attr.``class`` "opacity-0 pointer-events-none"] []
                                            ) |> Doc.Concat
                                        ]
                                    else Doc.Empty
                                ) |> Doc.Concat
                            ]
                        | "Lunar" ->
                            let lunarStart = getRecentNewMoon currentRef
                            div [attr.``class`` "flex-1 w-full flex flex-col"] [
                                div [attr.``class`` "grid grid-cols-[80px_repeat(7,1fr)] gap-4 mb-8"] [
                                    span [] []
                                    [1..7] |> List.map (fun d ->
                                        span [attr.``class`` "text-center text-xs font-bold text-gray-700 uppercase opacity-60"] [text (sprintf "Day %d" d)]
                                    ) |> Doc.Concat
                                ]
                                
                                List.init 4 (fun weekIdx ->
                                    let weekStart = lunarStart.AddDays(float (weekIdx * 7))
                                    let phaseIcon, phaseName = 
                                        match weekIdx with
                                        | 0 -> "🌑", "New Moon"
                                        | 1 -> "🌓", "First Quarter"
                                        | 2 -> "🌕", "Full Moon"
                                        | 3 -> "🌗", "Last Quarter"
                                        | _ -> "🌙", "Phase"

                                    div [attr.``class`` "grid grid-cols-[80px_repeat(7,1fr)] gap-4 mb-4 items-center"] [
                                        div [attr.``class`` "flex flex-col items-center justify-center p-2 neo-pressed rounded-xl"] [
                                            span [attr.``class`` "text-xl"] [text phaseIcon]
                                            span [attr.``class`` "text-[8px] font-black text-gray-700 uppercase"] [text phaseName]
                                        ]
                                        List.init 7 (fun dayIdx ->
                                            renderDate (weekStart.AddDays(float dayIdx)) true (Some onDateClick)
                                        ) |> Doc.Concat
                                    ]
                                ) |> Doc.Concat
                            ]
                        | "Year" ->
                            div [attr.``class`` "h-full overflow-y-auto space-y-10 pr-4 mt-2"] [
                                List.init 12 (fun i ->
                                    let firstOfJan = new System.DateTime(currentRef.Year, 1, 1)
                                    let month = firstOfJan.AddMonths(i)
                                    div [attr.``class`` "neo-flat p-8 rounded-3xl"] [
                                        h3 [attr.``class`` "text-2xl font-bold text-gray-800 mb-6"] [text (month.ToString("MMMM yyyy"))]
                                        div [attr.``class`` "grid grid-cols-[auto_repeat(7,1fr)] gap-2"] [
                                            span [attr.``class`` "w-6"] []
                                            let daysShort = ["S";"M";"T";"W";"T";"F";"S"]
                                            let rotatedHeadersShort = 
                                                List.append (daysShort |> List.skip startDayOffset) (daysShort |> List.take startDayOffset)

                                            rotatedHeadersShort |> List.map (fun d -> 
                                                span [attr.``class`` "text-center text-[10px] font-bold text-gray-700"] [text d]
                                            ) |> Doc.Concat
                                            
                                            let firstDay = int month.DayOfWeek
                                            let firstDayOffsetYear = (firstDay - startDayOffset + 7) % 7
                                            let daysInMonth = System.DateTime.DaysInMonth(month.Year, month.Month)
                                            
                                            List.init 6 (fun w ->
                                                let ws = month.AddDays(float (w * 7 - firstDayOffsetYear))
                                                if ws.Month = month.Month || ws.AddDays(6.0).Month = month.Month then
                                                    Doc.Concat [
                                                        div [attr.``class`` "text-[8px] font-bold text-gray-700 flex items-center justify-center"] [
                                                            text (string (getWeekNumber ws))
                                                        ]
                                                        List.init 7 (fun d ->
                                                            let dayDate = ws.AddDays(float d)
                                                            if dayDate.Month = month.Month then
                                                                div [
                                                                    attr.classDyn (accent |> View.Map (fun a ->
                                                                        let bc = "aspect-square flex items-center justify-center neo-nav-item rounded-lg text-sm cursor-pointer "
                                                                        if dayDate.Date = System.DateTime.Today then 
                                                                            sprintf "%s %s font-bold border %s" bc a (getSeasonTheme (getSeason dayDate) "border" "200")
                                                                        else bc + "text-gray-700"
                                                                    ))
                                                                    on.click (fun _ _ -> onDateClick dayDate)
                                                                ] [
                                                                    text (string dayDate.Day)
                                                                ]
                                                            else
                                                                div [] []
                                                        ) |> Doc.Concat
                                                    ]
                                                else Doc.Empty
                                            ) |> Doc.Concat
                                        ]
                                    ]
                                ) |> Doc.Concat
                            ]
                        | _ -> Doc.Empty
                    ) viewMode.View refDate.View calendarStartDay.View |> Doc.EmbedView
                ]
            ]

            // Right Sidebar: Day Details
            isSidebarOpen.View |> View.Map (fun openState ->
                if openState && selectedDateForSidebar.Value.IsSome then
                    let d = selectedDateForSidebar.Value.Value
                    
                    div [attr.``class`` "w-[360px] neo-flat m-6 rounded-3xl p-6 flex flex-col animate-in slide-in-from-right duration-300"] [
                        // Close Button (Top Right)
                        div [attr.``class`` "flex justify-end mb-4"] [
                            button [
                                attr.``class`` "w-10 h-10 flex items-center justify-center rounded-full neo-nav-item text-gray-600 hover:text-red-500 transition"
                                on.click (fun _ _ -> isSidebarOpen.Value <- false)
                            ] [Doc.Verbatim """<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>"""]
                        ]

                        // Day Card (The Menu-like Header)
                        div [attr.``class`` "mb-8 flex flex-col items-center"] [
                            div [attr.``class`` "w-48 mb-6"] [
                                renderDate d true None
                            ]
                            div [attr.``class`` "text-center"] [
                                h2 [attr.``class`` "text-sm font-bold text-gray-400 uppercase tracking-widest"] [text (d.ToString("dddd"))]
                                h3 [attr.``class`` "text-2xl font-black text-gray-800"] [text (d.ToString("MMMM d"))]
                            ]
                        ]

                        // Events
                        div [attr.``class`` "flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar"] [
                            h4 [attr.``class`` "text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-2"] [text "Scheduled Events"]
                            events.View |> View.Map (fun evs ->
                                let dayEvents = evs |> Array.filter (fun e -> e.EventDate.Date = d.Date)
                                if dayEvents.Length = 0 then
                                    div [attr.``class`` "p-10 neo-pressed rounded-3xl text-center opacity-40"] [
                                        text "No events for this day"
                                    ]
                                else
                                    dayEvents |> Array.map (fun e ->
                                        div [attr.``class`` "p-5 rounded-2xl neo-nav-item border-l-4 border-indigo-400 active:scale-95 transition"] [
                                            div [attr.``class`` "flex justify-between mb-1"] [
                                                span [attr.``class`` "text-[10px] font-bold text-indigo-600 uppercase"] [text e.EventType]
                                                span [attr.``class`` "text-xl"] [text e.Icon]
                                            ]
                                            p [attr.``class`` "text-base font-bold text-gray-800"] [text e.Title]
                                            p [attr.``class`` "text-xs text-gray-600 mt-1"] [text e.Description]
                                        ]
                                    ) |> Doc.Concat
                            ) |> Doc.EmbedView
                        ]
                    ]
                else Doc.Empty
            ) |> Doc.EmbedView
        ]


    let RecipesPage () =
        disableTransitionsOnLoad()
        let username = Var.Create "Loading..."
        let season = View.Const (getSeason System.DateTime.Today)
        let recipes = Var.Create ([||] : RecipeEntry[])
        let showAddModal = Var.Create false
        let newName = Var.Create ""
        let newInst = Var.Create ""
        let newKcal = Var.Create "300"
        let newPrep = Var.Create "20"
        let newIcon = Var.Create "🥗"
        
        let loadRecipes () =
            async {
                let! res = Server.GetRecipes()
                recipes.Value <- res
            } |> Async.StartImmediate

        async {
            let! res = Server.CheckAuthState()
            match res with
            | AuthResult.LoggedIn (u, _) -> 
                username.Value <- u
                loadRecipes()
            | _ -> JS.Window.Location.Href <- "/"
        } |> Async.StartImmediate

        let addRecipe () =
            async {
                if newName.Value <> "" then
                    let r = { Id = 0; Name = newName.Value; Instructions = newInst.Value; PrepTime = int newPrep.Value; Kcal = int newKcal.Value; Icon = newIcon.Value }
                    let! res = Server.AddRecipe r
                    match res with
                    | AuthResult.Success _ -> 
                        newName.Value <- ""
                        showAddModal.Value <- false
                        loadRecipes()
                    | AuthResult.Error e -> JS.Alert e
                    | _ -> ()
            } |> Async.StartImmediate

        div [attr.``class`` "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0"] [
            Sidebar "Recipes" username season isMenuCollapsed.View (fun () -> isMenuCollapsed.Value <- not isMenuCollapsed.Value)
            div [attr.``class`` "flex-1 p-10 overflow-y-auto w-full"] [
                div [attr.``class`` "flex justify-between items-center mb-8"] [
                    h1 [attr.``class`` "text-4xl font-extrabold text-gray-800"] [text "My Recipes"]
                    let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                    Neo.Button [text "+ Add Recipe"] accent (fun () -> showAddModal.Value <- true)
                ]

                // Add Recipe Modal
                showAddModal.View |> View.Map (fun show ->
                    if show then
                        div [attr.``class`` "fixed inset-0 z-[200] flex items-center justify-center p-6"] [
                            div [attr.``class`` "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"; on.click (fun _ _ -> showAddModal.Value <- false)] []
                            div [attr.``class`` "relative w-full max-w-lg neo-flat p-8 rounded-3xl"] [
                                h2 [attr.``class`` "text-2xl font-bold mb-6 text-gray-900"] [text "Cookbook Entry"]
                                div [attr.``class`` "space-y-4"] [
                                    div [attr.``class`` "grid grid-cols-3 gap-4 mb-4"] [
                                        ["🥗"; "🥩"; "🍝"; "🥑"; "🥪"; "🍰"] |> List.map (fun i ->
                                            button [
                                                attr.classDyn (newIcon.View |> View.Map (fun current -> 
                                                    if current = i then "neo-pressed p-4 rounded-xl text-2xl"
                                                    else "neo-flat p-4 rounded-xl text-2xl active:scale-95 transition"
                                                ))
                                                on.click (fun _ _ -> newIcon.Value <- i)
                                            ] [text i]
                                        ) |> Doc.Concat
                                    ]
                                    div [] [
                                        label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Recipe Name"]
                                        Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newName
                                    ]
                                    div [attr.``class`` "grid grid-cols-2 gap-4"] [
                                        div [] [
                                            label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Prep Time (min)"]
                                            Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newPrep
                                        ]
                                        div [] [
                                            label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Calories (kcal)"]
                                            Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newKcal
                                        ]
                                    ]
                                    div [] [
                                        label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Instructions"]
                                        Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newInst
                                    ]
                                    div [attr.``class`` "flex space-x-4 mt-8"] [
                                        button [
                                            attr.``class`` "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"
                                            on.click (fun _ _ -> showAddModal.Value <- false)
                                        ] [text "Cancel"]
                                        let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                                        Neo.Button [text "Save Cookbook"] (accent |> View.Map (fun a -> "flex-1 " + a)) (fun () -> addRecipe())
                                    ]
                                ]
                            ]
                        ]
                    else Doc.Empty
                ) |> Doc.EmbedView

                div [attr.``class`` "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"] [
                    recipes.View |> View.Map (fun rs ->
                        if rs.Length = 0 then
                            [div [attr.``class`` "col-span-full neo-pressed p-20 rounded-3xl text-center opacity-40"] [
                                div [attr.``class`` "text-gray-600 font-bold italic mb-2"] [text "Your cookbook is empty"]
                                div [attr.``class`` "text-[10px] text-gray-600 uppercase tracking-widest"] [text "Share your first secret recipe"]
                            ]]
                        else
                            rs |> Array.toList |> List.map (fun r ->
                                div [attr.``class`` "neo-nav-item p-6 rounded-3xl group cursor-pointer hover:scale-[1.01] transition duration-300"] [
                                    div [attr.``class`` "w-full h-40 neo-pressed rounded-2xl mb-4 overflow-hidden flex items-center justify-center text-6xl"] [
                                        text r.Icon
                                    ]
                                    h3 [attr.``class`` "font-black text-gray-800 text-xl"] [text r.Name]
                                    p [attr.``class`` "text-sm text-gray-600 mt-2 line-clamp-2 italic"] [text r.Instructions]
                                    div [attr.``class`` "flex justify-between mt-6 pt-4 border-t border-gray-100"] [
                                        div [attr.``class`` "flex items-center space-x-1 text-gray-700"] [
                                            Doc.Verbatim """<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>"""
                                            span [attr.``class`` "text-xs font-bold"] [text (string r.PrepTime + "m")]
                                        ]
                                        div [attr.``class`` "flex items-center space-x-1 text-orange-400"] [
                                            Doc.Verbatim """<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 3 5.5 6 5.5 9.5a7 7 0 01-2.343 5.657z"></path></svg>"""
                                            span [attr.``class`` "text-xs font-bold"] [text (string r.Kcal + " kcal")]
                                        ]
                                    ]
                                ]
                            )
                    ) |> View.Map Doc.Concat |> Doc.EmbedView
                ]
            ]
        ]

    let RecordsPage () =
        disableTransitionsOnLoad()
        let username = Var.Create "Loading..."
        let season = View.Const (getSeason System.DateTime.Today)
        let records = Var.Create ([||] : DailyRecord[])
        let newType = Var.Create "Blood Glucose"
        let newValue = Var.Create ""
        let newUnit = Var.Create "mmol/L"
        
        let loadRecords () =
            async {
                let! res = Server.GetHealthRecords()
                records.Value <- res
            } |> Async.StartImmediate

        async {
            let! res = Server.CheckAuthState()
            match res with
            | AuthResult.LoggedIn (u, _) -> 
                username.Value <- u
                loadRecords()
            | _ -> JS.Window.Location.Href <- "/"
        } |> Async.StartImmediate

        let addRecord () =
            async {
                if newValue.Value <> "" then
                    let record = { Id = 0; RecordDate = System.DateTime.Now; Type = newType.Value; Value = newValue.Value; Unit = newUnit.Value; Status = "Normal" }
                    let! res = Server.AddHealthRecord record
                    match res with
                    | AuthResult.Success _ -> 
                        newValue.Value <- ""
                        loadRecords()
                    | AuthResult.Error e -> JS.Alert e
                    | _ -> ()
            } |> Async.StartImmediate

        div [attr.``class`` "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0"] [
            Sidebar "Records" username season isMenuCollapsed.View (fun () -> isMenuCollapsed.Value <- not isMenuCollapsed.Value)
            div [attr.``class`` "flex-1 p-10 overflow-y-auto w-full"] [
                h1 [attr.``class`` "text-4xl font-extrabold text-gray-800 mb-6"] [text "Health Records"]
                
                // Add Record Form
                div [attr.``class`` "neo-flat p-8 rounded-3xl mb-10"] [
                    h2 [attr.``class`` "text-xl font-bold mb-6 text-gray-700"] [text "Add New Measurement"]
                    div [attr.``class`` "grid grid-cols-1 md:grid-cols-4 gap-6 items-end"] [
                        div [] [
                            label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Type"]
                            let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                            let accentBg = season |> View.Map (fun s -> getSeasonTheme s "bg" "100")
                            Neo.Select ["Blood Glucose"; "Weight"; "Blood Pressure"; "Heart Rate"] newType id "Select Type" accent accentBg false
                        ]
                        div [] [
                            label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Value"]
                            Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none placeholder:text-gray-400"] newValue
                        ]
                        div [] [
                            label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Unit"]
                            Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none placeholder:text-gray-400"] newUnit
                        ]
                        let accentBg = season |> View.Map (fun s -> getSeasonTheme s "bg" "100")
                        let accentText = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                        Neo.Button [text "Save Entry"] accentBg (fun () -> addRecord())
                    ]
                ]

                // Records Log
                div [attr.``class`` "neo-flat p-8 rounded-3xl"] [
                    table [attr.``class`` "w-full text-left"] [
                        thead [] [
                            tr [attr.``class`` "text-gray-600 text-sm uppercase tracking-wider"] [
                                th [attr.``class`` "pb-4 pl-4"] [text "Date"]
                                th [attr.``class`` "pb-4"] [text "Type"]
                                th [attr.``class`` "pb-4"] [text "Value"]
                                th [attr.``class`` "pb-4 pr-4 text-right"] [text "Status"]
                            ]
                        ]
                        tbody [] [
                            records.View |> View.Map (fun rs ->
                                if rs.Length = 0 then
                                    [tr [] [td [attr.colspan "4"; attr.``class`` "text-center py-10 text-gray-600 italic"] [text "No records found. Add your first measurement above."]]]
                                else
                                    rs |> Array.toList |> List.map (fun r ->
                                        tr [attr.``class`` "border-t border-gray-100"] [
                                            td [attr.``class`` "py-4 pl-4 font-medium text-gray-600"] [text (r.RecordDate.ToString("yyyy-MM-dd HH:mm"))]
                                            td [attr.``class`` "py-4 text-gray-700"] [text r.Type]
                                            td [attr.``class`` "py-4 text-gray-700 font-bold"] [text (r.Value + " " + r.Unit)]
                                            td [attr.``class`` "py-4 pr-4 text-right"] [
                                                span [attr.``class`` "px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold"] [text r.Status]
                                            ]
                                        ]
                                    )
                            ) |> View.Map Doc.Concat |> Doc.EmbedView
                        ]
                    ]
                ]
            ]
        ]
    let ProductsPage () =
        disableTransitionsOnLoad()
        let username = Var.Create "Loading..."
        let season = View.Const (getSeason System.DateTime.Today)
        let products = Var.Create ([||] : ProductItem[])
        let showAddModal = Var.Create false
        let newName = Var.Create ""
        let newCategory = Var.Create "Groceries"
        let newStock = Var.Create "0"
        let newUnit = Var.Create "pcs"
        
        let loadProducts () =
            async {
                let! res = Server.GetProducts()
                products.Value <- res
            } |> Async.StartImmediate

        async {
            let! res = Server.CheckAuthState()
            match res with
            | AuthResult.LoggedIn (u, _) -> 
                username.Value <- u
                loadProducts()
            | _ -> JS.Window.Location.Href <- "/"
        } |> Async.StartImmediate

        let addProduct () =
            async {
                if newName.Value <> "" then
                    let p = { Id = 0; Name = newName.Value; Category = newCategory.Value; Stock = float newStock.Value; Unit = newUnit.Value; Calories = 0.0; Carbs = 0.0; Protein = 0.0; Fat = 0.0 }
                    let! res = Server.AddProduct p
                    match res with
                    | AuthResult.Success _ -> 
                        newName.Value <- ""
                        newStock.Value <- "0"
                        showAddModal.Value <- false
                        loadProducts()
                    | AuthResult.Error e -> JS.Alert e
                    | _ -> ()
            } |> Async.StartImmediate

        div [attr.``class`` "flex h-screen bg-[#e0e5ec] w-full overflow-hidden mt-0"] [
            Sidebar "Products" username season isMenuCollapsed.View (fun () -> isMenuCollapsed.Value <- not isMenuCollapsed.Value)
            div [attr.``class`` "flex-1 p-10 overflow-y-auto w-full"] [
                div [attr.``class`` "flex justify-between items-center mb-8"] [
                    h1 [attr.``class`` "text-4xl font-extrabold text-gray-900"] [text "Product Inventory"]
                    let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                    Neo.Button [text "+ Add Product"] accent (fun () -> showAddModal.Value <- true)
                ]

                // Add Product Modal
                showAddModal.View |> View.Map (fun show ->
                    if show then
                        div [attr.``class`` "fixed inset-0 z-[200] flex items-center justify-center p-6"] [
                            div [attr.``class`` "absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm"; on.click (fun _ _ -> showAddModal.Value <- false)] []
                            div [attr.``class`` "relative w-full max-w-md neo-flat p-8 rounded-3xl"] [
                                h2 [attr.``class`` "text-2xl font-bold mb-6 text-gray-900"] [text "Add Warehouse Item"]
                                div [attr.``class`` "space-y-4"] [
                                    div [] [
                                        label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Product Name"]
                                        Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newName
                                    ]
                                    div [attr.``class`` "grid grid-cols-2 gap-4"] [
                                        div [] [
                                            label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Category"]
                                            let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                                            let accentBg = season |> View.Map (fun s -> getSeasonTheme s "bg" "100")
                                            Neo.Select ["Groceries"; "Meat"; "Dairy"; "Veggie"; "Treats"] newCategory id "Select Category" accent accentBg false
                                        ]
                                        div [] [
                                            label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Unit"]
                                            Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newUnit
                                        ]
                                    ]
                                    div [] [
                                        label [attr.``class`` "block text-xs font-bold text-gray-700 mb-2 pl-2"] [text "Current Stock"]
                                        Doc.InputType.Text [attr.``class`` "neo-pressed w-full rounded-xl py-4 px-5 text-gray-800 focus:outline-none"] newStock
                                    ]
                                    div [attr.``class`` "flex space-x-4 mt-8"] [
                                        button [
                                            attr.``class`` "flex-1 neo-flat py-4 rounded-xl font-bold text-gray-600 active:scale-95 transition"
                                            on.click (fun _ _ -> showAddModal.Value <- false)
                                        ] [text "Cancel"]
                                        let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                                        Neo.Button [text "Save Product"] (accent |> View.Map (fun a -> "flex-1 " + a)) (fun () -> addProduct())
                                    ]
                                ]
                            ]
                        ]
                    else Doc.Empty
                ) |> Doc.EmbedView

                div [attr.``class`` "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"] (
                    [
                        products.View |> View.Map (fun ps ->
                            if ps.Length = 0 then
                                [div [attr.``class`` "col-span-full neo-pressed p-20 rounded-3xl text-center opacity-40"] [
                                    div [attr.``class`` "text-gray-600 font-bold italic mb-2"] [text "Inventory is empty"]
                                    div [attr.``class`` "text-[10px] text-gray-600 uppercase tracking-widest"] [text "Start by adding your first product"]
                                ]]
                            else
                                ps |> Array.toList |> List.map (fun p ->
                                    div [attr.``class`` "neo-nav-item p-6 rounded-3xl group relative"] [
                                        div [attr.``class`` "absolute top-4 right-4 text-xs font-bold text-emerald-600 opacity-60"] [text p.Category]
                                        div [attr.``class`` "w-12 h-12 neo-pressed rounded-xl mb-4 flex items-center justify-center text-2xl"] [
                                            text (match p.Category with | "Meat" -> "🍖" | "Dairy" -> "🥛" | "Veggie" -> "🥦" | "Treats" -> "🍬" | _ -> "🛒")
                                        ]
                                        h3 [attr.``class`` "font-bold text-gray-800 text-lg mb-1"] [text p.Name]
                                        div [attr.``class`` "flex items-baseline space-x-1"] [
                                            span [attr.``class`` "text-2xl font-black text-gray-700"] [text (string p.Stock)]
                                            span [attr.``class`` "text-xs font-bold text-gray-600 uppercase"] [text p.Unit]
                                        ]
                                        div [attr.``class`` "mt-6 flex space-x-3"] [
                                            let accent = season |> View.Map (fun s -> getSeasonTheme s "text" "600")
                                            Neo.Button [text "Update"] (accent |> View.Map (fun a -> "flex-1 text-[10px] uppercase tracking-tighter " + a)) (fun () -> ())
                                            Neo.IconButton (Doc.Verbatim """<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>""") (View.Const "text-red-400") (fun () -> 
                                                async {
                                                    let! _ = Server.DeleteProduct p.Id
                                                    loadProducts()
                                                } |> Async.StartImmediate
                                            )
                                        ]
                                    ]
                                )
                        ) |> View.Map Doc.Concat |> Doc.EmbedView
                    ]
                )
            ]
        ]

    let ProfilePage (username: string) =
        let state = Var.Create (None : PublicProfile option)
        let loading = Var.Create true
        
        async {
            let! res = Server.GetPublicProfile username
            state.Value <- res
            loading.Value <- false
        } |> Async.StartImmediate
        
        div [attr.``class`` "flex items-center justify-center min-h-screen bg-[#e0e5ec] p-6"] [
            state.View |> View.Map (fun profile ->
                match profile with
                | Some prof ->
                    GlassCard [
                        div [attr.``class`` "flex flex-col items-center"] [
                            div [attr.``class`` "w-32 h-32 rounded-full neo-flat mb-6 overflow-hidden flex items-center justify-center text-4xl font-black text-gray-300"] [
                                match prof.AvatarUrl with
                                | Some url -> img [attr.src url; attr.``class`` "w-full h-full object-cover"] []
                                | None -> text (if prof.Username.Length > 0 then prof.Username.Substring(0,1).ToUpper() else "U")
                            ]
                            h2 [attr.``class`` "text-3xl font-black text-gray-800 mb-2"] [text (sprintf "@%s" prof.Username)]
                            div [attr.``class`` "px-4 py-1 rounded-full neo-pressed text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-8"] [
                                text (if prof.IsPublic then "Public Profile" else "Private View")
                            ]
                            
                            div [attr.``class`` "w-full space-y-4 border-t border-gray-100 pt-8"] [
                                if prof.IsOwner then
                                    Neo.Button [text "Edit My Profile"] (View.Const "") (fun () -> JS.Window.Location.Href <- "/settings")
                                else
                                    p [attr.``class`` "text-center text-gray-500 italic text-sm font-medium"] [text "Detailed user stats are private."]
                            ]
                        ]
                    ]
                | None ->
                    if loading.Value then
                        div [attr.``class`` "text-gray-400 font-bold animate-pulse text-xl"] [text (sprintf "Searching for @%s..." username)]
                    else
                        div [attr.``class`` "text-center neo-flat p-12 rounded-3xl"] [
                            span [attr.``class`` "text-6xl mb-6 block grayscale opacity-40"] [text "🔍"]
                            h2 [attr.``class`` "text-2xl font-bold text-gray-800 mb-2"] [text "User Not Found"]
                            p [attr.``class`` "text-gray-500"] [text (sprintf "The profile for @%s does not exist or has been removed." username)]
                            div [attr.``class`` "mt-8"] [
                                Neo.Button [text "Return Home"] (View.Const "") (fun () -> JS.Window.Location.Href <- "/")
                            ]
                        ]
            ) |> Doc.EmbedView
        ]

    let VerifyEmailChange (token: string) =
        let status = Var.Create "Verifying your new email address..."
        let isError = Var.Create false
        
        async {
            let! res = Server.VerifyEmailChange token
            match res with
            | AuthResult.Success _ ->
                status.Value <- "Email verified successfully! Redirecting..."
                isError.Value <- false
                do! Async.Sleep 2000
                JS.Window.Location.Href <- "/settings"
            | AuthResult.Error e ->
                status.Value <- e
                isError.Value <- true
            | _ -> ()
        } |> Async.StartImmediate
        
        div [attr.``class`` "flex items-center justify-center min-h-screen bg-[#e0e5ec] p-6"] [
            GlassCard [
                div [attr.``class`` "text-center"] [
                    status.View |> View.Map (fun s ->
                        div [attr.``class`` "flex flex-col items-center"] [
                            div [attr.``class`` "w-16 h-16 rounded-full neo-pressed flex items-center justify-center mb-6"] [
                                if isError.Value then
                                    Doc.Verbatim """<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>"""
                                else
                                    Doc.Verbatim """<svg class="w-8 h-8 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>"""
                            ]
                            h2 [attr.``class`` ("text-xl font-bold " + (if isError.Value then "text-red-600" else "text-gray-800"))] [text s]
                            if isError.Value then
                                div [attr.``class`` "mt-8"] [
                                    Neo.Button [text "Back to Home"] (View.Const "") (fun () -> JS.Window.Location.Href <- "/")
                                ]
                        ]
                    ) |> Doc.EmbedView
                ]
            ]
        ]


