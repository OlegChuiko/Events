const events = require('events');
const fs = require('fs');
const readline = require('readline');

const eventEmitter = new events.EventEmitter();

// Event 1: Save temperature data to file
eventEmitter.on('saveTempData', (date, temp) => {
  const data = {
    date: date,
    temperature: temp
  };
  const jsonData = JSON.stringify(data);

  fs.writeFile('tempData.json', jsonData, (err) => {
    if (err) throw err;
    console.log(`Temperature data saved for ${date}`);
    eventEmitter.emit('checkTemp', temp); // trigger check temperature event
  });
});

// Event 2: Calculate average temperature for given date
eventEmitter.on('calcAvgTemp', (date) => {
  let sum = 0;
  let count = 0;

  const rl = readline.createInterface({
    input: fs.createReadStream('tempData.json')
  });

  rl.on('line', (line) => {
    const data = JSON.parse(line);

    if (data.date === date) {
      sum += data.temperature;
      count++;
    }
  });

  rl.on('close', () => {
    const avgTemp = sum / count;
    console.log(`Average temperature for ${date}: ${avgTemp}`);
  });
});

// Event 3: Check if temperature is higher than 30 degrees
eventEmitter.on('checkTemp', (temp) => {
  if (temp > 30) {
    console.log('Temperature is higher than 30 degrees');
  }
});

// Trigger save temperature data event
eventEmitter.emit('saveTempData', '2023-04-30', 32);

// Trigger calculate average temperature event
eventEmitter.emit('calcAvgTemp', '2023-04-30');
