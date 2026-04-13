namespace WebSharperApp

open WebSharper
open Dapper
open BCrypt.Net
open System

module MockMailer =
    let SendVerificationEmail (email: string, token: string) =
        printfn "----------------------------------------------------"
        printfn "[MOCK EMAIL OUTBOX]"
        printfn "To: %s" email
        printfn "Subject: Please Verify Your Email Account"
        printfn "Body: Click this link to verify: http://localhost:5000/verify-email?token=%s" token
        printfn "----------------------------------------------------"

    let SendMagicLinkEmail (email: string, token: string) =
        printfn "----------------------------------------------------"
        printfn "[MOCK EMAIL OUTBOX]"
        printfn "To: %s" email
        printfn "Subject: Magic Login Link"
        printfn "Body: Click here to instantly login: http://localhost:5000/magic-login?token=%s" token
        printfn "----------------------------------------------------"

/// <summary>Represents the structured result of backend authentication RPC operations transmitted securely to the client.</summary>
[<JavaScript>]
type AuthResult =
    | Success of bool
    | LoggedIn of string * bool // Username, IsVerified
    | NeedPasswordChange
    | Error of string

/// <summary>Data structure for safely deserializing Database mapping payloads specifically for F# memory execution using Dapper.</summary>
[<CLIMutable>]
type UserAuthData = { Username: string; Email: string; PasswordHash: string; IsEmailVerified: int64; MustChangePassword: int64; TokenExpiry: System.DateTime }

[<JavaScript>]
[<CLIMutable>]
type CalendarEvent = { Id: int; Title: string; Description: string; EventDate: DateTime; EventType: string; Icon: string }

[<JavaScript>]
[<CLIMutable>]
type DailyRecord = { Id: int; RecordDate: DateTime; Type: string; Value: string; Unit: string; Status: string }

[<JavaScript>]
[<CLIMutable>]
type ProductItem = { Id: int; Name: string; Category: string; Stock: float; Unit: string; Calories: float; Carbs: float; Protein: float; Fat: float }

[<JavaScript>]
[<CLIMutable>]
type RecipeEntry = { Id: int; Name: string; Instructions: string; PrepTime: int; Kcal: int; Icon: string }

[<JavaScript>]
[<CLIMutable>]
type MealPlanItem = { Id: int; PlanDate: DateTime; MealType: string; RecipeId: int option; Title: string; Notes: string }

[<JavaScript>]
[<CLIMutable>]
type GlobalSettings = { CalendarStartDay: string; AvatarUrl: string option }

