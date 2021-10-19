import axios from 'axios'
import { getToken } from './auth.js'

import { baseUrl } from '../config.js'

function getHeaders(){
  const token = getToken()
  return {
    headers: { Authorization: `Bearer ${token}` },
  }
}

// image and comment requests


export function getImages() {
  return axios.get(`${baseUrl}/images`)
}

export function createImage(imageData) {
  return axios.post(`${baseUrl}/images`, imageData, getHeaders())
}

export function getImage(imageId) {
  return axios.get(`${baseUrl}/images/${imageId}`)  
}

export function editImage(imageId, imageData) {
  return axios.put(`${baseUrl}/images/${imageId}`, imageData, getHeaders())
}

export function rateImage(imageId, formData){
  return axios.post(`${baseUrl}/images/${imageId}/rating`, formData)
}

export function deleteRating(imageId, ratingId){
  return axios.get(`${baseUrl}/images/${imageId}/rating/${ratingId}`)
}

// user requests

export function createUser(formData){
  return axios.post(`${baseUrl}/signUp`, formData)
}

export function logInUser(formData){
  return axios.post(`${baseUrl}/signIn`, formData)
}

export function editUser(userData) {
  return axios.put(`${baseUrl}/users/${userData._id}`, userData, getHeaders())
}

export function showUser(userId){
  return axios.get(`${baseUrl}/users/${userId}`)
}




