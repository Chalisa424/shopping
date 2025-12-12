import axios from "axios";

const getAccessToken = () => {
    return window.localStorage.getItem("Token") ?? "";
}

const httpClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_DIR}`,
    timeout: 2000,
})

//request interceptor
httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//response interceptor
httpClient.interceptors.response.use(
 (res) => res,
 async (err) =>{
    const originalConfig = err.config;
        //ถ้ามี response กลับมาจาก API
     if (err.response) {
      // token หมดอายุ = 401
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true

        localStorage.removeItem('Token')

        // กลับไปหน้า login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      return Promise.reject(err)
    }

    // network error ไม่มี response
    return Promise.reject(err)
  }
)

export { httpClient, getAccessToken };
export default httpClient;