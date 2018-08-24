<template>
  <v-card flat>
    <v-card-title class="headline">4iQ API Calls</v-card-title>
    <v-divider></v-divider>
    <v-card-text style="height: 400px; overflow-y: scroll;">
      <v-container fluid grid-list-xl>
        <v-layout row wrap>
          <v-flex v-for="c in api" :key="c.id" xs12 sm12 md12 lg12>
            <v-card>
              <v-layout v-if="c.status === 200">
                <v-flex xs11 sm11 md11 lg11 >
                  <v-card-title class="title"> - </v-card-title>
                </v-flex>
                <v-flex xs1 sm1 md1 lg1>
                  <v-icon large color="green">fa-check-circle</v-icon>
                </v-flex>
              </v-layout>
              <v-layout v-else-if="c.status !== 200">
                <v-flex xs11 sm11 md11 lg11>
                  <v-card-title class='title'> - </v-card-title>
                </v-flex>
                <v-flex xs1 sm1 md1 lg1>
                  <v-icon large color="red">fa-exclamation-circle</v-icon>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs6>
                    <span class="subheading">Request: </span>
                  </v-flex>
                  <v-flex xs6>
                    <span class="subheading">Response: </span>
                  </v-flex>
                  <v-flex xs6>
                    <pre v-highlightjs><code>{{ c.url }}</code></pre>
                  </v-flex>
                  <v-flex d-flex xs6>
                    <pre v-highlightjs><code class="text-xs-left">{{ c.data }}</code></pre>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters([
    'api'
  ])
}
</script

<style>
.json{
  word-break: break-all;
}
</style>
