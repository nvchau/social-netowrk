import axiosClient from "./axiosClient"; 

const messageApi = { 
  sendTextEmoji: ({token, groupId, type, content}) => {
    const url = `api/v1/groups/${groupId}/messages/text-emoji`
    
    return axiosClient.post(url, 
      {
        type, 
        content,
      },
      {
        headers: { 
          Authorization: token, 
        },
      }
    )
  },

  sendImage: ({token, groupId, image}) => {
    const url = `api/v1/groups/${groupId}/messages/image`

    const bodyFormData = new FormData()
    bodyFormData.append('image', image)
    
    return axiosClient.post(url, 
      bodyFormData,
      {
        headers: { 
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        },
      }
    )
  },
}; 
  
export default messageApi; 
