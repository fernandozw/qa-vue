import { doRequest } from '../common/request';

const runCaseReuquest = function(markers, modelType) {
  let paramDict = {
    url: '/tw/runCases',
    type: 'post',
    param: {
      markers: markers,
      model_type: modelType
    }
  };
  return doRequest(process.env.TW_URL, paramDict);
};

const rebotCaseRequest = function(markers, modelType) {
  let paramDict = {
    url: '/tw/rebotCases',
    type: 'post',
    param: {
      markers: markers,
      model_type: modelType
    }
  };
  return doRequest(process.env.TW_URL, paramDict);
};
const getReport = function(markers, modelType) {
  let paramDict = {
    url: '/reports/TwAllureReport/',
    type: 'get',
    param: {}
  };
  return doRequest('http://47.100.78.246', paramDict);
};

export { rebotCaseRequest, runCaseReuquest, getReport };
