const urllib = require('urllib');
const plantumlPlain = process.env.PLANTUML_PLAIN_TEXT;

function writeToStd(json) {
  process.stdout.write(JSON.stringify(json));
}

requestPlantuml(plantumlPlain)
  .then(data => {
    writeToStd({ success: true, data });
  })
  .catch(e => {
    writeToStd({
      success: false,
      errMsg: e.message,
      errStack: e.stack,
    });
  });

// request plantuml img
async function requestPlantuml(plantumlPlain) {
  const data = await urllib.curl('https://g.yuque.com/g/puml', {
    method: 'POST',
    dataType: 'json',
    data: {
      content: plantumlPlain,
    },
    headers: {
      'content-type': 'application/json',
    },
    timeout: 2000,
  });

  if (data.data && data.data.url) {
    return data.data.url;
  }

  throw new Error('request fail, ', JSON.stringify(data.data || {}));
}
