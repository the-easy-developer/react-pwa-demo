import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSelectedTitleStore } from "../utils/store";
import { getJournal, updateJournal, deleteJournal } from "../utils/db";

const EmptyJournal = () => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h4">Welcome to your journal,</Typography> <br />
      <Typography variant="h4">
        Please select a journal or add a journal entry using the textbox at the
        bottom in the left sidebar.
      </Typography>
    </Box>
  );
};

export const Journal = () => {
  const { selectedTitle, setSelectedTitle } = useSelectedTitleStore(
    (state) => state
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const savedMsgRef = useRef<HTMLElement>(null);

  const saveHandler = () => {
    if (!textareaRef.current) {
      return;
    }
    if (savedMsgRef.current) {
      savedMsgRef.current.style.visibility = "hidden";
      savedMsgRef.current.style.opacity = "1";
      savedMsgRef.current.style.transition = "none";
    }
    updateJournal({ title: selectedTitle, content: textareaRef.current.value })
      .then((result) => {
        console.log(result);
        if (savedMsgRef.current) {
          savedMsgRef.current.style.visibility = "visible";
          savedMsgRef.current.style.transition = "opacity 3s linear";
          savedMsgRef.current.style.opacity = "0";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteHandler = () => {
    deleteJournal(selectedTitle)
      .then((result) => {
        console.log(result);
        setSelectedTitle("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getJournal(selectedTitle)
      .then((result) => {
        if (textareaRef.current) {
          textareaRef.current.value = result.content;
          textareaRef.current.focus();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedTitle]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        width: "100%",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      {!selectedTitle && <EmptyJournal />}
      {selectedTitle && (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            textAlign: "initial",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6"> {selectedTitle} </Typography>

            <Typography
              variant="subtitle1"
              color="success"
              className="journal-saved-msg"
              ref={savedMsgRef}
            >
              Saved
            </Typography>
          </Box>
          <Divider sx={{ marginBottom: "1rem" }} />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <textarea
              className="text-area-content"
              placeholder="Express yourself here..."
              ref={textareaRef}
            />
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <IconButton aria-label="delete" onClick={deleteHandler}>
                <DeleteIcon />
              </IconButton>
              <Button variant="contained" onClick={saveHandler}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
