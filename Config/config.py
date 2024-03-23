import configparser


config = configparser.ConfigParser()
config.read('config/config.ini')

APP_PORT = config.getint('Ports', 'back',fallback=8100)
DB_FILE_PATH_barrier = "./Database/barriers.db"
DB_FILE_PATH_events = "./Database/events.db"

    

