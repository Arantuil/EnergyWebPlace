import React, { useState } from "react";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";

const App = () => {
  const [color, setColor] = useState(0);

  return (
    <div className='bg-[#333] flex justify-center items-center h-[100vh]'>
      <ColorPicker
        currentColor={color}
        setColor={color => {
          setColor(color);
        }}
      />

      <Canvas currentColor={color} />
    </div>
  );
};

export default App;