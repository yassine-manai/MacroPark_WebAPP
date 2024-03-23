from fastapi import APIRouter, HTTPException, Request
from Database.Requests.req_control import Open_rq
from Events.Add_Events import add_open_event
from Models.items import send_action
from Config.log_config import logger

#Routing for the api endpoint
Open_barrier = APIRouter()

@Open_barrier.post("/open/{id}", tags=["Barriers Controller"])
async def open_barrier_by_id(id: int, request: Request, extradata: str = "No Extra data"):
    
    barrier_info = Open_rq(id)
    status_code = 500

    if not barrier_info:
        raise HTTPException(status_code=404, detail="Barrier not found")
    
    ip_address, port, hex_code = barrier_info
    logger.info(ip_address, port, hex_code)
    
    ip_user = request.client.host

    try:
        send_action(ip_address, port, hex_code,'Opened')
        status_code = 200  
        
    except HTTPException as e:
        status_code = e.status_code 

    add_open_event(id, ip_user, status_code, extradata) 
    
    return send_action(ip_address, port, hex_code,'Opened')



