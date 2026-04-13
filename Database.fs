namespace WebSharperApp

open System.Data
open Microsoft.Data.Sqlite
open Dapper

module Database =
    
    // SQLite Connection String
    let connectionString = "Data Source=app.sqlite"

    /// <summary>Instantiates a strict non-pooling synchronous explicit SQLite connection locally mapping inherently back to IDbConnection structures.</summary>
    let GetConnection () : IDbConnection =
        new SqliteConnection(connectionString) :> IDbConnection

    /// <summary>Boot mechanism mapping baseline SQL SQLite logic injecting specific unmapped fields natively avoiding missing table structural errors synchronously upon load.</summary>
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

            // Calendar and Health Records Tables
            let contentTables = """
                CREATE TABLE IF NOT EXISTS CalendarEvents (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserEmail TEXT NOT NULL,
                    Title TEXT NOT NULL,
                    Description TEXT,
                    EventDate DATETIME NOT NULL,
                    EventType TEXT,
                    Icon TEXT
                );
                CREATE TABLE IF NOT EXISTS DailyRecords (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserEmail TEXT NOT NULL,
                    RecordDate DATETIME NOT NULL,
                    Type TEXT NOT NULL,
                    Value TEXT NOT NULL,
                    Unit TEXT,
                    Status TEXT
                );
                CREATE TABLE IF NOT EXISTS Products (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserEmail TEXT NOT NULL,
                    Name TEXT NOT NULL,
                    Category TEXT,
                    Stock REAL NOT NULL DEFAULT 0,
                    Unit TEXT NOT NULL DEFAULT 'pcs',
                    Calories REAL NOT NULL DEFAULT 0,
                    Carbs REAL NOT NULL DEFAULT 0,
                    Protein REAL NOT NULL DEFAULT 0,
                    Fat REAL NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS Recipes (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserEmail TEXT NOT NULL,
                    Name TEXT NOT NULL,
                    Instructions TEXT,
                    PrepTime INTEGER,
                    Kcal INTEGER,
                    Icon TEXT
                );
                CREATE TABLE IF NOT EXISTS MealPlans (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserEmail TEXT NOT NULL,
                    PlanDate DATETIME NOT NULL,
                    MealType TEXT NOT NULL,
                    RecipeId INTEGER,
                    Title TEXT,
                    Notes TEXT
                );
                CREATE TABLE IF NOT EXISTS Settings (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserEmail TEXT NOT NULL UNIQUE,
                    CalendarStartDay TEXT NOT NULL DEFAULT 'Monday',
                    AvatarUrl TEXT
                );
            """
            db.Execute(contentTables) |> ignore
            
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
