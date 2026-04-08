const axios = require("axios");

axios.post("http://localhost:3001/analyze", {
  text: "This paper proposes a machine learning system"
})
.then(res => console.log(res.data))
.catch(err => console.log(err));