const _ = require('lodash');
const moment = require('moment');
const { throwError } = require('src/utils/error');

const check = (restriction = {}) => {
  const after = _.get(restriction, 'after');
  const before = _.get(restriction, 'before');

  if (!after && !before) {
    return throwError('BadRequest', '[date rule] must contain after or before attributes');
  }

  _.forEach([after, before], (attribute) => {
    if (attribute) {
      const date = moment(attribute);

      if (!date.isValid()) {
        return throwError('BadRequest', `[date rule] you must provide a valid date: ${attribute}`);
      }
    }
  });
};

const validate = async (arg, restrictions) => {
  const isDateValid = _.some(restrictions, (restriction) => {
    const date = moment(arg);
    const after = moment(_.get(restriction, 'after'));
    const before = moment(_.get(restriction, 'before'));

    if (!date.isBefore(before)) return false;
    if (!date.isAfter(after)) return false;

    return true;
  });

  if (!isDateValid) return throwError('BadRequest', 'date is not valid');
};


module.exports.check = check;
module.exports.validate = validate;
