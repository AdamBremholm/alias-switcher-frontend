<template>
  <div class="row">
    <header v-if="loading">Loading...</header>

    <div
      class="col-3"
      v-for="(element, index) in aliasList"
      :key="element.name"
    >
      <h3>{{ element.name }}</h3>
      <draggable
        class="list-group"
        :value="element.hosts"
        :id="index"
        group="hosts"
        @change="changed"
        @end="checkEnd"
        :disabled="sending"
      >
        <div
          class="list-group-item"
          v-for="(e2, i) in element.hosts"
          :key="e2.name"
        >
          {{ e2.name }} {{ e2.address }}
        </div>
      </draggable>
    </div>
    <br />
    <button type="button" v-if="!loading" v-on:click="handleClick">
      Logout
    </button>
  </div>
</template>

<script>
import draggable from "vuedraggable";

import { mapState, mapActions, mapMutations } from "vuex";


export default {
  name: "Lists",
  display: "Lists",
  order: 1,
  components: {
    draggable
  },
  computed: {
    ...mapState("aliases", ["aliasList", "sending", "sendError", "sendErrorCode"])
  },
  data() {
    return {
      value: "",
      loading: true,
      action: {
        name: "",
        origin: "",
        target: "",
        newIndex: "",
        oldIndex: ""
      }
    };
  },
  methods: {
    ...mapActions("aliases", ["sendAlias", "loadAliases"], "auth", ["logout"]),
    ...mapMutations("aliases", ["updateList"]),

    changed(evt) {
      if (evt.hasOwnProperty("added")) {
        this.action.name = evt.added.element.name;
        this.action.newIndex = evt.added.newIndex;
      } else if (evt.hasOwnProperty("removed")) {
        this.action.oldIndex = evt.removed.oldIndex;
      } else if (evt.hasOwnProperty("moved")) {
        this.action.newIndex = evt.moved.newIndex;
        this.action.oldIndex = evt.moved.oldIndex;
      }
    },
    async checkEnd(event) {
      this.action.origin = event.from.id;
      this.action.target = event.to.id;
      this.updateList(this.action);
      await this.$store.dispatch("aliases/sendAlias", this.action);
    },
    handleClick() {
      this.$store.dispatch("auth/logout");
    },
    updateList(e) {
      this.$store.commit("aliases/updateList", e);
    }
  },
  mounted() {
    //Väntar 1 sec med att starta igång allting så att det hinner loada
    let load = this.loading;
    setTimeout(() => {
      this.$store
        .dispatch("aliases/loadAliases")
        .then((this.loading = false))
        .catch(error => console.log("failed load aliases on created"));
    }, 250);
  }
};
</script>
