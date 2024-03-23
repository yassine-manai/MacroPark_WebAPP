from Database.db_barriers import get_db_barrier


def Open_rq(id: int):
    conn, cursor = get_db_barrier()
    cursor.execute('''SELECT ip, port, op_cmd FROM barriers WHERE id = ?''', (id,))
    barrier_info = cursor.fetchone()
    conn.close()
    return barrier_info

def Close_rq(id: int):
    conn, cursor = get_db_barrier()
    cursor.execute('''SELECT ip, port, cl_cmd FROM barriers WHERE id = ?''', (id,))
    barrier_info = cursor.fetchone()
    conn.close()
    return barrier_info