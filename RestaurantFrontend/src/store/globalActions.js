import { createAction } from "@reduxjs/toolkit";

// A global action all slices can listen to
export const resetStatusAll = createAction("global/resetStatusAll");
