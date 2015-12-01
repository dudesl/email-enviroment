var http = require('http');
var mailgun = require('mailgun-js')({
  apiKey: 'key-f1d1f5a41e5528beaeb63f35b6a7c80c',
  domain: 'sandboxd2cba16debb04c3a9d37570b82f0c884.mailgun.org'
  // apiKey: 'key',
  // domain: 'sandbox'
});

var url = 'http://localhost:3000';
var body = '';

var data = {
  from: 'Mailgun Postmaster <postmaster@sandboxd2cba16debb04c3a9d37570b82f0c884.mailgun.org>',
  subject: '[TEST] MELI Retargueting 0.0.9',
  // subject: '[TEST] MELI Retargueting',
  to: 'santiago.barchetta@mercadolibre.com,lucia.guedes@mercadolibre.com'
  // to: 'sbarchetta-9drp@litmustest.com'
}

http.get(url, function(res) {

  if (res.statusCode == '200') {

    res.on("data", function(chunk) {
      // recolecto el body del mail
      body += String(chunk);
    });

    res.on("end", function () {
      data.html = body;
      mailgun.messages().send(data, function (err, body) {})
    });

  } else {
    console.log('Status : ' + res.statusCode)
  }
})
