# ChoreWheel
An application to keep track of shared chores among people living together. Enter the flatmate names and the work you have, it will take care of rest.



## Setting Up MySQL Database
### Create a database named ChoreWheel
2. Connect to the database using the following command
```
mysql -u root -p
```
3. Enter the password for your MySQL server
4. Create a user named chorewheel with password chorewheel
```
CREATE USER 'chorewheel'@'localhost' IDENTIFIED BY 'chorewheel';
```
5. Grant all privileges to the user
```
GRANT ALL PRIVILEGES ON * . * TO 'chorewheel'@'localhost';
```
6. Exit MySQL
```
exit
```
7. Connect to MySQL using the new user
```
mysql -u chorewheel -p
```
8. Enter the password for the new user
9. Create a database named ChoreWheel
```
CREATE DATABASE ChoreWheel;
```

### Create tables using the following queries
```
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

```
### Database Schema for ChoreWheel App

#### 1. Apartments Table

- **ApartmentID** (Primary Key): Unique identifier for each apartment.
- **Name**: The name of the apartment (e.g., "Apartment 1").
- **Address**: The address of the apartment.
- **Password**: The password for the apartment.

#### 2. Users Table

- **UserID** (Primary Key): Unique identifier for each user.
- **ApartmentID** (Foreign Key): Links to the ApartmentID in the Apartments table.
- **Name**: The name of the user.

#### 3. Tasks Table

- **TaskID** (Primary Key): Unique identifier for each task.
- **ApartmentID** (Foreign Key): Links to the ApartmentID in the Apartments table.
- **UserID** (Foreign Key): Links to the UserID in the Users table.
- **Title**: The name of the task (e.g., "Unload Dishwasher").
- **Interval**: How often the task should be repeated.
- **DaysRemaining**: Days until the task needs to be completed again.
- **Completed**: Boolean or similar to indicate if the task is completed or not.


## TODO
- Update State when delete Task
- Update state for userTaskList when task is added
- Add Authentication (edit UI too)
- Deploy