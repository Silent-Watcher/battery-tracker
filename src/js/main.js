'use strict';
import { Chart  } from 'chart.js';
import 'chartjs-adapter-date-fns';
import * as batteryHelper from "./battery.helper.js";

const batteryData = [];

window.addEventListener('load', async () => {
  const chargingText = document.getElementById('charging-text');
  let battery = await batteryHelper.getBatteryInfo();
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
      level: event.currentTarget.level,
      timestamp: +Date.now(),
    });
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


