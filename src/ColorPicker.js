import React from "react";
import Pixel from "./Pixel";
import Colors from "./Colors";

const ColorPicker = props => {
    return (
        <div className="p-[8px] bg-white colorpicker translate-x-8 rounded-xl w-[96px] h-[336px] flex flex-wrap">
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