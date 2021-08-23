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

export function createUser(){
  return axios.post(`${baseURL}/signUp`)
}

export function logInUser(){
  return axios.post(`${baseURL}/signIn`)
}

export function editUser(userId){
  return axios.put(`${baseURL}/${userId}/edit`, getHeaders())
}

export function showUser(userId){
  return axios.get(`${baseURL}/${userId}`)
}




