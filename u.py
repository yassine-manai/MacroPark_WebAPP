import random
import string

def generate_valid_uuids(num_uuids):
    valid_uuids = []
    for _ in range(num_uuids):
        random_number = random.randint(200, 299)
        uuid_string = 'F838{}F-0101-0000-F850-9C398FC199D2'.format(random_number)
        valid_uuids.append(uuid_string)
    return valid_uuids

# Example: Generate 5 valid UUID-like strings
num_uuids_to_generate = 200
result_uuids = generate_valid_uuids(num_uuids_to_generate)

# Print the generated UUID-like strings
for uuid in result_uuids:
    print(uuid)
