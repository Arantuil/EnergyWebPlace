import React, { useState, useEffect } from "react";
import Colors from "./Colors";
import Pixel from "./Pixel";
import store from './redux/store'

const Canvas = props => {
    const [matrix, setMatrix] = useState(
        Array(10)
            .fill()
            .map(() =>
                Array(10)
                    .fill()
                    .map(() => 0)
            )
    );

    const changeColor = (rowIndex, colIndex) => {
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        if (props.currentColor !== newMatrix[rowIndex][colIndex]) {
            //blockchain.smartContract.methods
            //.changePixelColour()
            newMatrix[rowIndex][colIndex] = props.currentColor;
        } else {
            newMatrix[rowIndex][colIndex] = 0;
        }

        setMatrix(newMatrix);
        localStorage.clear();
        try {
            localStorage.setItem("matrix", JSON.stringify(newMatrix));
        } catch (domException) {
            if (
                ["QuotaExceededError", "NS_ERROR_DOM_QUOTA_REACHED"].includes(
                    domException.name
                )
            ) {
                console.log(domException);
            }
        }

        getPixelInfo() 
        async function getPixelInfo() {
            let pixelInfo = await store
            .getState()
            .blockchain.smartContract.methods
            .pixels(rowIndex, colIndex)
            .call();
            console.log(rowIndex, colIndex, pixelInfo["owner"])
            return(pixelInfo)
        }
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
        localStorage.clear();
    };

    useEffect(() => {
        const loadCanvasFromLocalStorage = () => {
            if (localStorage.hasOwnProperty("matrix")) {
                const localCanvas = localStorage.getItem("matrix");
                try {
                    setMatrix(JSON.parse(localCanvas));
                } catch (err) {
                    console.log(err);
                }
            }
        };
        loadCanvasFromLocalStorage();
    }, [setMatrix]);

    return (
        <div className='flex flex-row items-center'>
            <div className='flex flex-wrap max-w-[500px]'>
                {matrix.map((row, rowIndex) =>
                    row.map((_, colIndex) => {
                        return (
                            <Pixel
                                key={`${rowIndex}-${colIndex}`}
                                background={Colors[matrix[rowIndex][colIndex]]}
                                onClick={() => changeColor(rowIndex, colIndex)}
                            />
                        );
                    })
                )}
            </div>
            <button className='ml-4 rounded-md text-2xl font-bold text-black bg-green-300 p-1' onClick={clearCanvas}>
                Clear
            </button>
        </div>
    );
};

export default Canvas;