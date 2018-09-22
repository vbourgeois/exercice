const express = require('express');
const _ = require('lodash');
const { createPromocode } = require('src/api/promocode');
const {
  checkPromocodeParamsMdw,
  checkRuleRestrictionsMdw,
  checkPromocodeRequestParamsMdw,
  checkValidationRulesMdw,
} = require('src/middleware/promocode');
const asyncRequest = require('src/middleware/asyncRequest');

const router = express.Router();

router.post('/',
  checkPromocodeParamsMdw,
  checkRuleRestrictionsMdw,
  (req, res) => {
    const promocode = _.get(req, 'body');
    const createdPromocode = createPromocode(promocode);
    res.json(createdPromocode);
  });

router.post('/:name',
  checkPromocodeRequestParamsMdw,
  asyncRequest(checkValidationRulesMdw),
  (req, res) => {
    const promocode = _.get(res, 'locals.promocode', {});
    res.json({
      name: promocode.name,
      status: 'accepted',
      advantage: promocode.advantage,
    });
  });


module.exports = router;
