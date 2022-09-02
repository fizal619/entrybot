const axios = require('axios');

module.exports = async ({pool, client, message, msgArr}) => {
  const db = await pool.connect();
  try {
    const check = await db.query('select * from users where uid=$1;', [message.member.user.id]);
    if (check.rowCount === 0) {
      await db.release();
      return 'You do not exist to me ☠.';
    } else if (check.rowCount === 1) {
      await db.release();
      return `This is the video you have saved: \n${check.rows[0].url}`;
    }
  } catch (e) {
    console.log(e)
    await db.release();
    return `Something went wrong: ${e.message} 😭`;
  }
}