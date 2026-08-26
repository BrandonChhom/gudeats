// codeProjects/gudeats/backend/src/config/clarifai.js

// read at call time rather than import time so env loading order can't strand a stale value
const getClarifaiPat = () => process.env.CLARIFAI_PAT;

const CLARIFAI_MODEL_ID = "food-item-recognition";
const CLARIFAI_USER_ID = "clarifai";
const CLARIFAI_APP_ID = "main";

// minimum confidence for the model's top concept before we accept an image as food
const FOOD_CONFIDENCE_THRESHOLD = 0.7;

// give up on the vision API rather than letting a post hang on a slow third party
const FOOD_VALIDATION_TIMEOUT_MS = 10000;

// when the validator is unconfigured or unreachable we let the post through
// (fail open) instead of blocking all uploads on a third-party outage
const isFoodValidationConfigured = () => Boolean(getClarifaiPat());

export {
  getClarifaiPat,
  CLARIFAI_MODEL_ID,
  CLARIFAI_USER_ID,
  CLARIFAI_APP_ID,
  FOOD_CONFIDENCE_THRESHOLD,
  FOOD_VALIDATION_TIMEOUT_MS,
  isFoodValidationConfigured,
};
