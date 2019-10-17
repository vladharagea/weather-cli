// const axios = require('axios');

// const cityName = process.argv[2];

////////////////////////////////////////////////
/////////////////////API Key is missing/////////
////////////////////////////////////////////////


// apiKey = ``;

// const weatherAPIUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=${apiKey}fee&units=metric`;

// getWeather = async () => {
//     return await axios.get(weatherAPIUrl);
// }

// getWeather()
//     .then(res => {

//         const data = res.data;
//         getCurrentDayForecast(data);
//         getFiveDayForecast(data);

//     })
//     .catch(err => {
//         console.log(err);
//     });

// getCurrentDayForecast = (data) => {
//     const dt1 = data.list[0].dt_txt.slice(0, 10);
//     const weather = data.list[0].weather[0].main;
//     const weatherDescription = data.list[0].weather[0].description;
//     const temperature = data.list[0].main.temp;
//     const country = data.city.country;
//     console.log(`For ${dt1}`);
//     console.log(`It is now ${temperature}°C in ${cityName}, ${country}`);
//     console.log(`The current weather conditions are : ${weather}(${weatherDescription})`);
// };

// getFiveDayForecast = (data) => {

//     let arr = data.list;
//     for (let i = 0; i <= arr.length; i++)
//         if (i == 0)
//             console.log(arr[i].dt_txt)
//     else {
//         if ((arr[i].dt - arr[0].dt) % 86400 == 0) {
//             console.log(arr[i].dt_txt)
//         }
//     }
// }


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
///////////////////////////Vasilis Solution/////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const axios = require('axios');

const [name, type] = process.argv.slice(2);


////////////////////////////////////////////////
/////////////////////API Key is missing/////////
////////////////////////////////////////////////

const apiKey = ``;


let url = `http://api.openweathermap.org/data/2.5/forecast?q=${name}&APPID=${apiKey}fee&units=metric`


// axios
//     .get(url)
//     .then(res => {
//         console.log(`I am axios promise`)
//         printResults(res.data);
//     }).catch(err => {
//         console.log(`${name} os a very busy at the moment. Please try again later.`);
//     });

//getWeatherData = async () => {};
async function getWeatherData() {
    try {
        const res = await axios.get(url);
        if (type === 'now')
            printTodaysWeather(res.data.list[0], res.data.city);
        // console.log(`I am await`)
        else if (type === 'week')
            printWeeksWeather(res.data.list, res.data.city);
    } catch (error) {
        console.log(error);
    }
};

printTodaysWeather = (weatherData, cityData) => {

    let res = `It is now ${weatherData.main.temp}°C in ${cityData.name}, ${cityData.country}
                The current weather conditions are : ${weatherData.weather[0].description}`
    console.log(res);
};


printWeeksWeather = (weatherData, cityData) => {
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
    // I am still still in the same day
    if (cur.date === acc.date) {
        //add this temp
        acc.temp += cur.temp
        acc.cnt++;
        if (index == arr.length - 1) printOutWeather(acc);
    } else {
        // A new day is born
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