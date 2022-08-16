import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import Colors from './Colors';
import Pixel from './Pixel';
import store from './redux/store'
import OwnedPixel from './assets/images/OwnedPixelIcon.png'
import UnownedPixel from './assets/images/UnownedPixelIcon.png'

const Canvas = props => {
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const [matrix, setMatrix] = useState(
        Array(20)
            .fill()
            .map(() =>
                Array(20)
                    .fill()
                    .map(() => 0)
            )
    );

    const buyPixel = (rowIndex, colIndex) => {
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        let totalCostWei = String(10000000000000)
        blockchain.smartContract.methods.buyPixel(rowIndex, colIndex).send({
            to: "0xc602bfef805119D22844b64b5f3c874901c40871",
            from: blockchain.account,
            value: totalCostWei,
        })
        .then((receipt) => {
            console.log(receipt)
            console.log('update to redis')
        });
        setMatrix(newMatrix);
    };

    const changeColor = (rowIndex, colIndex) => {
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        //let pixelIndexNum = parseInt(String(rowIndex) + String(colIndex))-1

        //let totalCostWei = String(10000000000000)
        //blockchain.smartContract.methods.buyPixel(rowIndex, colIndex).send({
        //    to: "0x15A97aE00F78819daf81F9d82d6e9A5D895D5649",
        //    from: blockchain.account,
        //    value: totalCostWei,
        //})

        if (props.currentColor !== newMatrix[rowIndex][colIndex]) {
            newMatrix[rowIndex][colIndex] = props.currentColor;
        } else {
            newMatrix[rowIndex][colIndex] = 0;
        }

        setMatrix(newMatrix);
        console.log('current user owns this pixel')
    };

    //async function getUpdatedMatrix() {
    //    const newMatrix = JSON.parse(JSON.stringify(matrix))
    //    let blockchainPixels = store.getState()["data"]["allPixelsArray"]
    //    for (let x = 0; x < 10; x++) {
    //        let elemColor = blockchainPixels[x]["colour"].slice(2);
    //        console.log(elemColor)
    //        if (elemColor === '00ff00') { elemColor = 2 }
    //        if (elemColor === '0000ff') { elemColor = 2 }
    //        else { elemColor = 1 }  
    //        newMatrix[x,0] = elemColor
    //    }
    //    setMatrix(newMatrix)
    //}

    function buyOrChange(rowIndex, colIndex) {
        let blockchainPixels = store.getState()["data"]["allPixelsArray"]
        console.log(blockchainPixels)
        let pixelIndexNum = parseInt((rowIndex*20) + (colIndex))
        console.log(pixelIndexNum, rowIndex, colIndex, blockchain.account)
        if (blockchainPixels[pixelIndexNum]["owner"].toLowerCase() === blockchain.account) {
            changeColor(rowIndex, colIndex)
        }
        else {
            buyPixel(rowIndex, colIndex)
        }
    }

    function seeOwnedPixels() {
        let allPixels = document.getElementById('allpixels').children
        let blockchainPixels = data["allPixelsArray"]
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            if (blockchainPixels[p]["owner"].toLowerCase() === blockchain.account) {
                element.style.boxShadow = "inset 0 0 0 2px #70FF32"
            }
        }
    };

    function seeUnownedPixels() {
        let allPixels = document.getElementById('allpixels').children
        let blockchainPixels = data["allPixelsArray"]
        console.log(blockchainPixels)
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            if (blockchainPixels[p]["owner"].toLowerCase() === "0x0000000000000000000000000000000000000000") {
                element.style.boxShadow = "inset 0 0 0 2px #FFFF69"
            }
        }
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            if (blockchainPixels[p]["owner"].toLowerCase() !== "0x0000000000000000000000000000000000000000" && blockchainPixels[p]["owner"].toLowerCase() !== blockchain.account) {
                element.style.boxShadow = "inset 0 0 0 2px #61DAFB"
            }
        }
    };

    function removeOwnedPixelsBorders() {
        let allPixels = document.getElementById('allpixels').children
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            element.style.boxShadow = "inset 0 0 0 0px #5B5B5B"
        }
    }

    //function getPixelInfo() {
    //    let pixelInfo = await store
    //    .getState()
    //    .blockchain.smartContract.methods
    //    .pixels(rowIndex, colIndex)
    //    .call();
    //    console.log(rowIndex, colIndex, pixelInfo["owner"])
    //    return(pixelInfo)
    //}

    //useEffect(() => {
    //    seeOwnedPixels()
    //}, [data])

    return (
        <div className='flex flex-col items-center'>
            <div className='h-[70px] mb-[10px] w-[800px] flex justify-center'>
                <button className='bg-green-500 mr-[12.5px] rounded-md text-lg font-semibold w-[150px] p-2 h-full' onClick={seeOwnedPixels}>Show my pixels<img className='inline ml-1 w-7 h-7 mb-[1px]' src={OwnedPixel} /></button>
                <button className='bg-red-500 ml-[12.5px] mr-[12.5px] rounded-md text-lg font-semibold w-[150px] p-2 h-full' onClick={removeOwnedPixelsBorders}>Hide pixel borders</button>
                <button className='bg-blue-500 ml-[12.5px] rounded-md text-lg font-semibold w-[150px] p-2 h-full' onClick={seeUnownedPixels}>Show unowned pixels<img className='inline ml-1 w-7 h-7 mb-[1px]' src={UnownedPixel} /></button>
            </div>
            <div id='allpixels' className='allpixels flex flex-wrap max-w-[800px]'>
                {matrix.map((row, rowIndex) =>
                    row.map((_, colIndex) => {
                        return (
                            <Pixel
                                key={`${rowIndex}-${colIndex}`}
                                background={Colors[matrix[rowIndex][colIndex]]}
                                onClick={() => buyOrChange(rowIndex, colIndex)}
                            />
                        );
                    })
                )}
            </div>
            <div className='h-[50px] mt-[10px] mb-[20px]'>
            </div>
        </div>
    );
};

export default Canvas;