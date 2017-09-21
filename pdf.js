const doT = require('dot');
const puppeteer = require('puppeteer');
const fs = require('fs');
var args = process.argv.slice(2);
var resultText;
async function renderPdf() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  fs.readFile('templates/invoice.html', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    tempFn = doT.template(data);
    resultText = tempFn(JSON.parse(args[1]))
  });


  await page.setContent(resultText);
  console.log("load done");
  await page.pdf({path: args[0], format: 'A4'});
  browser.close();
  console.log("render done");

}

// renderPdf()
console.log( renderPdf().catch(() => {}) );
