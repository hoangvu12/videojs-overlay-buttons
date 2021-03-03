const axios = require("axios");

(async () => {
  const url = "http://smsedu.smas.vn/User/Login";
  const body = `UserName=${process.env.SMAS_USERNAME}&Password=${process.env.SMAS_PASSWORD}`;
  const headers = {
    Host: "smsedu.smas.vn",
    Accept: "*/*",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const { data } = await axios.post(url, body, { headers });

  console.log(data);
})();