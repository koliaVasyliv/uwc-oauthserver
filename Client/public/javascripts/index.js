
'use strict';

let form = document.getElementById('form');
form.onsubmit = function (e) {
    e.preventDefault();
    let a = document.createElement('a');
    a.href = 'http://localhost:3000/api/oauth2/authorize?' +
        'client_id=' + this.cliendId.value + '&response_type=code&redirect_uri=http://localhost:3001'
};