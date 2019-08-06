import axios from "axios";

const endpoint = window.env?window.env.apiUrl : 'http://localhost:3000/kue-api'
const execute = (method, url, data) => {
  let obj = {
    method,
    url,
    data
  };
  if (method === "get" && data) {
    obj = { ...obj, params: data };
  }
  console.log("obj", obj);
  return axios(obj)
    .then(res => {
    //   console.log("data", res.data);
      return res.data;
    })
    .catch(e => {
      return Promise.reject(e);
    });
};


let obj = {
  get(URL, query) {
    // console.log("endpoint", endpoint);
    return execute("get", endpoint + URL, query);
  },
  post(URL, data) {
    return execute("post", endpoint + URL, data);
  },
  delete(URL, id) {
    return execute("delete", endpoint + URL + "/" + id);
  },
  put(URL,id, data) {
    let url = endpoint + URL;
    if (id) {
      url += `/${id}`;
    }
    return execute("put", url, data);
  }
};
export default obj;
