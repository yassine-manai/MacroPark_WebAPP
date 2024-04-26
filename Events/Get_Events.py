from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.responses import JSONResponse
from Database.db_events import get_db_events

Event_List = APIRouter()
EventById = APIRouter()

app = FastAPI()


# Get All Events Endpoint
@Event_List.get("/Event", tags=["Events"])
async def get_all_Events():
    conn, cursor = get_db_events()
    cursor.execute('''SELECT * FROM Events''')
    events = cursor.fetchall()
    conn.close()
    if not events:
        return JSONResponse(content=[], status_code=404)
    return JSONResponse(content=events, status_code=200)


# Get Event By Id Endpoint 
@EventById.get("/Event/{id}", tags=["Events"])
async def get_all_Events(id: int):
    conn, cursor = get_db_events()
    cursor.execute('''SELECT * FROM events WHERE barrier_id = ?''', (id,))
    events = cursor.fetchall()  
    conn.close()
    if not events:
        raise HTTPException(status_code=404, detail="Events not found")
    return JSONResponse(content=events, status_code=200)

