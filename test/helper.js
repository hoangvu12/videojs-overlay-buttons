const fs = require("fs");
const request = require("request-promise");

function getProxy() {
  const data = fs.readFileSync(__dirname + "/new_proxies.txt", "utf-8");
  const lines = data.split("\n").map((line) => line.trim());
  const line = lines[Math.floor(Math.random() * lines.length)];

  const [HOSTNAME, PORT, USERNAME, PASSWORD] = line.split(":");

  return { HOSTNAME, PORT, USERNAME, PASSWORD };
}

const cardType = (cc) => {
  const VISA = /^4[0-9]{12}(?:[0-9]{3})?$/g;
  // const MASTERCARD = /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/g;

  if (VISA.test(cc)) return "visa";
  return "mastercard";
};

const getAddress = async () => {
  const response = await request("https://nguyenvu-php.herokuapp.com/");

  return JSON.parse(response);
};

function getStr2(string, start, end) {
  str = string.split(start);
  str = str[1].split(end);
  return str[0];
}
module.exports = {
  getProxy: getProxy,
  getAddress: getAddress,
  cardType: cardType,
  getStr2: getStr2,
};
