"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("../../../consts/index");

var _reactJwt = require("react-jwt");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// nhận data từ server
var initialState = [];

var store = function store() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _index.ACTION.GET_STORE:
      {
        console.log(action);
        state = [{
          data: action.data
        }, {
          selectValue: action.data[0].store_id
        }];
        console.log("|||222");
        return _toConsumableArray(state);
      }

    case _index.ACTION.SELECT_VALUE:
      {
        console.log(action);

        var array = _toConsumableArray(state);

        array[1].selectValue = action.data;
        console.log(array);
        console.log("______________555555"); // state = [{ data: action.data }, { selectValue: action.data[0].store_id }]
        // console.log("|||222")

        return _toConsumableArray(array);
      }

    default:
      return state;
  }
};

var _default = store;
exports["default"] = _default;