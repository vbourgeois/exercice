const _ = require('lodash');
const { throwError } = require('src/utils/error');

const check = (restriction = {}) => {
  const gt = _.get(restriction, 'gt');
  const lt = _.get(restriction, 'lt');
  const eq = _.get(restriction, 'eq');

  if (!gt && !lt && !eq) {
    return throwError('BadRequest', '[age rule] must contain lt or gt or eq attributes');
  }

  _.forEach([gt, lt, eq], (attribute) => {
    if (attribute && !_.isNumber(attribute)) {
      return throwError('BadRequest', `[age rule] ${attribute} must be of type number`);
    }
  });
};

const validate = async (arg, restrictions) => {
  const isAgeValid = _.some(restrictions, (restriction) => {
    const gt = _.get(restriction, 'gt');
    const lt = _.get(restriction, 'lt');
    const eq = _.get(restriction, 'eq');

    if (gt && arg <= gt) return false;
    if (lt && arg >= lt) return false;
    if (eq && arg !== eq) return false;

    return true;
  });

  if (!isAgeValid) return throwError('BadRequest', 'age is not valid');
};

module.exports.validate = validate;
module.exports.check = check;
