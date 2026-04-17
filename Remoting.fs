namespace WebSharperApp

open WebSharper
open Dapper
open BCrypt.Net
open System
open System.IO
open System.Collections.Concurrent

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

    let SendEmailChangeLink (email: string, token: string) =
        printfn "----------------------------------------------------"
        printfn "[MOCK EMAIL OUTBOX]"
        printfn "To: %s" email
        printfn "Subject: Confirm Your New Email Address"
        printfn "Body: Please click here to verify your new email: http://localhost:5000/verify-email-change?token=%s" token
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
type UserAuthData = { 
    Username: string
    Email: string
    PasswordHash: string
    IsEmailVerified: int64
    MustChangePassword: int64
    TokenExpiry: System.DateTime 
}

/// <summary>Sub-record for minimal auth state checks natively mapping specific Dapper partial result sets.</summary>
[<CLIMutable>]
type UserLiteData = { Username: string; IsEmailVerified: int64 }

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


type EndPoint =
    | [<EndPoint "/">] Home
    | [<EndPoint "/auth">] Auth
    | [<EndPoint "/forgot-password">] ForgotPassword
    | [<EndPoint "/verify-email">] VerifyEmail of token: string
    | [<EndPoint "/magic-login">] MagicLogin of token: string
    | [<EndPoint "/change-password">] ChangePassword
    | [<EndPoint "/dashboard">] Dashboard
    | [<EndPoint "/planner">] Planner
    | [<EndPoint "/calendar">] Calendar
    | [<EndPoint "/products">] Products
    | [<EndPoint "/recipes">] Recipes
    | [<EndPoint "/records">] Records
    | [<EndPoint "/settings">] Settings
    | [<EndPoint "/@{Username}">] Profile of Username:string
    | [<EndPoint "/verify-email-change">] VerifyEmailChange of Token:string

[<JavaScript>]
[<CLIMutable>]
type GlobalSettings =
    { 
        Username: string
        Email: string
        PendingEmail: string option
        CalendarStartDay: string; 
        AvatarUrl: string option
        IsProfilePublic: bool
    }

[<JavaScript>]
[<CLIMutable>]
type UserHealthSettings = {
    Sex: string
    HeightCm: float
    WeightKg: float
    BloodType: string
    BirthYear: int
    BirthMonth: int
    BirthDay: int
    JobType: string
    ExerciseFrequency: string
    ExerciseTypes: string
}

[<JavaScript>]
[<CLIMutable>]
type PublicProfile = {
    Username: string
    AvatarUrl: string option
    IsPublic: bool
    IsOwner: bool
}

