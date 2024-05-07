import paho.mqtt.client as mqtt


def publish_to_mqtt_broker():
    broker_address = "192.168.25.71"  
    topic = "WT32/access"
    message = "open"

    # Create an MQTT client instance
    client = mqtt.Client()
    
    # Connect to the MQTT broker
    client.connect(broker_address)
    print(f"Connected to MQTT : {broker_address}")
    
    # Publish the message to the specified topic
    client.publish(topic, message)
    print(f"Published Topic : {topic}")
    print(f"Published message : {message}")

    # Disconnect from the MQTT broker
    client.disconnect()


    return {
        "mqtt_server": broker_address,
        "mqtt_topic": topic
    }
    
