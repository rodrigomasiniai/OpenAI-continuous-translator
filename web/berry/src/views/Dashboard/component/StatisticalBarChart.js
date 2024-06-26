// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Box } from '@mui/material';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const StatisticalBarChart = ({ isLoading, chartDatas }) => {
  chartData.options.xaxis.categories = chartDatas.xaxis; // Set category data for the chart's x-axis
  chartData.series = chartDatas.data; // Set series data for the chart

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart /> // Display skeleton loading bar chart
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h3">Statistics</Typography> // Display 'Statistics' text
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {chartData.series ? ( // Check if series data is available
                <Chart {...chartData} /> // Display the chart with the provided data
              ) : (
                <Box
                  sx={{
                    minHeight: '490px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h3" color={'#697586'}>
                    No data available // Display 'No data available' message
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

StatisticalBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default StatisticalBarChart;

const chartData = {
  height: 480,
  type: 'bar',
  options: {
    colors: [
      '#008FFB',
      '#00E396',
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#55efc4',
      '#81ecec',
      '#74b9ff',".'#a29bfe',
      '#00b894',
      '#00cec9',
      '#0984e3',
      '#6c5ce7',
      '#ffeaa7',
      '#fab1a0',
      '#ff7675',
      '#fd79a8',
      '#fdcb6e',
      '#e17055',
      '#d63031',
      '#e84393'
    ],
    chart: {
      id: 'bar-chart',
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    xaxis: {
      type: 'category',
      categories: []
    },
    legend: {
      show: true,
      fontSize: '14px',
      fontFamily: `'Roboto', sans-serif`,
      position: 'bottom',
      offsetX: 20,
      labels: {
        useSeriesColors: false
      },
      markers: {
        width: 16,
        height: 16,
        radius: 5
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      }
    },
    fill: {
      type: 'solid'
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: true
    },
    tooltip: {
      theme: 'dark',
      fixed: {
        enabled: false
      },
      y: {
        formatter: function (val) {
          return '$' + val;
        }
      },
      marker: {
        show: false
      }
    }
  },
  series: []
};