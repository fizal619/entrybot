const express = require('express')
const app = express()
const port = process.env.PORT || 3000

cron.schedule('5 7 * * *', () => {
  console.log('Crashing to combat memory leak lmao.');
  process.exit();
});

app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))