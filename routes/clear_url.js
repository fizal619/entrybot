const axios = require('axios');

module.exports = async (pool, uid) => {
  try {
    const check = await pool.query('select * from users where uid=$1;', [uid]);
    console.log(check.rows);
    if (check.rowCount === 0) {
      return 'You don\'t have anything stored budday 😛.';
    } else if (check.rowCount === 1) {
      await pool.query('delete from users where uid=$1;', [uid]);
      return 'Ok I forgot your music 🤒.';
    }
    // console.log(check.rows);
  } catch (e) {
    console.log(`Something went wrong: ${e.message} 😭.`);
    return `Something went wrong: ${e.message} 😭`;
  }
}