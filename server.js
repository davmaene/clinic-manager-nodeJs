'use strict';

const express = require('express');
const path = require('path');
const bp = require('body-parser');
const lite = require('sqlite3');
// const url = require('url');
const nodemailer = require('nodemailer');
// const querystring = require('querystring');
const TMClient = require('textmagic-rest-client');

// ================== cresting my app from express ===== //
const app = express(); // app
const router = express.Router(); // router
// ================= and of app ======================= //
// ================== connection to my db ============ //
const fdb = new lite.Database('dbMy.db', (err) => {
    if (err) throw err.message;
    console.log('===== connection to db success =====');
});
// ==== create tb user or admin of system ====
const createMessageTable = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS _conversions(id integer PRIMARY KEY,' +
        'idCustomer integer,'+
        'message text,'+
        'temps TIMESTAMP CURRENT TIMESTAMP,'+
        'ispending integer)';
        return fdb.run(sql)
};
const createMessageTableAdm = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS _admConversasion(id integer PRIMARY KEY,' +
        'idCustomer integer,'+
        'message text,'+
        'temps TIMESTAMP CURRENT TIMESTAMP,'+
        'ispending integer)';
        return fdb.run(sql)
};
const createAdminTable = apl => {
    const sqlQ = 'CREATE TABLE IF NOT EXISTS _adminTable(id integer PRIMARY KEY,' +
        'nom text,' +
        'postNom text,' +
        'preNom text,' +
        'addEmail text UNIQUE,' +
        'numTelephone text,' +
        'password text,' +
        'imgSrc text)';
    return fdb.run(sqlQ)
};
const createDoctor = apl => {
    const sqlQ = 'CREATE TABLE IF NOT EXISTS _doctorsTab (id integer PRIMARY KEY,' +
        'nom text,' +
        'postNom text,' +
        'preNOm text,' +
        'addEmail text UNIQUE,' +
        'numTelephone text UNIQUE,' +
        'password text,' +
        'levelAbility integer,' +
        'imgProfile text,' +
        'matricule text UNIQUE)';
    return fdb.run(sqlQ)
};
const createClient = apl => {
    const sqlQ = 'CREATE TABLE IF NOT EXISTS _clientTab (id integer PRIMARY KEY,' +
        'nom text,' +
        'postNom text,' +
        'preNOm text,' +
        'addEmail text UNIQUE,' +
        'numTelephone text UNIQUE,' +
        'password text,' +
        'levelAbility integer,' +
        'imgProfile text,' +
        'numC text)';
    return fdb.run(sqlQ)
};
// ============= created tables ================
createAdminTable();
createClient();
createDoctor();
createMessageTable();
createMessageTableAdm();
// =========== RR/WW =================
async function getBigData(opts){
  return fdb.each('SELECT * FROM _clientTab',(err, data) =>{
    opts(err, data)
  })  
};

