import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import TextField from '@mui/material/TextField';
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';

type DrawerComponentProps = {
  open: boolean;
  setOpen: (a: boolean) => void;
};

const list = ["ToDo", "Movies to watch", "Fav songs", "Dreams and aspirations"];

export const DrawerComponent = (props: DrawerComponentProps) => {
  const { open, setOpen } = props;

  const closeDrawer = () => setOpen(false);

  const DrawerList = (
    <Box
      sx={{ height: '100%', width: 250, display: "flex", flexDirection: "column" }}
      role="presentation"
    >
      <List sx={{ flexGrow: 1 }}>
        {list.map((listItem) => {
          return (
            <ListItem key={listItem} disablePadding>
              <ListItemButton onClick={closeDrawer}>
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
      <Box component="form" sx={{ padding: '10px', display: 'flex', gap: '5px', alignItems: 'center' }}>
        <TextField id="new-topic" label="Topic" variant="outlined" sx={{ width: 190 }} size="small" />
        <IconButton color="primary" aria-label="add journal" sx={{ flexShrink: 1 }}>
            <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Drawer open={open} onClose={closeDrawer}>
      {DrawerList}
    </Drawer>
  );
};
