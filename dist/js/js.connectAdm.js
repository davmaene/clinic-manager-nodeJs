// (() => {
    let isEmptyMail = true;
    let isEmptyPwd = true;
    const notFound = document.getElementById('not-found');
    const emailAdm = document.getElementById('s-login-em');
    const ls = document.getElementById('s-login-remember');
    const pwdAdm = document.getElementById('s-login-pw');
    const btnCnnx = document.getElementById('btn-btnCnx');
    function _getMe(prms) {
        localStorage.setItem('mySession.me', JSON.stringify(prms));
        setTimeout(()=> {
            window.location.reload();
        }, 150)
    }
    //
    btnCnnx.addEventListener('click', c => {

        if (emailAdm.value === '') { isEmptyMail = false; emailAdm.classList.add('border-danger');
        }else{ isEmptyMail = false; emailAdm.classList.remove('border-danger');}
        if (pwdAdm.value === ''){ isEmptyPwd = false; pwdAdm.classList.add('border-danger'); }
        else{ isEmptyMail = false; pwdAdm.classList.remove('border-danger'); }
        if (emailAdm.value != '' && pwdAdm.value != ''){ isEmptyMail = true; isEmptyPwd = true;pwdAdm.classList.remove('border-danger'); emailAdm.classList.remove('border-danger');
        }
        if (isEmptyPwd && isEmptyMail){
            const em = emailAdm.value;
            const pw = pwdAdm.value;
            fetch('/connectUser', {
                method: 'post',
                headers: {'Content-type':'application/json'},
                body: JSON.stringify({em:em,pw:pw})
            }).then((res) => {
                switch (res.status) {
                    case 404: notFound.classList.remove('d-none'); break;
                    case 200: notFound.classList.add('d-none');
                    const prms = JSON.parse(res.statusText);
                        _getMe(prms);
                        break;
                }
                // console.log(res.statusText);
            }).catch((error) => {
                console.log('une erreur est servenue');
            })
        }
    }, false);

// })();
