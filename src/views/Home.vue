<template>
  <div class="home">
    <Lists></Lists>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Lists from "../components/Lists.vue";

export default {
  name: "home",
  components: {
    Lists,
    HelloWorld
  }
};
</script>
