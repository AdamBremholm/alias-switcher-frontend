<template>
  <div>
    <div>{{ token }}</div>
    <div id="login">
      <h1>Login</h1>
      <input
        type="text"
        name="username"
        v-model="username"
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        v-model="password"
        placeholder="Password"
      />
      <button type="button" v-on:click="handleSubmit">Login</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "login",

  data() {
    return {
      username: "",
      password: "",
      token: ""
    };
  },

  computed: {
    ...mapGetters("auth", [
      "loggedIn",
      "authenticating",
      "authenticationError",
      "authenticationErrorCode"
    ])
  },

  methods: {
    ...mapActions("auth", ["login"]),
    checkForm() {},
    errors() {},

    handleSubmit() {
      // Perform a simple validation that username and password have been typed in
      if (this.username != "" && this.password != "") {
        this.login({ username: this.username, password: this.password });
      }
    }
  }
};
</script>

<style scoped></style>
