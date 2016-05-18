var http = require('http');
var mailgun = require('mailgun-js')({
  // configuración de una cuenta própia en mailgun.
  // Por el momento se puede usar sin problema.
  apiKey: 'key-f1d1f5a41e5528beaeb63f35b6a7c80c',
  domain: 'sandboxd2cba16debb04c3a9d37570b82f0c884.mailgun.org'
});

var url = 'http://localhost:3000';
var body = '';

var data = {
  from: 'Mailgun Postmaster <postmaster@sandboxd2cba16debb04c3a9d37570b82f0c884.mailgun.org>',
  subject: '[TEST] Email Test',
  // Dirección de Litmus para generar un nuevo checklist de prueba
  // Se pueden agregar sucesivas direcciones email1@test.com, email2@test.com, email3@test.com
  to: 'sbarchetta@litmustest.com'
}

http.get(url, function(res) {

  if (res.statusCode == '200') {

    res.on("data", function(chunk) {
      // recolecto el body del mail
      body += String(chunk);
    });

    res.on("end", function () {
      data.html = body;
      mailgun.messages().send(data, function (err, body) {
        if (!err) {
          console.log('Email sended [res code: '+ res.statusCode + ']')
          console.log('Status : ' + res.statusCode)
        } else {
          console.log('Error en el envío del mail.');
          console.log('[Error obj: ' + err +']');
          console.log('[res code: '+ res.statusCode + ']');
        }
      })
    });

  } else {
    console.log('Status : ' + res.statusCode)
  }
})
