const axios = require('axios');

let github = '';

exports.uploadFileToGitHub = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    const token = process.env.GH_TOKEN ? process.env.GH_TOKEN : req.body['token'];
    const path = req.body['pathName'];
    const content = req.body['fileBase64Content'];
    const repository = req.body['repoName'];
    const branch = req.body['branch'];

    if (!token || !path || !content || !repository || !branch) {
      return res.status(409).send('error');
    }

    github = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        common: {
          authorization: `token ${token}`
        }
      }
    });

    const sha = await getFileSha(`/repos/${repository}/contents/${path}?ref=${branch}`);
    const message = sha === '' ? `create file: ${path}` : `update file: ${path}`;
    
    const response = await updateFile(
      `/repos/${repository}/contents/${path}`, 
      {
        content,
        message,
        path,
        branch,
        sha
      });
    
    if (response === 'error'){
      console.log(message + " : " + "error");
      return res.status(500).send('error');
    } else {
      console.log(message + " : " + "success");
      return res.status(200).send(response);
    }
  }
};

const updateFile = async (url, data) => {
  let res = '';
  try {
    await github.put(url, data).then(function (response) {
      res = response.data;
    });
  } catch (error) {
    console.log(error.response.message + ":" + error.toString());
    res = 'error';
  }
  return res;
};

const getFileSha = async (url) => {
  let sha = '';
  try {
    await github.get(url).then(function (response) {
        sha = response.data['sha'];
      });
  } catch (error) {
    console.log("File not found: " + error.toString());
    if (error.response.status === 404) {
      return sha;
    }
  }
  return sha;
};
