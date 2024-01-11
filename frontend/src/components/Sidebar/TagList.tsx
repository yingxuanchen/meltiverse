import {
  ChangeEvent,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { contentStore } from "../../store/contentStore";
import { Tag } from "../../types/types";
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
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddEditTag from "../Tag/AddEditTag";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../../hooks/useDebounce";
import { fetcher } from "../../utils/utils";
import { authStore } from "../../store/authStore";
import useFirstRender from "../../hooks/useFirstRender";
import { searchStore } from "../../store/searchStore";
import { sidebarStore } from "../../store/sidebarStore";

const TagList = () => {
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
    searchState.tagInput as string
  );
  const debouncedSearch = useDebounce(searchInput, 800);

  const [tagList, setTagList] = useState<Tag[]>(
    searchState.tagData?.content ?? []
  );
  const [page, setPage] = useState<number>(
    searchState.tagData?.pageable.pageNumber ?? 0
  );
  const [totalCount, setTotalCount] = useState<number>(
    searchState.tagData?.totalElements ?? 0
  );

  const fetchTagList = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const response = await fetcher(
        `${process.env.REACT_APP_HOST_URL}/tag?search=${debouncedSearch}&page=${page}`
      );
      const data = await response.json();
      dispatchSearch({
        type: "SEARCH_TAG",
        payload: {
          tagInput: debouncedSearch,
          tagData: data,
        },
      });
      setTagList(data.content);
      setPage(data.pageable.pageNumber);
      setTotalCount(data.totalElements);
      setIsLoading(false);
    },
    [debouncedSearch, dispatchSearch]
  );

  useEffect(() => {
    if (sidebarState.toRefresh || !isFirstRender || tagList.length === 0) {
      dispatchSidebar({
        type: "DONE_REFRESH",
      });
      fetchTagList(isFirstRender ? page : 0);
    }
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const handlePageChange = (_event: any | null, page: number) => {
    fetchTagList(page);
  };

  const handleSelectTag = (tagId: number) => {
    dispatch({
      type: "CHANGE_CONTENT",
      payload: { contentType: "VIEW_TAG", tagId },
    });
  };

  const handleAddTag = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    fetchTagList(0);
  };

  return (
    <Fragment>
      {openModal && <AddEditTag tag={null} onClose={handleModalClose} />}
      <Grid container alignItems="flex-end" justifyContent="space-between">
        <Grid item xs={3}>
          <Button
            size="small"
            variant="contained"
            onClick={handleAddTag}
            startIcon={<LibraryAddIcon />}
            disabled={!authState.loggedIn}
          >
            Tag
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
                    <TableCell>Label</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tagList.length === 0 ? (
                    <TableRow>
                      <TableCell>No data</TableCell>
                    </TableRow>
                  ) : (
                    tagList.map((tag) => (
                      <TableRow
                        key={tag.id}
                        onClick={() => handleSelectTag(tag.id)}
                        hover={true}
                        selected={
                          state.contentType === "VIEW_TAG" &&
                          state.tagId === tag.id
                        }
                      >
                        <TableCell>{tag.label}</TableCell>
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

export default TagList;
