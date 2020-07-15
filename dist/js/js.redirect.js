    // try to redirect user if logged in
    window.addEventListener('load', anim => {
        // document.getElementById('loader-div').classList.add('ok-can-anim');
        if(JSON.parse(localStorage.getItem('mySession.me'))){
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 200);
        }
    }, false);
