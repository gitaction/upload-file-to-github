const axios = require('axios');
const oauthToken = require('./index').oauthToken;

jest.mock('axios');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = {
  method: 'POST',
  body: {
    redirect_uri: "req.body.redirect_uri",
    client_id: "req.body.client_id",
    client_secret: "req.body.client_secret",
    code: "req.body.code",
    state: "req.body.state"
  }
};

test('should allow all the origin for CORS Preflight', () => {
  const req = {method: 'OPTIONS'};
  const res = mockResponse();
  
  oauthToken(req, res);
  
  expect(res.set.mock.calls).toEqual([
    ["Access-Control-Allow-Origin", "*"],
    ["Access-Control-Allow-Methods", "POST"],
    ["Access-Control-Allow-Headers", "Content-Type"],
    ["Access-Control-Max-Age", "3600"]
  ]);
  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalledWith('');
});

test('should receive input error when parameters missing', () => {
  const req = { method: 'POST', body: {}};
  const res = mockResponse();

  oauthToken(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.send).toHaveBeenCalledWith('error');
});

test('should receive token with 200', async () => {
  const res = mockResponse();
  const token = {
    "access_token": "e72e16c7e42f292c6912e7710c838347ae178b4a",
    "scope": "repo,gist",
    "token_type": "bearer"
  };
  const resp = {data: token};

  axios.post.mockResolvedValue(resp);
  await oauthToken(mockRequest, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith(token);
});

test('should throw 500 when error caught', async () => {
  const res = mockResponse();
  const resp = new Error("errorMessage");

  axios.post.mockRejectedValue(resp);
  await oauthToken(mockRequest, res);
  
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith("error");
});

