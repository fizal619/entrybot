const axios = require('axios');

module.exports = async (pool, uid, url) => {
  try {
    const check = await pool.query('select * from users where uid=$1;', [uid]);
    console.log(check.rows);
    if (check.rowCount === 0) {
      const insert = await pool.query('insert into users values($1,$2);', [uid, url]);
      return 'Saved you and your new URL 🎊.';
    } else if (check.rowCount === 1) {
      const insert = await pool.query('update users set url=$2 where uid=$1;', [uid, url]);
      return 'Saved your new URL 🎊.';
    }
    // console.log(check.rows);
  } catch (e) {
    console.log(`Something went wrong: ${e.message} 😭.`);
    return `Something went wrong: ${e.message} 😭`;
  }
}