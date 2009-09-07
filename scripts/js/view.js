function toJson(obj) {
  switch (typeof obj) {
    case 'object':
      if (obj) {
	var list = [];
	if (obj instanceof Array) {
	  for (var i=0;i < obj.length;i++) {
	    list.push(toJson(obj[i]));
	  }
	  return '[' + list.join(',') + ']';

	} else {
	  for (var prop in obj) {
	    list.push('"' + prop + '":' + toJson(obj[prop]));
	  }

	  return '{' + list.join(',') + '}';
	}

      } else {
	return 'null';
      }

    case 'string':
      return "\"" + obj.replace("/(\")/g", "\\\"") + "\"";

    case 'number':
    case 'boolean':
      return new String(obj);
  }

  return "<error>";
}


var mapOutput = [];
var reduceKeys = [];
var reduceValues = [];
var reduceOutput = [];
var currentDocId = "";


function emit(key, value) {
  mapOutput.push({
		    id: currentDocId,
		    key: key,
		    value: value
  });

  reduceValues.push(value);
  reduceKeys.push([ key, currentDocId ]);
}



function loopOverInput() {
  var mapFunction = eval(mapConstruct.map);

  for (item in inputDocuments) {
    currentDocId = inputDocuments[item].id;
    mapFunction(inputDocuments[item].value);
  }


  if (typeof mapConstruct.reduce == "string") {
    var reduceFunction = eval(mapConstruct.reduce);

    reduceOutput.push({
			value: reduceFunction(reduceKeys, reduceValues, false)
		      });
  }
}



function processInput() {
  loopOverInput();

  if (typeof mapConstruct.reduce != "string") {
    print(toJson({
		   total_rows: mapOutput.length,
		   offset: 0,
		   rows: mapOutput
		 }));
  } else {
    print(toJson({
		   total_rows: reduceOutput.length,
		   offset: 0,
		   rows: reduceOutput
		 }));
  }
}


