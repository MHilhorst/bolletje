import Cookies from "js-cookie";
import config from "../config";

export const getSession = async () => {
  const jwt = Cookies.get("token");
  try {
    if (jwt) {
      fetch(`${config.host}/api/user`, {
        method: "GET",
        headers: {
          Authorization: jwt
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data.user);
          return data.user;
        });
    }
  } catch (error) {
    console.log(error);
    return { error: true };
  }
};
