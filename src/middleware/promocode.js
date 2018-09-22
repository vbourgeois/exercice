const _ = require('lodash');
const consign = require('consign');
const { throwError } = require('src/utils/error');
const { RULE_NAMES } = require('src/spec/promocode');
const { getPromocode } = require('src/api/promocode');

const validators = {};

consign()
  .include('src/validator')
  .into(validators);

const checkPromocodeParamsMdw = (req, res, next) => {
  const advantage = _.get(req, 'body.advantage');
  const name = _.get(req, 'body.name');
  const rules = _.get(req, 'body.rules', []);
  const ruleNames = _.map(rules, 'name');
  const areRuleNamesValid = _.every(ruleNames, ruleName => _.includes(RULE_NAMES, ruleName));

  if (!advantage) {
    return throwError('BadRequest', 'You must provide a promocode advantage');
  }
  if (!_.isNumber(advantage)) {
    return throwError('BadRequest', 'advantage must be a number');
  }

  if (_.isEmpty(name)) {
    return throwError('BadRequest', 'You must provide a promocode name');
  }

  if (_.isEmpty(rules)) {
    return throwError('BadRequest', 'You must provide rules');
  }
  if (!areRuleNamesValid) {
    return throwError('BadRequest', `Some rule names are not valid: ${_.chain(ruleNames)
      .difference(RULE_NAMES)
      .join(', ')
      .value()
    }, possible values: ${_.join(RULE_NAMES, ', ')}`);
  }

  return next();
};

const checkRuleRestrictionsMdw = (req, res, next) => {
  const rules = _.get(req, 'body.rules', []);
  _.forEach(rules, (rule) => {
    const type = _.get(rule, 'name');
    const restrictions = _.get(rule, 'restrictions', []);

    if (_.isEmpty(restrictions)) {
      return throwError('BadRequest', `you must provide restrictions array for rule: ${type}`);
    }

    _.forEach(restrictions, (restriction) => {
      const checkFn = _.get(validators, ['src', 'validator', type, 'check']);
      checkFn(restriction);
    });
  });

  next();
};

const checkPromocodeRequestParamsMdw = (req, res, next) => {
  const name = _.get(req, 'params.name');
  const args = _.get(req, 'body.args', {});

  const promocode = getPromocode(name);
  const rules = _.get(promocode, 'rules', []);
  const ruleNames = _.map(rules, 'name');

  const areArgsValid = _.every(args, (argValue, argName) => _.includes(ruleNames, argName));

  if (!promocode) {
    return throwError('BadRequest', `promocode with name: ${name}, does not exist`);
  }
  if (_.isEmpty(args)) {
    return throwError('BadRequest', 'You must provide args');
  }
  if (!areArgsValid) {
    return throwError('BadRequest', `Some args props are not valid: ${_.chain(args)
      .keys()
      .difference(ruleNames)
      .join(', ')
      .value()
    }, possible values for this promocode: ${_.join(ruleNames, ', ')}`);
  }

  _.set(res, 'locals.promocode', promocode);

  next();
};

const checkValidationRulesMdw = async (req, res, next) => {
  const promocode = _.get(res, 'locals.promocode');
  const rules = _.get(promocode, 'rules', []);
  const args = _.get(req, 'body.args', {});

  for (const rule of rules) {
    const type = _.get(rule, 'name');
    const restrictions = _.get(rule, 'restrictions', []);
    const arg = _.get(args, type);

    const validateFn = _.get(validators, ['src', 'validator', type, 'validate']);

    await validateFn(arg, restrictions);
  }

  next();
};

module.exports.checkPromocodeParamsMdw = checkPromocodeParamsMdw;
module.exports.checkRuleRestrictionsMdw = checkRuleRestrictionsMdw;
module.exports.checkPromocodeRequestParamsMdw = checkPromocodeRequestParamsMdw;
module.exports.checkValidationRulesMdw = checkValidationRulesMdw;
