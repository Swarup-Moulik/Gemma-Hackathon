import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "agrirescue")

client: AsyncIOMotorClient = None


def get_database():
    """Get MongoDB database client instance dynamically."""
    global client
    if client is None:
        client = AsyncIOMotorClient(
            MONGO_URI,
            serverSelectionTimeoutMS=5000,
            tlsAllowInvalidCertificates=True,
        )
    return client[DB_NAME]


def get_reports_collection():
    db = get_database()
    return db["reports"]


async def connect_to_mongo():
    try:
        db = get_database()
        await db.command("ping")
        print(f"Connected to MongoDB database: '{DB_NAME}'")
    except Exception as e:
        print(f"MongoDB Startup Connection Warning: {e}")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        client = None
        print("Closed MongoDB connection.")
