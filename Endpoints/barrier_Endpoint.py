from Database.db_barriers import get_db_barrier
from Database.Requests.req_barrier import modify_barrier_rq
from Database.Requests.req_barrier import delete_barrier_rq
from Database.db_barriers import get_db_barrier
from Models import items
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Add_barrier = APIRouter()
Delete_barrier = APIRouter()
Barrier_List = APIRouter()
BarrierById = APIRouter()   
Modify_barrier = APIRouter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"], 
    allow_headers=["Content-Type"], 
)

@Add_barrier.post("/add", tags=["Barriers Data"])
async def add_barrier(barrier_item: items.BarrierItem):
    conn, cursor = get_db_barrier()
    cursor.execute('''INSERT INTO barriers (id, ip, port, op_cmd, cl_cmd, description)
                    VALUES (?, ?, ?, ?, ?, ?)''',
                   (barrier_item.id, barrier_item.ip, barrier_item.port,
                    barrier_item.op_cmd, barrier_item.cl_cmd,
                    barrier_item.description))
    
    conn.commit()
    conn.close()
    return {"message": "Barrier added successfully"}



@Delete_barrier.delete("/delete/{barrier_id}" , tags=["Barriers Data"])
async def delete_barrier(barrier_id: int):
    
    delete_barrier_rq(barrier_id)

    return {"message": "Barrier deleted successfully"}


@Barrier_List.get("/getall", tags=["Barriers Data"])
async def get_all_barriers():
    conn, cursor = get_db_barrier()
    cursor.execute('''SELECT * FROM barriers''')
    barriers = cursor.fetchall()
    conn.close()
    if not barriers:
        return JSONResponse(content=[], status_code=404)
    return JSONResponse(content=barriers, status_code=200)



@BarrierById.get("/getBarrier/{id}" ,tags=["Barriers Data"])
async def get_barrier_by_id(id: int):
    conn, cursor = get_db_barrier()
    cursor.execute('''SELECT * FROM barriers WHERE id = ?''', (id,))
    barrier = cursor.fetchone()
    conn.close()
    if not barrier:
        raise HTTPException(status_code=404, detail="Barrier not found")
    return JSONResponse(content=barrier, status_code=200)



@Modify_barrier.put("/modify/{barrier_id}", tags=["Barriers Data"])
async def modify_barrier(barrier_id: int, barrier_item: items.ModifiedBarrierItem):

    modify_barrier_rq(barrier_id, barrier_item)
    
    return {"message": "Barrier modified successfully"}