import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Market from "./../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { marketAddress } from "../../configure";
import axios from "axios";
import Web3Modal from "web3modal";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { NFTMarketplace__factory } from "../../typechain";
import { NFT } from "../../interfaces";

const Home = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const marketContract = NFTMarketplace__factory.connect(
      marketAddress,
      provider
    );

    const data = await marketContract.fetchMarketItems();

    console.log(data);

    const items = await Promise.all(
      data.map(async (item: NFT) => {
        const tokenUri = await marketContract.tokenURI(item.tokenId);
        const meta = await axios.get(tokenUri);

        return {
          price: ethers.utils.formatUnits(item.price.toString(), "ether"),
          tokenId: item.tokenId.toString(),
          owner: item.owner,
          seller: item.seller,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
      })
    );

    setNfts(items);
    setLoading(false);
  };

  const buyNft = async (nft: NFT) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const contract = NFTMarketplace__factory.connect(
      marketAddress,
      provider.getSigner()
    );

    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(marketAddress, Market.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();

    fetchNfts();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, my: 10 }}>
        {loading ? (
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ textAlign: "center" }}
          >
            Loading...
          </Typography>
        ) : !nfts.length ? (
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ textAlign: "center" }}
          >
            No items in marketplace
          </Typography>
        ) : (
          <Grid
            container
            spacing={{ xs: 3, md: 6 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {nfts &&
              nfts.map((nft, id) => (
                <Grid item xs={12} sm={4} md={3} key={id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={nft.image}
                      alt={nft.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {nft.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nft.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => buyNft(nft)}>
                        Buy
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Home;
