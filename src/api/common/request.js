import axios from 'axios';
const service = axios.create({
  // 请求超时时间
  timeout: 2000000
});

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers = {
      ...config.headers,
      // 设置请求头
      'Content-Type': 'application/json;charset=UTF-8'
    };
    return config;
  },
  error => {
    // Do something with request error
    Promise.reject(error);
  }
);
// 这里是统一的错误处理，提示可以换成其他的
service.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    console.log(error);
    if (error.message.includes('timeout')) {
      // 判断请求异常信息中是否含有超时timeout字符串
      alert('网络超时');
      return Promise.reject(error.response); // reject这个错误信息
    } else {
      alert('网络超时，请重试');
      return Promise.reject(error.response);
    }
  }
);

const AsyncAxios = function(host, url, type, data) {
  console.log('host', `${host}/${url}`);
  switch (type.toLowerCase()) {
    case 'get':
      return service
        .get(`${host}${url}`, {
          params: data
        })
        .then(res => res.data);
    case 'post':
      return service.post(`${host}${url}`, data).then(res => res.data);
  }
};

const AsyncAxiosWithHeader = function(host, url, type, data, header) {
  switch (type.toLowerCase()) {
    case 'get':
      return service
        .get(`${host}${url}`, {
          params: data,
          headers: header
        })
        .then(res => res.data);
    case 'post':
      return service.post(`${host}${url}`, data).then(res => res.data);
  }
};

const doRequest = function(host, paramDict) {
  if (paramDict.header) {
    return AsyncAxiosWithHeader(
      host,
      paramDict.url,
      paramDict.type,
      paramDict.param,
      paramDict.header
    );
  }
  return AsyncAxios(host, paramDict.url, paramDict.type, paramDict.param);
};
export { AsyncAxios, doRequest, AsyncAxiosWithHeader };
