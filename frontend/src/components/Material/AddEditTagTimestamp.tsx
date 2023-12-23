import { Tag, TagTimestamp } from "../../types/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import useValidateOnTouch from "../../hooks/useValidateOnTouch";
import { timestampFormatRule } from "../../utils/inputValidationRules";
import { snackbarStore } from "../../store/snackbarStore";
import useDebounce from "../../hooks/useDebounce";
import {
  fetcher,
  getSecondsFromTimestamp,
  getTimestampFromSeconds,
} from "../../utils/utils";

interface Props {
  materialId: number;
  tagTimestamp: TagTimestamp | null;
  onClose: () => void;
}

const AddEditTagTimestamp = (props: Props) => {
  const { materialId, tagTimestamp, onClose } = props;
  const { setSnackbar } = useContext(snackbarStore);
  const [tagValue, setTagValue] = useState<Tag | null>(
    tagTimestamp ? tagTimestamp.tag : null
  );
  const [tagInputValue, setTagInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<readonly Tag[]>([]);
  const {
    value: timestampValue,
    errorMessage: timestampError,
    onChange: onTimestampChange,
    isInputValid: isTimestampValid,
  } = useValidateOnTouch(
    tagTimestamp?.timestamp
      ? getTimestampFromSeconds(tagTimestamp.timestamp)
      : "",
    [timestampFormatRule("Timestamp")]
  );
  const debouncedTagInput = useDebounce(tagInputValue, 500);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    const response = await fetcher(
      `${process.env.REACT_APP_HOST_URL}/tag?search=${debouncedTagInput}`
    );
    const data = await response.json();
    setTags(data.content);
    setIsLoading(false);
  }, [debouncedTagInput]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reqBody = {
      id: tagTimestamp?.id,
      materialId: materialId,
      tagId: tagValue!.id,
      timestamp: timestampValue
        ? getSecondsFromTimestamp(timestampValue)
        : null,
    };
    const url = tagTimestamp
      ? `${process.env.REACT_APP_HOST_URL}/material-tag/${tagTimestamp.id}`
      : `${process.env.REACT_APP_HOST_URL}/material-tag`;
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
        throw new Error(`Failed to save material tag: ${data.errorMessage}`);
      }
      setSnackbar({
        message: `Material tag ${
          tagTimestamp ? "edited" : "added"
        } successfully!`,
        severity: "success",
        open: true,
      });
      onClose();
    } catch (error) {
      setSnackbar({
        message: (error as Error).message,
        severity: "error",
        open: true,
      });
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="xs" fullWidth={true}>
      <form onSubmit={handleSave}>
        <DialogTitle>
          {tagTimestamp ? "Edit" : "Add"} Tag for Material
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            size="small"
            filterOptions={(x) => x}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.label}
            options={tags}
            value={tagValue}
            onChange={(event: any, newValue: Tag | null) => {
              setTagValue(newValue);
            }}
            inputValue={tagInputValue}
            onInputChange={(event: any, newValue: string) =>
              setTagInputValue(newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tag"
                variant="filled"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            )}
          />
          <TextField
            margin="normal"
            id="timestamp"
            label="Timestamp"
            type="text"
            variant="standard"
            value={timestampValue}
            onChange={onTimestampChange}
            error={!isTimestampValid && timestampError !== ""}
            helperText={!isTimestampValid ? timestampError : null}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="outlined"
            disabled={tagValue === null || isLoading}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEditTagTimestamp;
