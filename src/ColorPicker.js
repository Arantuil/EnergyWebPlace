import React from "react";
import Pixel from "./Pixel";
import Colors from "./Colors";

const ColorPicker = props => {
    return (
        <div className="colorpicker mr-2 w-[80px] flex flex-wrap">
            {Colors.map((color, index) => {
                return (
                    <Pixel
                        key={index}
                        onClick={() => props.setColor(index)}
                        background={color}
                        current={Colors[props.currentColor] === color}
                    />
                );
            })}
        </div>
    );
};

export default ColorPicker;