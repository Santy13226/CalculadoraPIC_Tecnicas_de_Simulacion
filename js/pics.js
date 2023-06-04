var p = 0;
var resp = 0;

const nUsuarios = () =>{
    let usuariosOpciones = document.getElementById('usuariosOpciones').value
    if(usuariosOpciones !== 'num1 o num2') 
    document.getElementById('nClientes2').style.display='none'
    else
    document.getElementById('nClientes2').style.display='block'
}

const cerrar=()=>{
    document.getElementById('fondo').style.display='none'
}

const condicionEstabilidad = () => {
    document.getElementById('contenidoPics').style.backdropFilter='blur(10px)'
  const lambda = parseFloat(document.getElementById("lambda").value);
  const mu = parseFloat(document.getElementById("mu").value);
  const n = parseFloat(document.getElementById("nClientes").value);
  const n2 = parseFloat(document.getElementById("nClientes2").value);
  const horas = parseFloat(document.getElementById("horas").value);
  let respuesta = document.getElementById("respuesta");
  
  let tipoCosto = document.getElementById('costoOpciones').value
  let costo = parseFloat(document.getElementById("costo").value);
  let costoCalculado=0
  let usuariosTipo = document.getElementById('usuariosOpcionesSistemaCola').value  
  let usuariosOpciones = document.getElementById('usuariosOpciones').value

  p = lambda / mu;

  if (!(p < 1)) return alert("La condición de estabilidad debe ser menor a 1");
  
  switch(tipoCosto){
    case 'Costo diario por el tiempo de espera en cola': 
    costoCalculado= lambda*horas*tiempoEsperadoCola(lambda, mu)*costo
    break
    case 'Costo diario por el tiempo en el sistema': 
    costoCalculado= lambda*horas*tiempoEsperadoSistema(lambda, mu)*costo
    break
    case 'Costo diario por el tiempo de servicio': 
    costoCalculado= lambda*horas*(1/mu)*costo
    break
    case 'Costo diario del servidor': 
    costoCalculado= costo
    break
   }

  respuesta.innerHTML = 
  `
  <button onclick='cerrar()'>X</button>
  <p>Probabilidad de hallar el sistema ocupado, utilización del sistema, probabilidad que tienen los
  usuarios de esperar para ser atendidos (p): ${sistemaOcupado(lambda, mu)}</p>
   <p>La probabilidad de hallar el sistema vacío u ocioso, probabilidad que tienen los usuarios de no
   esperar o ser atendidos sin esperar en cola (P0): ${sistemaVacio(lambda, mu)}</p>
   <p>Número esperado de clientes en el sistema (L): ${numeroEsperadoClientes(lambda, mu)}</p>
   <p>Número esperado de clientes en la cola Lq: ${numeroEsperadoClientesCola(lambda, mu)}</p>
   <p>Número esperado de clientes en la cola no vacía Ln: ${numeroEsperadoClientesColaNoVacia(lambda, mu)}</p>
   <p>Tiempo esperado en el sistema W: ${tiempoEsperadoSistema(lambda, mu)}</p>
   <p>Tiempo esperado en cola Wq: ${tiempoEsperadoCola(lambda, mu)}</p>
   <p>Tiempo esperado en cola para colas no vacías Wn: ${tiempoEsperadoColaNoVacia(lambda, mu)}</p>
   
   <div>
   <p>La probabilidad de hallar ${usuariosOpciones} en ${usuariosTipo} (Pn) es ${hallarNClientes(lambda, mu,n,n2,usuariosOpciones,usuariosTipo)}</p>
   
   <p> ${tipoCosto} es ${costoCalculado}
   </div>`;

   document.getElementById('fondo').style.display='flex';
   respuesta.style.backgroundColor='white';
};


const sistemaOcupado = (lambda, mu) => {
  resp = lambda / mu;
  return resp.toFixed(3);
};

const sistemaVacio = (lambda, mu) => {
  resp = 1 - p;
  return resp.toFixed(3);
};

const hallarNClientes= (lambda, mu, n,n2,usuariosOpciones,usuariosTipo) => {
    resp=0
    if(usuariosTipo==='cola')
    return usuariosCola(lambda,mu,n,n2,usuariosOpciones)
    return usuariosSistema(lambda,mu,n,n2,usuariosOpciones)
}

const usuariosSistema =  (lambda,mu,n,n2,usuariosOpciones)=>{
    if(usuariosOpciones==='n usuarios')
    resp = (1-p) * Math.pow(p, n);
    if(usuariosOpciones==='num1 o num2'){
      resp = (1-p) * Math.pow(p, n);
      resp = resp + (1-p) * Math.pow(p, n2);
    }
    if(usuariosOpciones==='maximo'){
      for(let i = 0; i<=n;i++){
          const currentResult = (1 - p) * Math.pow(p, i);
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
      }
    }
    if(usuariosOpciones==='al menos'){
      console.log(resp)
      for(let i = 0; i<n;i++){
          const currentResult = (1 - p) * Math.pow(p, i);
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
      }
      resp=1-resp;
    }
    return resp.toFixed(3);
}
const usuariosCola =  (lambda,mu,n,n2,usuariosOpciones)=>{
    if(usuariosOpciones==='n usuarios')
    resp = (1-p) * Math.pow(p, n+1);
    if(usuariosOpciones==='num1 o num2'){
      resp = (1-p) * Math.pow(p, n+1);
      resp = resp + (1-p) * Math.pow(p, n2+1);
    }
    if(usuariosOpciones==='maximo'){
      for(let i = 0; i<=(n+1);i++){
          const currentResult = (1 - p) * Math.pow(p, i);
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
          console.log(resp)
      }
    }
    if(usuariosOpciones==='al menos'){
      console.log(resp)
      for(let i = 0; i<=n;i++){
          const currentResult = (1 - p) * Math.pow(p, i);
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
          console.log(resp)
      }
      resp=1-resp;
    }
    return resp.toFixed(3);
}



const numeroEsperadoClientes=(lambda, mu)=> {
  resp = lambda / (mu - lambda);
  return resp.toFixed(3);
}

const numeroEsperadoClientesCola = (lambda, mu)=> {
  resp = Math.pow(lambda, 2) / (mu * (mu - lambda));
  return resp.toFixed(3);
}

const numeroEsperadoClientesColaNoVacia=(lambda, mu)=> {
  resp = lambda / (mu - lambda);
  return resp.toFixed(3);
}
const tiempoEsperadoSistema=(lambda, mu)=> {
  resp = 1 / (mu - lambda);
  return resp.toFixed(3);
}
const tiempoEsperadoCola=(lambda, mu)=> {
  resp = lambda / (mu * (mu - lambda));
  return resp.toFixed(3);
}
const tiempoEsperadoColaNoVacia=(lambda, mu)=> {
  resp = 1 / (mu - lambda);
  return resp.toFixed(3);
}