import firebase_admin
from firebase_admin import db, credentials, storage
import time
import turtle
from PIL import Image
import numpy as np

cred = credentials.Certificate("energywebnfts-firebase-adminsdk-isn9b-3ad0cc73aa.json")

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://energywebnftsplace.firebaseio.com/',
    'storageBucket': 'energywebnfts.appspot.com'
})

ref = db.reference('/pixels')
allpixels = ref.get()
templist = []
completelist = []
for i in range(10000):
    if i > 0 and i % 100 == 0:
        completelist.append(templist)
        templist = []
    elif i == 9999:
        completelist.append(templist)
    if allpixels[i]["color"] == 0: templist.append((255, 255, 255))
    if allpixels[i]["color"] == 1: templist.append((170, 170, 170))
    if allpixels[i]["color"] == 2: templist.append((95, 95, 95))
    if allpixels[i]["color"] == 3: templist.append((0, 0, 0))
    if allpixels[i]["color"] == 4: templist.append((126, 61, 54))
    if allpixels[i]["color"] == 5: templist.append((216, 0, 0))
    if allpixels[i]["color"] == 6: templist.append((255, 123, 0))
    if allpixels[i]["color"] == 7: templist.append((255, 186, 39))
    if allpixels[i]["color"] == 8: templist.append((255, 255, 0))
    if allpixels[i]["color"] == 9: templist.append((72, 255, 72))
    if allpixels[i]["color"] == 10: templist.append((7, 194, 7))
    if allpixels[i]["color"] == 11: templist.append((0, 215, 223))
    if allpixels[i]["color"] == 12: templist.append((12, 141, 228))
    if allpixels[i]["color"] == 13: templist.append((13, 78, 175))
    if allpixels[i]["color"] == 14: templist.append((154, 83, 255))
    if allpixels[i]["color"] == 15: templist.append((255, 146, 199))

# Convert the pixels into an array using numpy
array = np.array(completelist, dtype=np.uint8)

# Use PIL to create an image from the new array of pixels
new_image = Image.fromarray(array)
newimage2 = new_image.resize((1000,1000), resample=Image.BOX)
newimage2.save('place.png')

path = '/Users/Gideon/Documents/NFT_projectjes/TubbyTurtlesPlace/tubbyturtlesplace/'
#path = '/home/arantuil_greenleaf/eggupdater/'
fileName = "place"
bucket = storage.bucket()
blob = bucket.blob(fileName)
blob.upload_from_filename(path+str(fileName)+'.png')
blob.make_public()
print(f"Uploaded file:", blob.public_url)