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
  const poblacion = parseFloat(document.getElementById("poblacion").value);
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

    if (n || n2)
    if((n>poblacion || n2>poblacion)||(n<0 || n2<0))
    return alert("El número de usuarios no puede ser más grande que la población");
  
  switch(tipoCosto){
    case 'Costo diario por el tiempo de espera en cola': 
    costoCalculado= lambda*horas*tiempoEsperadoCola(lambda,poblacion,numeroEsperadoClientesCola(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion),numeroEsperadoClientes(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion))*costo
    break
    case 'Costo diario por el tiempo en el sistema': 
    costoCalculado= lambda*horas*tiempoEsperadoSistema(tiempoEsperadoCola(lambda,poblacion,numeroEsperadoClientesCola(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion),numeroEsperadoClientes(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion)),mu)*costo
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
  usuarios de esperar para ser atendidos (Pe): ${sistemaOcupado(sistemaVacio(lambda, mu,poblacion))}</p>
   <p>La probabilidad de hallar el sistema vacío u ocioso, probabilidad que tienen los usuarios de no
   esperar o de ser atendidos sin esperar en cola (P0): ${sistemaVacio(lambda, mu,poblacion)}</p>
   <p>Número esperado de clientes en el sistema (L): ${numeroEsperadoClientes(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion)}</p>
   <p>Número esperado de clientes en la cola Lq: ${numeroEsperadoClientesCola(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion)}</p>
   <p>Número esperado de clientes en la cola no vacía Ln: ${numeroEsperadoClientesColaNoVacia(numeroEsperadoClientesCola(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion), mu),sistemaOcupado(sistemaVacio(lambda, mu,poblacion))}</p>
   <p>Tiempo esperado en el sistema W: ${tiempoEsperadoSistema(tiempoEsperadoCola(lambda,poblacion,numeroEsperadoClientesCola(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion),numeroEsperadoClientes(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion)),mu)}</p>
   <p>Tiempo esperado en cola Wq: ${tiempoEsperadoCola(lambda,poblacion,numeroEsperadoClientesCola(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion),numeroEsperadoClientes(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion))}</p>
   <p>Tiempo esperado en cola para colas no vacías Wn: ${tiempoEsperadoColaNoVacia(tiempoEsperadoCola(lambda,poblacion,numeroEsperadoClientesCola(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion),numeroEsperadoClientes(sistemaVacio(lambda, mu,poblacion),lambda, mu,poblacion)),sistemaOcupado(sistemaVacio(lambda, mu,poblacion)))}</p>

   
   
   <div>
   <p>La probabilidad de hallar ${usuariosOpciones} en ${usuariosTipo} (Pn) es ${hallarNClientes(lambda, mu,n,n2,usuariosOpciones,usuariosTipo,poblacion,sistemaVacio(lambda, mu,poblacion))}</p>
   
   <p> ${tipoCosto} es ${costoCalculado}
   </div>`;

   document.getElementById('fondo').style.display='flex';
   respuesta.style.backgroundColor='white';
};

const factorial = (n)=>{
    let resp=1;
    for(let i = 2;i<=n;i++){
        resp=resp*i
    }
    return resp
}

const sistemaOcupado = (sistemaVacio) => {
  resp = 1-sistemaVacio;
  return resp.toFixed(3);
};

const sistemaVacio = (lambda, mu,m) => {
    let sumatoria=0
    for(let i=0;i<=m;i++){
        sumatoria=sumatoria+((factorial(m)/factorial(m-i))*Math.pow((lambda/mu),i))
    }
  resp = 1/(sumatoria);
  return resp.toFixed(3);
};

const hallarNClientes= (lambda, mu, n,n2,usuariosOpciones,usuariosTipo,m,sistemaVacio) => {
    resp=0
    if(usuariosTipo==='cola')
    return usuariosCola(lambda,mu,n,n2,usuariosOpciones,m,sistemaVacio)
    return usuariosSistema(lambda,mu,n,n2,usuariosOpciones,m,sistemaVacio)
}

const usuariosSistema =  (lambda,mu,n,n2,usuariosOpciones,m,sistemaVacio)=>{
    if(usuariosOpciones==='n usuarios')
    resp = ((factorial(m))/factorial(m-n)*Math.pow((lambda/mu),n))*sistemaVacio;
    if(usuariosOpciones==='num1 o num2'){
      resp = ((factorial(m))/factorial(m-n)*Math.pow((lambda/mu),n))*sistemaVacio;
      console.log(resp)
      resp = resp+((factorial(m))/factorial(m-n2)*Math.pow((lambda/mu),n2))*sistemaVacio;
      console.log(resp)
    }
    if(usuariosOpciones==='maximo'){
      for(let i = 0; i<=n;i++){
          const currentResult = ((factorial(m))/factorial(m-i)*Math.pow((lambda/mu),i))*sistemaVacio;
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
      }
    }
    if(usuariosOpciones==='al menos'){
      console.log(resp)
      for(let i = 0; i<n;i++){
          const currentResult = ((factorial(m))/factorial(m-i)*Math.pow((lambda/mu),i))*sistemaVacio;
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
      }
      resp=1-resp;
    }
    return resp.toFixed(3);
}
const usuariosCola =  (lambda,mu,n,n2,usuariosOpciones,m,sistemaVacio)=>{
    if(usuariosOpciones==='n usuarios')
    resp = ((factorial(m))/factorial(m-(n+1))*Math.pow((lambda/mu),(n+1)))*sistemaVacio;
    if(usuariosOpciones==='num1 o num2'){
      resp = resp = ((factorial(m))/factorial(m-(n+1))*Math.pow((lambda/mu),(n+1)))*sistemaVacio;
      resp = resp +((factorial(m))/factorial(m-(n2+1))*Math.pow((lambda/mu),(n2+1)))*sistemaVacio;
    }
    if(usuariosOpciones==='maximo'){
      for(let i = 0; i<=(n+1);i++){
          const currentResult = ((factorial(m))/factorial(m-(i))*Math.pow((lambda/mu),(i)))*sistemaVacio;
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
          console.log(resp)
      }
    }
    if(usuariosOpciones==='al menos'){
      for(let i = 0; i<=n;i++){
          const currentResult = ((factorial(m))/factorial(m-(i))*Math.pow((lambda/mu),(i)))*sistemaVacio;
          const roundedResult = currentResult.toFixed(2);
          resp += parseFloat(roundedResult);
          console.log(resp)
      }
      resp=1-resp;
    }
    return resp.toFixed(3);
}


const numeroEsperadoClientes=(sistemaVacio,lambda, mu,m)=> {
  resp = m - (mu/lambda)*(1-sistemaVacio)
  return resp.toFixed(3);
}

const numeroEsperadoClientesCola = (sistemaVacio,lambda, mu,m)=> {
  resp = m-((lambda+mu)/lambda)*(1-sistemaVacio)
  return resp.toFixed(3);
}

const numeroEsperadoClientesColaNoVacia=(lq,pe)=> {
  resp = lq/pe;
  return resp.toFixed(3);
}
const tiempoEsperadoSistema=(wq, mu)=> {
  resp = parseFloat(wq) + (1 / mu);
  return resp.toFixed(3);
}
const tiempoEsperadoCola=(lambda,m,lq,l)=> {
  resp = lq/((m-l)*lambda)
  return resp.toFixed(3);
}
const tiempoEsperadoColaNoVacia=(wq, pe)=> {
  resp = wq/pe;
  return resp.toFixed(3);
}

