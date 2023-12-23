import {
  Stack,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  IconButton,
  TablePagination,
} from "@mui/material";
import { useState, useEffect, Fragment, useCallback, useContext } from "react";
import { TagTimestamp } from "../../types/types";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddEditTagTimestamp from "./AddEditTagTimestamp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { fetcher, getTimestampFromSeconds } from "../../utils/utils";
import { snackbarStore } from "../../store/snackbarStore";
import { mediaStore } from "../../store/mediaStore";
import { contentStore } from "../../store/contentStore";
import { authStore } from "../../store/authStore";

interface Props {
  materialId: number;
}

const ViewTagTimestamps = (props: Props) => {
  const { materialId } = props;
  const [tagTimestamps, setTagTimestamps] = useState<TagTimestamp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedTagTimestamp, setSelectedTagTimestamp] =
    useState<TagTimestamp | null>(null);
  const { dispatch: dispatchMedia } = useContext(mediaStore);
  const { setSnackbar } = useContext(snackbarStore);
  const [page, setPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { dispatch: dispatchContent } = useContext(contentStore);
  const { state: authState } = useContext(authStore);

  const fetchTagTimestamps = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/material/${materialId}/tag?page=${page}`
      );
      const data = await response.json();
      setTagTimestamps(data.content);
      setPage(data.pageable.pageNumber);
      setTotalCount(data.totalElements);
      setIsLoading(false);
    },
    [materialId]
  );

  useEffect(() => {
    fetchTagTimestamps(0);
  }, [fetchTagTimestamps]);

  const handlePageChange = (_event: any | null, page: number) => {
    fetchTagTimestamps(page);
  };

  const handleAddEdit = (tagTimestamp: TagTimestamp | null) => {
    setSelectedTagTimestamp(tagTimestamp);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/material-tag/${id}`,
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
      fetchTagTimestamps(0);
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
    fetchTagTimestamps(0);
  };

  const handleClick = (timestamp: number) => {
    dispatchMedia({
      type: "CHANGE_TIME",
      payload: { seconds: timestamp },
    });
  };

  const handleSelectTag = (tagId: number) => {
    dispatchContent({
      type: "CHANGE_CONTENT",
      payload: { contentType: "VIEW_TAG", tagId },
    });
  };

  return (
    <Fragment>
      {openModal && (
        <AddEditTagTimestamp
          materialId={materialId}
          tagTimestamp={selectedTagTimestamp}
          onClose={handleModalClose}
        />
      )}
      <Stack>
        <Grid container columns={3}>
          <Grid item xs={1} style={{ textAlign: "start", alignSelf: "center" }}>
            <Button
              size="small"
              variant="contained"
              onClick={() => handleAddEdit(null)}
              startIcon={<LibraryAddIcon />}
              disabled={!authState.loggedIn}
            >
              Material Tag
            </Button>
          </Grid>
          <Grid item xs={1}>
            <h3>Tags</h3>
          </Grid>
        </Grid>

        {isLoading && <CircularProgress style={{ alignSelf: "center" }} />}
        {!isLoading && tagTimestamps.length === 0 && <h4>No tag yet</h4>}
        {!isLoading && tagTimestamps.length > 0 && (
          <Fragment>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tag</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tagTimestamps.map((t) => (
                    <TableRow
                      key={t.id}
                      hover={true}
                      onClick={() => handleClick(t.timestamp)}
                    >
                      <TableCell>
                        <div
                          className="clickable"
                          onClick={() => handleSelectTag(t.tag.id)}
                          style={{ display: "inline-block" }}
                        >
                          {t.tag.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTimestampFromSeconds(t.timestamp)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleAddEdit(t)}
                          disabled={
                            !authState.loggedIn ||
                            authState.userId !== t.createdBy
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(t.id)}
                          disabled={
                            !authState.loggedIn ||
                            authState.userId !== t.createdBy
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPage={10}
              rowsPerPageOptions={[10]}
              count={totalCount}
              onPageChange={handlePageChange}
              page={page}
            />
          </Fragment>
        )}
      </Stack>
    </Fragment>
  );
};

export default ViewTagTimestamps;
