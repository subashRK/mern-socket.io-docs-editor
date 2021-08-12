import axios from "axios"

const getError = e => Object.values(e)[2]?.data?.error

const SERVER_DOMAIN = process.env.SERVER_DOMAIN

const axiosInstance = axios.create({
  baseURL: SERVER_DOMAIN || "http://localhost:5000/",
  withCredentials: true
})

export { getError, axiosInstance as axios, SERVER_DOMAIN }
