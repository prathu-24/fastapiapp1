from database import engine

try:
    conn = engine.connect()
    print("DB CONNECTION OK")
    conn.close()
except Exception as e:
    print(f"DB CONNECTION FAILED: {e}")
