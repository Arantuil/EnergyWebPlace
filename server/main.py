from web3 import Web3
import redis
from privateinfo import *

def updateDataToRedis():
	r = redis.Redis(host=REDISLINK, port=17644, password=PASSWORD)

	w3 = Web3(Web3.HTTPProvider('https://volta-rpc.energyweb.org/'))

	# Solidity source code
	abi = '''
	[
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "x",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "y",
					"type": "uint256"
				}
			],
			"name": "buyPixel",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "x",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "y",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint8",
					"name": "color",
					"type": "uint8"
				}
			],
			"name": "PixelColourChanged",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "x",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "y",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "address",
					"name": "owner",
					"type": "address"
				}
			],
			"name": "PixelOwnerChanged",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "withdraw",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "contractOwner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "pixelPrice",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "pixels",
			"outputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				},
				{
					"internalType": "uint8",
					"name": "colour",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]
	'''

	contractAddress = "0xc602bfef805119D22844b64b5f3c874901c40871"
	smartContract = w3.eth.contract(address=contractAddress, abi=abi)
	e = 0
	e2 = 0
	index = 0
	for _ in range(400):
	#r.lpush('data', 'created')
		if e == 19:
			pixelInfo = smartContract.functions.pixels(e2, e).call()
			r.lset('data', index, str(pixelInfo))
			e = 0
			e2 += 1
			index += 1
		else:
			pixelInfo = smartContract.functions.pixels(e2, e).call()
			r.lset('data', index, str(pixelInfo))
			e += 1
			index += 1

	#value = r.get('data')
	#print(value)

for _ in range(1000):
	try:
		updateDataToRedis()
		print('updated')
	except:
		print('error')