const onSendingMssg = (packet, opts) =>{
    return fdb.run('INSERT INTO _conversions(idCustomer,message,ispending) VALUES (?,?,?)',packet, (err) =>{
        opts(err)
    })
}
const onSendingMssgAdm = (packet, opts) =>{
    return fdb.run('INSERT INTO _admConversasion(idCustomer,message,ispending) VALUES (?,?,?)',packet, (err) =>{
        opts(err)
    })
}
const selectAllMessageFromCst = (opts) =>{ // from customer to adm
    return fdb.all('SELECT * FROM _conversions WHERE ispending = ? ORDER BY id DESC LIMIT 5',[1],(err, row) => {
        opts(err,row)
    });
}
const selectAllMessageFromAdm = (opts) =>{ // from adm to custm
    return fdb.all('SELECT * FROM _admConversasion WHERE ispending = ? ORDER BY id DESC LIMIT 5',[1],(err, row) => {
        opts(err,row)
    });
}
const selectaMessage = (id, opts) =>{
    return fdb.all('SELECT * FROM _conversions JOIN _admConversasion ON _conversions.idCustomer = _admConversasion.idCustomer WHERE _conversions.id = ? ORDER BY _conversions.id DESC',[id], (err, row) => {
        opts(err,row)
    });
};
let findAdminByEmail = (email, opts) => {
  return fdb.get('SELECT * FROM _adminTable WHERE addEmail = ?',[email],(error, row) => {
     opts(error,row)
  })
};
let _findClientByEmail = (email, opts) => {
    return fdb.get('SELECT * FROM _clientTab WHERE addEmail = ?',[email],(error, row) => {
       opts(error,row)
    })
};
const sendSmsF = () =>{
    var c = new TMClient('username', 'C7XDKZOQZo6HvhJwtUw0MBcslfqwtp4');
    c.Messages.send({text: 'test message', phones:'+243970284997'}, function(err, res){
        console.log('Messages.send()', err, res);
    });
};
const _addClient = (client, opts) => {
    return fdb.run('INSERT INTO _clientTab (nom, postNom, preNOm, addEmail, numTelephone, password, levelAbility, imgProfile, numC) VALUES ' +
        '(?,?,?,?,?,?,?,?,?)',client, (error) => {
        opts(error)
    });
};
const addAdminUser = (admin, opts) => {
    return fdb.run('INSERT INTO _adminTable (nom, postNom, preNom, addEmail, numTelephone, password, imgSrc) VALUES ' +
        '(?,?,?,?,?,?,?)',admin, (error) => {
        opts(error)
    });
};
async function mailingUser(uscd) {
    const transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'davidmened@gmail.com',
            pass: '1804995dav'
        }
    });
    const mailOptions = {
        from: 'viva.rdc.covid19@gmail.com',
        to: 'davidmened@gmail.com,'+ uscd,
        subject: '<< form claudia management system >>',
        text: 'Bienvenu\n Nous sommes la meilleur plateforme d\'information en RDC'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
// ===========================================
app.use(bp.json());
app.use(bp.urlencoded({ extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// ============== container of static files ========== //
app.use(express.static(__dirname + '/dist'));
// ====================== routes ====================== //
app.get('/', function(req,res) {
    // setTimeout()
    res.sendFile(path.join(__dirname+'/dist/pages/caseCstm/index.html'));
});
app.get('/dashboard', function(req,res) {
    res.sendFile(path.join(__dirname +'/dist/pages/index.html'));
});
app.get('/register', function (req, res) {
    res.sendFile(path.join( __dirname + '/dist/pages/register.html'));
});
app.get('/login', function(req,res) {
    res.sendFile(path.join(__dirname +'/dist/pages/login.html'));
});
app.get('/login/forgot-password', function(req, res){
    res.sendFile(path.join(__dirname +'/dist/pages/forgot-password.html'));
});
// app.use(function(req,res,next){
//     res.setHeader('content-type','text/plain');
//     res.send(404,'page not found desole');
// });
app.get('/login/recover-password', function(req,res){
    res.sendFile(path.join(__dirname + '/dist/pages/recover-password.html'), err => {
        console.log('file not found sorry david');
    });
});
// ========================== actions ======================== //
router.post('/createAccount', function(req, res) {

    const n = req.body.nom;
    const ps = req.body.pstnom;
    const pr = req.body.prnom;
    const em = req.body.email;
    const tlp = req.body.tlph;
    const pwd = req.body.pwd;
    const img = req.body.imgsrc;

    _addClient([n,ps,pr,em,tlp,pwd,2020,img,'d.me'], (error) => {
        if (error) res.status(406).send(); // email used.
        if (!error) {
            _findClientByEmail(em, (er, us) => {
                if (er) throw er;
                if (us === undefined) res.status(404).end('not found');
                if (us) {
                    // sendSmsF(); // send sms to user when connect
                    mailingUser(em).then((e)=>{
                        console.log('mail sent success')
                    }).catch(error =>{
                        console.log('une erreur est survenu lors de l envoi du mail desole david')
                    });
                    if (pwd === us.password){
                        const expiresIn = 20 * 60;
                        const mes = {nom: us.nom,postNom: us.postNom, id_: us.id}
                        const tkn = {
                            expiresIn: expiresIn,
                            mes: mes
                        };
                        res.statusMessage = JSON.stringify(tkn);
                        // res.writeHead(200, JSON.stringify(tkn), {'content-type':'application/json'});
                        res.status(200);
                        res.end();
                    }else {
                        res.status(404).end('not found');
                    }
                }
            });
            // res.status(200).send();
        } // added with success.
    });
});
router.post('/connectUser', function (req, res) {
    const email = req.body.em.toString();
    const password = req.body.pw;
    // console.log(req.body.em);
    findAdminByEmail(email, (er, us) => {
        if (er) throw er;
        if (us === undefined) res.status(404).end('not found');
        if (us) {
            // sendSmsF(); // send sms to user when connect
            if (password === us.password){
                const expiresIn = 20 * 60;
                const mes = {nom: us.nom,postNom: us.postNom, id_: us.id}
                const tkn = {
                    expiresIn: expiresIn,
                    mes: mes
                };
                res.statusMessage = JSON.stringify(tkn); 
                res.status(200);
                // res.writeHead( 200, JSON.stringify(tkn), {'content-type':'application/json'});
                res.end();
            }else {
                res.status(404).end('not found');
            }
        }
    });
});
router.post('/getUsers', function(req, res) {
    fdb.get('SELECT * FROM _adminTable WHERE addEmail = ?',['davidmened@gmail.cd'],(error, row) => {
        if (error) throw error.message;
        // for (let me of row){
            console.log(row);  // was just for test
        // }
    })
});
router.post('/sendSmS', function(req, res){
    // console.log(req.body);
    const Nexmo = require('nexmo');
    const nexmo = new Nexmo({
        apiKey: 'cbe44b70',
        apiSecret: '6RISqccX3MBavbed',
    });
    const from = 'viva-rdc';
    const to = '243970284772';
    const text = req.body.input;
    nexmo.message.sendSms(from, to, text);
});
router.post('/selectMessage/:id', function(req, res) { // evalable for customer and adm
    const id = req.params.id; // get user id ====
    selectaMessage(id, (err, msg) => {
        if(err) throw err.message;
        if(!err){
            res.statusMessage = JSON.stringify(msg);
            // res.writeHead(200, JSON.stringify(msg), {'Content-type':'application/json'});
            res.status(200);
            res.send();
        }
    });
});
router.post('/selectMessageAdm', function(req, res) { // evalable for adm executed by adm
    // const id = req.params.id; // get user id ====
    selectAllMessageFromCst((err, msg) => {
        if(err) throw err;
        if(!err){
            res.statusMessage(JSON.stringify(msg));
            // res.writeHead(200, JSON.stringify(msg), {'Content-type':'application/json'});
            res.status(200);
            res.send();
        }
    });
});
router.post('/selectMessageCst', function(req, res) { // evalable for cust executed by cstmer
    // const id = req.params.id; // get user id ====
    selectAllMessageFromAdm((err, msg) => {
        if(err) throw err.message;
        if(!err){
            res.statusMessage = JSON.stringify(msg);
            res.status(200);
            res.send();
            // res.writeHead(200, JSON.stringify(msg), {'Content-type':'application/json'});
        }
    });
});
router.post('/onSendMessageCustomer', function(req, res){ // only for customer
    const id_ = req.body.usid;
    const mssg = req.body.mssg;
    onSendingMssg([id_,mssg,1],(error) => {
        if(error) throw error;
        if(!error){
            console.log(1);
            res.status(200).send();
        }
    });
    
});
router.post('/onSendMessageAdmin', function(req, res){ // only for adm
    const id_ = req.body.usid;
    const mssg = req.body.mssg;
    onSendingMssgAdm([id_,mssg,1],(error) => {
        if(error) throw error;
        if(!error){
            console.log(1);
            res.status(200).send();
        }
    });
    
});
router.post('/loadingMinData', function(req,res){ // only for adm loading data for each kind of patients
    const tbData_consu = []; // levelAbility = 200
    const tbData_actifs = []; // levelAbility = 300
    const tbData_visitors = []; // levelAbility = 2020
    getBigData((err,data) => {
        if(err) throw err;
        if(!err) {

            if(data.levelAbility === 200) tbData_consu.push(data);
            if(data.levelAbility === 300) tbData_actifs.push(data);
            if(data.levelAbility === 2020) tbData_visitors.push(data);
        // ---------------------------------------------------- //
        res.statusMessage = JSON.stringify({
                                actifs: tbData_actifs,
                                consultation: tbData_consu,
                                visitors: tbData_visitors
                            })
        res.status(200);
        res.send();
        // ---------------------------------------------------- //
        }
    });
})
// =================== end action ========================= //

// =============== create server ====================== //
app.use(router);
app.listen(process.env.PORT || 3000, function(){
    console.log('::<<>>:: server is running ::<<>>::');
});
