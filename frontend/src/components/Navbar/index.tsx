import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function ButtonAppBar() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              NFT Marketplace
            </Typography>
            <Button color="inherit" onClick={() => navigate("/assets")}>
              My Assets
            </Button>
            <Button color="inherit" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
