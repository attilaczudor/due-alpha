open System
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Configuration
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.DependencyInjection
open WebSharper.AspNetCore
open Microsoft.AspNetCore.Hosting
open WebSharperApp

[<EntryPoint>]
let main args =
    let builder = WebApplication.CreateBuilder(args)
    let defaultPort = 5000
    let port = builder.Configuration.GetValue<int>("Server:Port", defaultPort)
    let enableHttpsRedirection = builder.Configuration.GetValue<bool>("Security:EnableHttpsRedirection", true)
    let requireSecureCookies = builder.Configuration.GetValue<bool>("Security:Cookies:RequireSecure", not (builder.Environment.IsDevelopment()))
    let allowedOrigins =
        builder.Configuration.GetSection("Security:AllowedOrigins").GetChildren()
        |> Seq.choose (fun c ->
            let v = c.Value
            if String.IsNullOrWhiteSpace(v) then None
            else Some (v.TrimEnd('/').ToLowerInvariant())
        )
        |> Set.ofSeq
    
    // Initialize Database
    Database.InitDb()

    // Defaulting back to 5000 as requested. (Note: macOS AirPlay might conflict here).
    builder.WebHost.UseUrls(sprintf "http://localhost:%d" port) |> ignore

    // Ensure Avatars directory exists
    let avatarsPath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", "avatars")
    if not (System.IO.Directory.Exists(avatarsPath)) then
        System.IO.Directory.CreateDirectory(avatarsPath) |> ignore

    // Add services to the container.
    builder.Services.AddWebSharper()
        .AddAuthentication("WebSharper")
        .AddCookie("WebSharper", fun options -> 
            options.Cookie.HttpOnly <- true
            options.Cookie.SecurePolicy <-
                if requireSecureCookies then
                    Microsoft.AspNetCore.Http.CookieSecurePolicy.Always
                else
                    Microsoft.AspNetCore.Http.CookieSecurePolicy.SameAsRequest
            options.Cookie.SameSite <- Microsoft.AspNetCore.Http.SameSiteMode.Strict
            options.ExpireTimeSpan <- System.TimeSpan.FromDays(7.0)
            options.SlidingExpiration <- true
        )
    |> ignore

    let app = builder.Build()

    // Configure the HTTP request pipeline.
    if not (app.Environment.IsDevelopment()) then
        app.UseExceptionHandler("/Error")
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            .UseHsts()
        |> ignore

    if enableHttpsRedirection then
        app.UseHttpsRedirection() |> ignore

    app.Use(fun (context: HttpContext) (next: Func<System.Threading.Tasks.Task>) ->
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff")
        context.Response.Headers.Append("X-Frame-Options", "DENY")
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block")
        context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin")
        next.Invoke()
    ) |> ignore

    // Basic anti-CSRF control for WebSharper RPC POST endpoints.
    app.Use(fun (context: HttpContext) (next: Func<System.Threading.Tasks.Task>) ->
        let isRpcPost =
            HttpMethods.IsPost(context.Request.Method)
            && context.Request.Path.StartsWithSegments(PathString("/Server/"))

        if not isRpcPost then
            next.Invoke()
        else
            let originHeader = context.Request.Headers["Origin"].ToString()
            let requestOrigin =
                if not (String.IsNullOrWhiteSpace(originHeader)) then
                    originHeader
                else
                    let referer = context.Request.Headers["Referer"].ToString()
                    if String.IsNullOrWhiteSpace(referer) then ""
                    else
                        try
                            Uri(referer).GetLeftPart(UriPartial.Authority)
                        with _ -> ""

            if String.IsNullOrWhiteSpace(requestOrigin) then
                context.Response.StatusCode <- StatusCodes.Status403Forbidden
                context.Response.WriteAsync("Forbidden")
            else
                let normalizedOrigin = requestOrigin.TrimEnd('/').ToLowerInvariant()
                let hostOrigin = (sprintf "%s://%s" context.Request.Scheme (context.Request.Host.ToString())).TrimEnd('/').ToLowerInvariant()
                let isAllowed = normalizedOrigin = hostOrigin || allowedOrigins.Contains(normalizedOrigin)
                if isAllowed then
                    next.Invoke()
                else
                    context.Response.StatusCode <- StatusCodes.Status403Forbidden
                    context.Response.WriteAsync("Forbidden")
    ) |> ignore

    app.UseAuthentication()
        .UseStaticFiles()
        .UseWebSharper(fun ws -> ws.Sitelet(Site.Main) |> ignore)
    |> ignore

    app.Run()

    0 // Exit code
