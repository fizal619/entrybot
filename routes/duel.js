const puppeteer = require('puppeteer');
const headless = true;

module.exports = async (type) => {
  try {

    if(!type && ['single', 'tag', 'match'].includes(tag)) {
      return "Sorry you have to pick a duel type eg. `+entry duel [single|tag|match]`"
    }

    const browser = await puppeteer.launch({
      headless,
      executablePath:'/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    await page.goto('https://duelingnexus.com/login', {
      waitUntil: 'networkidle2',
    });

    // login
    await page.type('#login-email', process.env.NEXUS_EMAIL);
    await page.type('#login-password', process.env.NEXUS_PW);
    await page.click('#login-submit');
    console.log('waiting for login to finish');
    await page.waitForSelector('#home-area');
    console.log('logged in');

    //setup private duel
    await page.goto('https://duelingnexus.com/hostgame', {
      waitUntil: 'networkidle2',
    });
    await page.select("#custom-game-area p:nth-child(3) select", "private");
    await page.select("#custom-game-area p:nth-child(4) select", type);

    await page.click("#custom-game-area > p:nth-child(7) > button");
    await page.waitForTimeout(1000);
    const pages = await browser.pages();

    //the last tab opened, since they open it in a popup
    const duelURL = pages[pages.length - 1].url();

    //close the browser so we can get the duel session.
    await browser.close();

    return `${type} duel link: ${duelURL}`;

  } catch (error) {
    console.log(error);
    return ('FAILED GETTING DUEL LINK! Dueling nexus probably changed their pages a bit. Please adjust my CSS selectors: https://github.com/fizal619/entrybot/blob/master/routes/duel.js');
  }
}