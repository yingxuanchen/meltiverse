import {
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MaterialSummary } from "../../types/types";
import { contentStore } from "../../store/contentStore";
import { fetcher, formatDateString } from "../../utils/utils";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddEditMaterial from "../Material/AddEditMaterial";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../../hooks/useDebounce";
import { authStore } from "../../store/authStore";

const MaterialList = () => {
  const { state, dispatch } = useContext(contentStore);
  const [materialList, setMaterialList] = useState<MaterialSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, 800);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { state: authState } = useContext(authStore);

  const fetchMaterialList = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/material?search=${debouncedSearch}&page=${page}`
      );
      const data = await response.json();
      setMaterialList(data.content);
      setPage(data.pageable.pageNumber);
      setTotalCount(data.totalElements);
      setIsLoading(false);
    },
    [debouncedSearch]
  );

  useEffect(() => {
    fetchMaterialList(0);
  }, [fetchMaterialList]);

  const handlePageChange = (_event: any | null, page: number) => {
    fetchMaterialList(page);
  };

  const handleSelectMaterial = (materialId: number) => {
    dispatch({
      type: "CHANGE_CONTENT",
      payload: { contentType: "VIEW_MATERIAL", materialId },
    });
  };

  const handleAddMaterial = () => {
    setOpenModal(true);
  };

  const handleModalClose = (materialId?: number | null) => {
    setOpenModal(false);
    if (materialId) {
      dispatch({
        type: "CHANGE_CONTENT",
        payload: { contentType: "VIEW_MATERIAL", materialId },
      });
    }
  };

  return (
    <Fragment>
      {openModal && (
        <AddEditMaterial material={null} onClose={handleModalClose} />
      )}
      <Grid container alignItems="flex-end" justifyContent="space-between">
        <Grid item xs={3}>
          <Button
            size="small"
            variant="contained"
            onClick={handleAddMaterial}
            startIcon={<LibraryAddIcon />}
            disabled={!authState.loggedIn}
          >
            Material
          </Button>
        </Grid>
        <Grid item xs={4} textAlign="start">
          <TextField
            size="small"
            variant="standard"
            label="Search Material"
            value={searchInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchInput(event.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <TablePagination
            component="div"
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
            count={totalCount}
            onPageChange={handlePageChange}
            page={page}
          />
        </Grid>

        <Grid item xs={12} marginTop="1em">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {materialList.length === 0 ? (
                    <TableRow>
                      <TableCell>No data</TableCell>
                    </TableRow>
                  ) : (
                    materialList.map((material) => (
                      <TableRow
                        key={material.id}
                        onClick={() => handleSelectMaterial(material.id)}
                        hover={true}
                        selected={
                          state.contentType === "VIEW_MATERIAL" &&
                          state.materialId === material.id
                        }
                      >
                        <TableCell>
                          {formatDateString(material.postedDate)}
                        </TableCell>
                        <TableCell>{material.title}</TableCell>
                        <TableCell>{material.author}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default MaterialList;
