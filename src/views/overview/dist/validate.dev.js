"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var validate = function validate(values) {
  var errors = {};

  if (!values.clubName) {
    errors.clubName = 'Required';
  }

  if (!values.members || !values.members.length) {
    errors.members = {
      _error: 'At least one member must be entered'
    };
  } else {
    var membersArrayErrors = [];
    values.members.forEach(function (member, memberIndex) {
      var memberErrors = {};

      if (!member || !member.firstName) {
        memberErrors.firstName = 'Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }

      if (!member || !member.lastName) {
        memberErrors.lastName = 'Required';
        membersArrayErrors[memberIndex] = memberErrors;
      }

      if (member && member.hobbies && member.hobbies.length) {
        var hobbyArrayErrors = [];
        member.hobbies.forEach(function (hobby, hobbyIndex) {
          if (!hobby || !hobby.length) {
            hobbyArrayErrors[hobbyIndex] = 'Required';
          }
        });

        if (hobbyArrayErrors.length) {
          memberErrors.hobbies = hobbyArrayErrors;
          membersArrayErrors[memberIndex] = memberErrors;
        }

        if (member.hobbies.length > 5) {
          if (!memberErrors.hobbies) {
            memberErrors.hobbies = [];
          }

          memberErrors.hobbies._error = 'No more than five hobbies allowed';
          membersArrayErrors[memberIndex] = memberErrors;
        }
      }
    });

    if (membersArrayErrors.length) {
      errors.members = membersArrayErrors;
    }
  }

  return errors;
};

var _default = validate;
exports["default"] = _default;