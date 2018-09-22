const _ = require('lodash');
const axios = require('axios');

const getLyonWeather = async (id = 2996943) => {
  const { data } = await axios
    .get(`http://api.openweathermap.org/data/2.5/weather?id=${id}&appid=d0562f476913da692a065c608d0539f6&units=metric`);

  return {
    is: _.chain(data)
      .get('weather[0].main')
      .lowerCase()
      .value(),
    temp: _.chain(data)
      .get('main.temp')
      .round()
      .value(),
  };
};

module.exports.getLyonWeather = getLyonWeather;
