import axios, { AxiosInstance } from 'axios'
import { isServer } from '@Utils/common'

let axiosInstance: AxiosInstance

export default function() {
  if (isServer() || !axiosInstance) {
    axiosInstance = axios.create()
  }
  return axiosInstance
}
