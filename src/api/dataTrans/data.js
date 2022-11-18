import { doRequest } from '../common/request';
const getProjectInfo = function(url, user, password) {
  let paramDict = {
    url: '/data/project/info',
    type: 'post',
    param: {
      url: url,
      user: user,
      password: password
    }
  };
  return doRequest(process.env.RANCHER_URL, paramDict);
};

const exportApi = async param => {
  const res = await doRequest(`${window.origin}/engine`, {
    url: '/api/ta-engine-test/case-free/export',
    type: 'post',
    param
  });
  return res;
};

const uploadApi = async param => {
  const res = await doRequest(`${window.origin}/engine`, {
    url: '/api/ta-engine-test/case-free/upload',
    type: 'post',
    param
  });
  return res;
};

const packageList = function() {
  const res = doRequest(`${window.origin}/engine`, {
    url: '/api/ta-engine-test/case-free/list',
    type: 'get'
  });
  return res;
};

export { getProjectInfo, exportApi, packageList, uploadApi };
