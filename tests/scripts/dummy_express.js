export function createDummyExpressExport(
  jsonStub,
  urlencodedStub,
  eStub,
  dummyExpressApp,
) {
  const e = {
    json: jsonStub,
    urlencoded: urlencodedStub,
  };

  const callableE = function () {
    eStub();
    return dummyExpressApp;
  };

  Object.defineProperty(callableE, "json", {
    get: function () {
      return e.json;
    },
  });
  Object.defineProperty(callableE, "urlencoded", {
    get: function () {
      return e.urlencoded;
    },
  });

  return callableE;
}
