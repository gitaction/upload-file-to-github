const axios = require('axios');
const uploadFileToGitHub = require('./index').uploadFileToGitHub;

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
    "token": "4ca81154xxxxxx080301ae1a1",
    "pathName": "abc/test2.json",
    "fileBase64Content": "ewogICAgImFycmF5IjogWwogICAgICAgIDEsCiAgICAgICAgMiwKICAgICAgICAzLAogICAgICAgIDQKICAgIF0sCiAgICAiYm9vbGVhbiI6IHRydWUsCiAgICAibnVsbCI6IG51bGwsCiAgICAibnVtYmVyIjogMTIzLAogICAgIm9iamVjdCI6IHsKICAgICAgICAiYSI6ICJiIiwKICAgICAgICAiYyI6ICJkIiwKICAgICAgICAiZSI6ICJmIgogICAgfSwKICAgICJzdHJpbmciOiAiSGVsbG8gV29ybGQiCn0=",
    "repoName": "gitaction/comics",
    "branch": "master"
  }
};

test('should allow all the origin for CORS Preflight', () => {
  const req = {method: 'OPTIONS'};
  const res = mockResponse();

  uploadFileToGitHub(req, res);
  
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

  uploadFileToGitHub(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.send).toHaveBeenCalledWith('error');
});

test('should receive token with 200', async () => {
  const res = mockResponse();

  const respGet = {data: {"sha": "sha123"}};
  const respPut = {data: {"content": "content123"}};

  axios.create = jest.fn().mockReturnValue(axios);
  axios.get.mockResolvedValue(respGet);
  axios.put.mockResolvedValue(respPut);
  await uploadFileToGitHub(mockRequest, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith({"content": "content123"});
});

test('should throw 500 when error caught', async () => {
  const res = mockResponse();
  const resp = new Error("errorMessage");
  const respGet = {data: {"sha": "sha123"}};

  axios.create = jest.fn().mockReturnValue(axios);
  axios.get.mockResolvedValue(respGet);
  axios.put.mockRejectedValue(resp);
  await uploadFileToGitHub(mockRequest, res);
  
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith("error");
});

