from pydantic import BaseModel
from fastapi import HTTPException
from Config.log_config import logger
import socket

class BarrierItem(BaseModel):
    id: int
    ip: str
    port: int = 52719
    op_cmd: str = "55 03 01 01 00 B8 B4"
    cl_cmd: str = "55 03 01 02 00 ED E7"
    description: str = "Description"

class ModifiedBarrierItem(BaseModel):
    id: int
    ip: str
    port: int = 52719 
    op_cmd: str = "55 03 01 01 00 B8 B4"
    cl_cmd: str = "55 03 01 02 00 ED E7"
    description: str = "Description"


def send_action(ip_address, port, hex_code, action):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect((ip_address, port))
            except ConnectionRefusedError as conn_refused_error:
                error_msg = f"Connection refused to {ip_address}:{port}: {str(conn_refused_error)}"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)
            except Exception as conn_error:
                error_msg = f"Error establishing connection to {ip_address}:{port}: {str(conn_error)}"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)
                
            hex_bytes = bytes.fromhex(hex_code)
            s.sendall(hex_bytes)
            logger.info(f"Open '{hex_code}' to {ip_address}:{port}")
        
        return {"message": f" Barrier " + action + " with " + ip_address + ":" + str(port) + "  using " + str(hex_code)}
    
    except Exception as e:
        logger.error(f"Error sending Action '{hex_code}' to {ip_address}:{port}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    


