import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Colors from './Colors';
import Pixel from './Pixel';
import OwnedPixel from './assets/images/OwnedPixelIcon.png';
import UnownedPixel from './assets/images/UnownedPixelIcon.png';
import UnownedPixel2 from './assets/images/UnownedPixelIcon2.png';
import { db } from './firebase';
import { onValue, ref, set, update } from 'firebase/database';

const Canvas = props => {
    const blockchain = useSelector((state) => state.blockchain);
    const [pixeldata, setPixeldata] = useState([]);

    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            setPixeldata(data)
        })
    }, []);

    async function initColors() {
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        let rowindex = 0;
        let colindex = 0;
        for (let m = 0; m < 10000; m++) {
            if (m % 100 === 0) {
                colindex = 0;
                rowindex ++;
            }
            if (m % 1000 === 0) {
                console.log('color indexer:', m)
            }
            newMatrix[rowindex-1][colindex] = pixeldata["pixels"][m]["color"];
            colindex ++
        }
        setMatrix(newMatrix);
        console.log('Colors initialised')
    }

    const [matrix, setMatrix] = useState(
        Array(100)
            .fill()
            .map(() =>
                Array(100)
                    .fill()
                    .map(() => 0)
            )
    )

    useEffect(() => {
        initColors()
    }, [pixeldata])

    const buyPixel = (rowIndex, colIndex) => {
        let pixelIndexNum = parseInt((rowIndex*100) + (colIndex))
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        let totalCostWei = String(10000000000000)
        blockchain.smartContract.methods.buyPixel(rowIndex, colIndex).send({
            to: "0x4Acf16C8F832bE41b25898dbB7027A8D0291B6F8",
            from: blockchain.account,
            value: totalCostWei,
        })
        .then((receipt) => {
            console.log('updating...');
            update(ref(db, 'pixels/'+String(pixelIndexNum)), {
                owner: blockchain.account
            })
        });
        setMatrix(newMatrix);
    }

    const changeColor = (rowIndex, colIndex) => {
        let pixelIndexNum = parseInt((rowIndex*100) + (colIndex))
        const newMatrix = JSON.parse(JSON.stringify(matrix));

        if (props.currentColor !== newMatrix[rowIndex][colIndex]) {
            newMatrix[rowIndex][colIndex] = props.currentColor;
        } else {
            newMatrix[rowIndex][colIndex] = 0;
        }
        update(ref(db, 'pixels/'+String(pixelIndexNum)), {
            color: props.currentColor
        })

        setMatrix(newMatrix);
        console.log('current user owns this pixel')
    }

    async function buyOrChange(rowIndex, colIndex) {
        let pixelIndexNum = parseInt((rowIndex*100) + (colIndex))
        let pixeladdress = pixeldata["pixels"][pixelIndexNum]["owner"]
        if (pixeladdress.toLowerCase() === blockchain.account) {
            changeColor(rowIndex, colIndex)
        }
        else {
            buyPixel(rowIndex, colIndex)
        }
    }

    async function seeOwnedPixels() {
        let allPixels = document.getElementById('allpixels').children
        for (let p = 0; p < allPixels.length; p++) {
            let loopedelement = allPixels[p]
            let pixeladdress = pixeldata["pixels"][p]["owner"]
            if (pixeladdress.toLowerCase() === blockchain.account.toLowerCase()) {
                loopedelement.style.boxShadow = "inset 0 0 0 2px #70FF32"
            }
        }
    }

    async function seeUnownedPixels() {
        let allPixels = document.getElementById('allpixels').children
        for (let p = 0; p < allPixels.length; p++) {
            let loopedelement = allPixels[p]
            let pixeladdress = pixeldata["pixels"][p]["owner"]
            if (pixeladdress.toLowerCase() === "0x0000000000000000000000000000000000000000") {
                loopedelement.style.boxShadow = "inset 0 0 0 1px #FFFF69"
            }
        }
        for (let p = 0; p < allPixels.length; p++) {
            let loopedelement = allPixels[p]
            let pixeladdress = pixeldata["pixels"][p]["owner"]
            if (pixeladdress.toLowerCase() !== "0x0000000000000000000000000000000000000000" && pixeladdress.toLowerCase() !== blockchain.account) {
                loopedelement.style.boxShadow = "inset 0 0 0 1px #61DAFB"
            }
        }
    }

    async function removeOwnedPixelsBorders() {
        let allPixels = document.getElementById('allpixels').children
        for (let p = 0; p < allPixels.length; p++) {
            let element = allPixels[p];
            element.style.boxShadow = "inset 0 0 0 0px #5B5B5B"
        } 
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='h-[75px] mb-[20px] w-[1000px] flex justify-center'>
                <button className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-green-500 bg-green-400 mr-[12.5px] rounded-3xl text-lg font-semibold w-[175px] px-2 h-full' onClick={seeOwnedPixels}>Show my pixels<img className='border-[1px] border-black rounded inline ml-1 w-7 h-7 mb-[1px]' src={OwnedPixel} /></button>
                <button className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-red-500 bg-red-400 ml-[12.5px] mr-[12.5px] rounded-3xl text-lg font-semibold w-[175px] px-2 h-full' onClick={removeOwnedPixelsBorders}>Hide pixel borders</button>
                <button className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-blue-500 bg-blue-400 ml-[12.5px] rounded-3xl text-lg font-semibold w-[175px] px-2 h-full' onClick={seeUnownedPixels}>Show (un)owned pixels<img className='border-[1px] border-black rounded inline ml-1 w-7 h-7 mb-[1px]' src={UnownedPixel} /><img className='border-[1px] border-black rounded inline ml-1 w-7 h-7 mb-[1px]' src={UnownedPixel2} /></button>
            </div>
            <div id='allpixels' className='allpixels flex flex-wrap w-[2000px] mb-[95px]'>
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