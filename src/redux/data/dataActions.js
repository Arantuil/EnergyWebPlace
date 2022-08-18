// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      const allPixelsArray = [];
      //let row = 0;
      //for (let i = 0; i < 6; i++) {
      //  let pixelInfo = await store
      //  .getState()
      //  .blockchain.smartContract.methods.pixels(row, i)
      //  .call();
      //  allPixelsArray.push(pixelInfo)
      //  if (i === 5) {
      //    let pixelInfo = await store
      //    .getState()
      //    .blockchain.smartContract.methods.pixels(row, 5)
      //    .call();
      //    allPixelsArray.push(pixelInfo)
      //    row++
      //    i = 0
      //  }
      //  if (row === 6) {
      //    break
      //  }
      //}
      //allPixelsArray.pop()

      dispatch(
        fetchDataSuccess({
          allPixelsArray,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
