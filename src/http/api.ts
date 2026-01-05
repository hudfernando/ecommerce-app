import ky from 'ky'
//baseURL: 'http://177.39.16.76:8405',
export const api = ky.create({
  prefixUrl: 'http://goyazservice.ddns.me:18818',
  //prefixUrl: 'http://177.39.16.76:8406',
})
