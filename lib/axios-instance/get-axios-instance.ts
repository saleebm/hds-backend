import axios, { AxiosInstance } from 'axios'
import { isServer } from '@Utils/common'

let axiosInstance: AxiosInstance

export default function () {
  if (isServer() || !axiosInstance) {
    axiosInstance = axios.create({
      //todo port needs to be established
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
