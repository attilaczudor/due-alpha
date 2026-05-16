#r "nuget: Dapper"
#r "nuget: Microsoft.Data.Sqlite"

open Dapper
open Microsoft.Data.Sqlite
open System.Threading

let run () =
    while true do
        try
            use db = new SqliteConnection("Data Source=app.sqlite")
            db.Open()
            let res = db.QueryFirstOrDefault<{| Sex: string; MealFrequency: int |}>("SELECT Sex, MealFrequency FROM UserSettingsHealth WHERE UserId = 1")
            printfn "DB STATE at %A: Sex=%s, MealFrequency=%d" System.DateTime.Now (if isNull res.Sex then "NULL" else res.Sex) res.MealFrequency
        with ex ->
            printfn "Error: %s" ex.Message
        Thread.Sleep(2000)

run ()
