import React, { useState } from "react";
import axios from "axios";

import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";

const END_POINT = process.env.REACT_APP_BASE_URL;

const Product = ({ _id, name, address, photo, information }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [fiscalInformation, setFiscalInformation] = useState(information);

  const handleEditButton = () => {
    setIsEditable(!isEditable);
  };

  const handleSaveButton = async () => {
    setIsEditable(!isEditable);
    try {
      console.log(_id);
      const response = await axios.post(
        `${END_POINT}/apartment/update/${_id}`,
        {
          id: _id,
          name: name,
          address: address,
          information: fiscalInformation,
        }
      );
      console.log(response.data);
      toast.success(response.data.msg, { position: "top-right" });
    } catch (err) {
      toast.error(err.response.data.error, { position: "top-right" });
    }
  };

  const handleFiscalInformationChange = (e) => {
    const { value } = e.target;
    setFiscalInformation(value);
  };

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          {isEditable ? (
            <Button onClick={handleSaveButton}>
              <SaveIcon color="success" />
            </Button>
          ) : (
            <Button onClick={handleEditButton}>
              <EditIcon color="error" />
            </Button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div style={{ marginRight: "15px" }}>
            <Typography variant="body2" style={{ marginTop: "15px" }}>
              {address}
            </Typography>
          </div>
          <img alt="room photo" src={photo} width="150px" height="150px"></img>
        </div>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <TextField
            label="Fiscal Information"
            multiline
            fullWidth
            rows={10}
            size="small"
            value={fiscalInformation}
            onChange={handleFiscalInformationChange}
            slotProps={{
              input: {
                readOnly: !isEditable,
              },
            }}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Product;
