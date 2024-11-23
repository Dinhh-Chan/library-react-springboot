# Springboot library management 
## Descriptions Springboot library management system
### Library Management System

**Main Idea:** Support library book management, including adding and editing book information, managing readers, and tracking readers' borrowing and returning of books.

**Requirements:**

- Manage category list.
  
- System for managing book information: book ID, title, author, category.
  
- Users can view the list of books, add, edit, hide/unhide, and delete book information in the library. Allow searching for books by title or author.
  
- Manage information of library readers, each reader has a quota of books they can borrow.
  
- Add new borrowing activity for readers within the borrowing quota and availability of books in stock, reducing the book quantity in stock upon successful borrowing. Allow deletion and updating of borrowing time if the book is not yet returned.
  
- Add new returning activity for readers, increasing the book quantity in stock.
  
- Summarize the borrowing and returning situation weekly, monthly, and per reader.
  
- Statistics on the status of books in stock, including remaining quantity.
## How to run 
### Clone superset 
Cloning the Apache Superset GitHub repo, and navigating to the superset folder from our terminal:
``` 
git clone https://github.com/apache/superset.git
cd superset 
```
Then we can use docker-compose to create all containers needed for Apache Superset
```
docker compose -f docker-compose-non-dev.yml up -d 
```
Now you can go to localhost:8088 on your browser, and login with the safest duo ever (admin as user, and admin as passoword)
### Run docker-compose 
After clone Apache Superset, go to folder Thuvienv1 run this command to start container docker postgres: 
``` 
docker compose up -d
```
### Connect Apache Superset to Postgres container 
If you want to create statistical charts from Apache Superset, first you must config to connect Apache Superset with Postgres which is running on docker-compose.
#### There is how to connect Apache Superset to Postgres step by step. 
- Go to localhost:8088 and login with admin user (admin:admin).
- Click on setting and then click <strong>database connections </strong>.
- Click on <strong> + Database </strong> button, then choose PostgreSQL.
- Type config follow this: 
    * Host: 172.17.0.1
    * Port: 5432
    * Database name: library_management
    * Username: library_user
    * Password: library_pass
- Then choose connect 
# Weldone, now you can test the system