USE ChoreWheel;

-- Apartments Table
DROP TABLE IF EXISTS Apartments;
CREATE TABLE Apartments (
    ApartmentID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NULL,
    Password VARCHAR(255) NOT NULL
);

-- Users Table
DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    ApartmentID INT,
    Name VARCHAR(255) NOT NULL,
    FOREIGN KEY (ApartmentID) REFERENCES Apartments(ApartmentID)
);

-- Tasks Table
DROP TABLE IF EXISTS Tasks;
CREATE TABLE Tasks (
    TaskID INT AUTO_INCREMENT PRIMARY KEY,
    ApartmentID INT,
    UserID INT,
    Title VARCHAR(255) NOT NULL,
    IntervalDays INT NOT NULL,
    DaysRemaining INT NULL,
    Completed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (ApartmentID) REFERENCES Apartments(ApartmentID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);