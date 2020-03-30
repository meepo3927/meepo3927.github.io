function m1(elem) {
    var win = window.open('', '_blank', 'top=10000');
    if (typeof elem === 'string') {
        var html = elem;
    } else if (elem.innerHTML) {
        html = elem.innerHTML;
    }
    // LOG(html);
    win.document.open('text/html', 'replace');
    win.document.writeln(html);
    win.document.execCommand('saveas','','report.xls');
    win.close();
}

function m2(elem) {
    var container = document.createElement('iframe');
    container.style.visibility = 'hidden';
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0px';
    container.style.border = '0';
    container.scrolling = 'no';
    container.className = 'export-excel-iframe';
    document.body.appendChild(container);
    var win = container.contentWindow;
    var doc = win.document;

    if (typeof elem === 'string') {
        var html = elem;
    } else if (elem.innerHTML) {
        html = elem.innerHTML;
    }
    // LOG(html);
    doc.open('text/html', 'replace');
    doc.write(html);
    doc.close();
    doc.execCommand('saveas','','report.xls');
    // 移除
    setTimeout(() => {
        document.body.removeChild(container);
    }, 30 * 1000);
}

module.exports = m2;