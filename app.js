require("dot").process({
  global: "_page.render",
  destination: __dirname + "/render/",
  path: (__dirname + "/templates")
});

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  puppeteer = require('puppeteer'),
  render = require('./render')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.json({message: 'Hello'});
});

app.post('/pdf', function (req, res) {
  var templateData = req.body;
  const puppeteer = require('puppeteer');
  (async() => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setContent(render.invoice(templateData));
    var pdf = await page.pdf({format: 'A4'});
    browser.close();
    res.send(pdf);
  })();
})

app.listen(port);
console.log('running printserver on ' + port);
