import { useState, useContext, Fragment, useEffect, useCallback } from "react";
import { snackbarStore } from "../../store/snackbarStore";
import { MaterialTimestamps, Tag } from "../../types/types";
import {
  Grid,
  IconButton,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AddEditTag from "./AddEditTag";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetcher,
  formatDateString,
  getTimestampFromSeconds,
} from "../../utils/utils";
import { contentStore } from "../../store/contentStore";
import { mediaStore } from "../../store/mediaStore";
import { authStore } from "../../store/authStore";

interface Props {
  tagId: number;
}

const ViewTag = (props: Props) => {
  const { tagId } = props;
  const [tag, setTag] = useState<Tag | null>(null);
  const [matTimestamps, setMatTimestamps] = useState<MaterialTimestamps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { setSnackbar } = useContext(snackbarStore);
  const { state: contentState, dispatch: dispatchContent } =
    useContext(contentStore);
  const { dispatch: dispatchMedia } = useContext(mediaStore);
  const { state: authState } = useContext(authStore);

  const fetchTag = useCallback(async () => {
    setIsLoading(true);
    try {
      const tagResponse = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/tag/${tagId}`
      );
      const matTimestampsResponse = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/tag/${tagId}/material`
      );
      setIsLoading(false);
      if (!tagResponse.ok || !matTimestampsResponse.ok) {
        throw new Error("Failed to fetch tag or timestamps");
      }
      const tagData = await tagResponse.json();
      const matTimestampsData = await matTimestampsResponse.json();
      setTag(tagData);
      setMatTimestamps(matTimestampsData.content);
    } catch (error) {
      setSnackbar({
        message: (error as Error).message,
        severity: "error",
        open: true,
      });
    }
  }, [tagId, setSnackbar]);

  useEffect(() => {
    fetchTag();
  }, [fetchTag]);

  const handleEdit = () => {
    setOpenModal(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/tag/${tagId}`,
        {
          method: "DELETE",
        }
      );
      setIsLoading(false);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(`Failed to delete tag: ${data.errorMessage}`);
      }
      setSnackbar({
        message: `Tag deleted successfully!`,
        severity: "success",
        open: true,
      });
      dispatchContent({
        type: "CHANGE_CONTENT",
        payload: { contentType: null },
      });
    } catch (error) {
      setSnackbar({
        message: (error as Error).message,
        severity: "error",
        open: true,
      });
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    fetchTag();
  };

  const handleSelectMaterial = (materialId: number) => {
    dispatchContent({
      type: "SET_MATERIAL",
      payload: { materialId },
    });
  };

  const handleSelectTimestamp = (materialId: number, timestamp: number) => {
    if (contentState.materialId === materialId) {
      dispatchMedia({
        type: "CHANGE_TIME",
        payload: { seconds: timestamp },
      });
    } else {
      dispatchContent({
        type: "SET_MATERIAL",
        payload: { materialId },
      });
    }
  };

  return (
    <Fragment>
      {openModal && <AddEditTag tag={tag} onClose={handleModalClose} />}
      <Grid container columns={3}>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <h3>Tag: {tag?.label}</h3>
        </Grid>
        <Grid item xs={1} style={{ textAlign: "end", alignSelf: "center" }}>
          <IconButton
            aria-label="edit"
            onClick={handleEdit}
            disabled={!authState.loggedIn || authState.role !== "admin"}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={handleDelete}
            disabled={
              !authState.loggedIn ||
              authState.role !== "admin" ||
              matTimestamps.length > 0
            }
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      {isLoading && <CircularProgress style={{ alignSelf: "center" }} />}
      {!isLoading && matTimestamps.length === 0 && <h4>No material yet</h4>}
      {!isLoading && matTimestamps.length > 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Timestamps</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matTimestamps.map((el) => (
                <TableRow
                  key={el.material.id}
                  onClick={() => handleSelectMaterial(el.material.id)}
                  hover={true}
                  selected={contentState.materialId === el.material.id}
                >
                  <TableCell>
                    {formatDateString(el.material.postedDate)}
                  </TableCell>
                  <TableCell>{el.material.title}</TableCell>
                  <TableCell>
                    {el.timestamps.map((timestamp) => (
                      <div
                        key={timestamp}
                        className="clickable"
                        onClick={() =>
                          handleSelectTimestamp(el.material.id, timestamp)
                        }
                      >
                        {getTimestampFromSeconds(timestamp)}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Fragment>
  );
};

export default ViewTag;
