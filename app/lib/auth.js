import Emitter from 'tiny-emitter'

export const AuthEmitter = new Emitter()

export const getToken = () => Promise.resolve(localStorage.token)
export const isLoggedIn = () => Promise.resolve(!!localStorage.token)

export const login = ({ username, password }) => {
  return fetchApi(username, password)
    .then(res => {
      if (res.authenticated) {
        AuthEmitter.emit('auth-changed', { loggedIn: true })
        localStorage.token = res.token
        return res.token
      }

      return Promise.reject(new Error('Login failed due to network'))
    })
}

export const logout = () =>
  Promise.resolve()
    .then(() => delete localStorage.token)
    .then(() => AuthEmitter.emit('auth-changed', { loggedIn: false }))

function fetchApi (username, password) {
  if (username === 'gui' && password === 'xundas') {
    return Promise.resolve({
      authenticated: true,
      token: Math.random().toString(36).substring(7)
    })
  }

  return Promise.reject(new Error('Invalid username or password'))
}
