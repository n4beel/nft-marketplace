import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { marketAddress } from "../../configure";
import { NFT } from "../../interfaces";
import { NFTMarketplace__factory } from "../../typechain";
import axios from "axios";
import Web3Modal from "web3modal";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const Assets = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNfts();
  }, []);

  const fetchNfts = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const marketContract = NFTMarketplace__factory.connect(
      marketAddress,
      provider.getSigner()
    );

    const data = await marketContract.fetchMyNFTs();

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
            You don't own any NFT
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
                      // image={nft.image}
                      image="https://www.coreldraw.com/static/cdgs/images/free-trials/img-ui-cdgsx.jpg"
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
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {`${nft.price} ETH`}
                      </Typography>
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

export default Assets;
