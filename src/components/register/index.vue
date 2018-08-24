<template>
  <v-layout>
    <v-dialog v-model="active" persistent>
      <v-flex offset-sm1 offset-md1 offset-lg1 xs8 sm8 md10 lg10 pa-4>
        <v-card>
          <v-card-title>
            <h3 class="headline">Account Created!</h3>
          </v-card-title>
          <v-card-text>
            <p>{{ result }}</p>
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
              <h3 class="headline">Account Registration</h3>
              <p>{{ msg }}</p>
              <v-flex xs12 sm12 md14 lg14 pa-4>
                <v-form v-model="valid" ref="form">
                  <v-text-field label="Username" v-model="ID" required autofocus @keyup.enter="submit"></v-text-field>
                  <v-text-field label="Password" v-model="UsrPassword" required @keyup.enter="submit" type="password"></v-text-field>
                  <v-text-field label="First Name" v-model="FirstName" required @keyup.enter="submit"></v-text-field>
                  <v-text-field label="Last Name" v-model="LastName" required @keyup.enter="submit"></v-text-field>
                  <div class="text-xs-right">
                    <v-btn @click="submit" color="primary">Submit</v-btn>
                  </div>
                </v-form>
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
  name: 'Register',
  data () {
    return {
      msg: 'Please enter your account details.',
      msg2: '',
      active: false,
      errors: []
    }
  },
  computed: mapGetters([
    'api', 'result'
  ]),
  methods: {
    onConfirm () {
      this.$router.push({name: 'Home'})
    },
    submit: async function () {
      var postdata = { page: 'registerUser',
        data: {
          userName: this.ID,
          userPassword: this.UsrPassword,
          firstName: this.FirstName,
          lastName: this.LastName
        }
      }

      console.log(postdata)
      this.$store.dispatch('SEND_API', postdata).then(response => {
        this.active = true
      }, error => {
        if (error) {
          this.active = false
          console.error('Got nothing from server. Prompt user to check internet connection and try again')
        }
      })
      // API.post('registerUser', {
      //   userName: this.ID,
      //   userPassword: this.UsrPassword,
      //   firstName: this.FirstName,
      //   lastName: this.LastName
      // })
      //   .then(response => {
      //   // JSON responses are automatically parsed.
      //     this.msg2 = response.data
      //     console.log(response)
      //     this.active = true
      //   })
      //   .catch(e => {
      //     this.errors.push(e)
      //     console.log(e)
      //   })
    }
  }
}
</script>
