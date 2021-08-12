import axiosClient from "./axiosClient"; 

const authApi = { 
  login: (data) => { 
    const url = "api/v1/auth/login"; 
    
    return axiosClient.post(url, data); 
  },

  me: (token) => {  
    const url = "api/v1/auth/profile"; 

    return axiosClient.get(url, { 
      headers: { 
        Authorization: token, 
      }, 
    }); 
  }, 

  updateInfo: ({token, data}) => { 
    const url = "api/v1/auth/profile"; 
    
    return axiosClient.put(url, 
      data,
      {
        headers: { 
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        },
      }
    )
  },

  changeAvatar: ({token, image}) => {
    const url = `api/v1/auth/profile/change-avatar`

    const bodyFormData = new FormData()
    bodyFormData.append('image', image)
    
    return axiosClient.put(url, 
      bodyFormData,
      {
        headers: { 
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        },
      }
    )
  },

  register: (data) => { 
    const url = "api/v1/auth/register"; 
 
    return axiosClient.post(url, data); 
  },
  verifyEmailRegister: (data) => { 
    const url = "api/v1/auth/verify_email"; 
 
    return axiosClient.post(url, data); 
  },
  forgotPassword : (data) => {
    const url = "api/v1/auth/verify_forgot_password"
    return axiosClient.post(url, data)
  },
  verifyEmailForgotPassword : (data) => {
    const user_id = localStorage.getItem('user_id')
    console.log(user_id)
    const url = `api/v1/auth/update_forgot_password/${user_id}`
    return axiosClient.post(url, data)
  } 
}; 
  
export default authApi; 
