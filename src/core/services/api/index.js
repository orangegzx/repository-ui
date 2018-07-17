// import React from 'react';
import REST from './rest';

const API_URL = 'http://117.50.19.70:30088';

class APIService extends REST {
  constructor() {
    super(`${API_URL}`);
    // this.configInterceptors();
  }

  /*
  configInterceptors() {
    this.rest.interceptors.request.use(config => {
      if (!config.headers.Authorization && AuthService.getToken()) {
        config.headers.Authorization = `Bearer ${AuthService.getToken()}`;
      }
      return config;
    });
    this.rest.interceptors.response.use(
      // global ajsx success handler
      res => {
        if (/^20\d/.test(res.status)) {
          return res.data;
        }
        return res;
      },
      // global ajax error handler
      error => {
        // error reponse
        if (error.response.status === 401) {
          console.error('401 going home!');
        } else if (error.response.status === 403) {
          Vue.noty.error('权限不足');
        }
        // else if (error.response.status === 409) {
        //   Vue.noty.error('不能进行此操作');
        // }
        return Promise.reject(error);
      },
    );
  }
*/

  getEndPointURL() {
    return this.endPointURL;
  }

  create(url, config) {
    return new REST(url, config);
  }
}

export default new APIService();
