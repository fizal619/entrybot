const save_url = async (pool, uid, url) => {
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

const show_url = async (pool, uid) => {
  try {
    const check = await pool.query('select * from users where uid=$1;', [uid]);
    console.log(check.rows);
    if (check.rowCount === 0) {
      return 'You do not exist to me ☠.';
    } else if (check.rowCount === 1) {
      return `This is the video you have saved: ${check.rows[0].url}`;
    }
    // console.log(check.rows);
  } catch (e) {
    console.log(e)
    return `Something went wrong: ${e.message} 😭`;
  }
}


module.exports = {
  save_url,
  show_url
}
