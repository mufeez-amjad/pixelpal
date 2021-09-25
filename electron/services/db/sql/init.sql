/*
    Setup SQL file that runs on app startup
    Creates tables if they don't exist
    TODO: replace this with a migration system eventually https://www.npmjs.com/package/db-migrate
    (to allow for schema changing app updates)
*/

/* 
    habits:
        id: unique id
        name: habit name
        frequency: how often the reminders appear (in minutes)
        days: string representing days to trigger on (TODO: find better solution)
                eg: MWRSU = trigger on mondays, wednesdays, thursdays, saturdays, and sundays
                M = Monday
                T = Tuesday
                W = Wednesday
                R = Thursday
                F = Friday
                S = Saturday
                U = Sunday
        start_time: earliest time of day user can get reminder 
        end_time: latest time of day user can get reminder
        last_completed_at: timestamp (text, sqlite does not have date/time types)
                           that habit was most recently completed at
*/

CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    frequency INTEGER,
    days TEXT,
    start_time INTEGER,
    end_time INTEGER,
    last_completed_at TEXT
);
