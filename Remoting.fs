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

[<JavaScript>]
type AuthResult =
    | Success of bool
    | LoggedIn of string * bool // Username, IsVerified
    | NeedPasswordChange
    | Error of string

type UserAuthData = { Username: string; Email: string; PasswordHash: string; IsEmailVerified: int64; MustChangePassword: int64; TokenExpiry: DateTime }

module Server =

    [<Rpc>]
    let RegisterUser (username: string, email: string, password: string) =
        async {
            if String.IsNullOrWhiteSpace(username) || username.Length < 3 then
                return AuthResult.Error "Username must be at least 3 characters."
            elif String.IsNullOrWhiteSpace(email) || not (email.Contains("@")) then
                return AuthResult.Error "Invalid email address."
            elif String.IsNullOrWhiteSpace(password) || password.Length < 8 then
                return AuthResult.Error "Password must be at least 8 securely required characters."
            else
                try
                    use db = Database.GetConnection()
                    db.Open()

                    let existingUser = db.QueryFirstOrDefault<int>("SELECT Count(1) FROM Users WHERE Username = @Username OR Email = @Email", {| Username = username; Email = email |})
                    
                    if existingUser > 0 then
                        return AuthResult.Error "Username or Email already exists."
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
                | ex -> return AuthResult.Error ("System error: " + ex.Message)
        }

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
             with ex -> return AuthResult.Error (ex.Message)
        }

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
            with ex -> return AuthResult.Error ex.Message
        }

    [<Rpc>]
    let ResetPassword (newPassword: string) =
        async {
             let ctx = WebSharper.Web.Remoting.GetContext()
             let! emailOpt = ctx.UserSession.GetLoggedInUser()
             match emailOpt with
             | None -> return AuthResult.Error "Not authenticated to change password."
             | Some email ->
                 if newPassword.Length < 8 then
                     return AuthResult.Error "Password must be at least 8 characters securely."
                 else
                     use db = Database.GetConnection()
                     db.Open()
                     let hash = BCrypt.HashPassword(newPassword)
                     db.Execute("UPDATE Users SET PasswordHash = @h, MustChangePassword = 0 WHERE Email = @e", {| h = hash; e = email |}) |> ignore
                     return AuthResult.Success true
        }
        
    [<Rpc>]
    let AttemptVerifyEmail (token: string) =
        async {
            try
                use db = Database.GetConnection()
                db.Open()
                let rows = db.Execute("UPDATE Users SET IsEmailVerified = 1, VerificationToken = NULL WHERE VerificationToken = @t", {| t = token |})
                if rows > 0 then return AuthResult.Success true
                else return AuthResult.Error "Invalid or expired verification token."
            with ex -> return AuthResult.Error ex.Message
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
                         // Invalidate link immediately
                         let email = u.Email
                         db.Execute("UPDATE Users SET MagicLinkToken = NULL, MustChangePassword = 1 WHERE Email = @e", {| e = email |}) |> ignore
                         let ctx = WebSharper.Web.Remoting.GetContext()
                         do! ctx.UserSession.LoginUser(email)
                         return AuthResult.NeedPasswordChange
            with ex -> return AuthResult.Error ex.Message
        }
        
    [<Rpc>]
    let Logout () =
        async {
            let ctx = WebSharper.Web.Remoting.GetContext()
            do! ctx.UserSession.Logout()
            return AuthResult.Success true
        }
