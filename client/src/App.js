import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import {
  Layout,
  Apartments,
  Guests,
  Admin,
  Schema,
  SignIn,
  Invoice,
} from "scenes";
import PrivateRoute from "components/PrivateRoute";
import { isExpired } from "react-jwt";
import { setAuth, setUser } from "state";

// console.log(decoded);
function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch();

  //Check Auth.
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (admin) {
    const auth = isExpired(admin.token);
    dispatch(setAuth(!auth));
    dispatch(setUser(admin.name));
  }

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/apartments" replase />}
                />
                <Route path="/apartments" element={<Apartments />} />
                <Route path="/guests" element={<Guests />} />
                <Route path="/schema" element={<Schema />} />
                {/* <Route path="/admin" element={<Admin />} /> */}
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
