import axios from "axios";
import { TokenService } from "../services/storage.service";
import { mapActions } from "vuex";
import https from "https";

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const ApiService = {
  ...mapActions("auth", ["refreshToken", "logout"]),

  init(baseURL) {
    axios.defaults.baseURL = baseURL;
    axios.defaults.httpsAgent = httpsAgent;
  },

  setHeader() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TokenService.getToken()}`;
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return axios(data);
  },

  // Stores the 401 interceptor position so that it can be later ejected when needed
  _401interceptor: null,

  mount401Interceptor() {
    this._401interceptor = axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        if (error.request.status == 401) {
          console.log("tjaba 401 interceptor här");
          if (error.config.url.includes("/authentication")) {
            // Refresh token has failed. Logout the user
            this.$store.dispatch("auth/logout");
            throw error;
          } else {
            console.log("trying to refresh accesstoken");
            // Refresh the access token
            try {
              await this.$store.dispatch("auth/refreshToken");
              // Retry the original request
              return this.customRequest({
                method: error.config.method,
                url: error.config.url,
                data: error.config.data
              });
            } catch (e) {
              console.log("refresh failed - original request rejected");
              // Refresh has failed - reject the original request
              throw error;
            }
          }
        }

        // If error was not 401 just reject as is
        throw error;
      }
    );
  },

  unmount401Interceptor() {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor);
  }
};

export default ApiService;
