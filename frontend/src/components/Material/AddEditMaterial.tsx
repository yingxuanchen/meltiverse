import { Material } from "../../types/types";
import {
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
} from "@mui/material";
import useForm from "../../hooks/useForm";
import { materialForm } from "../../utils/formConfig";
import { useContext, useEffect, useState } from "react";
import { snackbarStore } from "../../store/snackbarStore";
import { fetcher } from "../../utils/utils";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { sidebarStore } from "../../store/sidebarStore";

interface Props {
  material: Material | null;
  onClose: (materialId?: number | null) => void;
}

const ALLOWED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

const AddEditMaterial = (props: Props) => {
  const { material, onClose } = props;
  const { form, renderFormInputs, isFormValid } = useForm(
    materialForm(material)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setSnackbar } = useContext(snackbarStore);
  const { dispatch: dispatchSidebar } = useContext(sidebarStore);
  const [reviewed, setReviewed] = useState<boolean>(
    material?.reviewed ?? false
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (material?.imageName) {
      setFileName(material.imageName);
    }
  }, [material?.imageName]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const materialUrl = form.url.value as string;
    if (
      fileName &&
      (materialUrl.includes("youtube") || materialUrl.includes("youtu.be"))
    ) {
      setSnackbar({
        message: "Youtube material cannot have image. Please remove image.",
        severity: "error",
        open: true,
      });
      return;
    }

    const formData = new FormData();
    const reqBody = {
      id: material?.id,
      postedDate: form.postedDate.value,
      author: form.author.value,
      title: form.title.value,
      url: materialUrl,
      topic: form.topic.value,
      reviewed: reviewed,
    };
    formData.append(
      "material",
      new Blob([JSON.stringify(reqBody)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }
    let url = material
      ? `${process.env.REACT_APP_HOST_URL}/material/${material.id}`
      : `${process.env.REACT_APP_HOST_URL}/material`;
    if (material?.imageName && fileName === "") {
      url += "?delete=true";
    }
    setIsLoading(true);
    try {
      const response = await fetcher(url, {
        method: "POST",
        body: formData,
      });
      setIsLoading(false);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to save material: ${data.errorMessage}`);
      }
      setSnackbar({
        message: `Material ${material ? "edited" : "added"} successfully!`,
        severity: "success",
        open: true,
      });
      onClose(data);
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

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) {
      return;
    }
    const file = event.target.files[0];
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setSnackbar({
        message: "Invalid file type",
        severity: "error",
        open: true,
      });
      return;
    }
    if (file.size > 1048576) {
      setSnackbar({
        message: "File size is too big",
        severity: "error",
        open: true,
      });
      return;
    }
    setFile(file);
    setFileName(file.name);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setFileName("");
  };

  return (
    <Dialog
      open={true}
      onClose={() => onClose(null)}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogTitle>{material ? "Edit" : "Add"} Material</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSave}>
          <Stack spacing={2} marginTop="0.5em">
            {renderFormInputs()}
            <Stack
              spacing={2}
              direction="row"
              useFlexGap
              sx={{ alignItems: "center" }}
            >
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
              >
                Upload
                <input
                  hidden
                  type="file"
                  accept="image/png, image/jpg"
                  onChange={handleChangeFile}
                />
              </Button>
              {fileName ? (
                <Chip label={fileName} onDelete={handleDeleteFile} />
              ) : (
                <span style={{ color: "grey" }}>
                  Image (jpg or png, max 1MB)
                </span>
              )}
            </Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={reviewed}
                  onChange={() => setReviewed(!reviewed)}
                />
              }
              label="Reviewed?"
            />
            <div style={{ textAlign: "end" }}>
              <Button
                variant="outlined"
                onClick={() => onClose()}
                style={{ marginRight: "1em" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid() || isLoading}
              >
                Save
              </Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditMaterial;
