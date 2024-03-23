from Database.db_barriers import get_db_barrier
from Models import items


def add_barrier_rq(barrier_item: items.BarrierItem):
    conn, cursor = get_db_barrier()
    cursor.execute('''INSERT INTO barriers (id, ip, port, op_cmd, cl_cmd, description)
                    VALUES (?, ?, ?, ?, ?, ?)''',
                   (barrier_item.id, barrier_item.ip, barrier_item.port,
                    barrier_item.op_cmd, barrier_item.cl_cmd,
                    barrier_item.description))
    
    conn.commit()
    conn.close()
    return barrier_item


def modify_barrier_rq(barrier_id: int, barrier_item: items.ModifiedBarrierItem):

    conn, cursor = get_db_barrier()
    cursor.execute('''UPDATE barriers SET 
                   id = ?, 
                   ip = ?, 
                   port = ?, 
                   op_cmd = ?,
                   cl_cmd = ?,
                   description = ?
                   WHERE id = ?''',
                (barrier_item.id, 
                 barrier_item.ip, 
                 barrier_item.port,
                 barrier_item.op_cmd,
                 barrier_item.cl_cmd,
                 barrier_item.description,
                 barrier_id))
    conn.commit()
    conn.close()

    return barrier_item

def delete_barrier_rq(barrier_id: int):
    conn, cursor = get_db_barrier()
    cursor.execute('''DELETE FROM barriers WHERE id = ?''', (barrier_id,))
    conn.commit()
    conn.close()

    return barrier_id



