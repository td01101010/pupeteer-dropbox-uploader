console.log("APP.JS - starting ");
const params = process.argv.splice(2);

let URL = params[0];
let EMAIL = params[1];
let FNAME = params[2];
let LNAME = params[3];
let FILE = params[4];

console.log("Params: ", {URL, EMAIL, FNAME, LNAME, FILE});

if ( !URL || !EMAIL || !FNAME || ! LNAME || ! FILE) {
  console.log("Null param received.");
  return;
}

const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function run() {
//  const browser = await puppeteer.launch();
const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg, msg.text()));


  await page.goto(URL);
  await page.click('#browse-target');
  const input = await page.$('input[type="file"]');
  await input.uploadFile(FILE);
  await page.waitFor('input[name=fname]');
  await page.waitFor('input[name=lname]');
  await page.waitFor('input[name=email]');

  await sleep(5000);

  await page.click('input[name=fname]');
  await page.type('input[name=fname]', FNAME);
  await sleep(1000);
  await page.click('input[name=lname]');
  await page.type('input[name=lname]', LNAME);
  await sleep(1000);
  await page.click('input[name=email]');
  await page.type('input[name=email]', EMAIL);
  await sleep(1000);

  // await page.screenshot({ path: 'screenshots/dropbox-form.png' });

  console.log("Send!");
  await page.click('.submission-form__submit');

  // setInterval ( async () => {
  //         await page.screenshot({ path: 'screenshots/dropbox-'+ ((new Date()).getTime()) +'.png' });
  // }, 60000);

  await page.waitFor('.complete__header', {timeout: 2*60*60*1000});

  browser.close();

}


run();