module Server =

    let authRateLimits = ConcurrentDictionary<string, ResizeArray<DateTime>>()

    let normalizeEmailKey (email: string) =
        if String.IsNullOrWhiteSpace(email) then "blank"
        else email.Trim().ToLowerInvariant()

    let isRateLimited (key: string) (maxAttempts: int) (window: TimeSpan) =
        let now = DateTime.UtcNow
        let bucket = authRateLimits.GetOrAdd(key, fun _ -> ResizeArray<DateTime>())
        lock bucket (fun () ->
            let cutoff = now - window
            bucket.RemoveAll(fun ts -> ts < cutoff) |> ignore
            if bucket.Count >= maxAttempts then true
            else
                bucket.Add(now)
                false
        )

    let isValidPassword (p: string) =
        if String.IsNullOrWhiteSpace(p) then false
        else
            let hasLower = System.Text.RegularExpressions.Regex.IsMatch(p, "[a-z]")
            let hasUpper = System.Text.RegularExpressions.Regex.IsMatch(p, "[A-Z]")
            let hasDigit = System.Text.RegularExpressions.Regex.IsMatch(p, "[0-9]")
            let hasSpecial = System.Text.RegularExpressions.Regex.IsMatch(p, """[!@#$%^&*(),.?":{}|<>]""")
            p.Length >= 8 && p.Length <= 16 && hasLower && hasUpper && hasDigit && hasSpecial

    let isValidUsername (name: string) =
        not (String.IsNullOrWhiteSpace(name))
        && System.Text.RegularExpressions.Regex.IsMatch(name, "^[A-Za-z0-9_.-]{3,32}$")

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

                    let (username: string) = null // Explicitly don't create a user name
                    let existingUser = db.QueryFirstOrDefault<int>("SELECT Count(1) FROM Users WHERE Email = @e", {| e = email |})
                    
                    if existingUser > 0 then
                        return AuthResult.Error "Email already exists."
                    else
                        let hash = BCrypt.HashPassword(password)
                        let verToken = Guid.NewGuid().ToString("N")
                        let verExpiry = DateTime.UtcNow.AddHours(24.0)
                        
                        let insertQuery = """
                            INSERT INTO Users (Username, Email, PasswordHash, VerificationToken, VerificationTokenExpiry, IsEmailVerified)
                            VALUES (@u, @e, @p, @t, @tx, 0)
                        """
                        let rows = db.Execute(insertQuery, {| u = username; e = email; p = hash; t = verToken; tx = verExpiry |})
                        if rows > 0 then
                            MockMailer.SendVerificationEmail(email, verToken)
                            
                            let ctx = WebSharper.Web.Remoting.GetContext()
                            do! ctx.UserSession.LoginUser(email)
                            return AuthResult.LoggedIn (username, false)
                        else
                            return AuthResult.Error "Failed to register user."
                with
                | ex -> return AuthResult.Error ("Register error: " + ex.Message)
        }

    [<Rpc>]
    let LoginUser (email: string, password: string) =
        async {
              let emailKey = normalizeEmailKey email
              if isRateLimited ("login:" + emailKey) 5 (TimeSpan.FromMinutes(1.0)) then
                  return AuthResult.Error "Too many login attempts. Please wait a minute and try again."
              else
                  try
                      use db = Database.GetConnection()
                      db.Open()
                      let q = "SELECT * FROM Users WHERE Email = @e"
                      let user = db.Query<UserAuthData>(q, {| e = email |}) |> Seq.tryHead
                      
                      match user with
                      | None -> return AuthResult.Error "Invalid email or password."
                      | Some u ->
                           let hash : string = u.PasswordHash
                           if BCrypt.Verify(password, hash) then
                               authRateLimits.TryRemove("login:" + emailKey) |> ignore
                               let ctx = WebSharper.Web.Remoting.GetContext()
                               do! ctx.UserSession.LoginUser(email)
                                
                               let isVerified = u.IsEmailVerified = 1L
                               let mustChange = u.MustChangePassword = 1L
                                
                               if mustChange then return AuthResult.NeedPasswordChange
                               else return AuthResult.LoggedIn (u.Username, isVerified)
                           else
                                return AuthResult.Error "Invalid email or password."
                  with ex -> return AuthResult.Error ("Login error: " + ex.Message)
         }

    [<Rpc>]
    let CheckAuthState () =
        async {
            try
                let ctx = WebSharper.Web.Remoting.GetContext()
                let! emailOpt = ctx.UserSession.GetLoggedInUser()
                match emailOpt with
                | None -> return AuthResult.Error "Not logged in."
                | Some email ->
                    use db = Database.GetConnection()
                    db.Open()
                    let q = "SELECT Username, IsEmailVerified FROM Users WHERE Email = @e"
                    let user = db.Query<UserLiteData>(q, {| e = email |}) |> Seq.tryHead
                    match user with
                    | None -> 
                        printfn "[AUTH] Stale session for email: %s (User not found in DB)" email
                        return AuthResult.Error "Invalid session."
                    | Some u -> 
                        return AuthResult.LoggedIn (u.Username, u.IsEmailVerified = 1L)
            with ex ->
                printfn "[AUTH] CheckAuthState error: %s" ex.Message
                return AuthResult.Error ("Check state error: " + ex.Message)
        }
        
    [<Rpc>]
    let TriggerMagicLink (email: string) =
        async {
            try
                let emailKey = normalizeEmailKey email
                if isRateLimited ("magic-link:" + emailKey) 3 (TimeSpan.FromMinutes(10.0)) then
                    return AuthResult.Success true
                else
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
                        return AuthResult.Success true
            with ex -> return AuthResult.Error "System processing error occurred securely."
        }

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

    [<Rpc>]
    let UpdateUsername (newName: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated."
            | Some email ->
                if not (isValidUsername newName) then
                    return AuthResult.Error "Username must be 3-32 chars and only contain letters, numbers, dot, underscore, or hyphen."
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
        
    [<Rpc>]
    let AttemptVerifyEmail (token: string) =
        async {
            try
                use db = Database.GetConnection()
                db.Open()
                let rows = db.Execute("UPDATE Users SET IsEmailVerified = 1, VerificationToken = NULL, VerificationTokenExpiry = NULL WHERE VerificationToken = @t AND VerificationTokenExpiry IS NOT NULL AND VerificationTokenExpiry > @now", {| t = token; now = DateTime.UtcNow |})
                if rows > 0 then return AuthResult.Success true
                else return AuthResult.Error "Invalid or expired verification token."
            with ex -> return AuthResult.Error "System processing error occurred securely."
        }

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
                         let email = u.Email
                         db.Execute("UPDATE Users SET MagicLinkToken = NULL, MustChangePassword = 1 WHERE Email = @e", {| e = email |}) |> ignore
                         let ctx = WebSharper.Web.Remoting.GetContext()
                         do! ctx.UserSession.LoginUser(email)
                         return AuthResult.NeedPasswordChange
            with ex -> return AuthResult.Error "System processing error occurred securely."
        }
        
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
                    let q = "SELECT * FROM CalendarEvents WHERE UserId = (SELECT Id FROM Users WHERE Email = @e) AND EventDate >= @s AND EventDate <= @end"
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
                    let q = "INSERT INTO CalendarEvents (UserId, Title, Description, EventDate, EventType, Icon) VALUES ((SELECT Id FROM Users WHERE Email = @e), @t, @d, @dt, @et, @i)"
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
                    let q = "SELECT * FROM DailyRecords WHERE UserId = (SELECT Id FROM Users WHERE Email = @e) ORDER BY RecordDate DESC"
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
                    let q = "INSERT INTO DailyRecords (UserId, RecordDate, Type, Value, Unit, Status) VALUES ((SELECT Id FROM Users WHERE Email = @e), @rd, @t, @v, @u, @s)"
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
                    let q = "SELECT * FROM Products WHERE UserId = (SELECT Id FROM Users WHERE Email = @e) ORDER BY Name ASC"
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
                    let q = "INSERT INTO Products (UserId, Name, Category, Stock, Unit, Calories, Carbs, Protein, Fat) VALUES ((SELECT Id FROM Users WHERE Email = @e), @n, @c, @s, @u, @cal, @carb, @prot, @fat)"
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
                    let q = "DELETE FROM Products WHERE Id = @id AND UserId = (SELECT Id FROM Users WHERE Email = @e)"
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
                    let q = "SELECT * FROM Recipes WHERE UserId = (SELECT Id FROM Users WHERE Email = @e) ORDER BY Name ASC"
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
                    let q = "INSERT INTO Recipes (UserId, Name, Instructions, PrepTime, Kcal, Icon) VALUES ((SELECT Id FROM Users WHERE Email = @e), @n, @inst, @pt, @k, @i)"
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
                    let q = "SELECT * FROM MealPlans WHERE UserId = (SELECT Id FROM Users WHERE Email = @e) AND DATE(PlanDate) >= DATE(@s) AND DATE(PlanDate) <= DATE(@ed) ORDER BY PlanDate ASC"
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
                    let q = "INSERT INTO MealPlans (UserId, PlanDate, MealType, RecipeId, Title, Notes) VALUES ((SELECT Id FROM Users WHERE Email = @e), @pd, @mt, @rid, @t, @n)"
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
            | None -> return { Username = ""; Email = ""; PendingEmail = None; CalendarStartDay = "Monday"; AvatarUrl = None; IsProfilePublic = true }
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = """
                        SELECT u.Username, u.Email, u.PendingEmail, s.CalendarStartDay, s.AvatarUrl, COALESCE(s.IsProfilePublic, 1) AS IsProfilePublic
                        FROM Users u
                        LEFT JOIN UserSettings s ON u.Id = s.UserId
                        WHERE u.Email = @e
                    """
                    let res = db.QueryFirstOrDefault<{| Username: string; Email: string; PendingEmail: string; CalendarStartDay: string; AvatarUrl: string; IsProfilePublic: int64 |}>(q, {| e = email |})
                    if isNull (box res) then 
                        return { Username = ""; Email = email; PendingEmail = None; CalendarStartDay = "Monday"; AvatarUrl = None; IsProfilePublic = true }
                    else 
                        return { 
                            Username = if String.IsNullOrWhiteSpace(res.Username) then "" else res.Username
                            Email = res.Email
                            PendingEmail = if String.IsNullOrWhiteSpace(res.PendingEmail) then None else Some res.PendingEmail
                            CalendarStartDay = if String.IsNullOrWhiteSpace(res.CalendarStartDay) then "Monday" else res.CalendarStartDay
                            AvatarUrl = if String.IsNullOrWhiteSpace(res.AvatarUrl) then None else Some res.AvatarUrl
                            IsProfilePublic = res.IsProfilePublic <> 0L
                        }
                with _ -> return { Username = ""; Email = email; PendingEmail = None; CalendarStartDay = "Monday"; AvatarUrl = None; IsProfilePublic = true }
        }

    [<Rpc>]
    let CheckUsernameAvailability (username: string) =
        async {
            if not (isValidUsername username) then
                return false
            else
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let count = db.QuerySingle<int>("SELECT COUNT(*) FROM Users WHERE Username = @u", {| u = username |})
                    return count = 0
                with _ -> return false
        }

    [<Rpc>]
    let SaveUsername (newUsername: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    if not (isValidUsername newUsername) then
                        return AuthResult.Error "Username must be 3-32 chars and only contain letters, numbers, dot, underscore, or hyphen."
                    else
                        use db = Database.GetConnection()
                        db.Open()
                        // Re-check uniqueness
                        let count = db.QuerySingle<int>("SELECT COUNT(*) FROM Users WHERE Username = @u AND Email <> @e", {| u = newUsername; e = email |})
                        if count > 0 then
                            return AuthResult.Error "Username already taken"
                        else
                            db.Execute("UPDATE Users SET Username = @u WHERE Email = @e", {| u = newUsername; e = email |}) |> ignore
                            return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let RequestEmailChange (newEmail: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some currentEmail ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    // Check if new email is taken
                    let count = db.QuerySingle<int>("SELECT COUNT(*) FROM Users WHERE Email = @e", {| e = newEmail |})
                    if count > 0 then
                        return AuthResult.Error "Email already in use"
                    else
                        let token = Guid.NewGuid().ToString("N")
                        let expiry = DateTime.UtcNow.AddHours(2.0)
                        
                        db.Execute("""
                            UPDATE Users 
                            SET PendingEmail = @pe, PendingEmailToken = @t, PendingEmailExpiry = @ex 
                            WHERE Email = @e
                        """, {| pe = newEmail; t = token; ex = expiry; e = currentEmail |}) |> ignore
                        
                        MockMailer.SendEmailChangeLink(newEmail, token)
                        return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let CancelEmailChange () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    db.Execute("UPDATE Users SET PendingEmail = NULL, PendingEmailToken = NULL, PendingEmailExpiry = NULL WHERE Email = @e", {| e = email |}) |> ignore
                    return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let VerifyEmailChange (token: string) =
        async {
            try
                use db = Database.GetConnection()
                db.Open()
                let user = db.QueryFirstOrDefault<{| Id: int; Email: string; PendingEmail: string |}>(
                            "SELECT Id, Email, PendingEmail FROM Users WHERE PendingEmailToken = @t AND PendingEmailExpiry > @now", 
                            {| t = token; now = DateTime.UtcNow |})
                
                if isNull (box user) then
                    return AuthResult.Error "Invalid or expired token"
                else
                    // Swap email
                    db.Execute("""
                        UPDATE Users 
                        SET Email = @ne, PendingEmail = NULL, PendingEmailToken = NULL, PendingEmailExpiry = NULL 
                        WHERE Id = @id
                    """, {| ne = user.PendingEmail; id = user.Id |}) |> ignore
                    
                    // Re-login with new email for the session
                    let ctx = WebSharper.Web.Remoting.GetContext()
                    do! ctx.UserSession.LoginUser(user.PendingEmail, persistent = true)
                    
                    return AuthResult.Success true
            with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let GetPublicProfile (username: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! viewerEmailOpt = ctx.UserSession.GetLoggedInUser()
            try
                use db = Database.GetConnection()
                db.Open()
                let q = """
                    SELECT u.Username, u.Email, s.AvatarUrl, COALESCE(s.IsProfilePublic, 1) AS IsProfilePublic
                    FROM Users u
                    LEFT JOIN UserSettings s ON u.Id = s.UserId
                    WHERE u.Username = @u
                """
                let res = db.QueryFirstOrDefault<{| Username: string; Email: string; AvatarUrl: string; IsProfilePublic: int64 |}>(q, {| u = username |})
                if isNull (box res) then return None
                else
                    let isOwner =
                        match viewerEmailOpt with
                        | Some viewerEmail -> String.Equals(viewerEmail, res.Email, StringComparison.OrdinalIgnoreCase)
                        | None -> false
                    let isPublic = res.IsProfilePublic <> 0L
                    let canViewAvatar = isPublic || isOwner
                    let avatarUrl =
                        if canViewAvatar && not (String.IsNullOrWhiteSpace(res.AvatarUrl)) then Some res.AvatarUrl
                        else None
                    return Some { Username = res.Username; AvatarUrl = avatarUrl; IsPublic = isPublic; IsOwner = isOwner } : PublicProfile option
            with _ -> return None
        }
    
    [<Rpc>]
    let UploadAvatar (base64Data: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    // 1. Get User Id
                    use db = Database.GetConnection()
                    db.Open()
                    let userId = db.QuerySingle<int>("SELECT Id FROM Users WHERE Email = @e", {| e = email |})

                    let isPng = base64Data.StartsWith("data:image/png;base64,", StringComparison.OrdinalIgnoreCase)
                    let isJpeg = base64Data.StartsWith("data:image/jpeg;base64,", StringComparison.OrdinalIgnoreCase)
                                 || base64Data.StartsWith("data:image/jpg;base64,", StringComparison.OrdinalIgnoreCase)
                    if not (isPng || isJpeg) then
                        return AuthResult.Error "Only PNG or JPEG avatar uploads are allowed."
                    else
                        // 2. Prepare Data
                        let data = 
                            if base64Data.Contains(",") then base64Data.Split(',').[1]
                            else base64Data
                        let bytes = Convert.FromBase64String(data)
                        let maxBytes = 5 * 1024 * 1024
                        if bytes.Length > maxBytes then
                            return AuthResult.Error "Avatar file is too large. Max size is 5MB."
                        else
                            // 3. Generate Filename: [UserId]-[random6].jpg
                            let randomHex = Guid.NewGuid().ToString("N").Substring(0, 6)
                            let extension = if isPng then "png" else "jpg"
                            let fileName = sprintf "%d-%s.%s" userId randomHex extension
                            let savePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "avatars", fileName)
                            
                            // 4. Save to Disk
                            File.WriteAllBytes(savePath, bytes)
                            
                            // 5. Update Database
                            let avatarUrl = "/avatars/" + fileName
                            let q = """
                                INSERT INTO UserSettings (UserId, AvatarUrl)
                                VALUES (@userId, @url)
                                ON CONFLICT(UserId) DO UPDATE SET AvatarUrl = excluded.AvatarUrl
                            """
                            db.Execute(q, {| userId = userId; url = avatarUrl |}) |> ignore
                            
                            return AuthResult.LoggedIn (avatarUrl, true) // Reusing LoggedIn to return the new URL as the 'Username' field for convenience in Client.fs
                with ex -> return AuthResult.Error ex.Message
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
                    let q = """
                        INSERT INTO UserSettings (UserId, CalendarStartDay, AvatarUrl, IsProfilePublic)
                        VALUES ((SELECT Id FROM Users WHERE Email = @email), @day, @avatar, @visibility)
                        ON CONFLICT(UserId) DO UPDATE SET
                            CalendarStartDay = excluded.CalendarStartDay,
                            AvatarUrl = excluded.AvatarUrl,
                            IsProfilePublic = excluded.IsProfilePublic
                    """
                    let visibility = if s.IsProfilePublic then 1 else 0
                    db.Execute(q, {| email = email; day = s.CalendarStartDay; avatar = defaultArg s.AvatarUrl ""; visibility = visibility |}) |> ignore
                    return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let SetProfileVisibility (isPublic: bool) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let visibility = if isPublic then 1 else 0
                    let q = """
                        INSERT INTO UserSettings (UserId, IsProfilePublic)
                        VALUES ((SELECT Id FROM Users WHERE Email = @email), @visibility)
                        ON CONFLICT(UserId) DO UPDATE SET
                            IsProfilePublic = excluded.IsProfilePublic
                    """
                    db.Execute(q, {| email = email; visibility = visibility |}) |> ignore
                    return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let ChangePassword (newPassword: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    if not (isValidPassword newPassword) then
                        return AuthResult.Error "Password must be 8-16 characters and contain uppercase, lowercase, numbers, and special characters."
                    else
                        let hash = BCrypt.Net.BCrypt.HashPassword(newPassword)
                        use db = Database.GetConnection()
                        db.Open()
                        let q = "UPDATE Users SET PasswordHash = @p WHERE Email = @e"
                        db.Execute(q, {| e = email; p = hash |}) |> ignore
                        return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let GetHealthSettings () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            let empty = { Sex = ""; HeightCm = 0.0; WeightKg = 0.0; BloodType = ""; BirthYear = 0; BirthMonth = 0; BirthDay = 0; JobType = ""; ExerciseFrequency = ""; ExerciseTypes = "" }
            match emailOpt with
            | None -> return empty
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = """
                        SELECT Sex, HeightCm, WeightKg, BloodType,
                               BirthYear, BirthMonth, BirthDay,
                               JobType, ExerciseFrequency, ExerciseTypes
                        FROM UserSettingsHealth
                        WHERE UserId = (SELECT Id FROM Users WHERE Email = @e)
                    """
                    let res = db.QueryFirstOrDefault<{| Sex: string; HeightCm: float; WeightKg: float; BloodType: string; BirthYear: int; BirthMonth: int; BirthDay: int; JobType: string; ExerciseFrequency: string; ExerciseTypes: string |}>(q, {| e = email |})
                    if isNull (box res) then return empty
                    else return { Sex = res.Sex; HeightCm = res.HeightCm; WeightKg = res.WeightKg; BloodType = res.BloodType; BirthYear = res.BirthYear; BirthMonth = res.BirthMonth; BirthDay = res.BirthDay; JobType = res.JobType; ExerciseFrequency = res.ExerciseFrequency; ExerciseTypes = res.ExerciseTypes }
                with _ -> return empty
        }

    [<Rpc>]
    let SaveHealthSettings (h: UserHealthSettings) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let q = """
                        INSERT INTO UserSettingsHealth (
                            UserId, Sex, HeightCm, WeightKg, BloodType,
                            BirthYear, BirthMonth, BirthDay,
                            JobType, ExerciseFrequency, ExerciseTypes
                        ) VALUES (
                            (SELECT Id FROM Users WHERE Email = @e),
                            @sex, @h, @w, @bt, @by, @bm, @bd, @jt, @ef, @et
                        )
                        ON CONFLICT(UserId) DO UPDATE SET
                            Sex               = excluded.Sex,
                            HeightCm          = excluded.HeightCm,
                            WeightKg          = excluded.WeightKg,
                            BloodType         = excluded.BloodType,
                            BirthYear         = excluded.BirthYear,
                            BirthMonth        = excluded.BirthMonth,
                            BirthDay          = excluded.BirthDay,
                            JobType           = excluded.JobType,
                            ExerciseFrequency = excluded.ExerciseFrequency,
                            ExerciseTypes     = excluded.ExerciseTypes
                    """
                    db.Execute(q, {| e = email; sex = h.Sex; h = h.HeightCm; w = h.WeightKg; bt = h.BloodType; by = h.BirthYear; bm = h.BirthMonth; bd = h.BirthDay; jt = h.JobType; ef = h.ExerciseFrequency; et = h.ExerciseTypes |}) |> ignore
                    return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let UploadAvatarBase64 (dataUrl: string) : Async<Result<string, string>> =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return Result.Error "Not authenticated"
            | Some email ->
                try
                    // parse "data:image/png;base64,....."
                    let parts = dataUrl.Split(',')
                    let base64 = if parts.Length > 1 then parts.[1] else parts.[0]
                    let bytes = System.Convert.FromBase64String(base64)
                    
                    use db = Database.GetConnection()
                    db.Open()
                    let userId = db.QuerySingle<int>("SELECT Id FROM Users WHERE Email = @e", {| e = email |})
                    
                    let filename = sprintf "%d.jpg" userId
                    let relPath = sprintf "/avatars/%s" filename
                    let dir = System.IO.Path.Combine("wwwroot", "avatars")
                    if not (System.IO.Directory.Exists(dir)) then System.IO.Directory.CreateDirectory(dir) |> ignore
                    let fullPath = System.IO.Path.Combine(dir, filename)
                    System.IO.File.WriteAllBytes(fullPath, bytes)
                    
                    let urlWithCacheBuster = sprintf "%s?v=%d" relPath (System.DateTimeOffset.UtcNow.ToUnixTimeSeconds())
                    
                    db.Execute("INSERT INTO UserSettings (UserId, AvatarUrl) VALUES (@uid, @url) ON CONFLICT(UserId) DO UPDATE SET AvatarUrl = excluded.AvatarUrl", {| uid = userId; url = relPath |}) |> ignore
                    
                    return Result.Ok urlWithCacheBuster
                with ex -> return Result.Error ex.Message
        }

    [<Rpc>]
    let ToggleProfilePublic (isPublic: bool) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let userId = db.QuerySingle<int>("SELECT Id FROM Users WHERE Email = @e", {| e = email |})
                    let p = if isPublic then 1 else 0
                    db.Execute("INSERT INTO UserSettings (UserId, IsProfilePublic) VALUES (@uid, @p) ON CONFLICT(UserId) DO UPDATE SET IsProfilePublic = excluded.IsProfilePublic", {| uid = userId; p = p |}) |> ignore
                    return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }
        
    [<Rpc>]
    let ChangeEmailDirect (newEmail: string) =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            let! emailOpt = ctx.UserSession.GetLoggedInUser()
            match emailOpt with
            | None -> return AuthResult.Error "Not authenticated"
            | Some email ->
                try
                    use db = Database.GetConnection()
                    db.Open()
                    let count = db.QuerySingle<int>("SELECT COUNT(*) FROM Users WHERE Email = @ne", {| ne = newEmail |})
                    if count > 0 then return AuthResult.Error "Email is already taken"
                    else 
                        db.Execute("UPDATE Users SET Email = @ne WHERE Email = @e", {| ne = newEmail; e = email |}) |> ignore
                        do! ctx.UserSession.LoginUser(newEmail)
                        return AuthResult.Success true
                with ex -> return AuthResult.Error ex.Message
        }
