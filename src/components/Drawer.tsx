import { KeyboardEvent, useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import { addJournal, fetchTitles } from "../utils/db";
import { useSelectedTitleStore } from "../utils/store";

type DrawerComponentProps = {
  open: boolean;
  setOpen: (a: boolean) => void;
};

export const DrawerComponent = (props: DrawerComponentProps) => {
  const { open, setOpen } = props;

  const [newTitle, setNewTitle] = useState("");

  const [titles, setTitles] = useState<string[]>([]);

  const { setSelectedTitle, selectedTitle } = useSelectedTitleStore(
    (state) => state
  );

  const closeDrawer = () => setOpen(false);

  const addHandler = () => {
    addJournal({ title: newTitle, content: "" })
      .then((res) => {
        console.log(res);
        setNewTitle("");
        updateTitles();
        setSelectedTitle(newTitle);
        closeDrawer();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateTitles = () => {
    fetchTitles()
      .then((response) => {
        setTitles(response);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const listItemClickHandler = (item: string) => () => {
    setSelectedTitle(item);
    closeDrawer();
  };

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      addHandler();
    }
  };

  useEffect(() => {
    updateTitles();
  }, [selectedTitle]);

  return (
    <Drawer open={open} onClose={closeDrawer}>
      <Box
        sx={{
          height: "100%",
          width: 250,
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        <List sx={{ flexGrow: 1 }}>
          {titles.map((listItem) => {
            return (
              <ListItem key={listItem} disablePadding>
                <ListItemButton onClick={listItemClickHandler(listItem)}>
                  <ListItemIcon>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText primary={listItem} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Box
          sx={{
            padding: "10px",
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <TextField
            id="new-topic"
            label="Topic"
            variant="outlined"
            sx={{ width: 190 }}
            size="small"
            value={newTitle}
            onKeyDown={keyDownHandler}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <IconButton
            color="primary"
            aria-label="add journal"
            sx={{ flexShrink: 1 }}
            onClick={addHandler}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};
