import json

def write_json(new_data, filename='zerodata.json'):
    with open(filename,'r+') as file:
        file_data = json.load(file)
        file_data["pixels"].append(new_data)
        file.seek(0)
        json.dump(file_data, file, indent = 4)

tokenId = 0
xcord = 0
ycord = 0
for i in range(10000):
    if tokenId > 0:
        xcord += 1
        if tokenId % 50 == 0:
            xcord = 0
            ycord += 1

    d = {
            "owner": "0x0000000000000000000000000000000000000000",
            "color": 0
        }
    tokenId += 1

    write_json(d)