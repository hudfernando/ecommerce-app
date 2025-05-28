import ky from 'ky'
//baseURL: 'http://177.39.16.76:8405',
export const api = ky.create({
  //prefixUrl: 'https://localhost:7261',
  prefixUrl: 'http://177.39.16.76:8406',
})
