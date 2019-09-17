export const convertToPostBody = (sourceObj) => {
    function convert(conObj, desObj={}) {
        Object.keys(conObj).forEach((key) => {
            const conObjKey = conObj[key]
            switch(typeof conObjKey) {
                case "string":
                    desObj[key] = {
                        "stringValue": conObjKey
                    }
                    break
                case "boolean":
                    desObj[key] = {
                        "booleanValue": conObjKey
                    }
                    break
                case "number":
                    if(Number.isInteger(conObjKey)) {
                        desObj[key] = {
                            "integerValue": conObjKey
                        }
                    } else {
                        desObj[key] = {
                            "doubleValue": conObjKey
                        }
                    }
                    break
                case "object":
                    if(conObjKey === null) {
                        desObj[key] = {
                            "nullValue": conObjKey
                        }
                    } else if(Array.isArray(conObjKey)) {
                        const arrayValues = conObjKey.map((currentElem) => {
                            const convertedArrayMap = convert({"arrayKey":currentElem})
                            return convertedArrayMap["arrayKey"]
                        })
                        desObj[key] = {
                            "arrayValue": {
                                "values": arrayValues
                            }
                        }
                    } else {
                        desObj[key] = {
                            "mapValue": {
                                "fields": convert(conObjKey)
                            }
                        }
                    }
                    break
                default:
                    console.log("--None of the data types matched--")
            }
        })
        return desObj
    }        
    let postBodyObj = {
        "fields" : convert(sourceObj)
    }
    return postBodyObj
}

export const convertResponse = (res) => {
    function convert(input, desObj={}) {
        Object.keys(input).forEach((item) => {
            const currentItemObject = input[item]
                
            switch(Object.keys(currentItemObject)[0]) {
                case "stringValue":
                    desObj[item] =  currentItemObject["stringValue"]
                    break
                case "integerValue":
                    desObj[item] =  parseInt(currentItemObject["integerValue"])
                    break
                case "doubleValue":
                    desObj[item] =  parseFloat(currentItemObject["integerValue"])
                    break
                case "booleanValue":
                    desObj[item] =  Boolean(currentItemObject["booleanValue"])
                    break
                case "nullValue":
                    desObj[item] =  null
                    break
                case "mapValue":
                    desObj[item] =  convert(currentItemObject["mapValue"]["fields"])
                    break
                case "arrayValue":
                    desObj[item] =  currentItemObject["arrayValue"]["values"].map((arrayItem) => {
                        const temp = convert({arrayItem})
                        return temp.arrayItem
                    })
                    break
                default:
                    console.log('None matched for conversion')
            }
             
        })
        return desObj
    }
    const conversionFields =  res.fields ? res.fields : res.data.fields
    return convert(conversionFields)
}