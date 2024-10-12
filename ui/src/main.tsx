import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import {router} from "./routes";
import {theme} from "./theme";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { defaults as apiConfig } from "./api/client";

apiConfig.baseUrl = "/";

export default function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router} />
        </LocalizationProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<App />)
