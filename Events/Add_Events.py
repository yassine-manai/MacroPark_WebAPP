from Database.db_events import get_db_events

#ADD
def add_open_event(barrier_id: int, ip_user: str, status_code: int, extradata: str):
    status = {
        500: "Barrier Disconnected",
        404: "Barrier Not Found",
        200: "Barrier Opened"
    }

    conn, cursor = get_db_events()
    meth = status.get(status_code, "Unknown")
    cursor.execute('''INSERT INTO events (barrier_id, time, extradata, ip_user, meth)
                      VALUES (?, datetime('now', 'localtime'), ?, ?, ?)''', (barrier_id, extradata, ip_user, meth))
    conn.commit()
    conn.close()


#Close Event Add
def add_close_event(barrier_id: int, ip_user: str, status_code: int, extradata: str):
    status = {
        500: "Barrier Disconnected",
        404: "Barrier Not Found",
        200: "Barrier Closed"
    }

    conn, cursor = get_db_events()
    meth = status.get(status_code, "Unknown")
    cursor.execute('''INSERT INTO events (barrier_id, time, extradata, ip_user, meth)
                      VALUES (?, datetime('now', 'localtime'), ?, ?, ?)''', (barrier_id, extradata, ip_user, meth))
    conn.commit()
    conn.close()
