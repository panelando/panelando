import { hashHistory } from 'react-router'
import { auth } from 'lib/firebase'

export const redirect = path => hashHistory.push(path)

export const signInWithGoogle = () => {
  const provider = new auth.GoogleAuthProvider()

  provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

  return auth().signInWithPopup(provider)
}

export const signInWithFacebook = () => {
  const provider = new auth.FacebookAuthProvider()

  return auth().signInWithPopup(provider)
}

export const signOut = () => {
  return auth().signOut()
}

export const getCurrentUser = () => {
  return Promise.resolve(auth().currentUser)
}

