from flask import Flask, render_template, url_for
from flask import request
from configparser import ConfigParser
import os

# Config Parser
config = ConfigParser()
config.read("config.ini")

os.environ["GOOGLE_API_KEY"] = config["Gemini"]["API_KEY"]
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-pro")
#gemini-1.5-flash-latest

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route('/final')
def final():
    return render_template("final.html")
    

@app.route("/call_llm", methods=["POST"])
def call_llm():
    if request.method == "POST":
        print("POST!")
        data = request.form
        print(data)
        result = llm.invoke("你是一個餐廳服務生，請向客人打招呼並詢問需要什麼幫助，並且不超過20個字")
        return result.content