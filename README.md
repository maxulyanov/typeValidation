# typeValidation

Adds validation arguments for javascript functions


##NPM
`npm install type-validation`


##Use case


### Simple example
```javascript
function summator(x, y, z) {
  return x + y + z;
}

summator = typeValidation(summator, [
  {type: 'number'}, {type: 'number'}, {type: 'number'}
]);

summator(1, 2, 3); // 6
summator(1, 2, 'str'); // Error!
```


### Object method
Set the context by third argument
```javascript
var user = {
  name: 'Mark',
  age: 25,
  getInfo: function() {
    return this.name + ' ' + this.age;
  },
  setInfo: function(name, age) {
    this.name = name;
    this.age = age;
  }
};

user.setInfo = typeValidation(user.setInfo, [
  {type: 'string', required: true},
  {type: 'number', required: true}
], user);

user.setInfo('Mars', 20);
console.log(user.getInfo());
```


### Use callback
Callback should return false if argument not valid
```javascript
function setAge(age) {
  return age;
}

setAge = typeValidation(setAge, [
  {
    type: 'number',
    required: true,
    callback: function(value, func) {
      if(value < 18) {
        func('minimum age 18!');
        return false;
      }
      return true;
    }
  }
]);

setAge(17); // Minimum age 18!
```


### Object data validation
```javascript
function renderHTML(selector, data) {
  return 'render success! Status code: ' + data.statusCode;
}

renderHTML = typeValidation(renderHTML, [
  {
    type: 'string',
    required: true
  },
  {
    type: 'object',
    items: [
      {
        key: 'statusCode',
        type: 'number',
        required: true,
        callback: function(value, func) {
          if(value !== 200) {
            func('Need status 200! Got' + value);
          }
          return true;
        }
      },
      {
        key: 'origin',
        type: 'string'
      },
      {
        key: 'date',
        type: 'date'
      }
    ]
  }
]);

renderHTML('.root', {
  statusCode: 200,

  // not required fields
  origin: 'https://www.google.ru',
  date: 123, // Error!
//    date: new Date() // Ok!
});
```


### Array items validation
```javascript
function MixinArray(array) {
  return array.map(function(item) {
    return item;
  }).join(' ');
};

MixinArray = typeValidation(MixinArray, [
  {
    type: 'array',
    required: true,
    items: [
      {type: 'string'}, {type: 'number'}, {type: 'string'}
    ],
    callback: function(value, func) {
      if(value.length === 0) {
        func('Array length 0!')
        return false;
      }
      return true;
    },
  }
]);

MixinArray(['firstString', 1, 'SecondString']);
```

