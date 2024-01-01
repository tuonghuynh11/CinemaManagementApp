import axios from "axios";

const baseURL =
  "https://api.imgbb.com/1/upload?key=6273f1872fb797a00d79db3230630161";

const upload = axios.create({
  baseURL,
});

export const uploadimage = async (image) => {
    //console.log(image);
  const header = {
    "content-type": "multipart/form-data",
  };
  let body = new FormData();
  const file = {
    uri: image,
    type: 'image/jpeg',
    name: 'image.jpeg'
  }
  body.append("image", file);
  var res = await axios.post(`${baseURL}`, body, {
    headers: header
  })
  .then((reponse) => {
    //console.log(reponse.data);
    return reponse;
  })
  .catch((err) => {
    console.log("Error updating image:", err);
    return null;
  })
  return res;
};
