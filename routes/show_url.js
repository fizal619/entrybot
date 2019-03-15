const axios = require('axios');

module.exports = async (pool, uid) => {
  try {
    const check = await pool.query('select * from users where uid=$1;', [uid]);
    if (check.rowCount === 0) {
      return 'You do not exist to me ☠.';
    } else if (check.rowCount === 1) {
      return `This is the video you have saved: ${check.rows[0].url}`;
    }
  } catch (e) {
    console.log(e)
    return `Something went wrong: ${e.message} 😭`;
  }
}