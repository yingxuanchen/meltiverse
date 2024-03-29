import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState, Fragment, ChangeEvent, useContext } from "react";
import { Tag } from "../../types/types";
import { snackbarStore } from "../../store/snackbarStore";
import { fetcher } from "../../utils/utils";
import { sidebarStore } from "../../store/sidebarStore";

interface Props {
  tag: Tag | null;
  onClose: (toRefresh: boolean) => void;
}

const AddEditTag = (props: Props) => {
  const { tag, onClose } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [labelInput, setLabelInput] = useState<string>(tag?.label ?? "");
  const { setSnackbar } = useContext(snackbarStore);
  const { dispatch: dispatchSidebar } = useContext(sidebarStore);

  const handleLabelInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const trimmed = event.target.value.trim();
    setLabelInput(trimmed);
  };

  const handleSave = async () => {
    const reqBody = {
      id: tag?.id,
      label: labelInput,
    };
    const url = tag
      ? `${process.env.REACT_APP_HOST_URL}/tag/${tag.id}`
      : `${process.env.REACT_APP_HOST_URL}/tag`;
    setIsLoading(true);
    try {
      const response = await fetcher(url, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: { "Content-Type": "application/json" },
      });
      setIsLoading(false);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(`Failed to save tag: ${data.errorMessage}`);
      }
      setSnackbar({
        message: `Tag ${tag ? "edited" : "added"} successfully!`,
        severity: "success",
        open: true,
      });
      onClose(true);
      dispatchSidebar({
        type: "REFRESH",
      });
    } catch (error) {
      setIsLoading(false);
      setSnackbar({
        message: (error as Error).message,
        severity: "error",
        open: true,
      });
    }
  };

  return (
    <Fragment>
      <Dialog open={true} onClose={() => onClose(false)}>
        <DialogTitle>{tag ? "Edit" : "Add"} Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="tag"
            label="Tag"
            type="text"
            variant="standard"
            value={labelInput}
            onChange={handleLabelInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="outlined"
            disabled={!labelInput || isLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AddEditTag;
