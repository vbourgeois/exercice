const _ = require('lodash');
const { throwError } = require('src/utils/error');
const { WEATHER } = require('src/spec/weather');
const { getLyonWeather } = require('src/service/weather');

const check = (restriction = {}) => {
  const is = _.get(restriction, 'is');
  const temp = _.get(restriction, 'temp');

  if (!is && !temp) {
    return throwError('BadRequest', 'meteo rule must contain is or temp attribute');
  }
  if (is && !_.includes(WEATHER, is)) {
    return throwError('BadRequest', `[meteo rule] is attribute not valid: ${is}, possible values: ${_.join(WEATHER, ', ')}`);
  }

  if (temp) {
    const gt = _.get(temp, 'gt');
    const lt = _.get(temp, 'lt');
    const eq = _.get(temp, 'eq');

    if (!gt && !lt && !eq) {
      return throwError('BadRequest', '[meteo rule] temp attribute must contain lt or gt or eq attributes');
    }

    _.forEach([gt, lt, eq], (attribute) => {
      if (attribute && !_.isNumber(attribute)) {
        return throwError('BadRequest', `[meteo rule] ${attribute} must be of type number`);
      }
    });
  }
};

const validate = async (arg, restrictions) => {
  const { is, temp } = await getLyonWeather();

  const isWeatherValid = _.some(restrictions, (restriction) => {
    if (restriction.is && is !== restriction.is) return false;

    if (restriction.temp) {
      const gt = _.get(restriction.temp, 'gt');
      const lt = _.get(restriction.temp, 'lt');
      const eq = _.get(restriction.temp, 'eq');

      if (gt && temp <= gt) return false;
      if (lt && temp >= lt) return false;
      if (eq && temp !== eq) return false;
    }

    return true;
  });

  if (!isWeatherValid) return throwError('BadRequest', 'weather is not valid');
};

module.exports.check = check;
module.exports.validate = validate;
