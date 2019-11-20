import ApiService from "./api.service";

class ConnectionError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errorCode = errorCode;
  }
}

const AliasService = {
  async loadAliases() {
    try {
      return await ApiService.get("/api/v1/aliases");
    } catch (error) {
      throw new ConnectionError(
        error.response.status,
        error.response.data.detail
      );
    }
  },

  //Tries to put the changed aliases to backend. If unauthorized the 401 interceptor will take care of it. If other error resets the lists to the state before the put action
  // Starts with changing the origin so we avoid constraint of unique ids in db.
  // If error sends up to store where we will reload from backend.
  async sendAlias({ state }, action) {
    try {
      const res = await this.putAlias(state.aliasList[action.origin].id, state.aliasList[action.origin]);
      const res2 = await this.putAlias(state.aliasList[action.target].id, state.aliasList[action.target]);
      return res + res2;
    } catch (e) {
      if (e instanceof ConnectionError) {
        console.log("problem with putting at backend, ==> sending error upwards");
        throw new ConnectionError(error.response.status, error.response.detail);
      }
    }
  },

  async putAlias(IDParam, alias) {
    try {
      return await ApiService.put("/api/v1/aliases/" + IDParam, alias)
    }catch (error) {
      throw new ConnectionError(error.response.status, error.response.detail);
    }
  },

  async updateAliasTables() {
    try {
       const res = await ApiService.get("/api/v1/aliases/update_urltables");
       console.log(res.data.data.updates);
       return res;
    } catch (error) {
      throw new ConnectionError(error.response.status, error.response.detail);
    }
  }
};

export default AliasService;

export { AliasService };
