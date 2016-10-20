export const getToken = () => Promise.resolve(localStorage.token)

export const isLoggedIn = () => Promise.resolve(!!localStorage.token)

export const login = (email, password) => {
  return fetchApi(email, password)
    .then(res => {
      if (res.authenticated) {
        localStorage.token = res.token
        return res.token
      }

      return Promise.reject(new Error('Login failed due to network'))
    })
}

export const logout = () =>
  Promise.resolve()
    .then(() => delete localStorage.token)

function fetchApi (email, password) {
  if (email === 'gui' && password === 'xundas') {
    return Promise.resolve({
      authenticated: true,
      token: Math.random().toString(36).substring(7)
    })
  }

  return Promise.reject(new Error('Invalid email or password'))
}
