import axiosClient from "./axiosClient"; 

const friendApi = { 
  getAllFriend: (token) => {  
    const url = "api/v1/friends"; 

    return axiosClient.get(url, { 
      headers: { 
        Authorization: token, 
      }, 
    }); 
  }, 

  getAllFriendRequest: (token) => {  
    const url = "api/v1/friends/requests"; 

    return axiosClient.get(url, { 
      headers: { 
        Authorization: token, 
      }, 
    }); 
  }, 

  getAllUser: () => {  
    const url = "api/v1/friends/users"; 

    return axiosClient.get(url); 
  },

  addFriend: ({token, userId}) => {
    const url = `api/v1/friends/request/${userId}`;
    
    return axiosClient.post(url, {}, { 
      headers: { 
        Authorization: token, 
      }, 
    });
  },

  acceptFriend: ({token, receiverId}) => {
    const url = `api/v1/friends/accept/${receiverId}`;
    
    return axiosClient.post(url, {}, { 
      headers: { 
        Authorization: token, 
      }, 
    });
  },

  rejectFriend: ({token, senderId}) => {
    const url = `api/v1/friends/delete_req_receiver/${senderId}`;
    
    return axiosClient.delete(url, { 
      headers: { 
        Authorization: token, 
      }, 
    });
  },

  deleteFriendRequest: ({token, receiverId}) => {
    const url = `api/v1/friends/delete_req_sender/${receiverId}`;
    
    return axiosClient.delete(url, { 
      headers: { 
        Authorization: token, 
      }, 
    });
  },

  deleteFriendBySender: ({token, receiverId}) => {
    const url = `api/v1/friends/delete_friend_sender/${receiverId}`;
    
    return axiosClient.delete(url, { 
      headers: { 
        Authorization: token, 
      }, 
    });
  },

  deleteFriendByReceiver: ({token, senderId}) => {
    const url = `api/v1/friends/delete_friend_receiver/${senderId}`;
    
    return axiosClient.delete(url, { 
      headers: { 
        Authorization: token, 
      }, 
    });
  },
}

export default friendApi; 