from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import json
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
import os
import logging
from contextlib import asynccontextmanager

db = None

class AgentDB(BaseModel):
    id: str = Field(alias="_id")
    name: str
    files: List[Dict] = []
    websites: List[Dict] = []
    messages: List[Dict] = []

class Message(BaseModel):
    message: str

async def init_db():
    global db
    try:
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        client = AsyncIOMotorClient(mongodb_url)
        db = client.agents_db
        await client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()  # Startup logic
    yield  # Application runs here
    # Cleanup logic if needed

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI!"}