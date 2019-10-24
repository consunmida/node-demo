export function JSONP (obj) {
    let {url, data, callback} = obj;

    if (!url) {
        return;
    }

    return new Promise((resolve, reject) =>{
        const cbFn = `jsonp_${Date.now()}` 
        data.callback = cbFn;
        const head = document.querySelector('head');
        const script = document.createElement('script');
        script.src = `${url}?${dataToUrl(data)}`;
        head.appendChild(script);
        window[cbFn] = function(res) {
            res ? resolve(res) : reject('err');
            head.removeChild(script);
            window[cbFn] = null;
        }
    })
}

function dataToUrl (data) {
   return  Object.entries(data || {}).map((params) => params.join('=')).join('&');
}