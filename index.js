const axios = require("axios");

const [name, type, unit] = process.argv.slice(2);
const apiKey = `9c116980cd34f1346e401f71e9263fee`;
let options = "";
if (unit === "c") options = `metric`;
else options = `imperial`;

let url = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${apiKey}&units=${options}`;

getWeatherData = async () => {
  try {
    const res = await axios.get(url);
    if (type === "now") printTodaysWeather(res.data.list[0], res.data.city);
    else if (type === "week") getAvgTempWeather(res.data.list, res.data.city);
  } catch (error) {
    console.log(`${name} is very busy at the moment. Please try again later`);
  }
};

printTodaysWeather = (weatherData, cityData) => {
  let res = `It is now ${weatherData.main.temp}C in ${cityData.name}, ${cityData.country}.
The current weather conditions are: ${weatherData.weather[0].description}`;
  console.log(res);
};

getAvgTempWeather = (weatherData, cityData) => {
  console.log(`Weekly overview for ${cityData.name}, ${cityData.country}`);
  const dt = weatherData.map(el => {
    const newEl = {
      temp: el.main.temp,
      date: el.dt_txt.slice(0, 10)
    };
    return newEl;
  });

  dt.reduce(myReducer, {
    cnt: 0,
    temp: 0,
    date: dt[0].date
  });
};

printOutWeather = dt => {
  console.log(`The temp for ${dt.date} is ${dt.temp / dt.cnt}`);
};

myReducer = (acc, cur, index, arr) => {
  // I am still in the same day
  if (cur.date === acc.date) {
    //add this temp
    acc.temp += cur.temp;
    acc.cnt++;
    if (index == arr.length - 1) printOutWeather(acc);
  } else {
    // A new days i born
    printOutWeather(acc);

    acc = {
      cnt: 0,
      temp: 0,
      date: cur.date
    };
  }

  return acc;
};

getWeatherData();
