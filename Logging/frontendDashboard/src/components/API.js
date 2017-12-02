import axios from 'axios';

//const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3300';

// http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/paymentcount
// http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/totalrevenue
// http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/paymentdata
//
//
// Useractivity api.
// http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/logincount
// http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/signupcount
// http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/useractivitydata
//


const api = 'http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/'

const headers = {
    'Accept': 'application/json'
};


export const getPaymentCount = () =>

    axios.get(api + '/paymentcount')
        .then(res => {
            console.log('response from getPaymentCount', res.data);
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getTotalRevenue = () =>
axios.get(api + '/totalrevenue')
    .then(res => {
        console.log('response from getTotalRevenue', res.data);
        return res;
    })
    .catch(error => {
        console.log("This is error");
        return error;
    });

export const getPaymentData = () =>
  axios.get(api + '/paymentdata')
      .then(res => {
          console.log('response from getPaymentData', res.data);
          return res;
      })
      .catch(error => {
          console.log("This is error");
          return error;
      });


//Getting useractivity data.

export const getLoginCount = () =>

    axios.get(api + '/logincount')
        .then(res => {
            console.log('response from getLoginCount', res.data);
            return res;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const getSignupCount = () =>
axios.get(api + '/signupcount')
    .then(res => {
        console.log('response from getSignupCount', res.data);
        return res;
    })
    .catch(error => {
        console.log("This is error");
        return error;
    });


export const getUserData = () =>
  axios.get(api + '/useractivitydata')
      .then(res => {
          console.log('response from getUserData', res.data);
          return res;
      })
      .catch(error => {
          console.log("This is error");
          return error;
      });
