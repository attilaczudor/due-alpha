namespace WebSharperApp

open System.Data
open Microsoft.Data.Sqlite
open Dapper

module Database =
    
    let connectionString = "Data Source=app.sqlite"

    let GetConnection () : IDbConnection =
        new SqliteConnection(connectionString) :> IDbConnection

    let InitDb () =
        using (GetConnection()) (fun db ->
            db.Open()

            // ── Core users table ──────────────────────────────────────────────────────
            db.Execute("""
                CREATE TABLE IF NOT EXISTS Users (
                    Id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    Username     TEXT    UNIQUE,
                    Email        TEXT    NOT NULL UNIQUE,
                    PasswordHash TEXT    NOT NULL
                );
            """) |> ignore

            // ── Auth column migrations ────────────────────────────────────────────────
            for col in [
                "ALTER TABLE Users ADD COLUMN IsEmailVerified    INTEGER  NOT NULL DEFAULT 0;"
                "ALTER TABLE Users ADD COLUMN VerificationToken  TEXT;"
                "ALTER TABLE Users ADD COLUMN VerificationTokenExpiry DATETIME;"
                "ALTER TABLE Users ADD COLUMN MagicLinkToken     TEXT;"
                "ALTER TABLE Users ADD COLUMN TokenExpiry        DATETIME;"
                "ALTER TABLE Users ADD COLUMN MustChangePassword INTEGER  NOT NULL DEFAULT 0;"
                "ALTER TABLE Users ADD COLUMN PendingEmail        TEXT;"
                "ALTER TABLE Users ADD COLUMN PendingEmailToken   TEXT;"
                "ALTER TABLE Users ADD COLUMN PendingEmailExpiry  DATETIME;"
            ] do
                try db.Execute(col) |> ignore with _ -> ()

            // ── User-owned content tables ─────────────────────────────────────────────
            db.Execute("""
                CREATE TABLE IF NOT EXISTS CalendarEvents (
                    Id          INTEGER  PRIMARY KEY AUTOINCREMENT,
                    UserId      INTEGER  NOT NULL,
                    Title       TEXT     NOT NULL,
                    Description TEXT,
                    EventDate   DATETIME NOT NULL,
                    EventType   TEXT,
                    Icon        TEXT,
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );
                CREATE TABLE IF NOT EXISTS DailyRecords (
                    Id         INTEGER  PRIMARY KEY AUTOINCREMENT,
                    UserId     INTEGER  NOT NULL,
                    RecordDate DATETIME NOT NULL,
                    Type       TEXT     NOT NULL,
                    Value      TEXT     NOT NULL,
                    Unit       TEXT,
                    Status     TEXT,
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );
                CREATE TABLE IF NOT EXISTS Products (
                    Id       INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserId   INTEGER NOT NULL,
                    Name     TEXT    NOT NULL,
                    Category TEXT,
                    Stock    REAL    NOT NULL DEFAULT 0,
                    Unit     TEXT    NOT NULL DEFAULT 'pcs',
                    Calories REAL    NOT NULL DEFAULT 0,
                    Carbs    REAL    NOT NULL DEFAULT 0,
                    Protein  REAL    NOT NULL DEFAULT 0,
                    Fat      REAL    NOT NULL DEFAULT 0,
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );
                CREATE TABLE IF NOT EXISTS Recipes (
                    Id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserId       INTEGER NOT NULL,
                    Name         TEXT    NOT NULL,
                    Instructions TEXT,
                    PrepTime     INTEGER,
                    Kcal         INTEGER,
                    Icon         TEXT,
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );
                CREATE TABLE IF NOT EXISTS MealPlans (
                    Id        INTEGER  PRIMARY KEY AUTOINCREMENT,
                    UserId    INTEGER  NOT NULL,
                    PlanDate  DATETIME NOT NULL,
                    MealType  TEXT     NOT NULL,
                    RecipeId  INTEGER,
                    Title     TEXT,
                    Notes     TEXT,
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );
            """) |> ignore

            // ── Content table migrations ──────────────────────────────────────────────
            let tablesToMigrate = [
                "CalendarEvents"; "DailyRecords"; "Products"; "Recipes"; "MealPlans"
            ]
            
            for tbl in tablesToMigrate do
                let hasUserEmail = 
                    try db.QuerySingleOrDefault<int>(
                            sprintf "SELECT COUNT(*) FROM pragma_table_info('%s') WHERE name = 'UserEmail'" tbl) > 0
                    with _ -> false
                
                if hasUserEmail then
                    let migTbl = tbl + "_mig"
                    // Get columns except Id and UserEmail to build the INSERT statement
                    let cols = 
                        match tbl with
                        | "CalendarEvents" -> "Title, Description, EventDate, EventType, Icon"
                        | "DailyRecords"   -> "RecordDate, Type, Value, Unit, Status"
                        | "Products"       -> "Name, Category, Stock, Unit, Calories, Carbs, Protein, Fat"
                        | "Recipes"        -> "Name, Instructions, PrepTime, Kcal, Icon"
                        | "MealPlans"      -> "PlanDate, MealType, RecipeId, Title, Notes"
                        | _ -> ""
                    
                    if cols <> "" then
                        db.Execute(sprintf """
                            CREATE TABLE IF NOT EXISTS %s AS SELECT * FROM %s WHERE 1=0;
                            -- Adjust schema of temp table (SQLite doesn't support easy DROP column, 
                            -- so we recreate properly)
                        """ migTbl tbl) |> ignore
                        
                        // Re-create proper schema with UserId for migration
                        db.Execute(sprintf "DROP TABLE IF EXISTS %s;" migTbl) |> ignore
                        
                        // We use the same CREATE logic as above but into the _mig table
                        let createSql = 
                            match tbl with
                            | "CalendarEvents" -> sprintf "CREATE TABLE %s (Id INTEGER PRIMARY KEY AUTOINCREMENT, UserId INTEGER NOT NULL, Title TEXT, Description TEXT, EventDate DATETIME, EventType TEXT, Icon TEXT)" migTbl
                            | "DailyRecords"   -> sprintf "CREATE TABLE %s (Id INTEGER PRIMARY KEY AUTOINCREMENT, UserId INTEGER NOT NULL, RecordDate DATETIME, Type TEXT, Value TEXT, Unit TEXT, Status TEXT)" migTbl
                            | "Products"       -> sprintf "CREATE TABLE %s (Id INTEGER PRIMARY KEY AUTOINCREMENT, UserId INTEGER NOT NULL, Name TEXT, Category TEXT, Stock REAL, Unit TEXT, Calories REAL, Carbs REAL, Protein REAL, Fat REAL)" migTbl
                            | "Recipes"        -> sprintf "CREATE TABLE %s (Id INTEGER PRIMARY KEY AUTOINCREMENT, UserId INTEGER NOT NULL, Name TEXT, Instructions TEXT, PrepTime INTEGER, Kcal INTEGER, Icon TEXT)" migTbl
                            | "MealPlans"      -> sprintf "CREATE TABLE %s (Id INTEGER PRIMARY KEY AUTOINCREMENT, UserId INTEGER NOT NULL, PlanDate DATETIME, MealType TEXT, RecipeId INTEGER, Title TEXT, Notes TEXT)" migTbl
                            | _ -> ""
                        
                        db.Execute(createSql) |> ignore
                        
                        db.Execute(sprintf """
                            INSERT INTO %s (UserId, %s)
                            SELECT u.Id, %s
                            FROM   %s o
                            INNER JOIN Users u ON u.Email = o.UserEmail;
                        """ migTbl cols cols tbl) |> ignore
                        
                        db.Execute(sprintf "DROP TABLE IF EXISTS %s;" tbl) |> ignore
                        db.Execute(sprintf "ALTER TABLE %s RENAME TO %s;" migTbl tbl) |> ignore


            // ── UserSettings  (calendar & avatar) ─────────────────────────────────────
            // Create with new schema (UserId FK) if the table doesn't exist yet.
            db.Execute("""
                CREATE TABLE IF NOT EXISTS UserSettings (
                    Id               INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserId           INTEGER NOT NULL UNIQUE,
                    CalendarStartDay TEXT    NOT NULL DEFAULT 'Monday',
                    AvatarUrl        TEXT,
                    IsProfilePublic  INTEGER NOT NULL DEFAULT 1,
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );
            """) |> ignore

            // Migration: old email-based "Settings" or "UserSettings" → new UserId schema
            let hasUserEmailInSettings =
                try db.QuerySingleOrDefault<int>(
                        "SELECT COUNT(*) FROM pragma_table_info('UserSettings') WHERE name = 'UserEmail'") > 0
                with _ -> false

            if hasUserEmailInSettings then
                db.Execute("""
                    CREATE TABLE IF NOT EXISTS UserSettings_mig (
                        Id               INTEGER PRIMARY KEY AUTOINCREMENT,
                        UserId           INTEGER NOT NULL UNIQUE,
                        CalendarStartDay TEXT    NOT NULL DEFAULT 'Monday',
                        AvatarUrl        TEXT,
                        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                    );
                    INSERT OR IGNORE INTO UserSettings_mig (UserId, CalendarStartDay, AvatarUrl)
                    SELECT u.Id, COALESCE(s.CalendarStartDay, 'Monday'), s.AvatarUrl
                    FROM   Users u
                    LEFT JOIN UserSettings s ON s.UserEmail = u.Email;
                """) |> ignore
                try db.Execute("DROP TABLE IF EXISTS UserSettings;") |> ignore with _ -> ()
                try db.Execute("DROP TABLE IF EXISTS Settings;") |> ignore with _ -> ()
                try db.Execute("ALTER TABLE UserSettings_mig RENAME TO UserSettings;") |> ignore with _ -> ()

            // Also drop old flat Settings table if it somehow still exists
            try db.Execute("DROP TABLE IF EXISTS Settings;") |> ignore with _ -> ()

            // Ensure newer profile visibility column exists on already-created databases.
            try db.Execute("ALTER TABLE UserSettings ADD COLUMN IsProfilePublic INTEGER NOT NULL DEFAULT 1;") |> ignore with _ -> ()

            // ── UserSettingsHealth  (health profile) ──────────────────────────────────
            db.Execute("""
                CREATE TABLE IF NOT EXISTS UserSettingsHealth (
                    Id                INTEGER PRIMARY KEY AUTOINCREMENT,
                    UserId            INTEGER NOT NULL UNIQUE,
                    Sex               TEXT,
                    HeightCm          REAL,
                    WeightKg          REAL,
                    BloodType         TEXT,
                    BirthYear         INTEGER,
                    BirthMonth        INTEGER,
                    BirthDay          INTEGER,
                    JobType           TEXT,
                    ExerciseFrequency TEXT,
                    ExerciseTypes     TEXT,
                    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
                );
            """) |> ignore

            // Migrations for new health settings columns
            try db.Execute("ALTER TABLE UserSettingsHealth ADD COLUMN MealFrequency INTEGER NOT NULL DEFAULT 3;") |> ignore with _ -> ()
            try db.Execute("ALTER TABLE UserSettingsHealth ADD COLUMN DietType TEXT;") |> ignore with _ -> ()
            try db.Execute("ALTER TABLE UserSettingsHealth ADD COLUMN Allergies TEXT;") |> ignore with _ -> ()
            try db.Execute("ALTER TABLE UserSettingsHealth ADD COLUMN OtherAllergies TEXT;") |> ignore with _ -> ()


            // Migration: rename/copy old UserHealthSettings → UserSettingsHealth
            let hasOldHealthTable =
                try db.QuerySingleOrDefault<int>(
                        "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='UserHealthSettings'") > 0
                with _ -> false

            if hasOldHealthTable then
                try
                    db.Execute("""
                        INSERT OR IGNORE INTO UserSettingsHealth
                            (UserId, Sex, HeightCm, WeightKg, BloodType,
                             BirthYear, BirthMonth, BirthDay,
                             JobType, ExerciseFrequency, ExerciseTypes)
                        SELECT u.Id, h.Sex, h.HeightCm, h.WeightKg, h.BloodType,
                               h.BirthYear, h.BirthMonth, h.BirthDay,
                               h.JobType, h.ExerciseFrequency, h.ExerciseTypes
                        FROM   UserHealthSettings h
                        INNER JOIN Users u ON u.Email = h.UserEmail;
                    """) |> ignore
                with _ -> ()
                try db.Execute("DROP TABLE IF EXISTS UserHealthSettings;") |> ignore with _ -> ()
        )
