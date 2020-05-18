const axios = require("axios");
const fs = require("fs");

axios.get(`${process.env.VAULT_HOST}/v1/entrybot/creds`, {
  headers: {
    "X-Vault-Token": process.env.VAULT_TOKEN
  }
})
.then(res => {
  // console.log(res.data.data.DOTENV);
  fs.writeFileSync(".env", res.data.data.DOTENV);
});
