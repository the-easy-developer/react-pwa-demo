import { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { useSelectedTitleStore } from "../utils/store";

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
  const selectedTitle = useSelectedTitleStore((state) => state.selectedTitle);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
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
          <Typography variant="h6"> {selectedTitle} </Typography>
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
              <IconButton aria-label="delete">
                <DeleteIcon />
              </IconButton>
              <Button variant="contained"> Save </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
