const _ = require('lodash');
const { promocodes } = require('src/db');
const { throwError } = require('src/utils/error');

const createPromocode = (promocode = {}) => {
  const exists = _.find(promocodes, { name: promocode.name });

  if (exists) {
    return throwError('BadRequest', `promocode name already exists: ${promocode.name}`);
  }

  promocodes.push(promocode);

  return promocode;
};

const getPromocode = (promocodeName) => {
  const promocode = _.find(promocodes, { name: promocodeName });

  if (!promocode) {
    return throwError('NotFound', `Unknown promocode name: ${promocodeName}`);
  }

  return promocode;
};

module.exports.createPromocode = createPromocode;
module.exports.getPromocode = getPromocode;
