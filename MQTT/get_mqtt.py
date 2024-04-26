""" import json
import paho.mqtt.client as mqtt
from auth.DB.Connection import *

# MQTT Broker settings
MQTT_BROKER_HOST = "broker.example.com"
MQTT_BROKER_PORT = 1883
MQTT_TOPIC = "sensor/data"



async def setup_db_events():
    client, db, collection = await connect_events()
    return client, db, collection


async def on_message(client, userdata, message):
    _, _, collection = await setup_db_events()

    try:
        payload = message.payload.decode("utf-8")
        data = json.loads(payload)

        collection.insert_one(data)
        print(f"Inserted document into MongoDB: {data}")

    except Exception as e:
        print(f"Error processing message: {str(e)}")

client = mqtt.Client()
client.on_message = on_message

# Connect to MQTT broker
client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT)
client.subscribe(MQTT_TOPIC)

# Start MQTT loop to receive messages
client.loop_forever()
 """