const tokenBridge = () => {
  let token = null;

  const getToken = () => token;

  const setToken = (value) => {
    token = value;
    return true;
  };

  const removeToken = () => {
    token = null;
    return true;
  };

  return {
    getToken,
    setToken,
    removeToken,
  };
};

export default tokenBridge();
