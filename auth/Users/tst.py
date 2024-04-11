from fastapi import APIRouter, FastAPI, HTTPException, Body
import random
from bson import json_util
from fastapi.responses import JSONResponse
from Models.items import userItem
from auth.DB.Connection import connect_users

app = FastAPI()

async def setup_db():
    # Connect to MongoDB
    client, db, collection = await connect_users()
    return client, db, collection


def generate_unique_id():
    return random.randint(100, 999)


# Define routers
Add_user = APIRouter()
UserByEmail = APIRouter()
User_List = APIRouter()
Login_User = APIRouter()
Modify_User = APIRouter()
Delete_User = APIRouter()



@Add_user.post('/signup', tags=["Users"])
async def sign_up(data: userItem):
    _, _, collection = await setup_db()
    
    # Check if user with the same email already exists
    existing_user = await collection.find_one({'email': data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail='User with the same email already exists')
    
    # Construct user data dictionary from validated Pydantic model
    user_data = data
    
    # Generate a unique short ID for the user
    user_data['_id'] = generate_unique_id()
    
    # Insert user data into the database
    await collection.insert_one(user_data)
    
    # Return a JSON response with success message and user ID
    return JSONResponse(
        content={'message': 'User created successfully', 'user_id': user_data['_id']},
        status_code=201
    )


# Read operation (get all users)
@User_List.get('/allusers', tags=["Users"])
async def get_all_users():
    _, _, collection = await setup_db()
    users = await collection.find().to_list(length=None)
    return json_util.dumps(users)

# Read operation (get a user by email)
@UserByEmail.get('/user/{email}', tags=["Users"])
async def find(email: str):
    _, _, collection = await setup_db()
    user = await collection.find_one({'email': email})
    if user:
        return json_util.dumps(user)
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

# Update operation (update user information)
@Modify_User.put('/modify/{email}', tags=["Users"])
async def update_user(email: str, data: dict = Body(...)):
    _, _, collection = await setup_db()
    existing_user = await collection.find_one({'email': email})
    if existing_user:
        # Update the existing user with the new data
        await collection.update_one({'email': email}, {'$set': data})
        return {'message': 'User updated successfully'}
    else:
        raise HTTPException(status_code=404, detail='User not found')

# Delete operation (delete user)
@Delete_User.delete('/delete/{email}', tags=["Users"])
async def delete_user(email: str):
    _, _, collection = await setup_db()
    existing_user = await collection.find_one({'email': email})
    if existing_user:
        await collection.delete_one({'email': email})
        return {'message': 'User deleted successfully'}
    else:
        raise HTTPException(status_code=404, detail='User not found')

# Add routes to the main FastAPI app
app.include_router(User_List, prefix="/users")

      const noDataMessageRow = document.createElement("tr");
      const noDataMessageCell = document.createElement("td");
      const span = document.createElement("span");
      span.textContent = "No user found";
      span.classList.add("text-dark", "fw-bold", "text-hover-primary", "d-block", "mb-1", "fs-6");
      noDataMessageCell.appendChild(span);
      noDataMessageCell.colSpan = 10; // Span across all columns
      noDataMessageCell.style.textAlign = "center"; // Center the text
      noDataMessageRow.appendChild(noDataMessageCell);
      barriersTable.appendChild(noDataMessageRow);
    } 
    else 
    {
      data.forEach((barrier) => {
        const newRow = document.createElement("tr");

        const idCell = createCell(barrier[1], true);
        const nameCell = createCell(barrier[0], true);
        const typeCell = createCell(barrier[2], true);
        const ipCell = createCell(barrier[3], true);
        const portCell = createCell(barrier[4], true);
        const opCmdCell = createCell(open_cmd, true);
        const clCmdCell = createCell(close_cmd, true);
        const lkCmdCell = createCell(lock_cmd, true);
        const ukCmdCell = createCell(unlock_cmd, true);
        const actionCell = createActionCell(barrier[1]);


        newRow.appendChild(idCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(typeCell);

        newRow.appendChild(ipCell);
        newRow.appendChild(portCell);
        newRow.appendChild(opCmdCell);
        console.log(opCmdCell)

        newRow.appendChild(clCmdCell);
        newRow.appendChild(lkCmdCell);
        newRow.appendChild(ukCmdCell);

        newRow.appendChild(actionCell);

        barriersTable.appendChild(newRow);