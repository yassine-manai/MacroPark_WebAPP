from fastapi import APIRouter, FastAPI, HTTPException, Body
import random
from bson import json_util
from auth.DB.Connection import connect_guests

app = FastAPI()

async def setup_db():
    # Connect to MongoDB
    client, db, collection = await connect_guests()
    return client, db, collection

def generate_unique_id():
    return random.randint(100, 999)

# Define routers
Add_guest = APIRouter()
Guests_List = APIRouter()
Delete_Guest = APIRouter()

# Define route handlers
@Add_guest.post('/signup', tags=["Guests"])
async def add(data: dict = Body(...)):
    _, _, collection = await setup_db()
    existing_guest = await collection.find_one({'email': data['email']})
    if existing_guest:
        raise HTTPException(status_code=400, detail='User with the same email already exists')
    else:
        # Generate a unique short ID for the user
        data['_id'] = generate_unique_id()
        await collection.insert_one(data)
        return {'message': 'User created successfully', 'user_id': data['_id']}

# Read operation (get all users)
@Guests_List.get('/users', tags=["Guests"])
async def get_all_guests():
    _, _, collection = await setup_db()
    users = await collection.find().to_list(length=None)
    return json_util.dumps(users)
    


@Delete_Guest.post('/delete/{id}', tags=["Guests"])
async def delete_guest(id: int):
    _, _, collection = await setup_db()
    existing_guest = await collection.find_one({'id': id})
    if existing_guest:
        # Update the existing user with the new data
        await collection.delete_one({'id': id})
        return {'message': 'User deleted successfully'}
    else:
        raise HTTPException(status_code=404, detail='User not found')
