import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    print(f"Connected to MongoDB database: '{DB_NAME}'")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection.")


def get_reports_collection():
    return db["reports"]
