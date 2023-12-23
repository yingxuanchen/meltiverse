import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Material } from "../../types/types";
import {
  CircularProgress,
  Table,
  TableCell as TableCellO,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { fetcher, formatDateString } from "../../utils/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { snackbarStore } from "../../store/snackbarStore";
import AddEditMaterial from "./AddEditMaterial";
import MediaContainer from "../common/MediaContainer";
import { mediaStore } from "../../store/mediaStore";
import { contentStore } from "../../store/contentStore";
import { authStore } from "../../store/authStore";

const TableCell = styled(TableCellO)`
  border: none;
`;

interface Props {
  materialId: number;
}

const ViewMaterial = (props: Props) => {
  const { materialId } = props;
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { setSnackbar } = useContext(snackbarStore);
  const { dispatch: dispatchMedia } = useContext(mediaStore);
  const { state: contentState, dispatch: dispatchContent } =
    useContext(contentStore);
  const { state: authState } = useContext(authStore);

  const fetchMaterial = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/material/${materialId}`
      );
      setIsLoading(false);
      if (!response.ok) {
        throw new Error("Failed to fetch material");
      }
      const data = await response.json();
      setMaterial(data);
      dispatchMedia({
        type: "SET_URL",
        payload: {
          url: data.url,
        },
      });
    } catch (error) {
      setSnackbar({
        message: (error as Error).message,
        severity: "error",
        open: true,
      });
    }
  }, [materialId, setSnackbar, dispatchMedia]);

  useEffect(() => {
    fetchMaterial();
  }, [fetchMaterial]);

  const handleEdit = () => {
    setOpenModal(true);
  };

  const handleDelete = () => {};

  const handleModalClose = (materialId?: number | null) => {
    setOpenModal(false);
    fetchMaterial();
  };

  const handleViewMaterial = () => {
    dispatchContent({
      type: "CHANGE_CONTENT",
      payload: { contentType: "VIEW_MATERIAL" },
    });
  };

  return (
    <Fragment>
      {openModal && (
        <AddEditMaterial material={material} onClose={handleModalClose} />
      )}
      <Stack>
        <MediaContainer />
        <Grid container columns={3} alignItems="center">
          <Grid item xs={1}>
            {contentState.contentType !== "VIEW_MATERIAL" && (
              <Button
                variant="outlined"
                onClick={handleViewMaterial}
                size="small"
              >
                Go to Material
              </Button>
            )}
          </Grid>
          <Grid item xs={1}>
            <h3>Material</h3>
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
              disabled={!authState.loggedIn || authState.role !== "admin"}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        {isLoading ? (
          <CircularProgress style={{ alignSelf: "center" }} />
        ) : (
          material && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>
                      {formatDateString(material.postedDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Author</TableCell>
                    <TableCell>{material.author}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>{material.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Link</TableCell>
                    <TableCell>{material.url}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Topic</TableCell>
                    <TableCell>{material.topic}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reviewed?</TableCell>
                    <TableCell>{material.reviewed ? "Yes" : "No"}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          )
        )}
      </Stack>
    </Fragment>
  );
};

export default ViewMaterial;
