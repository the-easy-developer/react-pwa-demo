import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { DrawerComponent } from "./Drawer";

export const Shell = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "initial" }}
          >
            {import.meta.env.VITE_APP_NAME}
          </Typography>
        </Toolbar>
      </AppBar>
      <DrawerComponent open={open} setOpen={setOpen} />
    </Box>
  );
};
