fetch('/includes/header.html').then(r=>r.text()).then(html=>{document.getElementById('header-placeholder').outerHTML=html;});
