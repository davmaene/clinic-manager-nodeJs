(() => {
    const showPwd = document.getElementById('sh-pwd');
    //
    const name = document.getElementById('s-sgn-n');
    const psn = document.getElementById('s-sgn-ps');
    const prn = document.getElementById('s-sgn-pr');
    const eml = document.getElementById('s-sgn-em');
    const tlp = document.getElementById('s-sgn-tlp');
    const pwd = document.getElementById('s-sgn-pwd');
    const imgsrc = document.getElementById('s-sgn-pwd');
    const pwdc = document.getElementById('s-sgn-pwdc');
    const agr = document.getElementById('agreeTerms');
    //
    const checkIn = {};
    // const _checkIn = {};
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
    function _getMeIn(me){
        localStorage.setItem('mySession.me', JSON.stringify(me))
        setTimeout(() => {
            window.location.reload()
        }, 300);
    };
    showPwd.onclick = (es) => {
        if (pwd.type === 'text'){ pwd.type = 'password'; showPwd.classList.remove('fa-eye-slash');
        }else{ pwd.type = 'text'; showPwd.classList.add('fa-eye-slash'); }
    };
    const _desactivateDng = (nxt) => {
        const element = document.getElementById(nxt.id + '-n');
        nxt.classList.remove('border-danger');
        element.style.display = 'none';
    };
    const _selectOutPut = (nxt) => {
        const element = document.getElementById(nxt.id + '-n');
        nxt.classList.add('border-danger');
        element.style.display = 'block';
    };
    checkIn['s-sgn-n'] = (elm) => {
        const elmt = document.getElementById(elm);
        if (/^[a-z]{2,20}$/.test(elmt.value)){
            _desactivateDng(elmt);
            return true;
        }else {
            _selectOutPut(elmt);
            return false;
        }
    };
    checkIn['s-sgn-ps'] = (elm) => {
        const elmt = document.getElementById(elm);
        if (/^[a-z]{2,20}$/.test(elmt.value)){
            _desactivateDng(elmt);
            return true;
        }else {
            _selectOutPut(elmt);
            return false;
        }
    };
    checkIn['s-sgn-pr'] = (elm) => {
        const elmt = document.getElementById(elm);
        if (/^[a-z]{2,20}$/.test(elmt.value)){
            _desactivateDng(elmt);
            return true;
        }else {
            _selectOutPut(elmt);
            return false;
        }
    };
    checkIn['s-sgn-em'] = (elm) => {
        const elmt = document.getElementById(elm);
        if (/^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/.test(elmt.value)){
            _desactivateDng(elmt);
            return true;
        }else {
            _selectOutPut(elmt);
            return false;
        }
    };
    checkIn['s-sgn-tlp'] = (elm) => {
        const elmt = document.getElementById(elm);
        if (/^[+]+[1-9]{1,3}[0-9]{9}$/.test(elmt.value) || /^[0]+[0-9]{9}$/.test(elmt.value)){
            _desactivateDng(elmt);
            return true;
        }else {
            _selectOutPut(elmt);
            return false;
        }
    };
    checkIn['s-sgn-pwd'] = (elm) => {
        const elmt = document.getElementById(elm);
        if (elmt.value.length >= 6){
            _desactivateDng(elmt);
            return true;
        }else {
            _selectOutPut(elmt);
            return false;
        }
    };
    checkIn['s-sgn-pwdc'] = (elm) => {
        const elmt = document.getElementById(elm);
        if (pwd.value.length >= 6){
            if (elmt.value === pwd.value){
                _desactivateDng(elmt);
                return true;
            }else {
                _selectOutPut(elmt);
                return false;
            }
        }
    };
    // (() => {
        let input = document.getElementsByTagName('input');
            for (let inp of input){
                if (inp.type === 'email' || inp.type === 'password' || inp.type === 'text'){
                    inp.addEventListener('blur',(e) => {
                        checkIn[e.target.id](e.target.id);
                    },false);
                }
            }
            document.getElementById('s-sgn-btn').addEventListener('click',(e) =>{
                let val = true;
                for (let k in checkIn){ val = val + checkIn[k](k); }
                if (val){
                    const mn = document.getElementById('agreeTerms-n');
                   if(document.getElementById('agreeTerms').checked){
                       mn.classList.remove('text-danger');
                       const me = {
                           nom: name.value,
                           pstnom: psn.value,
                           prnom: prn.value,
                           email: eml.value,
                           tlph: tlp.value,
                           pwd: pwd.value,
                           imgsrc: imgsrc.value
                       };
                       fetch('/createAccount',{
                           method: 'post',
                           headers: {'Content-type':'application/json'},
                           body: JSON.stringify(me)
                       }).then((e) => {
                           switch (e.status) {
                               case 200: toastr.success('Votre Compte a été crée avec succès \nMerci');
                               _getMeIn(JSON.parse(e.statusText));
                               break;
                               case 406: toastr.error('Adresse mail ou Numero de téléphone déjà utlisé \nveillez changer ces informations puis continuer');
                               break;
                               default:
                                   break;
                           }
                           // console.log(JSON.parse(e));
                       }).catch((error) => {
                           if (error) toastr.error('une erreur est survenue lors de l\'enregistrement');
                       });
                   }else {
                    mn.classList.add('text-danger');
                   }
               }
            });
    // })();
})();


