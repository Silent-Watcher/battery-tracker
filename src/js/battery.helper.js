'use strict';

export async function getBatteryInfo() {
  if (navigator.getBattery) {
    let battery = await navigator.getBattery();
    return battery;
  } else {
    alert('getBattery api not supported');
    return new Error('battery api not supported !');
  }
}

export function setBatteryLevel(battery) {
  const batteryLevel = document.getElementById('battery-level');
  batteryLevel.style.width = `${battery.level * 100}%`;
}

export function setBatteryPercentage(battery) {
  const batteryPercentage = document.getElementById('battery-percentage');
  batteryPercentage.textContent = `${battery.level * 100}%`;
}

export function addBatteryThunder() {
  const batteryThunder = document.getElementById('battery-thunder');
  batteryThunder.hidden = false;
}

export function removeBatteryThunder() {
  const batteryThunder = document.getElementById('battery-thunder');
  batteryThunder.hidden = true;
}

export function changeBatteryLevelColor(battery) {
  const batteryLevel = document.getElementById('battery-level');
  if (battery.level > 0.6) batteryLevel.style.backgroundColor = '#34c759';
  else if (battery.level > 0.15 && battery.level <= 0.6)
    batteryLevel.style.backgroundColor = '#ffcc0a';
  else if (battery.level <= 0.15) {
    batteryLevel.style.backgroundColor = '#ff3b30';
  }
}

export function sendLowChargeMsg() {
  alert('low battery \n charge your battery');
}

export function updateTimeRemaining(battery) {
  if (battery.charging) {
    let timeRemaining = (1 - battery.level) * battery.chargingTime;
    let timeRemainingFormatted = formatTime(timeRemaining);
    document.getElementById('battery-status').textContent =
      timeRemainingFormatted + ' time Remaining';
  } else {
    let timeRemaining = +battery.level * +battery.dischargingTime;
    let timeRemainingFormatted = formatTime(timeRemaining);
    document.getElementById('battery-status').textContent =
      timeRemainingFormatted + ' time left';
  }
}

export function formatTime(timeInSeconds) {
  var hours = Math.floor(+timeInSeconds / 3600);
  var minutes = Math.floor((+timeInSeconds % 3600) / 60);
  return hours + 'h ' + minutes + 'min';
}
