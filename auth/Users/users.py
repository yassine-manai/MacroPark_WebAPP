from fastapi import APIRouter, FastAPI, HTTPException, Body
from fastapi.responses import JSONResponse
from Models.items import UpdateUserData, Updateweb, userItem
from auth.DB.Connection import connect_users
from fastapi.middleware.cors import CORSMiddleware

import random
import string

app = FastAPI()

async def setup_db():
    # Connect to MongoDB
    client, db, collection = await connect_users()
    return client, db, collection


def generate_unique_id():
    # Generate a random integer in the range from 200 to 299
    random_number = random.randint(200, 299)
    
    # Return the random number as a 32-bit integer
    return random_number



# Define routers
Add_User = APIRouter()
UserByEmail = APIRouter()
UserById = APIRouter()
User_List = APIRouter()
Login_User = APIRouter()
Modify_User = APIRouter()
Modify_Web = APIRouter()
Delete_User = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"], 
    allow_headers=["Content-Type"], 
)


# Read operation (get all users)
@User_List.get('/allusers', tags=["Users"])
async def get_all_users():
    _, _, collection = await setup_db()
    
    users = await collection.find().to_list(length=None)
    
    # Convert MongoDB ObjectId to string for serialization
    formatted_users = []
    for user in users:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        formatted_users.append(user)
    
    return {"users": formatted_users}



# Define route handlers
@Add_User.post('/adduser', tags=["Users"])
async def addUser(data: dict = Body(...)):
    _, _, collection = await setup_db()
    existing_user = await collection.find_one({'email': data['email']})
    if existing_user:
        raise HTTPException(status_code=400, detail='User with the same email already exists')
    else:
        # Generate a unique short ID for the user
        data['_id'] = generate_unique_id()
        await collection.insert_one(data)
        return {'message': 'User created successfully', 'user_id': data['_id']}



# Read operation (get a user by email)
@UserByEmail.get('/user/{email}', tags=["Users"])
async def find_user_by_email(email: str):
    _, _, collection = await setup_db()
    
    user = await collection.find_one({'email': email})
    
    if user:
        user['_id'] = str(user['_id'])
        return {"user": user}  
    else:
        raise HTTPException(status_code=404, detail='User not found')
    

@UserById.get('/userid/{id}', tags=["Users"])
async def find_user_by_email(id: int):
    _, _, collection = await setup_db()
    
    user = await collection.find_one({'_id': id})
    
    if user:
        user['_id'] = str(user['_id'])
        return {"user": user}  
    else:
        raise HTTPException(status_code=404, detail='User not found')
    

# User sign-in endpoint - login
@Login_User.post('/signin', tags=["Users"])
async def sign_in(data: dict = Body(...)):
    _, _, collection = await setup_db()
    user = await collection.find_one({'email': data['email']})
    if user and user['password'] == data['password']:
        # Extract the user ID from the user document
        id = str(user['_id'])
        return {'message': 'User signed in successfully', 'userId': id}
    else:
        raise HTTPException(status_code=401, detail='User not found or password incorrect')
    



@Modify_User.put('/modifyUser/{email}', tags=["Users"])
async def update_user(email: str, data: UpdateUserData):
    _, _, collection = await setup_db()
    existing_user = await collection.find_one({'email': email})
    
    if existing_user:
        # Extract the fields to update from the data object
        update_data = {
            'name': data.name,
            'email': data.email,
            'phone_number': data.phone_number,
            'password': data.password
        }
        
        # Perform the update operation using '$set' operator
        await collection.update_one({'email': email}, {'$set': update_data})
        
        return {'message': 'User updated successfully'}
    else:
        raise HTTPException(status_code=404, detail='User not found')
    

@Delete_User.delete('/deleteUser/{user_id}', tags=["Users"])
async def delete_user(user_id: str):
    try:
        _, _, collection = await setup_db()
        
        # Convert user_id to integer
        user_id_int = int(user_id)
        
        # Assuming 'id' is the custom identifier field stored as an integer
        existing_user = await collection.find_one({'_id': user_id_int})
        if existing_user:
            await collection.delete_one({'_id': user_id_int})
            return {'message': 'User deleted successfully'}
        else:
            raise HTTPException(status_code=404, detail=f'User with ID {user_id} not found')
    except ValueError:
        raise HTTPException(status_code=400, detail='Invalid user ID format')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error deleting user: {str(e)}')



@Modify_Web.put('/modifyWeb/{id}', tags=["Users"])
async def update_user_id(id: int, data: Updateweb):
    _, _, collection = await setup_db()
    existing_user = await collection.find_one({'_id': id})
    
    if existing_user:
        # Extract the fields to update from the data object
        update_data = {
            'name': data.name,
            'email': data.email,
            'phone_number': data.phone_number,
            'lpn1': data.lpn1,
            'lpn2': data.lpn2,
            'lpn3': data.lpn3,
            'lpn4': data.lpn4
        }
        
        # Perform the update operation using '$set' operator
        await collection.update_one({'_id': id}, {'$set': update_data})
        
        return {'message': 'User updated successfully'}
    else:
        raise HTTPException(status_code=404, detail='User not found')
    
