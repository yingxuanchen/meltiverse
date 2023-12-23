import { Material } from "../../types/types";
import {
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import useForm from "../../hooks/useForm";
import { materialForm } from "../../utils/formConfig";
import { useContext, useState } from "react";
import { snackbarStore } from "../../store/snackbarStore";
import { fetcher } from "../../utils/utils";

interface Props {
  material: Material | null;
  onClose: (materialId?: number | null) => void;
}

const AddEditMaterial = (props: Props) => {
  const { material, onClose } = props;
  const { form, renderFormInputs, isFormValid } = useForm(
    materialForm(material)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setSnackbar } = useContext(snackbarStore);
  const [reviewed, setReviewed] = useState<boolean>(
    material?.reviewed ?? false
  );

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reqBody = {
      id: material?.id,
      postedDate: form.postedDate.value,
      author: form.author.value,
      title: form.title.value,
      url: form.url.value,
      topic: form.topic.value,
      reviewed: reviewed,
    };
    const url = material
      ? `${process.env.REACT_APP_HOST_URL}/material/${material.id}`
      : `${process.env.REACT_APP_HOST_URL}/material`;
    setIsLoading(true);
    try {
      const response = await fetcher(url, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: { "Content-Type": "application/json" },
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
    } catch (error) {
      setSnackbar({
        message: (error as Error).message,
        severity: "error",
        open: true,
      });
    }
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
