const axios = require('axios');

module.exports = async ({pool, client, message, msgArr}) => {
  console.log("Save url", msgArr);
  const duration = msgArr[1] || 10;
  const url = msgArr[0];
  if (parseInt(duration) > 20 || isNaN(parseInt(duration))) {
    return `Duration invalid 😭`;
  }
  try {
    const db = await pool.connect();
    const check = await db.query('select * from users where uid=$1;', [message.member.user.id]);
    // console.log(check.rows);
    if (check.rowCount === 0) {
      const insert = await db.query('insert into users values($1,$2,$3);', [message.member.user.id, url, duration]);
      await db.release();
      return 'Saved you and your new URL 🎊.';
    } else if (check.rowCount === 1) {
      const insert = await db.query('update users set url=$2, duration=$3 where uid=$1;', [message.member.user.id, url, duration]);
      await db.release();
      return 'Saved your new URL 🎊.';
    }
    // console.log(check.rows);
    await db.release();
  } catch (e) {
    console.log(`Something went wrong: ${e.message} 😭.`);
    return `Something went wrong: ${e.message} 😭`;
  }
}
