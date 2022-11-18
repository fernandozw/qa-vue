import { doRequest } from '../common/request';

const getRancherEnv = function() {
  let paramDict = {
    url: '/rancher/v1/projects/1a5/environments',
    type: 'get',
    param: {},
    header: {
      Accept: 'application/json'
    }
  };
  return doRequest(process.env.RANCHER_URL, paramDict);
};

const getServiceHost = function(id) {
  let paramDict = {
    url: '/rancher/v1/projects/1a5/environments/' + id + '/services',
    type: 'get',
    param: {},
    header: {
      Accept: 'application/json'
    }
  };
  return doRequest(process.env.RANCHER_URL, paramDict);
};

export { getRancherEnv, getServiceHost };
