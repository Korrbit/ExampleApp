import axios from 'axios'

// Create default port
var PORT = process.env.PORT || 3000

export const API = axios.create({
  baseURL: 'http://localhost:' + PORT + '/api/'
})
