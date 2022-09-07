import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Colors from './Colors';
import Pixel from './Pixel';
import OwnedPixel from './assets/images/OwnedPixelIcon.png';
import UnownedPixel from './assets/images/UnownedPixelIcon.png';
import UnownedPixel2 from './assets/images/UnownedPixelIcon2.png';
import { db } from './firebase';
import { onValue, ref, set, update } from 'firebase/database';
import Selecto from "react-selecto";
import { getStorage, getDownloadURL } from "firebase/storage";
import { BsLink45Deg } from 'react-icons/bs';

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
        let totalCostWei = String(2500000000000000)
        blockchain.smartContract.methods.buyPixel(rowIndex, colIndex).send({
            to: "0x71dB1A52b9E684AC73b3041a67AE9d39A6515591",
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

    async function addTargets() {
        var element = document.getElementById("allpixels").children
        for (let o = 0; o < element.length; o++) {
            let element2 = element[o];
            element2.classList.add("target");
            element2.classList.add(String(o));
        }
    }

    async function removeTargets() {
        var element = document.getElementById("allpixels").children
        for (let o = 0; o < element.length; o++) {
            let element2 = element[o];
            element2.classList.remove("selected");
            element2.classList.remove("target");
            element2.classList.remove(String(o));
        }
    }

    async function multiBuyPixels() {
        var elements = document.getElementsByClassName("selected")
        let listofrowcoords = []
        let listofcolcoords = []
        for (let e = 0; e < elements.length; e++) {
            let element = elements[e];
            let id = element.classList[3]
            if (id < 100) {
                listofrowcoords.push(String(0))
                listofcolcoords.push(String(id))
            }
            else if (id > 99) {
                listofrowcoords.push(String((parseInt(id) - parseInt(id % 100)) / 100))
                listofcolcoords.push(String(parseInt(id % 100)))
            }
        }
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        let totalCostWei = String(2500000000000000);
        blockchain.smartContract.methods.buyPixels(listofrowcoords, listofcolcoords).send({
            to: "0x71dB1A52b9E684AC73b3041a67AE9d39A6515591",
            from: blockchain.account,
            value: String(parseInt(totalCostWei)*parseInt(elements.length)),
        })
        .then((receipt) => {
            console.log('updating...');
            for (let index = 0; index < elements.length; index++) {
                let element = elements[index];
                let id = element.classList[3]

                update(ref(db, 'pixels/'+String(id)), {
                    owner: blockchain.account
                })
            }
        });
        setMatrix(newMatrix);
    }

    return (
        <div className='flex flex-col items-center'>
            <div className='h-[75px] mb-[20px] w-[1000px] flex justify-center'>
                <button className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-green-500 bg-green-400 mr-[12.5px] rounded-3xl text-lg font-semibold w-[185px] px-2 h-full' onClick={seeOwnedPixels}>Show my pixels<img className='border-[1px] border-black rounded inline ml-1 w-7 h-7 mb-[1px]' src={OwnedPixel} /></button>
                <button className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-red-500 bg-red-400 ml-[12.5px] mr-[12.5px] rounded-3xl text-lg font-semibold w-[185px] px-2 h-full' onClick={removeOwnedPixelsBorders}>Hide pixel borders</button>
                <button className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-blue-500 bg-blue-400 ml-[12.5px] rounded-3xl text-lg font-semibold w-[185px] px-2 h-full' onClick={seeUnownedPixels}>Show (un)owned pixels<img className='border-[1px] border-black rounded inline ml-1 w-7 h-7 mb-[1px]' src={UnownedPixel} /><img className='border-[1px] border-black rounded inline ml-1 w-7 h-7 mb-[1px]' src={UnownedPixel2} /></button>
            </div>
            <div className='flex flex-row'>
                <div className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-[rgb(221,209,120)] w-[114px] h-[64px] rounded-3xl bg-yellow-200 mr-[386px] flex item-center'>
                    <a className='w-[114px] flex flex-row text-lg font-semibold justify-center my-auto' href='https://storage.googleapis.com/energywebnfts.appspot.com/place' target='_blank'>Canvas<BsLink45Deg className='my-auto' /></a>
                </div>
                <div className='flex items-center'>
                    <button className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-[rgb(112,195,207)] w-60 h-16 text-lg font-semibold mr-2 rounded-3xl bg-[rgb(129,221,235)]' onClick={addTargets}>Turn on multi-selector</button>
                    <button onClick={multiBuyPixels} className='border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-[rgb(97,204,115)] w-60 h-16 text-lg font-semibold mr-2 ml-2 rounded-3xl bg-[rgb(110,231,130)]'>Buy multi-selected pixels</button>
                    <button className='mr-[500px] border-b-[5px] active:translate-y-[2px] hover:brightness-110 active:border-b-[3px] border-[rgb(209,128,170)] w-60 h-16 text-lg font-semibold ml-2 rounded-3xl bg-[rgb(238,145,193)]' onClick={removeTargets}>Turn off multi-selector (recommended after use)</button>
                </div>
            </div>
            <Selecto
                // The container to add a selection element
                container={document.querySelector('.allpixels')}
                // The area to drag selection element (default: container)
                dragContainer={document.querySelector('.allpixels')}
                // Targets to select. You can register a queryselector or an Element.
                selectableTargets={[".target", document.querySelector(".target2")]}
                // Whether to select by click (default: true)
                selectByClick={true}
                // Whether to select from the target inside (default: true)
                selectFromInside={true}
                // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
                continueSelect={false}
                // Determines which key to continue selecting the next target via keydown and keyup.
                toggleContinueSelect={"shift"}
                // The container for keydown and keyup events
                keyContainer={window}
                // The rate at which the target overlaps the drag area to be selected. (default: 100)
                hitRate={60}
                onSelect={e => {
                    e.added.forEach(el => {
                        el.classList.add("selected");
                    });
                    //e.removed.forEach(el => {
                    //    el.classList.remove("selected");
                    //});
                }}
            ></Selecto>
            <div className='w-[2100px] px-[50px] py-[25px]'>
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
        </div>
    );
};

export default Canvas;