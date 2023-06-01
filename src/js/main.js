'use strict';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import * as batteryHelper from './battery.helper.js';

let batteryChart;
let battery = await batteryHelper.getBatteryInfo();
const batteryData = JSON.parse(localStorage.getItem('batteryData')) ?? [
  { x: Date.now(), y: battery.level * 100 },
];

window.addEventListener('load', async () => {
  const chargingText = document.getElementById('charging-text');
  addBatteryChart(batteryData);
  batteryHelper.changeBatteryLevelColor(battery);
  batteryHelper.updateTimeRemaining(battery);
  batteryHelper.setBatteryLevel(battery);
  batteryHelper.setBatteryPercentage(battery);
  //
  if (battery.charging) {
    batteryHelper.addBatteryThunder();
    chargingText.classList.replace('d-none', 'd-flex');
  } else {
    batteryHelper.removeBatteryThunder();
    chargingText.classList.replace('d-flex', 'd-none');
  }
  //
  battery.addEventListener('chargingchange', (event) => {
    if (event.currentTarget.charging) {
      batteryHelper.addBatteryThunder();
      chargingText.classList.replace('d-none', 'd-flex');
    } else {
      batteryHelper.removeBatteryThunder();
      chargingText.classList.replace('d-flex', 'd-none');
    }
  });
  //
  battery.addEventListener('levelchange', (event) => {
    batteryData.push({
      x: Date.now(),
      y: event.currentTarget.level * 100,
    });
    console.log(batteryData);
    localStorage.setItem('batteryData', JSON.stringify(batteryData));
    addBatteryChart(JSON.parse(localStorage.getItem('batteryData')));
    batteryHelper.updateTimeRemaining(event.currentTarget);
    batteryHelper.changeBatteryLevelColor(event.currentTarget);
    batteryHelper.setBatteryLevel(event.currentTarget);
    batteryHelper.setBatteryPercentage(event.currentTarget);
    if (event.currentTarget.level <= 0.15) {
      batteryHelper.sendLowChargeMsg();
    }
  });
  //   dark and light theme
  document.getElementById('moon').addEventListener('click', (event) => {
    event.target.classList.toggle('bxs-sun');
    document.body.classList.toggle('theme-dark');
  });
});


function addBatteryChart(batteryData) {
  if (batteryChart) {
    batteryChart.destroy();
  }
      let chartId = 'battery-chart-' + new Date().getTime();
      let data = {
        datasets: [
          {
            label: 'Battery Level',
            data: batteryData,
            borderWidth: 1,
          },
        ],
      };
      let config = {
        type: 'bar',
        data,
        options: {
          responsive: true,
          scales: {
            x: {
              parsing: false,
              type: 'time',
              time: {
                unit: 'minute',
                displayFormats: {
                  minute: 'MMM dd, HH:mm',
                },
              },
            },
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        },
        chartId: chartId
      };
      batteryChart = new Chart(document.getElementById('battery-chart'), config);
}


