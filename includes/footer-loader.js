fetch('/includes/footer.html').then(r=>r.text()).then(html=>{document.getElementById('footer-placeholder').outerHTML=html;});
