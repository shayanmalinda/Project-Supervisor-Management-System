import { getFromStorage } from "./Storage";
const backendURI = require("../components/shared/BackendURI");

export const verifyAuth = async () => {
  let authState = false;
  const obj = getFromStorage("auth-token");
  if (!obj) {
    return null;
  }
  try {
    //verify token
    await fetch(backendURI.url + "/users/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application-json",
        "auth-token": obj.token,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        authState = json.state;
      });
    return authState;
  } catch (err) {
    return err;
  }
};
