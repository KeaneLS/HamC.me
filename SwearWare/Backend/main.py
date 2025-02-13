import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Establishing the connection
connection = mysql.connector.connect(
    host='riku.shoshin.uwaterloo.ca',    
    user=os.environ['MYSQL_USER'],                     
    password=os.environ['MYSQL_PASSWORD'],            
    database='db101_a2ayush'                    
)

@app.route("/")
def hello_world():
    return "Hello World"


@app.route("/swear-list/", methods=["GET"])
def swearlist():
    # Define the JSON data
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM swear_list;")  # Assumes a `swear_list` table exists
    swears = cursor.fetchall()

    return jsonify(swears)

@app.route("/swear-log/", methods=["GET"])
def swearlog():
    # Define the JSON data
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM swear_log;")  # Assumes a `swear_list` table exists
    swears = cursor.fetchall()
    print(swears)
    cursor.close()

    return jsonify(swears)


def sweardetected_manual(word, speaker, link):
    print(word, speaker, link)
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE swear_list SET number_of_times_said = number_of_times_said + 1 WHERE word = %s;",
        (word,)
    )
    connection.commit()
    cursor.close()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO swear_log (log_date, swear_name, user_name, swear_link) VALUES (%s, %s, %s, %s);",
        (str(datetime.datetime.now()), word, speaker, f"https://se101.s3.us-east-2.amazonaws.com/{link}")
    )
    connection.commit()
    cursor.close()
    return jsonify({"message": "Swear word occurrence updated successfully!"}), 200

@app.route('/webhook', methods=['POST'])
def webhook():
    # print("Headers:", request.headers)
    # print("Data", request.json)

    # Check if "swear" key exists in the JSON
    if request.json.get("swear"):
        # Log the data to a text file
        with open("swear_log.txt", "a") as log_file:
            log_file.write(f"Webhook data: {request.json['word']}  S3 link: {request.json['amazonS3Link']}\n")

        # print("Logged data to swear_log.txt")
    else:
        try:
            with open("swear_log.txt", "r") as log_file:
                lines = log_file.readlines()
                if not lines:
                    print("Log file is empty.")
                    return None

                # Get the last logged entry
                last_line = lines[-1]
                # print(f"Last line from log: {last_line}")

                # Extract the JSON part
                if "Webhook data:" in last_line:
                    json_part = last_line.split("Webhook data: ")[1]
                    json_part = json_part.split(' ')  # Convert string representation of dict back to dict
                    word = json_part[0]  # Extract the word
                    amazonS3Link = json_part[-1]
                    print(f'Speaker {request.json["output"]["identification"][0]["speaker"]} said: {word}')
                    sweardetected_manual(word, request.json["output"]["identification"][0]["speaker"], amazonS3Link)
                    return jsonify({"message": "Webhook received"}), 200
                else:
                    print("No 'Webhook data:' found in the last line.")
                    return None
        except FileNotFoundError:
            print("Log file does not exist.")
            return None
        except Exception as e:
            print(f"Error reading log file: {e}")
            return None

    return jsonify({"message": "Webhook received"}), 200

# LEGACY OUTDATED
@app.route('/sweardetected', methods=['POST'])
def sweardetected():
    data = request.get_json()
    word = data.get('word')
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE swear_list SET number_of_times_said = number_of_times_said + 1 WHERE word = %s;",
        (word,)
    )
    connection.commit()
    return jsonify({"message": "Swear word occurrence updated successfully!"}), 200

@app.errorhandler(500)
def handle_500_error(e):
    print("500 error occurred:", e)
    return jsonify({"error": "Internal server error"}), 500

@app.route("/account-data/", methods=["GET"])
def accountdata():
    # data = {
    #     "accountBalance": 45,
    #     "individualUsers": ["Bob","Alice","Cindy","David","Elen"],
    #     "individualUsersBalances": [21,34,53,2,64],
    #     "recentSwears": ["fuck", "shit", "damn","fuck","fuck"]
    # }
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM accounts;")  # Assumes an `accounts` table exists
    accounts = cursor.fetchall()
    cursor.close()
    return jsonify(accounts)

# LEGACY OUTDATED
@app.route('/add-swear/', methods=['POST'])
def add_swear_word():

    data = request.get_json()  # Get JSON data from the request body
    word = data.get('word')
    cost = data.get('cost')
    print(word)
    if word and cost is not None:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO swear_list (word, cost) VALUES (%s, %s);", (word, cost))
        connection.commit()
        return jsonify({"message": "Swear word added successfully!"}), 200
    else:
        return jsonify({"error": "Invalid input"}), 400


@app.route('/delete-swear/', methods=['POST'])
def delete_swear_word():
    data = request.get_json()  # Get JSON data from the request body
    word = data.get('word')
    print(word)
    if word is not None:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM swear_list WHERE word = %s;", (word,))
        return jsonify({"message": "Swear word deleted successfully!"}), 200
    else:
        return jsonify({"error": "Invalid input"}), 400


@app.route('/set-cost/', methods=['POST'])
def setcost():
    data = request.get_json()  # Get JSON data from the request body
    word = data.get('word')
    cost = data.get('cost')
    print(word)
    print(cost)
    if word and cost is not None:
        cursor = connection.cursor()
        cursor.execute("UPDATE swear_list SET cost = %s WHERE word = %s;", (cost, word))
        connection.commit()
        return jsonify({"message": "Set cost successfully!"}), 200
    else:
        return jsonify({"error": "Invalid input"}), 400


@app.route('/fetch-swears/', methods=['POST'])
def fetchSwears():
    cursor = connection.cursor()
    cursor.execute("SELECT swear_name FROM swears_list;")
    rows = cursor.fetchall()
    swears = [{"swear_name": row[0]} for row in rows]
    cursor.close()

    return jsonify({"swears": swears}), 200





if __name__ == '__main__':
    app.run(port=5000, debug=True)