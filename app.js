var dots = require("dot").process({
  global: "_page.render",
  destination: __dirname + "/render/",
  path: (__dirname + "/templates")
});

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  puppeteer = require('puppeteer'),
  
  compression = require('compression')

app.use(compression());
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

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
    await page.goto('data:text/html,' + dots.invoice(templateData), {waitUntil: 'load', networkIdleTimeout: 5000});

    var pdf = await page.pdf({format: 'A4'});
    browser.close();

    res.setHeader('Content-disposition', 'inline; filename="' + templateData.filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    res.send(pdf);
  })();
})

app.listen(port);
console.log('running printserver on ' + port);

