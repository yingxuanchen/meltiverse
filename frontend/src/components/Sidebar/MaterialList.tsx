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
import { searchStore } from "../../store/searchStore";
import useFirstRender from "../../hooks/useFirstRender";
import { sidebarStore } from "../../store/sidebarStore";

const MaterialList = () => {
  const { state, dispatch } = useContext(contentStore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { state: authState } = useContext(authStore);
  const { state: sidebarState, dispatch: dispatchSidebar } =
    useContext(sidebarStore);
  const isFirstRender = useFirstRender();

  const { state: searchState, dispatch: dispatchSearch } =
    useContext(searchStore);
  const [searchInput, setSearchInput] = useState<string>(
    searchState.materialInput as string
  );
  const debouncedSearch = useDebounce(searchInput, 800);

  const [materialList, setMaterialList] = useState<MaterialSummary[]>(
    searchState.materialData?.content ?? []
  );
  const [page, setPage] = useState<number>(
    searchState.materialData?.pageable.pageNumber ?? 0
  );
  const [totalCount, setTotalCount] = useState<number>(
    searchState.materialData?.totalElements ?? 0
  );

  const fetchMaterialList = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/material?search=${debouncedSearch}&page=${page}`
      );
      const data = await response.json();
      dispatchSearch({
        type: "SEARCH_MATERIAL",
        payload: {
          materialInput: debouncedSearch,
          materialData: data,
        },
      });
      setMaterialList(data.content);
      setPage(data.pageable.pageNumber);
      setTotalCount(data.totalElements);
      setIsLoading(false);
    },
    [debouncedSearch, dispatchSearch]
  );

  useEffect(() => {
    if (sidebarState.toRefresh || !isFirstRender || materialList.length === 0) {
      dispatchSidebar({
        type: "DONE_REFRESH",
      });
      fetchMaterialList(isFirstRender ? page : 0);
    }
    // eslint-disable-next-line
  }, [debouncedSearch]);

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
        <Grid
          item
          xs={4}
          textAlign="start"
          sx={{ paddingLeft: 1, paddingRight: 1 }}
        >
          <TextField
            size="small"
            variant="standard"
            label="Search"
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
