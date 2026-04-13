open System
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Hosting
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.DependencyInjection
open WebSharper.AspNetCore
open WebSharperApp

[<EntryPoint>]
let main args =
    let builder = WebApplication.CreateBuilder(args)
    
    // Initialize Database
    Database.InitDb()

    // Add services to the container.
    builder.Services.AddWebSharper()
        .AddAuthentication("WebSharper")
        .AddCookie("WebSharper", fun options -> 
            options.Cookie.HttpOnly <- true
            options.Cookie.SecurePolicy <- Microsoft.AspNetCore.Http.CookieSecurePolicy.Always
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

    app.UseHttpsRedirection() |> ignore

    app.Use(fun (context: HttpContext) (next: Func<System.Threading.Tasks.Task>) ->
        context.Response.Headers.Append("X-Content-Type-Options", "nosniff")
        context.Response.Headers.Append("X-Frame-Options", "DENY")
        context.Response.Headers.Append("X-XSS-Protection", "1; mode=block")
        context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin")
        next.Invoke()
    ) |> ignore

    app.UseAuthentication()
        .UseStaticFiles()
        .UseWebSharper(fun ws -> ws.Sitelet(Site.Main) |> ignore)
    |> ignore

    app.Run()

    0 // Exit code
