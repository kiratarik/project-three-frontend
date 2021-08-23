export function setToken(token) {
  window.localStorage.setItem('token', token)
}

export function getToken() {
  return window.localStorage.getItem('token')
}

export function removeToken() {
  window.localStorage.removeItem('token')
}

// gets the token and parses it using the atob encoder function to get the middle string 

export function getPayload() {
  const token = getToken()
  if (!token) return false
  const tokenParts = token.split('.')
  if (tokenParts.length < 3 ) return false
  const payload = JSON.parse(atob(tokenParts[1]))
  return payload 
}

// checks wehter the expiry date in the token is passed its sell-by-date

export function isAuthenticated(){
  const payload = getPayload()
  if (!payload) return false
  const timeNow = Math.round(Date.now() / 1000)
  return timeNow < payload.exp
}

//gets the user credentials from the token object 

export function isOwner(userId){
  const payload = getPayload()
  if (!payload) return false
  return payload.sub === userId
}