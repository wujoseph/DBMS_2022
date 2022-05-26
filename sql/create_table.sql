create table COMMENT(ID INTEGER AUTO_INCREMENT,Group_ID INTEGER NOT NULL, 
Comment_Time TIME, Comment_Text VARCHAR(50),primary key(ID),
foreign key(Group_ID) references LEARNING_GROUP(Group_ID));

create table LEARNING_GROUP(Group_ID INTEGER AUTO_INCREMENT,primary key(Group_ID),Group_Name VARCHAR(30))AUTO_INCREMENT = 10000;

create table USER(User_ID INTEGER AUTO_INCREMENT,Username VARCHAR(255), Password VARCHAR(255), email varchar(255),primary key(User_ID));

create table TASK(Objective_ID INTEGER, User_ID INTEGER,
Done_Number INTEGER, Status INTEGER,Title VARCHAR(20), 
Start_Date Date,End_Date Date,Description VARCHAR(255),Group_ID INTEGER,primary key(Objective_ID,User_ID));
