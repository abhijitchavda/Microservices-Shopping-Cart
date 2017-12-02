import React, {Component} from 'react';
import {Bar, Line, Pie, HorizontalBar} from 'react-chartjs-2';

class dataComp extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageClicksData:props.pageClicksData,
      paymentsData:props.paymentsData,
    }
  }

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right'
  }

  render(){
    return (
      <div className="chart">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <Bar
                data={this.state.pageClicksData}
                width={70}
                height={70}
                options={{
                  title:{
                    display:this.props.displayTitle,
                    text:'Views Per Page.',
                    fontSize:15
                  },
                  legend:{
                    display:this.props.displayLegend,
                    position:this.props.legendPosition
                  }
                }}
              />
            </div>

            <div className="col-lg-6">
            <Line
              data={this.state.paymentsData}
              width={70}
              height={70}
              options={{
                title:{
                  display:this.props.displayTitle,
                  text:'Payments in November. ',
                  fontSize:15
                },
                legend:{
                  display:this.props.displayLegend,
                  position:this.props.legendPosition
                }
              }}
            />

            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">

            </div>

            <div className="col-lg-6">

            </div>

            </div>
        </div>
      </div>
    )
  }
}

export default dataComp;
