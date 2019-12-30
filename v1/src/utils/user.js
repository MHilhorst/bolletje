import Cookies from "js-cookie";
import { config } from "../config";
const jwt = Cookies.get("token");
export const getUserInformation = async () => {
  return fetch(`${config.host}/api/user`, {
    method: "GET",
    headers: {
      Authorization: jwt
    }
  })
    .then(res => res.json())
    .then(data => {
      return data.user;
    });
};
