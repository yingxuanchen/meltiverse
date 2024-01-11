import { Box } from "@mui/material";

interface Props {
  imageName: string;
}

const ImageContainer = (props: Props) => {
  const { imageName } = props;
  return (
    <Box
      component="img"
      //   sx={{
      //     height: 233,
      //     width: 350,
      //     maxHeight: { xs: 233, md: 167 },
      //     maxWidth: { xs: 350, md: 250 },
      //   }}
      alt={imageName}
      src={`https://storage.googleapis.com/meltiverse/${imageName}`}
    />
  );
};

export default ImageContainer;
