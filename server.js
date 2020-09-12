const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// let's exit the process and force a restart
// to combat a memory leak I cannot find
cron.schedule('5 11 * * *', () => {
  console.log('Crashing to combat memory leak lmao.');
  process.exit();
});

app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))