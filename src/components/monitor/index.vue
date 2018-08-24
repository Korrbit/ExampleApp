<template>
  <v-layout>
    <v-dialog v-model="active" persistent>
      <v-flex offset-sm1 offset-md1 offset-lg1 xs8 sm8 md10 lg10 pa-4>
        <v-card>
          <v-card-title>
            <h3 class="headline">Info: </h3>
          </v-card-title>
          <v-card-text>
            <p>{{ msg2 }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="onConfirm">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>
    <v-flex xs10 md6 offset-sm1 offset-md3 sm10 lg6 offset-lg3 mt-5>
      <v-card>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm12 md14 lg14 pa-4>
              <h3 class="headline">Compromised User Data</h3>
              <p>{{ msg }}</p>
              <v-flex v-for='(itemObjKey, info) in this.information.results[0].information' xs12 sm12 md14 lg14 pa-4>
                <v-card class='text-xs-left'>{{ info }} : {{ itemObjKey }}</v-card>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      msg: 'Please enter your username.',
      msg2: '',
      active: false,
      information: '',
      errors: []
    }
  },
  created () {
    this.$store.dispatch('CLEAR_API')
    this.msg = this.user
    if (this.user === '') {
      this.$router.push({ name: 'Home' })
    } else {
      var postdata = { page: 'monitorUser',
        data: {
          userName: this.user
        }
      }
      this.$store.dispatch('SEND_API', postdata).then(response => {
        // this.msg2 = response.response.data.results
        var info = response.response
        // var find = this.convArrToObj(JSON.stringify(response.response.results).match(/"information"(.*?)password_info(.*?)}(.*?)}/g)) // .replace(/\[/g, '')

        console.log(info.results[0].information)
        // var val = { info: find }
        // var t = JSON.stringify(find).replace(/"information":/g, '')
        // console.log(t)
        // t = t.replace(/"\\"information\\":/g, '')
        // find = JSON.parse(t)
        // console.log(find)
        // find = find.replace(/\]/g, '')
        // find = find.replace(/\{/g, '[{')
        // find = find.replace(/\}/g, '}]')
        // console.log(find.information.city)

        this.information = info
        // console.log(this.information)
      }, error => {
        if (error) {
          console.error('Got nothing from server. Prompt user to check internet connection and try again')
        }
      })
    }
  },
  computed: mapGetters(['api', 'result', 'user']),
  methods: {
    onConfirm () {
      this.active = false
    },
    submit: async function () {
      this.active = true
    },
    convArrToObj: function (array) {
      var thisEleObj = {}
      if (typeof array === 'object') {
        for (var i in array) {
          var thisEle = this.convArrToObj(array[i])
          thisEleObj[i] = thisEle
        }
      } else {
        thisEleObj = array
      }
      return thisEleObj
    }
  }
}
</script>
