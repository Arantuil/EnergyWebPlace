import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import Colors from './Colors';
import Pixel from './Pixel';
import store from './redux/store'

const Canvas = props => {
    const blockchain = useSelector((state) => state.blockchain);

    const [matrix, setMatrix] = useState(
        Array(10)
            .fill()
            .map(() =>
                Array(10)
                    .fill()
                    .map(() => 0)
            )
    );

    const buyPixel = (rowIndex, colIndex) => {
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        let totalCostWei = String(10000000000000)
        blockchain.smartContract.methods.buyPixel(rowIndex, colIndex).send({
            to: "0x545750882494e98dd243dB91dc4285FAc6611ed7",
            from: blockchain.account,
            value: totalCostWei,
        })
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

    const clearCanvas = () => {
        setMatrix(
            Array(10)
                .fill()
                .map(() =>
                    Array(10)
                        .fill()
                        .map(() => 0)
                )
        );
    };

    async function getMatrixFromContract() {
        const blockchaininfo = store.getState()["data"]
        seeOwnedPixels()
        console.log(blockchaininfo)
    }

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
        let pixelIndexNum = parseInt(String(rowIndex) + String(colIndex))
        console.log(blockchain.account)
        if (blockchainPixels[pixelIndexNum]["owner"].toLowerCase() === blockchain.account) {
            changeColor(rowIndex, colIndex)
        }
        else {
            buyPixel(rowIndex, colIndex)
        }
    }

    function seeOwnedPixels() {
        let allPixels = document.getElementById('allpixels').children
        let blockchainPixels = store.getState()["data"]["allPixelsArray"]
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            if (blockchainPixels[p]["owner"].toLowerCase() === blockchain.account) {
                element.style.boxShadow = "inset 0 0 0 2px #5B5B5B"
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

    //useEffect(() => {
    //    seeOwnedPixels()
    //}, [store.getState()["data"]])

    return (
        <div className='flex flex-col items-center'>
            <div className='h-[50px]'>
                <button className='bg-green-500 rounded-md text-2xl font-semibold w-[100px] h-full' onClick={getMatrixFromContract}>Owned</button>
                <button className='bg-red-500 rounded-md text-2xl font-semibold w-[100px] h-full' onClick={removeOwnedPixelsBorders}>Owned</button>
            </div>
            <div id='allpixels' className='allpixels flex flex-wrap max-w-[500px]'>
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
            <div className='h-[50px]'>
                <button className='h-[100%-10px] mt-[10px] w-[100px] rounded-md text-2xl font-semibold text-black bg-green-300 p-1' onClick={clearCanvas}>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default Canvas;

//getPixelInfo()
//async function getPixelInfo() {
//    let pixelInfo = await store
//    .getState()
//    .blockchain.smartContract.methods
//    .pixels(rowIndex, colIndex)
//    .call();
//    console.log(rowIndex, colIndex, pixelInfo["owner"])
//    return(pixelInfo)
//}