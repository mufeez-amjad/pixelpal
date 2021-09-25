/*
    Setup SQL file that runs on app startup
    Creates tables if they don't exist
    Probably replace this with a migration system eventually
    (to allow for schema changing app updates)
*/

/* 
    habits:
        id: unique id
        name: habit name
        last_completed_at: timestamp (text, sqlite does not have date/time types)
                           that habit was most recently completed at

    habit_triggers:
        id: unique id
        habit_id: FK to habit
        interval: how often the reminders appear (in minutes)
        days: string representing days to trigger on (TODO: find better solution)
                eg: MWRSU = trigger on mondays, wednesdays, thursdays, saturdays, and sundays
                M = Monday
                T = Tuesday
                W = Wednesday
                R = Thursday
                F = Friday
                S = Saturday
                U = Sunday
*/

CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    last_completed_at TEXT
);

CREATE TABLE IF NOT EXISTS habit_triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER,
    interval INTEGER,
    days TEXT,
    FOREIGN KEY(habit_id) REFERENCES habits(id)
);
