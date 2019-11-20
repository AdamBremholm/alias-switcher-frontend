import Vue from "vue";
import { auth } from "./auth.module";
import { aliases } from "./aliases.module";
import createLogger from "../plugins/logger";
import Vuex from "vuex";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    auth,
    aliases
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
