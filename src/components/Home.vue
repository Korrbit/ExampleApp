<template>
  <div>
  <v-layout>
    <v-flex xs10 md6 offset-sm1 offset-md3 sm10 lg6 offset-lg3 mt-5>
        <v-card>
        <div>
            {{ msg }}
        </div>
            <div>
            <v-flex xs12 sm12 md14 lg14 pa-5>
              <md-content class="md-alignment-top-center">
                <h3 class="headline">Login With Your Credentials:</h3>
                <p>Enter your User ID and Password below to get started.</p>
                <v-form v-model="valid" ref="form">
                  <v-text-field label="UserID" v-model="ID" required autofocus @keyup.enter="submit"></v-text-field>
                  <v-text-field label="Password" v-model="usrPassword" required @keyup.enter="submit" type="password"></v-text-field>
                  <div class="text-xs-right">
                    <v-btn @click="submit" color="primary">Submit</v-btn>
                  </div>
                </v-form>
              </md-content>
              </v-flex>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout wrap>
        <v-flex xs10 md6 offset-sm1 offset-md3 sm10 lg6 offset-lg3>
          <v-card>
            <v-card-text class="text-xs-centered">
              <v-layout>
                <v-flex xs12 sm12 md4 lg4 text-xs-center align-center justify-center>
                  <br>
                  <router-link to="unlockuser">Unlock Account</router-link>
                </v-flex>
                <v-flex xs12 sm12 md4 lg4 text-xs-center align-center justify-center>
                  <br>
                  <router-link to="forgotpass">Forgot Password?</router-link>
                </v-flex>
                <v-flex xs12 sm12 md4 lg4 text-xs-center>
                  <span> Don't have an account? <br></span>
                  <router-link to="register">Click to Register.</router-link>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to 4iQ Demo App',
      errors: []
    }
  },
  created () {
  //  this.$store.dispatch('FETCH_API', 'test')

  //  API.get('test')
    //  .then(response => {
      // JSON responses are automatically parsed.
      //  this.msg = response.data
    //  })
    //  .catch(e => {
      //  this.errors.push(e)
    //  })
  },
  computed: mapGetters([
    'api', 'result'
  ]),
  methods: {
    submit: async function () {
      var postdata = { page: 'login',
        data: {
          userName: this.ID,
          userPassword: this.usrPassword
        }
      }
      console.log(postdata)
      this.$store.dispatch('SEND_API', postdata).then(response => {
        this.msg = response
        if (this.msg === 'status: success') {
          this.$store.dispatch('USER_LOGIN', this.ID)
          this.$router.push({name: 'Monitor'})
        }
      }, error => {
        if (error) {
          this.msg = error
          console.error('Got nothing from server. Prompt user to check internet connection and try again')
        }
      })
      // API.post('login', {
      //   userName: this.ID,
      //   userPassword: this.usrPassword
      // })
      //   .then(response => {
      //   // JSON responses are automatically parsed.
      //     this.msg = response.data
      //     console.log(response)
      //   })
      //   .catch(e => {
      //     this.errors.push(e)
      //     console.log(e)
      //   })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #1f1d99;
}

.ct {
  margin: 10 0px;
}

</style>
