import axiosClient from "./axiosClient"; 

const groupChatApi = { 
  getAllGroupByUser: (token) => { 
    const url = "api/v1/groups"; 
    
    return axiosClient.get(url, {
        headers: { 
            Authorization: token, 
        }
    }); 
  },

  createGroup: ({token, name, members}) => {
    const url = `api/v1/groups`
    
    return axiosClient.post(url, 
      {
        name,
        members
      },
      {
        headers: { 
          Authorization: token, 
        },
      }
    )
  },

  deleteGroup: ({token, groupId}) => {
    const url = `api/v1/groups/${groupId}`
    
    return axiosClient.delete(url, 
      {
        headers: { 
          Authorization: token, 
        },
      }
    )
  },
}; 
  
export default groupChatApi; 
