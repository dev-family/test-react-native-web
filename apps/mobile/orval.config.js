/* eslint-disable import/no-default-export */
import { defineConfig } from "orval";


export default defineConfig({
  api: {
    input: {
      target: "../backend/swagger.yml",
      validation: true,

    },
    output: {
      target: "./src/lib/api/client.ts",
      tslint: true,
      prettier: true,
      mode: "split",

      client: "axios-functions",
      override: {
        mutator: {
          path: "./src/lib/api/axios.ts",
          name: "customInstance",
        },
      },
    },
  },
});

