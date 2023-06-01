'use strict';

window.addEventListener('load', async () => {
  const chargingText = document.getElementById('charging-text');
  let battery = await getBatteryInfo();
  //
  setBatteryLevel(battery);
  setBatteryPercentage(battery);
  //
  if (battery.charging) addBatteryThunder();
  else removeBatteryThunder();
  //
  battery.addEventListener('chargingchange', (event) => {
    if (event.currentTarget.charging) {
      addBatteryThunder();
      chargingText.classList.replace('d-none', 'd-flex');
    } else {
      removeBatteryThunder();
      chargingText.classList.replace('d-flex', 'd-none');
    }
  });
  //
  battery.addEventListener('levelchange', (event) => {
    changeBatteryLevelColor(event.currentTarget);
    setBatteryLevel(event.currentTarget);
    setBatteryPercentage(event.currentTarget);
    if(event.currentTarget.level <= 0.15){
        sendLowChargeMsg();
    }
  });
  //   dark and light theme
  document.getElementById('moon').addEventListener('click', (event) => {
    event.target.classList.toggle('bxs-sun');
    document.body.classList.toggle('theme-dark');
  });
});

async function getBatteryInfo() {
  if (navigator.getBattery) {
    let battery = await navigator.getBattery();
    return battery;
  } else {
    alert('getBattery api not supported');
    return new Error('battery api not supported !');
  }
}

function setBatteryLevel(battery) {
  const batteryLevel = document.getElementById('battery-level');
  batteryLevel.style.width = `${battery.level * 100}%`;
}

function setBatteryPercentage(battery) {
  const batteryPercentage = document.getElementById('battery-percentage');
  batteryPercentage.textContent = `${battery.level * 100}%`;
}

function addBatteryThunder() {
  const batteryThunder = document.getElementById('battery-thunder');
  batteryThunder.hidden = false;
}

function removeBatteryThunder() {
  const batteryThunder = document.getElementById('battery-thunder');
  batteryThunder.hidden = true;
}

function changeBatteryLevelColor(battery) {
  const batteryLevel = document.getElementById('battery-level');
  if (battery.level > 0.6) batteryLevel.style.backgroundColor = '#34c759';
  else if (battery.level > 0.15 || battery.level <= 0.6)
    batteryLevel.style.backgroundColor = '#ffcc0a';
  else batteryLevel.style.backgroundColor = '#ff3b30';
}

function sendLowChargeMsg() {
  alert('low battery \n charge your battery');
}
