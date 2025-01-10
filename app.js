import express from "express";
import session from "express-session";
import moment from "moment-timezone";

const app = express(); //permite el uso de los verbos http
const port = 3000;

app.use(
  session({
    secret: `aquinitaxduxita`,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 dia
  })
);

app.get("/iniciar-sesion", (req, res) => {
  if (!req.session.inicio) {
    req.session.inicio = new Date();
    req.session.ultimoAcceso = new Date();
    res.send("Sesion iniciada.");
  } else {
    res.send("La sesion ya esta activa");
  }
});

app.get("/actualizar", (req, res) => {
  if (req.session.inicio) {
    req.session.ultimoAcceso = new Date();
    res.send("Fecha de ultima consulta actualizada.");
  } else {
    res.send("No hay una sesion activa.");
  }
});

app.get('/estado-sesion', (req, res) =>{
    if (req.session.inicio){
        const inicio = new Date(req.session.inicio)
        const ultimoAcceso = new Date(req.session.ultimoAcceso)
        const ahora = new Date()

        //Calcular la antiguedad de la sesion
        const antiguedadMs = ahora - inicio
        const horas = Math.floor(antiguedadMs / (1000 * 60 * 60))
        const minutos = Math.floor((antiguedadMs % (1000 * 60 * 60)) / (1000 * 60))
        const segundos = Math.floor((antiguedadMs % (1000 * 60)) / 1000)

        //Convertimos la decha al uso horario de CDMX
        const inicioCDMX = moment(inicio).tz('America/Mexico_City').format
        const ultimoCDMX = moment(ultimoAcceso).tz('America/Mexico_City').format

        res.json({
            mensaje: 'Estado de la sesion',
            sessionID: req.sessionID,
            inicio: inicioCDMX.toISOString(),
            ultimoAcceso: ultimoCDMX.toISOString(),
            antiguedad: `${horas} horas, ${minutos} minutos, ${segundos} segundos`
        })
    }else{
        res.send('No hay una sesion activa')
    }
})

app.get('/cerrar-sesion', (req, res) =>{
    if (req.session){
        req.session.destroy((err)=>{
            if (err) {
                return res.status(500).send('https://http.cat/500')
            }
            res.send('Sesion cerrada correctamente')
        })
    } else {
        res.send('No hay una seccion activa para cerrar')
    }
})


app.listen(port, () =>{
    console.log(`Servidor ejecutandose en el puerto ${port}`)
})