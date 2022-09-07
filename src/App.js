import { useState, useEffect } from "react";
import Canvas from "./Canvas";
import ColorPicker from "./ColorPicker";

import { useDispatch, useSelector } from 'react-redux';
import { connect } from './redux/blockchain/blockchainActions';
import { fetchData } from './redux/data/dataActions';
import TubbyTurtlesPlace from './assets/images/TubbyTurtlesPlaceLogo.png'
import TubbyTurtlesPlaceScaled from './assets/images/TubbyTurtlesPlaceLogoScaleddark.png'
import { BsMouse2 } from 'react-icons/bs'
import { BsArrowLeft } from 'react-icons/bs'

const App = () => {
  const [loading, setLoading] = useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  useEffect(() => {
    setLoading(true);
    if (data["loading"] === false) {
      setLoading(false)
    }
  }, [data]);

  const dispatch = useDispatch();

  const [color, setColor] = useState(0);

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0
  });

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  window.addEventListener('load', function () {
    startApp();
  })
  async function startApp() {
    window.ethereum.sendAsync({
      method: "eth_accounts",
      params: [],
      jsonrpc: "2.0",
      id: new Date().getTime()
    }, function (error, result) {
      if (result["result"] !== "") dispatch(connect());
    });
    await sleep(500)
    document.getElementById('bgimage').style.minWidth = "2300px"
  }

  return (
    <div id='bgimage' className={`bgimage bg-no-repeat bg-cover flex justify-center items-center min-h-[100vh] py-6`}>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <div>
          <div className='flex justify-center mb-[1.5vw]'>
            <img className='w-[250px] h-[250px]' src={TubbyTurtlesPlaceScaled} alt="" />
          </div>
          <div className='flex flex-col text-center mx-auto justify-center mb-[1.5vw] w-[90%] md:w-[80%] lg:w-[70%]'>
            <h1 className='text-[#1E1E1E] font-bold text-3xl mb-2'>
              Welcome to EnergyWebPlace!
            </h1>
            <h2 className='text-[#1E1E1E] font-[500] text-xl'>EnergyWebPlace (EW/place) is a canvas of 100x100 pixels.
              You can buy any of the pixels on the canvas, once bought you can give the pixel any color you want.
            </h2>
            <h2 className='text-[#1E1E1E] font-[500] text-xl'>Each pixel only costs 0.005 EWT (Less than $0.02).
            </h2>
            <h2 className='text-[#1E1E1E] font-[500] text-xl'>It is recommended to use this application on a desktop computer.
            </h2>
          </div>
          <h2 className='text-[#1E1E1E] font-[500] text-xl flex text-center justify-center mb-4'>Connect to the {CONFIG.NETWORK.NAME} network</h2>
          <button className='flex text-3xl font-semibold text-center mx-auto
            justify-center rounded-lg items-center active:translate-y-1' onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
              getData();
            }}>
            <div className='bg-[#303030] rounded-md flex flex-row py-1 pl-2 pr-3'>
              <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 318.6 318.6" strokeLinejoin="round">
                <path d="M274.1 35.5l-99.5 73.9L193 65.8z" fill="#e2761b" stroke="#e2761b">
                </path><g fill="#e4761b" stroke="#e4761b"><path d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3z"></path><path d="M33.9 207.7L50.1 263l56.7-15.6-26.5-40.6zm69.7-69.5l-15.8 23.9 56.3 2.5-2-60.5z"></path><path d="M214.9 138.2l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z"></path></g><path d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zm-105 0l31.5 14.9-.2-9.3 2.5-22.1z" fill="#d7c1b3" stroke="#d7c1b3"></path><path d="M138.8 193.5l-28.2-8.3 19.9-9.1zm40.9 0l8.3-17.4 20 9.1z" fill="#233447" stroke="#233447"></path><path d="M106.8 247.4l4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z" fill="#cd6116" stroke="#cd6116"></path><path d="M87.8 162.1l23.6 46-.8-22.9zm120.3 23.1l-1 22.9 23.7-46zm-64-20.6l-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0l-2.7 18 1.2 45 6.7-34.1z" fill="#e4751f" stroke="#e4751f"></path><path d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z" fill="#f6851b" stroke="#f6851b"></path><path d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z" fill="#c0ad9e" stroke="#c0ad9e"></path><path d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z" fill="#161616" stroke="#161616"></path><path d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z" fill="#763d16" stroke="#763d16"></path><path d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z" fill="#f6851b" stroke="#f6851b"></path>
              </svg>
              <p className='my-auto' id='connectbutton'>
                Connect
              </p>
            </div>
          </button>

          {blockchain.errorMsg !== "" ? (
            <>
              <h2 className='mt-1 text-lg text-[#1E1E1E] md:text-xl flex text-center justify-center'>{blockchain.errorMsg}</h2>
            </>
          ) : null}
        </div>
      ) : (
        <div>
          {loading ?
            <div>
              <img className='w-[250px] h-[250px]' id='spinningLogo' src={TubbyTurtlesPlaceScaled} />
              <h1 className='relative text-[#1E1E1E] text-center text-3xl font-bold top-16'>Loading...</h1>
              <div className='relative top-20 bg-gray-300 rounded-md w-[250px] h-[30px]'>
                <div id='loadingbar' className='absolute bg-green-500 rounded-md h-full'></div>
              </div>
            </div>
            : (
              <div>
                <img className='absolute top-3 left-3 w-14 h-14 lg:w-20 lg:h-20' src={TubbyTurtlesPlaceScaled} alt="" />
                <div className='flex flex-col text-center mx-auto justify-center mb-[1.5vw] w-[90%] md:w-[80%] lg:w-[70%]'>
                  <a className='absolute top-3 lg:top-4 xl:top-5 -translate-x-10 md:-translate-x-32 lg:-translate-x-48 xl:-translate-x-52 w-[185px] h-[55px] rounded-2xl font-[500] bg-gradient-to-r from-[#c6a0ff] via-[#70c4cf] to-[#8fe495] border-b-[4px] border-[#36929e] hover:brightness-110 active:border-b-[1px] active:translate-y-[3px]' href="https://energywebnfts.com"><BsArrowLeft className='inline -translate-x-[3px]'/>Back to EnergyWebNFTs.com</a>
                  <h1 className='text-[#1E1E1E] font-bold text-3xl mb-2'>
                    Welcome to EnergyWebPlace!
                  </h1>
                  <h2 className='text-[#1E1E1E] font-[500] text-xl'>EnergyWebPlace (EW/place) is a canvas of 100x100 pixels.
                    You can buy any of the pixels on the canvas, once bought you can give the pixel any color you want.
                  </h2>
                  <h2 className='text-[#1E1E1E] font-[500] text-xl'>It is recommended to use this application on a desktop computer. 
                  </h2>
                  <h2 className='text-[#1E1E1E] font-[500] text-xl'>Tip: If you are using desktop, use <kbd className='border-2 border-white rounded-md px-[3px]'>Shift</kbd> + <div className='inline-flex h-[27px] translate-y-[3px] border-2 border-white rounded-md'><BsMouse2 className='inline mr-[2px] my-auto' /><kbd className='px-[3px] -translate-y-[2px]'>Scroll</kbd></div> for scrolling horizontally.
                  </h2>
                  <h2 className='text-[#1E1E1E] font-[500] text-xl'>And use <kbd className='border-2 border-white rounded-md px-[3px]'>Ctrl</kbd> + <div className='inline-flex h-[27px] translate-y-[3px] border-2 border-white rounded-md'><BsMouse2 className='inline mr-[2px] my-auto' /><kbd className='px-[3px] -translate-y-[2px]'>Scroll</kbd></div> for zooming in and out.
                  </h2>
                  <h2 className='text-[#1E1E1E] font-[500] text-xl'>Or you can use the arrow keys <kbd className='border-2 border-white rounded-md mx-[2px] px-[6px]'>↑</kbd><kbd className='border-2 border-white rounded-md mx-[2px] px-[6px]'>↓</kbd><kbd className='border-2 border-white rounded-md mx-[2px] px-[6px]'>←</kbd><kbd className='border-2 border-white rounded-md mx-[2px] px-[6px]'>→</kbd> to quickly move around the canvas.
                  </h2>
                  <h2 className='text-[#1E1E1E] font-[500] text-xl'>Each pixel only costs 0.005 EWT (Less then $0.02).
                  </h2>
                  <h2 className='text-[#1E1E1E] font-[500] text-xl'>You can buy a single pixel by just clicking on one, or you can use multi-select option below.
                  </h2>
                </div>
                <div className='flex flex-row justify-center items-center mr-[100px]'>
                  <ColorPicker
                    currentColor={color}
                    setColor={color => {
                      setColor(color);
                    }}
                  />
                  <Canvas currentColor={color} />
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default App;