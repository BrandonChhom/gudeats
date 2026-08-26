// codeProjects/gudeats/backend/src/utils/checkFoodImage.js

import {
  getClarifaiPat,
  CLARIFAI_MODEL_ID,
  CLARIFAI_USER_ID,
  CLARIFAI_APP_ID,
  FOOD_CONFIDENCE_THRESHOLD,
  FOOD_VALIDATION_TIMEOUT_MS,
  isFoodValidationConfigured,
} from "../config/clarifai.js";

/*
Asks the vision model whether an image contains food.

Returns { checked, isFood, label, confidence }.

`checked: false` means we could not get a verdict (no API key, network failure,
bad response). Callers treat that as "allow the post" — we would rather let an
occasional non-food image through than block every upload while a third-party
API is unreachable. An actual low-confidence verdict is a rejection.
*/
const checkFoodImage = async (imageUrl) => {
  const unchecked = { checked: false, isFood: false, label: null, confidence: 0 };

  if (!isFoodValidationConfigured()) {
    console.warn("CLARIFAI_PAT not set - skipping food image validation");
    return unchecked;
  }

  let response;

  try {
    response = await fetch(`https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`, {
      method: "POST",
      headers: {
        Authorization: `Key ${getClarifaiPat()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_app_id: { user_id: CLARIFAI_USER_ID, app_id: CLARIFAI_APP_ID },
        inputs: [{ data: { image: { url: imageUrl } } }],
      }),
      signal: AbortSignal.timeout(FOOD_VALIDATION_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Food validation request failed:", error.message);
    return unchecked;
  }

  if (!response.ok) {
    console.error(`Food validation returned HTTP ${response.status}`);
    return unchecked;
  }

  let concepts;

  try {
    const result = await response.json();
    concepts = result?.outputs?.[0]?.data?.concepts;
  } catch (error) {
    console.error("Food validation returned unreadable JSON:", error.message);
    return unchecked;
  }

  if (!Array.isArray(concepts) || concepts.length === 0) {
    console.error("Food validation returned no concepts");
    return unchecked;
  }

  // the model returns concepts sorted by confidence, so the first is the best guess
  const topConcept = concepts[0];

  return {
    checked: true,
    isFood: topConcept.value >= FOOD_CONFIDENCE_THRESHOLD,
    label: topConcept.name,
    confidence: topConcept.value,
  };
};

export default checkFoodImage;
