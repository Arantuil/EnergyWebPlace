import React, { useState, useEffect } from "react";
import Colors from "./Colors";
import Pixel from "./Pixel";

const Canvas = props => {
    const [matrix, setMatrix] = useState(
        Array(50)
            .fill()
            .map(() =>
                Array(50)
                    .fill()
                    .map(() => 0)
            )
    );

    const changeColor = (rowIndex, colIndex) => {
        const newMatrix = JSON.parse(JSON.stringify(matrix));
        if (props.currentColor !== newMatrix[rowIndex][colIndex]) {
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
    };

    const clearCanvas = () => {
        setMatrix(
            Array(50)
                .fill()
                .map(() =>
                    Array(50)
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
    });

    return (
        <div className='flex flex-row items-center'>
            <div className='flex flex-wrap max-w-[900px]'>
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
            <button className='text-black bg-gray-300 p-1' onClick={clearCanvas}>
                Clear
            </button>
        </div>
    );
};

export default Canvas;