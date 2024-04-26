from Database.db_barriers import get_db_barrier
from Models.items import BarrierCmd


def barrier_request(id: int, cmd: str):
    conn, cursor = get_db_barrier()
    cursor.execute('''SELECT ip, port, ? FROM barriers WHERE id = ?''', (cmd, id,))
    barrier_info = cursor.fetchone()
    conn.close()
    return barrier_info


def status_request(id: int):
    conn, cursor = get_db_barrier()
    cursor.execute('''SELECT ip, port FROM barriers WHERE id = ?''', (id,))
    barrier_info = cursor.fetchone()
    conn.close()
    return barrier_info


def Open_rq(id: int):
    return barrier_request(id, BarrierCmd.op_cmd)

def Close_rq(id: int):
    return barrier_request(id, BarrierCmd.cl_cmd)

def Lock_rq(id: int):
    return barrier_request(id, BarrierCmd.lk_cmd)

def Unlock_rq(id: int):
    return barrier_request(id, BarrierCmd.uk_cmd)

def status_rq(id: int):
    return status_request(id)
