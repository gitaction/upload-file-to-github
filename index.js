const axios = require('axios');

exports.oauthToken = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    const clientId = process.env.CLIENT_ID ? process.env.CLIENT_ID : req.body.client_id;
    const clientSecret = process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : req.body.client_secret;
    const redirectURI = req.body.redirect_uri;
    const code = req.body.code;
    const state = req.body.state;

    if (!clientId || !clientSecret || !redirectURI || !code || !state) {
      return res.status(409).send('error');
    }
    
    try {
      await axios.post('https://github.com/login/oauth/access_token', {
        redirect_uri: redirectURI,
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        state: state
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(function (response) {
          return res.status(200).send(response.data);
        });
    } catch (error) {
      console.log(error.toString());
      return res.status(500).send('error');
    }
  }
};
