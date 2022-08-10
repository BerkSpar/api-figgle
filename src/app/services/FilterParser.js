import { Op } from 'sequelize';

class FilterParser {
  isObject(o) {
    return o instanceof Object && o.constructor === Object;
  }

  isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }

  replacer(obj) {
    var operatorsMap = {
      or: Op.or,
      and: Op.and,
      like: Op.like,
      not: Op.not,
      eq: Op.eq,
      gte: Op.gte,
      lte: Op.lte,
    };

    var newObj = {};
    for (var key in obj) {
      var value = obj[key];

      if (this.isObject(value)) {
        newObj[key] = this.replacer(value);
      } else if (operatorsMap[key]) {
        var op = operatorsMap[key];

        if (op == Op.like) {
          newObj[op] = '%' + value + '%';
        } else if (this.isArray(value)) {
          var list = [];
          for (var item in value) {
            list.push(this.replacer(value[item]));
          }
          newObj[op] = list;
        } else {
          newObj[op] = value;
        }
      } else {
        newObj[key] = value;
      }
    }

    return newObj;
  }
}

export default new FilterParser();
