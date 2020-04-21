import axios, { AxiosInstance } from 'axios'
import { isServer } from '@Utils/common'

let axiosInstance: AxiosInstance

/**
 *todo drop this im using fetch from now on. save the bundle the 5.38kb gzipped
 * redux dispatch still uses it
 */
export default function () {
  if (isServer() || !axiosInstance) {
    axiosInstance = axios.create({
      baseURL: isServer() ? 'http://localhost:3000/api/v1/' : '/api/v1/',
      method: 'get',
      withCredentials: true,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })
  }
  return axiosInstance
}
