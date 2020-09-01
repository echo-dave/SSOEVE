        import axios from 'axios';

        function post (endpoint) {
            return axios.post(`https://esi.evetech.net/latest/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
                }
            })

         } 
        
         function get (endpoint,token) {
            return axios.get(`https://esi.evetech.net/latest/${endpoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

         }

         function refresh (charID){
             return axios.get(`/api/refresh/${charID}`)
         }

        export {post, get, refresh}