import axios, { AxiosInstance } from 'axios'
import { isServer } from '@Utils/common'

let axiosInstance: AxiosInstance

export function getAxiosInstance() {
  if (isServer() || !axiosInstance) {
    axiosInstance = axios.create({
      baseURL: '/api/v1/',
      method: 'get',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    })
  }
  return axiosInstance
}
