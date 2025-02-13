# CRUD
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

# class SQL:
#     def __init__(self):
#         pass
    
#     def create():
#         pass
#     def read():
#         pass

#     def update():
#         pass

#     def delete():
#         pass

def connect_to_db():
    try:
        # Establishing the connection
        connection = mysql.connector.connect(
            host='riku.shoshin.uwaterloo.ca',  
            user=os.environ['MYSQL_USER'],                       
            password=os.environ['MYSQL_PASSWORD'],            
            database='SE101'                     
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

def compute_gpa(connection):
    try:
        cursor = connection.cursor()

        # Query to select grades and their corresponding weight
        # for studentID 12345689
        # query = """
        # SELECT studentID,sum(grade * weight)/sum(weight) as GPA
        # FROM Grades
        # GROUP BY studentID;
        # """
        query = """
        SHOW TABLES;
        """
        
        cursor.execute(query)
        results = cursor.fetchall()
        print("Results: " + results)
        
        total_points = 0
        total_weight = 0

    except mysql.connector.Error as err:
        print(f"Query Error: {err}")
    finally:
        cursor.close()

def main():
    connection = connect_to_db()
    if connection:
        compute_gpa(connection)
        connection.close()

# if __name__ == '__main':
main()