import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import Typography from "@mui/material/Typography";
import InputField from "components/InputField";
import InputCountrySelect from "components/InputCountrySelect";

export default function Invoice() {
  const theme = useTheme();
  const [formData, setFormaData] = useState({
    name: "",
    surname: "",
    companyName: "",
    address: "",
    country: "Italy",
    email: "",
    vat: "",
    billingCode: "",
    pecAddress: "",
    isIndividual: "individual",
  });
  const handleChange = (e) => {
    setFormaData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(window.innerWidth);
  return (
    <div className="background">
      <Card
        className="card"
        sx={{
          backgroundColor: theme.palette.background.alt,
        }}
      >
        <CardContent style={{ margin: "10px" }}>
          {/* <Typography variant="h1">Stefan Jeremic</Typography>
           */}
          <div className="guestName">Stefan jeremic</div>
          <div className="reservationInfo">
            Reservation from checkIn to checkOut
          </div>
          <div className="selectRadio">
            <div className="represent">I represent</div>
            <FormControl>
              <RadioGroup
                name="isIndividual"
                onChange={handleChange}
                value={formData.isIndividual}
              >
                <div className="formControl">
                  <FormControlLabel
                    value="individual"
                    control={<Radio color="success" />}
                    label={<div className="isIndividual"> an Individual</div>}
                  />
                  <FormControlLabel
                    value="company"
                    control={<Radio color="success" />}
                    label={<div className="isIndividual"> a Company</div>}
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          {formData.isIndividual === "individual" ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <InputField
                  name={"name"}
                  onChange={handleChange}
                  value={formData.name}
                  fieldName={"Name"}
                />
                <InputField
                  name={"surname"}
                  onChange={handleChange}
                  value={formData.surname}
                  fieldName={"Surname"}
                />
              </div>
              <InputField
                name={"address"}
                onChange={handleChange}
                value={formData.address}
                fieldName={"Address"}
              />
              <InputCountrySelect
                name={"country"}
                value={formData.country}
                onChange={handleChange}
              />
              <InputField
                name={"email"}
                onChange={handleChange}
                value={formData.email}
                fieldName={"Email"}
              />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <InputField
                name={"companyName"}
                onChange={handleChange}
                value={formData.companyName}
                fieldName={`Company Name`}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <InputField
                  name={"name"}
                  onChange={handleChange}
                  value={formData.name}
                  fieldName={"Name"}
                />
                <InputField
                  name={"surname"}
                  onChange={handleChange}
                  value={formData.surname}
                  fieldName={"Surname"}
                />
              </div>
              <InputField
                name={"address"}
                onChange={handleChange}
                value={formData.address}
                fieldName={"Address"}
              />
              <div className="vatFieldDirection">
                <InputCountrySelect
                  name={"country"}
                  value={formData.country}
                  onChange={handleChange}
                />
                <InputField
                  name={"vat"}
                  onChange={handleChange}
                  value={formData.vat}
                  fieldName={"VAT"}
                />
              </div>
              {formData.country === "Italy" && (
                <div>
                  <InputField
                    name={"billingCode"}
                    onChange={handleChange}
                    value={formData.billingCode}
                    fieldName={"Codice Fatturazione"}
                  />
                  <InputField
                    name={"pecAddress"}
                    onChange={handleChange}
                    value={formData.pecAddress}
                    fieldName={"Indirizzo PEC"}
                  />
                </div>
              )}

              <InputField
                name={"email"}
                onChange={handleChange}
                value={formData.email}
                fieldName={"Email"}
              />
            </div>
          )}
          <Divider
            style={{
              marginTop: "15px",
              borderBottomWidth: "3px",
              backgroundColor: "black",
            }}
          />
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div className="isIndividual">Total rent paid</div>
            <div className="isIndividual">15000 Euro</div>
          </div>
          <div className="declareText">
            I declare, under my responsibility, to have paid in cash the tourist
            tax equal to
          </div>
          <div className="totalMoney">1000 Euro</div>

          <div className="finalButtonField">
            <Button variant="contained">
              <div className="finalButton">
                {formData.isIndividual === "individual"
                  ? "Download Receipt"
                  : "Download Invoice"}
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
