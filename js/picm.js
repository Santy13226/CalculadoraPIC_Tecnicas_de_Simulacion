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
  const k = parseFloat(document.getElementById("servidor").value);
  
  let tipoCosto = document.getElementById('costoOpciones').value
  let costo = parseFloat(document.getElementById("costo").value);
  let costoCalculado=0
  let usuariosTipo = document.getElementById('usuariosOpcionesSistemaCola').value  
  let usuariosOpciones = document.getElementById('usuariosOpciones').value

  p = (lambda /(k*mu));

  if (!(p < 1)) return alert("La condición de estabilidad debe ser menor a 1");
  
  switch(tipoCosto){
    case 'Costo diario por el tiempo de espera en cola': 
    
    costoCalculado= lambda*horas*tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k)*costo
    break
    case 'Costo diario por el tiempo en el sistema': 
    costoCalculado= lambda*horas*tiempoEsperadoSistema(tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k),mu)*costo
    break
    case 'Costo diario por el tiempo de servicio': 
    costoCalculado= lambda*horas*(1/mu)*costo
    break
    case 'Costo diario del servidor': 
    costoCalculado= k*costo
    break
   }

  respuesta.innerHTML = 
  `
  <button onclick='cerrar()'>X</button>
   <p>La probabilidad de hallar el sistema completamente vacío, probabilidad de que todos los
   servidores estén desocupados u ociosos a la vez (P0): ${sistemaVacio(lambda, mu,k)}</p>
   <p>La probabilidad de que un usuario que llega tenga que esperar, probabilidad de que haya k o
   más usuarios en el sistema (Pk): ${probabilidadUsuarioEsperar(lambda, mu,k)}</p>
   <p>Probabilidad de que un usuario que llega no tenga que esperar (Pne): ${probabilidadUsuarioNoEsperar(lambda, mu,k)}</p>
   <p>Número esperado de clientes en el sistema (L): ${numeroEsperadoClientes(numeroEsperadoClientesCola(tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k),lambda),mu)}</p>
   <p>Número esperado de clientes en la cola Lq: ${numeroEsperadoClientesCola(tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k),lambda)}</p>
   <p>Número esperado de clientes en la cola no vacía Ln: ${numeroEsperadoClientesColaNoVacia(numeroEsperadoClientesCola(tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k),lambda), probabilidadUsuarioEsperar(lambda, mu,k))}</p>
   <p>Tiempo esperado en el sistema W: ${tiempoEsperadoSistema(tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k),mu)}</p>
   <p>Tiempo esperado en cola Wq: ${tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k)}</p>
   <p>Tiempo esperado en cola para colas no vacías Wn: ${tiempoEsperadoColaNoVacia(tiempoEsperadoCola(lambda, mu,sistemaVacio(lambda,mu,k),k), probabilidadUsuarioEsperar(lambda, mu,k))}</p>
   <div>
   <p>La probabilidad de hallar ${usuariosOpciones} en ${usuariosTipo} (Pn) es ${hallarNClientes(lambda, mu,n,n2,k,usuariosOpciones,usuariosTipo)}</p>
   
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

const sistemaVacio = (lambda, mu,k) => {
    let aux= 0
    let sumatoria=0
    for(let n=0;n<k;n++){
        aux = (1/factorial(n))* Math.pow((lambda/mu),n)
        sumatoria=sumatoria+aux
        
    }
  resp = 1/ ( sumatoria + (( 1 / factorial(k) ) * (Math.pow((lambda/mu),k)) * (k*mu/((k*mu)-lambda))) );
  return resp.toFixed(3)
};

probabilidadUsuarioEsperar=(lambda, mu,k)=>{
  resp = (1/ (factorial(k)) * Math.pow((lambda/mu),k)) * (((k*mu)/((k*mu) - lambda)) * sistemaVacio(lambda,mu,k));
  return resp.toFixed(3)
}

probabilidadUsuarioNoEsperar=(lambda, mu,k)=>{
    resp = 1- probabilidadUsuarioEsperar(lambda, mu,k);
    return resp.toFixed(3)
}

const hallarNClientes= (lambda, mu, n,n2,k,usuariosOpciones,usuariosTipo) => {
    resp=0
    if(usuariosTipo==='cola')
    return usuariosCola(lambda,mu,n,n2,k,usuariosOpciones)
    return usuariosSistema(lambda,mu,n,n2,k,usuariosOpciones)
}


const hallarPnMenor=(lambda,mu,n,k)=>{
    return (sistemaVacio(lambda,mu,k)/factorial(n)) * Math.pow((lambda/mu), n);
}

const hallarPnMayor=(lambda,mu,n,k)=>{
    return ((1/(factorial(k)*Math.pow(k,n-k))) * Math.pow((lambda/mu),n) * sistemaVacio(lambda,mu,k));
}
const usuariosSistema =  (lambda,mu,n,n2,k,usuariosOpciones)=>{
    if(n<=k){
    if(usuariosOpciones==='n usuarios'){
    resp=hallarPnMenor(lambda,mu,n,k)
    }
    if(usuariosOpciones==='num1 o num2'){
      resp = hallarPnMenor(lambda,mu,n,k);
      if(n2<=k){
        console.log('si')
      resp = resp+hallarPnMenor(lambda,mu,n2,k);
      }else{
        console.log('no')
      resp = resp+hallarPnMayor(lambda,mu,n2,k);
    }
    }
    if(usuariosOpciones==='maximo'){        
        let sumatoria=0
        let currentResult = 0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k);
            }
          //const roundedResult = currentResult.toFixed(2);
          sumatoria += currentResult;
      }
      resp=sumatoria
    }
    if(usuariosOpciones==='al menos'){
        let sumatoria=0
        let currentResult=0
      for(let i = 0; i<n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k);
            }
          sumatoria += currentResult;
      }
      resp=1-sumatoria;
    }
}else if(n>k){
    if(usuariosOpciones==='n usuarios')
    resp=hallarPnMayor(lambda,mu,n,k)
    
    if(usuariosOpciones==='num1 o num2'){
        resp = hallarPnMayor(lambda,mu,n,k);
        if(n2>k)
        resp = resp+hallarPnMayor(lambda,mu,n2,k);
        else
        resp = resp+hallarPnMenor(lambda,mu,n2,k);
      }

    if(usuariosOpciones==='maximo'){
        let sumatoria=0
     let currentResult = 0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k);
            }
          sumatoria += currentResult;
        }
        resp=sumatoria
      }
    if(usuariosOpciones==='al menos'){
        let sumatoria=0
        let currentResult = 0
      for(let i = 0; i<n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k);
            }
          sumatoria += currentResult;
        }
        resp=1-sumatoria;
      }
}
return resp.toFixed(3)
}
const usuariosCola =  (lambda,mu,n,n2,k,usuariosOpciones)=>{
    let aux=n+k-1
    let aux2=n2+k
    console.log(n+k)
    if(n<=k){
    if(usuariosOpciones==='n usuarios') resp=hallarPnMenor(lambda,mu,aux,k)
    if(usuariosOpciones==='num1 o num2'){
        resp = hallarPnMenor(lambda,mu,aux,k);
        console.log(resp)
        if(n2<=k){
          resp = resp+hallarPnMenor(lambda,mu,aux2,k);
          console.log(resp)
          }else{
          resp = resp+hallarPnMayor(lambda,mu,aux2,k);
          console.log(resp)
        }
    }
    if(usuariosOpciones==='maximo'){
        let sumatoria=0
        let currentResult =0
      for(let i = 0; i<=(aux+1);i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k);
            }
          sumatoria += currentResult;
          console.log(sumatoria)
        }
        resp=sumatoria
      }
    if(usuariosOpciones==='al menos'){
        let sumatoria=0
        let currentResult = 0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k);
            }
        sumatoria += currentResult;
      }
      resp=1-sumatoria;
    }
}else if(n>k){
    if(usuariosOpciones==='n usuarios') resp=hallarPnMayor(lambda,mu,aux,k)
    if(usuariosOpciones==='num1 o num2'){
        resp = hallarPnMayor(lambda,mu,aux,k);
        console.log(resp)
        if(n2<=k){
          resp = resp+hallarPnMayor(lambda,mu,aux2,k);
          console.log(resp)
          }else{
          resp = resp+hallarPnMenor(lambda,mu,aux2,k);
          console.log(resp)
        }
    }
    if(usuariosOpciones==='maximo'){
        let sumatoria=0
        let currentResult=0
      for(let i = 0; i<=(aux+1);i++){
        if(i<=k){
        currentResult = hallarPnMenor(lambda,mu,i,k);
        }else{
        currentResult = hallarPnMayor(lambda,mu,i,k);
        }
          sumatoria += currentResult;
          console.log(sumatoria)
        }
        resp=sumatoria
      }
    if(usuariosOpciones==='al menos'){
        let sumatoria=0
        let currentResult=0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k);
        }
        sumatoria += currentResult;
      }
      resp=1-sumatoria;
    }
}
return resp.toFixed(3)
}



const numeroEsperadoClientes=(lq,mu)=> {
  console.log(lq,mu)
  resp = parseFloat(lq) + (1/mu);
  return resp.toFixed(3)
}

const numeroEsperadoClientesCola = (l, lambda)=> {
  resp =  lambda*parseFloat(l);
  return resp.toFixed(3)
}

const numeroEsperadoClientesColaNoVacia=(lq, pk)=> {
  resp = lq/pk;
  return resp.toFixed(3)
}

const tiempoEsperadoSistema=(w,mu)=> {
  resp = parseFloat(w) + (1/mu)
  return resp.toFixed(3)
}
const tiempoEsperadoCola=(lambda, mu,sistemaVacio,k)=> {
  resp = (mu*Math.pow((lambda/mu),k)*sistemaVacio)/(factorial(k-1)*Math.pow((k*mu-lambda),2));
  return resp.toFixed(3)
}
const tiempoEsperadoColaNoVacia=(wq,pk)=> {
  resp = wq/pk;
  return resp.toFixed(3)
}

