const fetch = require("node-fetch");

const login = (username, password) => {
  fetch(`https://login.bol.com/j_spring_security_check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": 148
    },
    body: JSON.stringify({
      j_username: username,
      j_password: password,
      csrftoken: "462a5c9e-2fc1-45b2-9681-76199e0dd051",
      submit: "&#58880; Inloggen"
    })
  })
    .then(res => console.log(res))
    .catch(err => console.log(err));
};
module.exports = login;
