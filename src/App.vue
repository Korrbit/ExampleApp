<template>
  <v-app class="main">
    <v-toolbar app>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <a href="https://4iq.com/" slot="activator">
          <img src="~@/assets/Header-4iQ-Logo.png">
        </a>
        <span>4iQ</span>
      </v-tooltip>
        <v-btn icon @click.stop="codeView = true">
          <v-icon>code</v-icon>
        </v-btn>
      </v-btn>
    </v-toolbar>
    <main>
        <v-container fluid grid-list-md>
            <router-view class="mt-5"></router-view>
          <v-bottom-sheet scrollable v-model="codeView">
            <inspector></inspector>
          </v-bottom-sheet>
        </v-container>
      </main>
    <v-footer app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import Inspector from '@/components/globals/Inspector'

export default {
  data () {
    return {
      drawer: false,
      title: 'Demo',
      codeView: false
    }
  },
  name: 'App',
  components: {
    Inspector
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.main {
    background-image: url('~@/assets/panorama-2646143_1920.jpg') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
    background-blend-mode: lighten !important;
    background-attachment: fixed !important;
    background-color: #5E1D9A !important;
  }
</style>
