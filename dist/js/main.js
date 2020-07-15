class Session {
    exires;
    usIdent;
    getExpires(){return this.exires}
    getUsIdent(){return this.usIdent}
    setExpires(expire){this.exires = expire;}
    setUsIdent(us){this.usIdent = us;}
    constructor(){
        // this.exires = exp;
        // this.us = us;
    }
}
window.addEventListener('load', redirect => {
    if(!JSON.parse(localStorage.getItem('mySession.me'))){
        window.location.href = '/login';
    }else{
        // =========== my object for session =========== //
        const me = new Session(); // session Object
        const frm = JSON.parse(localStorage.getItem('mySession.me'));
        // =============================================
        me.setExpires(frm);
        const mse = me.getExpires();
            mes = mse.mes;
        const n = mes.nom;
        const p = mes.postNom;
            // console.log(mes);
        // =============================================
        const nick_1 = document.getElementById('nick-1');
        const nick_2 = document.getElementById('nick-2');
        const nickinit = document.getElementById('nick-init');
    
        if(JSON.parse(localStorage.getItem('mySession.me'))){
            nick_1.textContent = mes.nom;
            nick_2.textContent = mes.postNom;
            nickinit.textContent = (n.substring(0, 1).toString()+p.substring(0, 1).toString());
        }
    }

})

const btn = document.getElementById('cabme');
btn.addEventListener('click',() => {
    const input = document.getElementById('cabmetxt').value;
    fetch('/selectMessage/' + 1,{
        method: 'post',
        headers: {
            'Content-type':'application/json'
        },
        body: JSON.stringify({input:input, me: 'maene'})
    })
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.log(error)
    })
}, false);
