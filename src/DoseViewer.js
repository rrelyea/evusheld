import React from 'react';
import Papa from 'papaparse';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController,
  } from "chart.js";
import { Chart } from 'react-chartjs-2';

class DoseViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableData: [],
            allottedData: [],
            doseInfo: null,
            chartData:
            {
              labels: [],
              datasets: [{
                data: [], 
                label: "Doses Available (in stock)",
                borderColor: '#3e95cd',
                backgroundColor: 'lightblue',
                fill: false,}]
            },
            chartOptions: 
            {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 10,
                                },
                        }
                    }
                },
            }
        }
    }

    async toCsv(uri) {
      return new Promise((resolve, reject) => {
        Papa.parse(uri, {
          download: true,
          complete (results, file) {
            resolve(results.data)
          },
          error (error, file) {
            resolve(null)
          }
        })
      })
    }

    async loadDoseInfo() {
        var baseUrl = "https://raw.githubusercontent.com/rrelyea/evusheld-locations-history/main/data/dose-details/";
        this.setState({doseInfo:await this.toCsv(baseUrl + this.props.zipCode + ".csv")})
    }

    GetDate(date,start=0) {
      if (date === null || date === undefined || date === "") return null;
      return date.substring(start,start+5);
    }
    
    GetDoses(dose) {
      if (dose === null || dose === undefined || dose === "") return null;
      return dose;
    }

    async componentDidMount () {
        ChartJS.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
        await this.loadDoseInfo();
        
        var j = 0;
        for (var i = 0; i < this.state.doseInfo.length; i++) {
            var provider = this.state.doseInfo[i][2] !== undefined ? this.state.doseInfo[i][2].replaceAll('-', ' ') : null;
            var reportDate = this.GetDate(this.state.doseInfo[i][0], 5);
            var available = this.GetDoses(this.state.doseInfo[i][6]);
            var allotted = this.GetDoses(this.state.doseInfo[i][5]);

            if (provider != null && provider.toUpperCase() === this.props.provider.toUpperCase() && reportDate !== null && (available !== null || allotted != null)) {
              this.state.chartData.labels[j] = this.props.mini !== 'true' ? reportDate : "";
              this.state.availableData[j] = available;
              this.state.allottedData[j] = allotted;
              j = j + 1;
            }
        }

        this.state.chartData.datasets = [{
          data: this.state.availableData,
          label: this.props.mini !== 'true' ? "Doses Available (in stock)" : this.props.available + " Avail",
          borderColor: '#00DD00',
          backgroundColor: '#00FF00',
          fill: false,
        },
        {
          data: this.state.allottedData,
          label: this.props.mini !== 'true' ? "Cumulative Allotted (from State)" : this.props.allotted + " Allotted",
          borderColor: '#3e95cd',
          backgroundColor: 'lightblue',
          fill: false,
        }];
        this.setState({chartData:this.state.chartData});
        this.setState({chartOptions:this.state.chartOptions})
      }


    getDoses () {
        return this.state.doseInfo[3][2];
    }

    render() {
        return (
        <>
          <div id='doses' style={this.style}>
            <Chart type='line' id='chart' height={this.props.mini === 'true' ? 150 : 300} data={this.state.chartData} options={this.state.chartOptions} />
          </div>
        </>
        );
      }
}

export default DoseViewer;