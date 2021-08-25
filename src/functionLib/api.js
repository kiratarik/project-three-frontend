import axios from 'axios'
import { getToken } from './auth.js'

const baseURL = '/api'

function getHeaders(){
  const token = getToken()
  return {
    headers: { Authorization: `Bearer ${token}` },
  }
}

// image and comment requests


export function getImages() {
  return axios.get(`${baseURL}/images`)
}

export function createImage(imageData) {
  return axios.post(`${baseURL}/images`, imageData, getHeaders())
}

export function getImage(imageId) {
  return axios.get(`${baseURL}/images/${imageId}`)  
}

export function editImage(imageId, imageData) {
  return axios.put(`${baseURL}/images/${imageId}`, imageData, getHeaders())
}

export function rateImage(imageId, formData){
  return axios.post(`${baseURL}/images/${imageId}/rating`, formData)
}

export function deleteRating(imageId, ratingId){
  return axios.get(`${baseURL}/images/${imageId}/rating/${ratingId}`)
}

// user requests

export function createUser(formData){
  return axios.post(`${baseURL}/signUp`, formData)
}

export function logInUser(formData){
  return axios.post(`${baseURL}/signIn`, formData)
}

export function editUser(userData) {
  return axios.put(`${baseURL}/users/${userData._id}`, userData, getHeaders())
}

export function showUser(userId){
  return axios.get(`${baseURL}/users/${userId}`)
}




