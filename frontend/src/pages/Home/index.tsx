// import { ethers } from "hardhat";
import { useEffect, useState } from "react";
// import Market from "artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

const Home = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
    // const provider = new ethers.providers.JsonRpcProvider();
    // const marketContract = new ethers.Contract(
    //   marketAddress,
    //   Market.abi,
    //   provider
    // );

    // const data = marketContract.fetc;
  };

  return <div>Home</div>;
};

export default Home;
