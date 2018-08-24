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
              <h3 class="headline">Bulk Search</h3>
              <p>{{ msg }}</p>
              <v-flex xs12 sm12 md14 lg14 pa-4>
                <v-form v-model="valid" ref="form">
                  <upload-button title="Browse" :selectedCallback="handleFilesUpload" color="primary"></upload-button>
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
import UploadButton from './UploadButton'
import axios from 'axios'

export default {
  name: 'UserBulkSearch',
  data () {
    return {
      msg: 'Select file to upload.',
      msg2: '',
      active: false,
      files: '',
      errors: []
    }
  },
  components: {
    UploadButton
  },
  computed: mapGetters([
    'api', 'result'
  ]),
  methods: {
    /*
    Handles a change on the file upload
    */
    handleFilesUpload (e) {
      console.log(e.name)

      let formData = new FormData();
      formData.append('files', e);

      let PORT = process.env.PORT || 3000

      let API = axios.create({
        baseURL: 'http://localhost:' + PORT + '/api/',
        timeout: 600000
      })

      /*
        Make the request to the POST /select-files URL
      */
      API.post( 'bulkUserSearch',
        formData,
        {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        }
      ).then(function(response){
        console.log(response.data)
        /*let blob = new Blob([JSON.stringify(response.data)], { type:   'application/octet-stream' } )
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'out.log'
        link.click() */
      })
      .catch(function(info){
        console.log('---FAILURE!!' + info)
      });


      //readBlob.dataurl(e).then(url => {
    },
    onConfirm () {
      this.$router.push({name: 'Home'})
    }
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
</script>
