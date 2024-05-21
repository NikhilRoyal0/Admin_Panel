import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { ChakraProvider } from "@chakra-ui/react";
import Store from "./app/Store/Store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={Store}>
      <ChakraProvider>
        <RouterProvider router={routes}></RouterProvider>
      </ChakraProvider>
    </Provider>
);
