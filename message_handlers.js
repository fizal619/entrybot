const axios = require('axios');

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

const spongebobify = async text => {
  const scrambled = text.split('').map(letter=> {
    let rand = Math.ceil(Math.random() * 2);
    if (rand == 1) {
      return letter.toUpperCase();
    } else {
      return letter.toLowerCase();
    }
  }).join('');
  try {
    const res =  await axios.get(`https://api.imgflip.com/caption_image?template_id=102156234&username=${process.env.IMGFLIP_USERNAME}&password=${process.env.IMGFLIP_PASSWORD}&boxes%5B%5D%5Btext%5D=${scrambled}`);
    // console.log(res.data.data.url);
    return res.data.data.url;

  } catch (e) {
    console.log(e.message);
    return 'OOPS sorry. ☠';
  }
}

module.exports = {
  save_url,
  show_url,
  spongebobify
}
