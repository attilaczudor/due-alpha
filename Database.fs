namespace WebSharperApp

open System.Data
open Microsoft.Data.Sqlite
open Dapper

module Database =
    
    // SQLite Connection String
    let connectionString = "Data Source=app.sqlite"

    // Helper function to provide a new closed connection
    let GetConnection () : IDbConnection =
        new SqliteConnection(connectionString) :> IDbConnection

    // Initialization query running on server start
    let InitDb () =
        using (GetConnection()) (fun db ->
            db.Open()
            let createTableQuery = """
                CREATE TABLE IF NOT EXISTS Users (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    Username TEXT NOT NULL UNIQUE,
                    Email TEXT NOT NULL UNIQUE,
                    PasswordHash TEXT NOT NULL
                );
            """
            // Execute returns number of rows affected. 
            // We ignore it safely since Dapper executes it synchronously.
            db.Execute(createTableQuery) |> ignore
            
            // Database Migrations: Safely add token/verification columns
            let authMigrations = [
                "ALTER TABLE Users ADD COLUMN IsEmailVerified INTEGER NOT NULL DEFAULT 0;"
                "ALTER TABLE Users ADD COLUMN VerificationToken TEXT;"
                "ALTER TABLE Users ADD COLUMN MagicLinkToken TEXT;"
                "ALTER TABLE Users ADD COLUMN TokenExpiry DATETIME;"
                "ALTER TABLE Users ADD COLUMN MustChangePassword INTEGER NOT NULL DEFAULT 0;"
            ]
            
            for migration in authMigrations do
                try
                    db.Execute(migration) |> ignore
                with 
                | _ -> () // Catch native exceptions cleanly if column already exists
        )
