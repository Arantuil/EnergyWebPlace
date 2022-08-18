import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import Colors from './Colors';
import Pixel from './Pixel';
import store from './redux/store'
import OwnedPixel from './assets/images/OwnedPixelIcon.png'
import UnownedPixel from './assets/images/UnownedPixelIcon.png'
import UnownedPixel2 from './assets/images/UnownedPixelIcon2.png'

const Canvas = props => {
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);

    const [pixeldata, setPixeldata] = useState([]);

    useEffect(() => {
        getPixelData()
    }, [setPixeldata])

    async function getPixelData() {
        const result = await fetch('http://localhost:3001/')
        .then(res => res.json())
        setPixeldata(result)
    }

    console.log(pixeldata)

    const [matrix, setMatrix] = useState(
        Array(50)
            .fill()
            .map(() =>
                Array(50)
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

        if (props.currentColor !== newMatrix[rowIndex][colIndex]) {
            newMatrix[rowIndex][colIndex] = props.currentColor;
        } else {
            newMatrix[rowIndex][colIndex] = 0;
        }

        setMatrix(newMatrix);
        console.log('current user owns this pixel')
    };

    function buyOrChange(rowIndex, colIndex) {
        let pixelIndexNum = parseInt((rowIndex*20) + (colIndex))
        console.log(pixelIndexNum, rowIndex, colIndex, blockchain.account)
        let pixelinfo = pixeldata[pixelIndexNum].split(',')
        let pixeladdress = pixelinfo[0].substring(2,44)
        let pixelcolor = pixelinfo[1]
        pixelcolor = pixelcolor.substring(0, pixelcolor.length - 1)
        pixelcolor = pixelcolor.substring(1)
        if (pixeladdress.toLowerCase() === blockchain.account) {
            changeColor(rowIndex, colIndex)
        }
        else {
            buyPixel(rowIndex, colIndex)
        }
    }

    function seeOwnedPixels() {
        let allPixels = document.getElementById('allpixels').children
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            let pixelinfo = pixeldata[p].split(',')
            let pixeladdress = pixelinfo[0].substring(2,44)
            let pixelcolor = pixelinfo[1]
            pixelcolor = pixelcolor.substring(0, pixelcolor.length - 1)
            pixelcolor = pixelcolor.substring(1)
            if (pixeladdress.toLowerCase() === blockchain.account) {
                element.style.boxShadow = "inset 0 0 0 2px #70FF32"
            }
        }
    };

    function seeUnownedPixels() {
        let allPixels = document.getElementById('allpixels').children
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            let pixelinfo = pixeldata[p].split(',')
            let pixeladdress = pixelinfo[0].substring(2,44)
            let pixelcolor = pixelinfo[1]
            pixelcolor = pixelcolor.substring(0, pixelcolor.length - 1)
            pixelcolor = pixelcolor.substring(1)
            if (pixeladdress.toLowerCase() === "0x0000000000000000000000000000000000000000") {
                element.style.boxShadow = "inset 0 0 0 2px #FFFF69"
            }
        }
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            let pixelinfo = pixeldata[p].split(',')
            let pixeladdress = pixelinfo[0].substring(2,44)
            let pixelcolor = pixelinfo[1]
            pixelcolor = pixelcolor.substring(0, pixelcolor.length - 1)
            pixelcolor = pixelcolor.substring(1)
            if (pixeladdress.toLowerCase() !== "0x0000000000000000000000000000000000000000" && pixeladdress.toLowerCase() !== blockchain.account) {
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

    return (
        <div className='flex flex-col items-center'>
            <div className='h-[75px] mb-[10px] w-[1000px] flex justify-center'>
                <button className='border-b-[5px] active:translate-y-[2px] active:border-b-[3px] border-green-600 bg-green-500 mr-[12.5px] rounded-lg text-lg font-semibold w-[175px] px-2 h-full' onClick={seeOwnedPixels}>Show my pixels<img className='inline ml-1 w-7 h-7 mb-[1px]' src={OwnedPixel} /></button>
                <button className='border-b-[5px] active:translate-y-[2px] active:border-b-[3px] border-red-600 bg-red-500 ml-[12.5px] mr-[12.5px] rounded-lg text-lg font-semibold w-[175px] px-2 h-full' onClick={removeOwnedPixelsBorders}>Hide pixel borders</button>
                <button className='border-b-[5px] active:translate-y-[2px] active:border-b-[3px] border-blue-600 bg-blue-500 ml-[12.5px] rounded-lg text-lg font-semibold w-[175px] px-2 h-full' onClick={seeUnownedPixels}>Show (un)owned pixels<img className='inline ml-1 w-7 h-7 mb-[1px]' src={UnownedPixel} /><img className='inline ml-1 w-7 h-7 mb-[1px]' src={UnownedPixel2} /></button>
            </div>
            <div id='allpixels' className='allpixels flex flex-wrap max-w-[1000px] mb-[85px]'>
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
        </div>
    );
};

export default Canvas;