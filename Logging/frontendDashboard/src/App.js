import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import axios from 'axios';
import Chart from './components/Chart';
import CartChart from './components/CartChart';
import API from './components/API';
import PageViewChart from './components/PageViewChart'


class App extends Component {
  constructor(){
    super();
    this.state = {
      chartBookingData:{},
      chartRevenueData:{},
      cartData:{},
      novCartBookings:{},
      cartCompanyData:{},
      pageClicksData:{},
      paymentsData:{},
    }
  }

  componentWillMount(){
    this.getChartData();
    // this.getPaymentCount();
    // this.getLoginCount();
    // this.getSignupCount();

  }


  // getPaymentCount(){
  //   var labels=[];
  //       var data=[];
  //       API.getPaymentCount()
  //           .then(res => {
  //               data.push(res);
  //           })
  //           .then(
  //               this.setState({
  //                   // The Main Chart Data Goes here.
  //                   pageClicksData: {
  //                       labels: labels,
  //                       datasets: [
  //                           {
  //                               label: 'Page clicks',
  //                               data: data,
  //                               backgroundColor: [
  //                                   'rgba(255, 99, 132, 0.6)',
  //                                   'rgba(54, 162, 235, 0.6)',
  //                                   'rgba(255, 206, 86, 0.6)'
  //                               ]
  //                           }
  //                       ]
  //                   }
  //               })
  //
  //           );
  // }




  // getLoginCount(){}
  // getSignupCount(){}
  //
  // getPaymentData(){}
  // getTotalRevenue(){}
  // getUserData(){}

  getChartData(){
    // Ajax calls here
    var dataT = [];
    var signupcount= [];
    var logincount= [];
    var paymentcount=[];

    // dataT.push($.ajax{url:"http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/paymentcount"}.then(function(data){
    //   dataT.push(data);
    // }));
    // console.log(dataT);

    axios.get("http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/paymentcount").then(function(result) {
    // we got it!
    //console.log(result);
    dataT.push(result);
  });

  axios.get("http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/logincount").then(function(result) {
  // we got it!
  //console.log(result);
  dataT.push(result);
});

axios.get("http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/signupcount").then(function(result) {
// we got it!
//console.log(result);
dataT.push(result);
});

  axios.get("http://ec2-54-183-181-217.us-west-1.compute.amazonaws.com:3000/paymentcount")
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


    this.setState({
      // The Main Chart Data Goes here.


      pageClicksData: {
          labels: ['New Signup', 'Login', 'Payments'],
          datasets: [
              {
                  label: 'Page clicks',
                  data: [
                    3,
                    27,
                    15,
                  ],
                  //data: dataT,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)'
                  ]
              }
          ]
      },


      paymentsData:{
        labels: ['5', '10', '15', '20', '25', '30'],
        datasets:[
          {
            label:'Days in November',
            data:[
              43,
              2,
              23,
              29,
              8,
              34,
            ],
            backgroundColor:[
              'rgba(123, 122, 255, 0.6)',
            ]
          }
        ]
      },



      chartBookingData:{
        labels: ['Single', 'Shared', 'Cancelled'],
        datasets:[
          {
            label:'Order Types',
            data:[
              44,
              21,
              10
            ],
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)'
            ]
          }
        ]
      },

      chartRevenueDataData:{
        labels: ['Single', 'Shared', 'Group'],
        datasets:[
          {
            label:'Revenue Types',
            data:[
              62,
              26,
              12
            ],
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)'
            ]
          }
        ]
      },


      // Cart Analytics Data

      cartData:{
        labels: ['Chocolates', 'Ice Cream', 'Gatorade', 'Milk', 'Butter', 'Bread', 'Cupcake', 'Beer','Cheese'],
        datasets:[
          {
            label:'Cities',
            data:[
              58,
              53,
              46,
              40,
              37,
              32,
              28,
              24,
              20,
            ],
            backgroundColor:[
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 192, 64, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 55, 0.6)',
              'rgba(255, 192, 64, 0.6)',

            ]
          }
        ]
      },

      novCartBookings:{
        labels: ['5', '10', '15', '20', '25', '30'],
        datasets:[
          {
            label:'Days in November',
            data:[
              199,
              252,
              191,
              160,
              303,
              100
            ],
            backgroundColor:[
              'rgba(153, 102, 255, 0.6)',
            ]
          }
        ]
      },

      //Can add more chart data here.

    });
  }

  render() {
    return (
      <div className="App">
      <div className="App-header">
        <h1 className="App-title">Ninja Analytics Dashboard</h1>
      </div>

      <PageViewChart pageClicksData={this.state.pageClicksData}
            paymentsData={this.state.paymentsData}
            legendPosition="bottom"/>

      <Chart chartBookingData={this.state.chartBookingData}
             chartRevenueDataData={this.state.chartRevenueDataData}
             legendPosition="bottom"/>


        <CartChart cartData={this.state.cartData}
              novCartBookings={this.state.novCartBookings}
              legendPosition="bottom"/>

        <div>{this.state.dataT}</div>

      </div>
    );
  }
}

export default App;
