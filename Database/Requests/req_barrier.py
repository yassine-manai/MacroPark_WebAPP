from Database.db_barriers import get_db_barrier
from Models import items

# Modify barrier Data Function
def modify_barrier_rq(barrier_id: int, barrier_item: items.ModifiedBarrierItem):

    conn, cursor = get_db_barrier()
    cursor.execute('''UPDATE barriers SET 
                   name = ?,
                   id = ?, 
                   type = ?,
                   ip = ?, 
                   port = ?

                   WHERE id = ?''',
                (
                barrier_item.name, 
                barrier_item.id, 
                barrier_item.type, 
                 barrier_item.ip, 
                 barrier_item.port,

                 barrier_id))
    conn.commit()
    conn.close()

    return barrier_item



#Delete barrier Function
def delete_barrier_rq(barrier_id: int):
    conn, cursor = get_db_barrier()
    cursor.execute('''DELETE FROM barriers WHERE id = ?''', (barrier_id,))
    conn.commit()
    conn.close()

    return barrier_id