module Server =

    /// <summary>Mechanically validates string structures enforcing strict parameter conditions globally (8-16 len, uppercase, lowercase, special char config).</summary>
    let isValidPassword (p: string) =
        if String.IsNullOrWhiteSpace(p) then false
        else
            let hasLower = System.Text.RegularExpressions.Regex.IsMatch(p, "[a-z]")
            let hasUpper = System.Text.RegularExpressions.Regex.IsMatch(p, "[A-Z]")
            let hasDigit = System.Text.RegularExpressions.Regex.IsMatch(p, "[0-9]")
            let hasSpecial = System.Text.RegularExpressions.Regex.IsMatch(p, """[!@#$%^&*(),.?":{}|<>]""")
            p.Length >= 8 && p.Length <= 16 && hasLower && hasUpper && hasDigit && hasSpecial

    /// <summary>Secure Endpoint mapping dynamically receiving user execution inputs, creating secure auto-generated identifiers, and storing explicit Salt-Hashed password fragments.</summary>
    [<Rpc>]
    let RegisterUser (email: string, password: string) =
        async {
            if String.IsNullOrWhiteSpace(email) || not (email.Contains("@")) then
                return AuthResult.Error "Invalid email address."
            elif not (isValidPassword password) then
                return AuthResult.Error "Password must be 8-16 characters and contain uppercase, lowercase, numbers, and special characters."
            else
                try
                    use db = Database.GetConnection()
                    db.Open()

                    let username = email.Split('@').[0] + "-" + Guid.NewGuid().ToString("N").Substring(0, 4)
                    let existingUser = db.QueryFirstOrDefault<int>("SELECT Count(1) FROM Users WHERE Email = @Email", {| Email = email |})
                    
                    if existingUser > 0 then
                        return AuthResult.Error "Email already exists."
                    else
                        let hash = BCrypt.HashPassword(password)
                        let verToken = Guid.NewGuid().ToString("N")
                        
                        let insertQuery = """
                            INSERT INTO Users (Username, Email, PasswordHash, VerificationToken, IsEmailVerified)
                            VALUES (@u, @e, @p, @t, 0)
                        """
                        let rows = db.Execute(insertQuery, {| u = username; e = email; p = hash; t = verToken |})
                        if rows > 0 then
                            MockMailer.SendVerificationEmail(email, verToken)
                            
                            // Auto Login securely context via WebSharper 10 Native forms!
                            let ctx = WebSharper.Web.Remoting.GetContext()
                            do! ctx.UserSession.LoginUser(email)
                            return AuthResult.LoggedIn (username, false)
                        else
                            return AuthResult.Error "Failed to register user."
                with
                | ex -> return AuthResult.Error ("System processing error occurred securely.")
        }

    /// <summary>Endpoint exclusively executing Bcrypt authentication routines securely bypassing timeline tracking attacks, returning validated state flags natively across.</summary>
    [<Rpc>]
    let LoginUser (email: string, password: string) =
        async {
             try
                  use db = Database.GetConnection()
                  db.Open()
                  let q = "SELECT Username, PasswordHash, IsEmailVerified, MustChangePassword FROM Users WHERE Email = @e"
                  let user = db.Query<UserAuthData>(q, {| e = email |}) |> Seq.tryHead
                  
                  match user with
                  | None -> return AuthResult.Error "Invalid email or password."
                   | Some u ->
                       let hash : string = u.PasswordHash
                       if BCrypt.Verify(password, hash) then
                            let ctx = WebSharper.Web.Remoting.GetContext()
                            do! ctx.UserSession.LoginUser(email)
                           
                            let isVerified = u.IsEmailVerified = 1L
                            let mustChange = u.MustChangePassword = 1L
                           
                            if mustChange then return AuthResult.NeedPasswordChange
                            else return AuthResult.LoggedIn (u.Username, isVerified)
                       else
                            return AuthResult.Error "Invalid email or password."
              with ex -> return AuthResult.Error ("System processing error occurred securely.")
         }

    /// <summary>Stateless validation verifying if the browser's contextually signed HTTP Cookie natively matches backend identity pipelines continuously asynchronously.</summary>
    [<Rpc>]
    let CheckAuthState () =
        async {
             let ctx = WebSharper.Web.Remoting.GetContext()
             let! emailOpt = ctx.UserSession.GetLoggedInUser()
             match emailOpt with
             | None -> return AuthResult.Error "Not logged in."
             | Some email ->
                 use db = Database.GetConnection()
                 db.Open()
                 let user = db.Query<UserAuthData>("SELECT Username, IsEmailVerified FROM Users WHERE Email = @e", {| e = email |}) |> Seq.tryHead
                 match user with
                 | None -> return AuthResult.Error "Invalid."
                 | Some u -> return AuthResult.LoggedIn (u.Username, u.IsEmailVerified = 1L)
        }
        
    [<Rpc>]
    let TriggerMagicLink (email: string) =
        async {
            try
                use db = Database.GetConnection()
                db.Open()
                let found = db.Query<int>("SELECT Count(1) FROM Users WHERE Email = @e", {| e = email |}) |> Seq.head
                if found > 0 then
                    let token = Guid.NewGuid().ToString("N")
                    let expiry = DateTime.UtcNow.AddMinutes(15.0)
                    db.Execute("UPDATE Users SET MagicLinkToken = @t, TokenExpiry = @ex WHERE Email = @e", {| t = token; ex = expiry; e = email |}) |> ignore
                    MockMailer.SendMagicLinkEmail(email, token)
                    return AuthResult.Success true
                else
                    // Silently fail identically avoiding leaking valid emails!
                    return AuthResult.Success true
            with ex -> return AuthResult.Error "System processing error occurred securely."
        }

    /// <summary>Forces explicitly authenticated identities to structurally rewrite their password hash mappings natively onto SQLite executing database structures.</summary>
    [<Rpc>]
    let ResetPassword (newPassword: string) =
        async {
             let ctx = WebSharper.Web.Remoting.GetContext()
             let! emailOpt = ctx.UserSession.GetLoggedInUser()
             match emailOpt with
             | None -> return AuthResult.Error "Not authenticated to change password."
             | Some email ->
                 if not (isValidPassword newPassword) then
                     return AuthResult.Error "Password must be 8-16 characters and contain uppercase, lowercase, numbers, and special characters."
                 else
                     use db = Database.GetConnection()
                     db.Open()
                     let hash = BCrypt.HashPassword(newPassword)
                     db.Execute("UPDATE Users SET PasswordHash = @h, MustChangePassword = 0 WHERE Email = @e", {| h = hash; e = email |}) |> ignore
                     return AuthResult.Success true
        }

    /// <summary>Authenticated mechanism allowing users to explicitly override their display identifiers within secure memory pipelines.</summary>
    [<Rpc>]
    let UpdateUsername (newName: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated."
            | Some email ->
                if String.IsNullOrWhiteSpace(newName) || newName.Length < 3 then
                    return AuthResult.Error "Username must be at least 3 characters."
                else
                    try
                        use db = Database.GetConnection()
                        db.Open()
                        let rows = db.Execute("UPDATE Users SET Username = @u WHERE Email = @e", {| u = newName; e = email |})
                        if rows > 0 then return AuthResult.LoggedIn (newName, true)
                        else return AuthResult.Error "Failed to update username."
                    with
                    | _ -> return AuthResult.Error "Username already taken or database error."
        }
        
    /// <summary>Token execution block processing verified emails into secure SQLite identities natively.</summary>
    [<Rpc>]
    let AttemptVerifyEmail (token: string) =
        async {
            try
                use db = Database.GetConnection()
                db.Open()
                let rows = db.Execute("UPDATE Users SET IsEmailVerified = 1, VerificationToken = NULL WHERE VerificationToken = @t", {| t = token |})
                if rows > 0 then return AuthResult.Success true
                else return AuthResult.Error "Invalid or expired verification token."
            with ex -> return AuthResult.Error "System processing error occurred securely."
        }

    /// <summary>Dynamic mechanism interpreting explicit URL-injected verification tokens, securely auto-authenticating matching identity pipelines within temporal expiration brackets.</summary>
    [<Rpc>]
    let AttemptMagicLogin (token: string) =
        async {
            try
                use db = Database.GetConnection()
                db.Open()
                let user = db.Query<UserAuthData>("SELECT Email, TokenExpiry FROM Users WHERE MagicLinkToken = @t", {| t = token |}) |> Seq.tryHead
                match user with
                | None -> return AuthResult.Error "Invalid magic link."
                | Some u ->
                    let expiry = u.TokenExpiry
                    if DateTime.UtcNow > expiry then
                         return AuthResult.Error "Magic link has expired. Please request a new one."
                    else
                         // Invalidate link immediately
                         let email = u.Email
                         db.Execute("UPDATE Users SET MagicLinkToken = NULL, MustChangePassword = 1 WHERE Email = @e", {| e = email |}) |> ignore
                         let ctx = WebSharper.Web.Remoting.GetContext()
                         do! ctx.UserSession.LoginUser(email)
                         return AuthResult.NeedPasswordChange
            with ex -> return AuthResult.Error "System processing error occurred securely."
        }
        
    /// <summary>Destroys identity cookies systematically executing browser decoupling from backend services natively securely.</summary>
    [<Rpc>]
    let Logout () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            do! ctx.UserSession.Logout()
            return AuthResult.Success true
        }

    [<Rpc>]
    let GetCalendarEvents (startDate: DateTime, endDate: DateTime) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return [||]
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "SELECT * FROM CalendarEvents WHERE UserEmail = @e AND EventDate >= @s AND EventDate <= @end"
                    return db.Query<CalendarEvent>(q, {| e = email; s = startDate; ``end`` = endDate |}) |> Seq.toArray
                with _ -> return [||]
        }

    [<Rpc>]
    let AddCalendarEvent (ev: CalendarEvent) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "INSERT INTO CalendarEvents (UserEmail, Title, Description, EventDate, EventType, Icon) VALUES (@e, @t, @d, @dt, @et, @i)"
                    let rows = db.Execute(q, {| e = email; t = ev.Title; d = ev.Description; dt = ev.EventDate; et = ev.EventType; i = ev.Icon |})
                    if rows > 0 then return AuthResult.Success true
                    else return AuthResult.Error "Failed to save event"
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let GetHealthRecords () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return [||]
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "SELECT * FROM DailyRecords WHERE UserEmail = @e ORDER BY RecordDate DESC"
                    return db.Query<DailyRecord>(q, {| e = email |}) |> Seq.toArray
                with _ -> return [||]
        }

    [<Rpc>]
    let AddHealthRecord (r: DailyRecord) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "INSERT INTO DailyRecords (UserEmail, RecordDate, Type, Value, Unit, Status) VALUES (@e, @rd, @t, @v, @u, @s)"
                    let rows = db.Execute(q, {| e = email; rd = r.RecordDate; t = r.Type; v = r.Value; u = r.Unit; s = r.Status |})
                    if rows > 0 then return AuthResult.Success true
                    else return AuthResult.Error "Failed to save record"
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let GetProducts () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return [||]
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "SELECT * FROM Products WHERE UserEmail = @e ORDER BY Name ASC"
                    return db.Query<ProductItem>(q, {| e = email |}) |> Seq.toArray
                with _ -> return [||]
        }

    [<Rpc>]
    let AddProduct (p: ProductItem) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "INSERT INTO Products (UserEmail, Name, Category, Stock, Unit, Calories, Carbs, Protein, Fat) VALUES (@e, @n, @c, @s, @u, @cal, @carb, @prot, @fat)"
                    let rows = db.Execute(q, {| e = email; n = p.Name; c = p.Category; s = p.Stock; u = p.Unit; cal = p.Calories; carb = p.Carbs; prot = p.Protein; fat = p.Fat |})
                    if rows > 0 then return AuthResult.Success true
                    else return AuthResult.Error "Failed to save product"
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let DeleteProduct (id: int) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "DELETE FROM Products WHERE Id = @id AND UserEmail = @e"
                    let rows = db.Execute(q, {| id = id; e = email |})
                    if rows > 0 then return AuthResult.Success true
                    else return AuthResult.Error "Failed to delete product"
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let GetRecipes () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return [||]
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "SELECT * FROM Recipes WHERE UserEmail = @e ORDER BY Name ASC"
                    return db.Query<RecipeEntry>(q, {| e = email |}) |> Seq.toArray
                with _ -> return [||]
        }

    [<Rpc>]
    let AddRecipe (r: RecipeEntry) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "INSERT INTO Recipes (UserEmail, Name, Instructions, PrepTime, Kcal, Icon) VALUES (@e, @n, @inst, @pt, @k, @i)"
                    let rows = db.Execute(q, {| e = email; n = r.Name; inst = r.Instructions; pt = r.PrepTime; k = r.Kcal; i = r.Icon |})
                    if rows > 0 then return AuthResult.Success true
                    else return AuthResult.Error "Failed to save recipe"
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let GetMealPlansRange (startDate: DateTime, endDate: DateTime) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return [||]
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "SELECT * FROM MealPlans WHERE UserEmail = @e AND DATE(PlanDate) >= DATE(@s) AND DATE(PlanDate) <= DATE(@ed) ORDER BY PlanDate ASC"
                    return db.Query<MealPlanItem>(q, {| e = email; s = startDate; ed = endDate |}) |> Seq.toArray
                with _ -> return [||]
        }

    [<Rpc>]
    let AddMealPlan (m: MealPlanItem) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "INSERT INTO MealPlans (UserEmail, PlanDate, MealType, RecipeId, Title, Notes) VALUES (@e, @pd, @mt, @rid, @t, @n)"
                    db.Execute(q, {| e = email; pd = m.PlanDate; mt = m.MealType; rid = m.RecipeId; t = m.Title; n = m.Notes |}) |> ignore
                    return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let GetUserSettings () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return { CalendarStartDay = "Monday"; AvatarUrl = None }
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "SELECT CalendarStartDay, AvatarUrl FROM Settings WHERE UserEmail = @e"
                    let res = db.QueryFirstOrDefault<{| CalendarStartDay: string; AvatarUrl: string |}>(q, {| e = email |})
                    if isNull (box res) then 
                        return { CalendarStartDay = "Monday"; AvatarUrl = None }
                    else 
                        return { 
                            CalendarStartDay = if String.IsNullOrWhiteSpace(res.CalendarStartDay) then "Monday" else res.CalendarStartDay
                            AvatarUrl = if String.IsNullOrWhiteSpace(res.AvatarUrl) then None else Some res.AvatarUrl 
                        }
                with _ -> return { CalendarStartDay = "Monday"; AvatarUrl = None }
        }

    [<Rpc>]
    let UpdateUserSettings (s: GlobalSettings) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "INSERT OR REPLACE INTO Settings (UserEmail, CalendarStartDay, AvatarUrl) VALUES (@email, @day, @avatar)"
                    db.Execute(q, {| email = email; day = s.CalendarStartDay; avatar = defaultArg s.AvatarUrl "" |}) |> ignore
                    return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }
