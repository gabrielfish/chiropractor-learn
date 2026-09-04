import { r as reactExports, R as React } from "./react.mjs";
import { P as PropTypes } from "./prop-types.mjs";
function edit(value, caret, operation) {
  switch (operation) {
    case "Backspace":
      if (caret > 0) {
        value = value.slice(0, caret - 1) + value.slice(caret);
        caret--;
      }
      break;
    case "Delete":
      value = value.slice(0, caret) + value.slice(caret + 1);
      break;
  }
  return {
    value,
    caret
  };
}
function parse(text, caret_position, parse_character) {
  var context = {};
  var value = "";
  var focused_input_character_index = 0;
  var index = 0;
  while (index < text.length) {
    var character = parse_character(text[index], value, context);
    if (character !== void 0) {
      value += character;
      if (caret_position !== void 0) {
        if (caret_position === index) {
          focused_input_character_index = value.length - 1;
        } else if (caret_position > index) {
          focused_input_character_index = value.length;
        }
      }
    }
    index++;
  }
  if (caret_position === void 0) {
    focused_input_character_index = value.length;
  }
  var result = {
    value,
    caret: focused_input_character_index
  };
  return result;
}
function _createForOfIteratorHelperLoose$1(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function count_occurences(symbol, string) {
  var count = 0;
  for (var _iterator = _createForOfIteratorHelperLoose$1(string.split("")), _step; !(_step = _iterator()).done; ) {
    var character = _step.value;
    if (character === symbol) {
      count++;
    }
  }
  return count;
}
function closeBraces(retained_template, template) {
  var placeholder = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "x";
  var empty_placeholder = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : " ";
  var cut_before = retained_template.length;
  var opening_braces = count_occurences("(", retained_template);
  var closing_braces = count_occurences(")", retained_template);
  var dangling_braces = opening_braces - closing_braces;
  while (dangling_braces > 0 && cut_before < template.length) {
    retained_template += template[cut_before].replace(placeholder, empty_placeholder);
    if (template[cut_before] === ")") {
      dangling_braces--;
    }
    cut_before++;
  }
  return retained_template;
}
function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);
  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) {
    if (it) o = it;
    var i = 0;
    return function() {
      if (i >= o.length) return { done: true };
      return { done: false, value: o[i++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
function template_formatter(template) {
  var placeholder = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "x";
  var shouldCloseBraces = arguments.length > 2 ? arguments[2] : void 0;
  if (!template) {
    return function(value) {
      return {
        text: value
      };
    };
  }
  var placeholdersCountInTemplate = count_occurences(placeholder, template);
  return function(value) {
    if (!value) {
      return {
        text: "",
        template
      };
    }
    var characterIndexInValue = 0;
    var templateWithFilledInPlaceholders = "";
    for (var _iterator = _createForOfIteratorHelperLoose(template.split("")), _step; !(_step = _iterator()).done; ) {
      var character = _step.value;
      if (character !== placeholder) {
        templateWithFilledInPlaceholders += character;
        continue;
      }
      templateWithFilledInPlaceholders += value[characterIndexInValue];
      characterIndexInValue++;
      if (characterIndexInValue === value.length) {
        if (value.length < placeholdersCountInTemplate) {
          break;
        }
      }
    }
    if (shouldCloseBraces) {
      templateWithFilledInPlaceholders = closeBraces(templateWithFilledInPlaceholders, template);
    }
    return {
      text: templateWithFilledInPlaceholders,
      template
    };
  };
}
function format(value, caret, formatter) {
  if (typeof formatter === "string") {
    formatter = template_formatter(formatter);
  }
  var _ref = formatter(value) || {}, text = _ref.text, template = _ref.template;
  if (text === void 0) {
    text = value;
  }
  if (template) {
    if (caret === void 0) {
      caret = text.length;
    } else {
      var index = 0;
      var found = false;
      var possibly_last_input_character_index = -1;
      while (index < text.length && index < template.length) {
        if (text[index] !== template[index]) {
          if (caret === 0) {
            found = true;
            caret = index;
            break;
          }
          possibly_last_input_character_index = index;
          caret--;
        }
        index++;
      }
      if (!found) {
        caret = possibly_last_input_character_index + 1;
      }
    }
  }
  return {
    text,
    caret
  };
}
function isReadOnly(element) {
  return element.hasAttribute("readonly");
}
function getSelection(element) {
  if (element.selectionStart === element.selectionEnd) {
    return;
  }
  return {
    start: element.selectionStart,
    end: element.selectionEnd
  };
}
var Keys = {
  Backspace: 8,
  Delete: 46
};
function getOperation(event) {
  switch (event.keyCode) {
    case Keys.Backspace:
      return "Backspace";
    case Keys.Delete:
      return "Delete";
  }
}
function getCaretPosition(element) {
  return element.selectionStart;
}
function setCaretPosition(element, caret_position) {
  if (caret_position === void 0) {
    return;
  }
  if (isAndroid()) {
    setTimeout(function() {
      return element.setSelectionRange(caret_position, caret_position);
    }, 0);
  } else {
    element.setSelectionRange(caret_position, caret_position);
  }
}
function isAndroid() {
  if (typeof navigator !== "undefined") {
    return ANDROID_USER_AGENT_REG_EXP.test(navigator.userAgent);
  }
}
var ANDROID_USER_AGENT_REG_EXP = /Android/i;
function onChange(event, input, _parse, _format, on_change) {
  formatInputText(input, _parse, _format, void 0, on_change);
}
function onKeyDown(event, input, _parse, _format, on_change) {
  if (isReadOnly(input)) {
    return;
  }
  var operation = getOperation(event);
  switch (operation) {
    case "Delete":
    case "Backspace":
      event.preventDefault();
      var selection = getSelection(input);
      if (selection) {
        eraseSelection(input, selection);
        return formatInputText(input, _parse, _format, void 0, on_change);
      }
      return formatInputText(input, _parse, _format, operation, on_change);
  }
}
function eraseSelection(input, selection) {
  var text = input.value;
  text = text.slice(0, selection.start) + text.slice(selection.end);
  input.value = text;
  setCaretPosition(input, selection.start);
}
function formatInputText(input, _parse, _format, operation, on_change) {
  var _parse2 = parse(input.value, getCaretPosition(input), _parse), value = _parse2.value, caret = _parse2.caret;
  if (operation) {
    var newValueAndCaret = edit(value, caret, operation);
    value = newValueAndCaret.value;
    caret = newValueAndCaret.caret;
  }
  var formatted = format(value, caret, _format);
  var text = formatted.text;
  caret = formatted.caret;
  input.value = text;
  setCaretPosition(input, caret);
  if (on_change) {
    on_change(value);
  }
}
var _excluded$1 = ["ref", "parse", "format", "value", "defaultValue", "controlled", "onChange", "onKeyDown"];
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), true).forEach(function(key) {
      _defineProperty$1(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties$1(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose$1(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function useInput(_ref) {
  var ref = _ref.ref, parse2 = _ref.parse, format2 = _ref.format, value = _ref.value, defaultValue = _ref.defaultValue, _ref$controlled = _ref.controlled, controlled = _ref$controlled === void 0 ? true : _ref$controlled, onChange$1 = _ref.onChange, onKeyDown$1 = _ref.onKeyDown, rest = _objectWithoutProperties$1(_ref, _excluded$1);
  var internalRef = reactExports.useRef();
  var setRef = reactExports.useCallback(function(instance) {
    internalRef.current = instance;
    if (ref) {
      if (typeof ref === "function") {
        ref(instance);
      } else {
        ref.current = instance;
      }
    }
  }, [ref]);
  var _onChange = reactExports.useCallback(function(event) {
    return onChange(event, internalRef.current, parse2, format2, onChange$1);
  }, [internalRef, parse2, format2, onChange$1]);
  var _onKeyDown = reactExports.useCallback(function(event) {
    if (onKeyDown$1) {
      onKeyDown$1(event);
    }
    if (event.defaultPrevented) {
      return;
    }
    return onKeyDown(event, internalRef.current, parse2, format2, onChange$1);
  }, [internalRef, parse2, format2, onChange$1, onKeyDown$1]);
  var commonProps = _objectSpread$1(_objectSpread$1({}, rest), {}, {
    ref: setRef,
    onChange: _onChange,
    onKeyDown: _onKeyDown
  });
  if (controlled) {
    return _objectSpread$1(_objectSpread$1({}, commonProps), {}, {
      value: format2(isEmptyValue(value) ? "" : value).text
    });
  }
  return _objectSpread$1(_objectSpread$1({}, commonProps), {}, {
    defaultValue: format2(isEmptyValue(defaultValue) ? "" : defaultValue).text
  });
}
function isEmptyValue(value) {
  return value === void 0 || value === null;
}
var _excluded = ["inputComponent", "parse", "format", "value", "defaultValue", "onChange", "controlled", "onKeyDown", "type"];
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function Input(_ref, ref) {
  var _ref$inputComponent = _ref.inputComponent, InputComponent = _ref$inputComponent === void 0 ? "input" : _ref$inputComponent, parse2 = _ref.parse, format2 = _ref.format, value = _ref.value, defaultValue = _ref.defaultValue, onChange2 = _ref.onChange, controlled = _ref.controlled, onKeyDown2 = _ref.onKeyDown, _ref$type = _ref.type, type = _ref$type === void 0 ? "text" : _ref$type, rest = _objectWithoutProperties(_ref, _excluded);
  var inputProps = useInput(_objectSpread({
    ref,
    parse: parse2,
    format: format2,
    value,
    defaultValue,
    onChange: onChange2,
    controlled,
    onKeyDown: onKeyDown2,
    type
  }, rest));
  return /* @__PURE__ */ React.createElement(InputComponent, inputProps);
}
Input = /* @__PURE__ */ React.forwardRef(Input);
Input.propTypes = {
  // Parses a single characher of `<input/>` text.
  parse: PropTypes.func.isRequired,
  // Formats `value` into `<input/>` text.
  format: PropTypes.func.isRequired,
  // Renders `<input/>` by default.
  inputComponent: PropTypes.elementType,
  // `<input/>` `type` attribute.
  type: PropTypes.string,
  // Is parsed from <input/> text.
  value: PropTypes.string,
  // An initial value for an "uncontrolled" <input/>.
  defaultValue: PropTypes.string,
  // This handler is called each time `<input/>` text is changed.
  onChange: PropTypes.func,
  // Whether this input should be "controlled" or "uncontrolled".
  // The default value is `true` meaning "uncontrolled".
  controlled: PropTypes.bool,
  // Passthrough
  onKeyDown: PropTypes.func,
  onCut: PropTypes.func,
  onPaste: PropTypes.func
};
export {
  Input as I
};
