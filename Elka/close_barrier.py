from fastapi import APIRouter, HTTPException, Request
from Database.Requests.req_control import Close_rq
from Events.Add_Events import add_close_event
from Models.items import send_action
from Config.log_config import logger

#Routing for the api endpoint
Close_barrier = APIRouter()

@Close_barrier.post("/close/{id}", tags=["Barriers Controller"])
async def close_Barrier_By_Id(request: Request, id: int, extradata: str = " "):
    
    barrier_info = Close_rq(id)
    status_code = 500

    if not barrier_info:
        raise HTTPException(status_code=404, detail="Barrier not found")
    
    ip_address, port, hex_code = barrier_info
    logger.info(ip_address, port, hex_code)

    ip_user = request.client.host
    
    try:
        send_action(ip_address, port, hex_code,'Closed')
        status_code = 200  
        
    except HTTPException as e:
        status_code = e.status_code 

    add_close_event(id, ip_user, status_code, extradata) 

    return send_action(ip_address, port, hex_code,'Closed')

