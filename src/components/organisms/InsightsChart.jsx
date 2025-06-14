import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';
import Card from '@/components/atoms/Card';
import { format, subDays, differenceInDays } from 'date-fns';

const InsightsChart = ({ entries = [], className = '' }) => {
  const [chartData, setChartData] = useState({
    cycleLengths: { series: [], options: {} },
    symptoms: { series: [], options: {} }
  });

  useEffect(() => {
    if (entries.length === 0) return;

    // Calculate cycle lengths
    const periodEntries = entries
      .filter(entry => entry.flow === 'heavy' || entry.flow === 'medium')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const cycleLengths = [];
    const cycleLabels = [];
    
    for (let i = 1; i < periodEntries.length; i++) {
      const currentDate = new Date(periodEntries[i].date);
      const prevDate = new Date(periodEntries[i - 1].date);
      const length = differenceInDays(currentDate, prevDate);
      
      if (length > 20 && length < 40) {
        cycleLengths.push(length);
        cycleLabels.push(format(prevDate, 'MMM'));
      }
    }

    // Calculate symptom frequency
    const symptomCounts = {};
    entries.forEach(entry => {
      if (entry.symptoms) {
        entry.symptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });

    const symptomData = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    setChartData({
      cycleLengths: {
        series: [{
          name: 'Cycle Length',
          data: cycleLengths
        }],
        options: {
          chart: {
            type: 'line',
            height: 300,
            toolbar: { show: false }
          },
          colors: ['#9C6FDE'],
          stroke: {
            curve: 'smooth',
            width: 3
          },
          xaxis: {
            categories: cycleLabels,
            labels: {
              style: { colors: '#6B7280' }
            }
          },
          yaxis: {
            title: {
              text: 'Days',
              style: { color: '#6B7280' }
            },
            labels: {
              style: { colors: '#6B7280' }
            },
            min: 20,
            max: 35
          },
          grid: {
            borderColor: '#E5E7EB'
          },
          markers: {
            size: 6,
            colors: ['#9C6FDE'],
            strokeWidth: 2,
            strokeColors: '#fff'
          }
        }
      },
      symptoms: {
        series: symptomData.map(([, count]) => count),
        options: {
          chart: {
            type: 'donut',
            height: 300
          },
          colors: ['#9C6FDE', '#F5A5C8', '#6B46C1', '#E9D5FF', '#C084FC', '#A855F7'],
          labels: symptomData.map(([symptom]) => 
            symptom.charAt(0).toUpperCase() + symptom.slice(1)
          ),
          legend: {
            position: 'bottom',
            labels: {
              colors: '#6B7280'
            }
          },
          plotOptions: {
            pie: {
              donut: {
                size: '60%'
              }
            }
          }
        }
      }
    });
  }, [entries]);

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Cycle Length Trend
          </h3>
          {chartData.cycleLengths.series[0]?.data.length > 0 ? (
            <ReactApexChart
              options={chartData.cycleLengths.options}
              series={chartData.cycleLengths.series}
              type="line"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="font-body">Not enough cycle data yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Keep tracking to see your trends
                </p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Common Symptoms
          </h3>
          {chartData.symptoms.series.length > 0 ? (
            <ReactApexChart
              options={chartData.symptoms.options}
              series={chartData.symptoms.series}
              type="donut"
              height={300}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="font-body">No symptoms tracked yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start logging symptoms to see patterns
                </p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default InsightsChart;