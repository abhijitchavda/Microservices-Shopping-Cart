import React, {Component} from 'react';
import {Bar, Line, Pie, HorizontalBar} from 'react-chartjs-2';

class CartChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      cartData:props.cartData,
      novCartBookings:props.novCartBookings,
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
                data={this.state.cartData}
                width={70}
                height={70}
                options={{
                  title:{
                    display:this.props.displayTitle,
                    text:'Most Popular Products.',
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
                data={this.state.novCartBookings}
                width={70}
                height={70}
                options={{
                  title:{
                    display:this.props.displayTitle,
                    text:'Product Sales in November(Number) ',
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

export default CartChart;
