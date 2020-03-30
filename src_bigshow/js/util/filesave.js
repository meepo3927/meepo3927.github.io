
function fileSave(content, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.fontSize = '0';
        a.style = 'display: none';
        var blobObject = new Blob([content]);
        a.onclick = function () {
            window.navigator.msSaveOrOpenBlob(blobObject, fileName);
        };
        a.click();
        // Clean-up
        document.body.removeChild(a);
        return true;
    } else if (window.URL && window.URL.createObjectURL) {
        // chrome, firefox
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.fontSize = '0';
        a.style = 'display: none';
        var blob = new Blob([content], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        // Clean-up (NOTE: Add a slight delay before removing to avoid 'blob:null' error in Firefox Issue#81)
        setTimeout(function(){
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 3000);

        return true;
    } else {
        var frame = document.createElement('iframe');
        document.body.appendChild(frame);
        frame.style.display = 'none';
        frame.contentDocument.open('text/html', 'replace');
        // data 是 string 类型
        frame.contentDocument.write(content); 
        frame.contentDocument.close();
        frame.focus();
        frame.contentDocument.execCommand('SaveAs', true, fileName);
        // Clean up
        setTimeout(function () {
            document.body.removeChild(frame);
        }, 3000);
        return true;
    }
    /*
    var evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false
    });
    $a.dispatchEvent(evt);
    */
}