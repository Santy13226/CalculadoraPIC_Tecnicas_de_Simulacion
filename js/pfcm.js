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
  const poblacion = parseFloat(document.getElementById("poblacion").value);
  
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
    costoCalculado= lambda*horas*tiempoEsperadoCola(numeroEsperadoClientesCola(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),poblacion,numeroEsperadoClientes(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),lambda)*costo
    break
    case 'Costo diario por el tiempo en el sistema': 
    costoCalculado= lambda*horas*tiempoEsperadoSistema(tiempoEsperadoCola(numeroEsperadoClientesCola(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),poblacion,numeroEsperadoClientes(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),lambda),mu)*costo
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
   <p>La probabilidad de hallar el sistema completamente vacío, de que todos los servidores estén
   desocupados u ociosos a la vez (P0): ${sistemaVacio(lambda, mu,k,poblacion)}</p>
   <p>Probabilidad de hallar el sistema completamente ocupado, de que un usuario que llega tenga
   que esperar, probabilidad de que haya k o más usuarios en el sistema (Pe): ${sistemaOcupado(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion))}</p>
   <p>Probabilidad de no esperar (Pne): ${probabilidadUsuarioNoEsperar(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion))}</p>
   <p>Número esperado de clientes en el sistema (L): ${numeroEsperadoClientes(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion))}</p>
   <p>Número esperado de clientes en la cola Lq: ${numeroEsperadoClientesCola(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion))}</p>
   <p>Número esperado de clientes en la cola no vacía Ln: ${numeroEsperadoClientesColaNoVacia(numeroEsperadoClientesCola(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),sistemaOcupado(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)))}</p>
   <p>Tiempo esperado en el sistema W: ${tiempoEsperadoSistema(tiempoEsperadoCola(numeroEsperadoClientesCola(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),poblacion,numeroEsperadoClientes(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),lambda),mu)}</p>
   <p>Tiempo esperado en cola Wq: ${tiempoEsperadoCola(numeroEsperadoClientesCola(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),poblacion,numeroEsperadoClientes(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),lambda)}</p>
   <p>Tiempo esperado en cola para colas no vacías Wn: ${tiempoEsperadoColaNoVacia(tiempoEsperadoCola(numeroEsperadoClientesCola(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),poblacion,numeroEsperadoClientes(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)),lambda),sistemaOcupado(lambda,mu,n,k,poblacion,sistemaVacio(lambda, mu,k,poblacion)))}</p>
   <div>
   <p>La probabilidad de hallar ${usuariosOpciones} en ${usuariosTipo} (Pn) es ${hallarNClientes(lambda, mu,n,n2,k,usuariosOpciones,usuariosTipo,poblacion,sistemaVacio(lambda, mu,k,poblacion))}</p>
   
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

//<p>(P0): ${sistemaVacio(lambda, mu,k,poblacion)}</p>
const sistemaVacio = (lambda, mu,k,m) => {
    
    let sumatoriaUno=0
    let sumatoriaDos=0
    for(let i=0;i<k;i++){
        sumatoriaUno=sumatoriaUno+((factorial(m)/(factorial(m-i)*factorial(i)))*Math.pow((lambda/mu),i))    
    }

    for(let i=k;i<=m;i++){
        sumatoriaDos=sumatoriaDos+((factorial(m)/(factorial(m-i)*factorial(k)*Math.pow(k,(i-k))))*Math.pow((lambda/mu),i))
    
    }
  resp = 1/ (sumatoriaUno+sumatoriaDos);
  return resp.toFixed(3)
};

const sistemaOcupado = (lambda,mu,n,k,m,sistemaVacio)=>{
  let sumatoria=0
  
  for(let i=0;i<k;i++){
    if(i<k)
    sumatoria=sumatoria+(hallarPnMenor(lambda,mu,i,k,m,sistemaVacio))
    else
    sumatoria=sumatoria+(hallarPnMayor(lambda,mu,i,k,m,sistemaVacio))
  }
    resp =1-sumatoria
  return resp.toFixed(3)
}

probabilidadUsuarioNoEsperar=(lambda,mu,n,k,m,sistemaVacio)=>{
    resp = 1- sistemaOcupado(lambda,mu,n,k,m,sistemaVacio);
    return resp.toFixed(3)
}


const hallarNClientes= (lambda, mu, n,n2,k,usuariosOpciones,usuariosTipo,m,sistemaVacio) => {
    resp=0
    if(usuariosTipo==='cola')
    return usuariosCola(lambda,mu,n,n2,k,usuariosOpciones,m,sistemaVacio)
    return usuariosSistema(lambda,mu,n,n2,k,usuariosOpciones,m,sistemaVacio)
}


const hallarPnMenor=(lambda,mu,n,k,m,sistemaVacio)=>{
    return (sistemaVacio*((factorial(m)/(factorial(m-n)*factorial(n))))*Math.pow((lambda/mu),n));
}
const hallarPnMayor=(lambda,mu,n,k,m,sistemaVacio)=>{
    let x=(sistemaVacio*((factorial(m)/(factorial(m-n)*factorial(n))))*Math.pow((lambda/mu),n));
    return (sistemaVacio*((factorial(m)/(factorial(m-n)*factorial(k)*Math.pow(k,(n-k)))))*Math.pow((lambda/mu),n));
}
const usuariosSistema =  (lambda,mu,n,n2,k,usuariosOpciones,m,sistemaVacio)=>{
    if(n<=k){
    if(usuariosOpciones==='n usuarios'){
    resp=hallarPnMenor(lambda,mu,n,k,m,sistemaVacio)
    }
    if(usuariosOpciones==='num1 o num2'){
      resp = hallarPnMenor(lambda,mu,n,k,m,sistemaVacio);
      if(n2<=k){
      resp = resp+hallarPnMenor(lambda,mu,n2,k,m,sistemaVacio);
      }else{
      resp = resp+hallarPnMayor(lambda,mu,n2,k,m,sistemaVacio);
    }
    }
    if(usuariosOpciones==='maximo'){        
        let sumatoria=0
        let currentResult = 0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
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
            currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
            }
          sumatoria += currentResult;
      }
      resp=1-sumatoria;
    }
}else if(n>k){
    if(usuariosOpciones==='n usuarios'){
    resp=hallarPnMayor(lambda,mu,n,k,m,sistemaVacio)
    }
    
    if(usuariosOpciones==='num1 o num2'){
        resp = hallarPnMayor(lambda,mu,n,k);
        if(n2>k)
        resp = resp+hallarPnMayor(lambda,mu,n2,k,m,sistemaVacio);
        else
        resp = resp+hallarPnMenor(lambda,mu,n2,k,m,sistemaVacio);
      }

    if(usuariosOpciones==='maximo'){
        let sumatoria=0
     let currentResult = 0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
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
            currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
            }
          sumatoria += currentResult;
        }
        resp=1-sumatoria;
      }
}
return resp.toFixed(3)
}
const usuariosCola =  (lambda,mu,n,n2,k,usuariosOpciones,m,sistemaVacio)=>{
    let aux=n+k
    let aux2=n2+k
    if(n<k){
    if(usuariosOpciones==='n usuarios'){
    resp=hallarPnMenor(lambda,mu,4,k,m,sistemaVacio)
    }
    if(usuariosOpciones==='num1 o num2'){
        resp = hallarPnMenor(lambda,mu,aux,k,m,sistemaVacio);
        if(n2<=k){
          resp = resp+hallarPnMenor(lambda,mu,aux2,k,m,sistemaVacio);
          }else{
          resp = resp+hallarPnMayor(lambda,mu,aux2,k,m,sistemaVacio);
        }
    }
    if(usuariosOpciones==='maximo'){
        let sumatoria=0
        let currentResult =0
      for(let i = 0; i<=(aux+1);i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
            }
          sumatoria += currentResult;
        }
        resp=sumatoria
      }
    if(usuariosOpciones==='al menos'){
        let sumatoria=0
        let currentResult = 0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
            }
        sumatoria += currentResult;
      }
      resp=1-sumatoria;
    }
}else if(n>=k){
    if(usuariosOpciones==='n usuarios') resp=hallarPnMayor(lambda,mu,aux,k,m,sistemaVacio)
    if(usuariosOpciones==='num1 o num2'){
        resp = hallarPnMayor(lambda,mu,aux,k,m,sistemaVacio);
        if(n2<=k){
          resp = resp+hallarPnMayor(lambda,mu,aux2,k,m,sistemaVacio);
          }else{
          resp = resp+hallarPnMenor(lambda,mu,aux2,k,m,sistemaVacio);
        }
    }
    if(usuariosOpciones==='maximo'){
        let sumatoria=0
        let currentResult=0
      for(let i = 0; i<=(aux+1);i++){
        if(i<=k){
        currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
        }else{
        currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
        }
          sumatoria += currentResult;
        }
        resp=sumatoria
      }
    if(usuariosOpciones==='al menos'){
        let sumatoria=0
        let currentResult=0
      for(let i = 0; i<=n;i++){
        if(i<=k){
            currentResult = hallarPnMenor(lambda,mu,i,k,m,sistemaVacio);
            }else{
            currentResult = hallarPnMayor(lambda,mu,i,k,m,sistemaVacio);
        }
        sumatoria += currentResult;
      }
      resp=1-sumatoria;
    }
}
return resp.toFixed(3)
}



const numeroEsperadoClientes=(lambda,mu,n,k,m,sistemaVacio)=> {
    let sumatoriaUno=0
    let sumatoriaDos=0
    let sumatoriaTres=0
    //lambda,mu,n,k,m,sistemaVacio
    for(let i=0;i<k;i++){
        if(i<k)
        sumatoriaUno= sumatoriaUno+(i*hallarPnMenor(lambda,mu,i,k,m,sistemaVacio))
else
        sumatoriaUno= sumatoriaUno+(i*hallarPnMayor(lambda,mu,i,k,m,sistemaVacio))
    }
    for(let j=k;j<=m;j++){
        if(j<k){
        sumatoriaDos= sumatoriaDos+((j-k)*hallarPnMenor(lambda,mu,j,k,m,sistemaVacio))
        }else{
            sumatoriaDos= sumatoriaDos+((j-k)*hallarPnMayor(lambda,mu,j,k,m,sistemaVacio))
        }
        
    }
    for(let x=0;x<k;x++){
        if(x<k)
        sumatoriaTres= sumatoriaTres+(hallarPnMenor(lambda,mu,x,k,m,sistemaVacio))
        else
        sumatoriaTres= sumatoriaTres+(hallarPnMayor(lambda,mu,x,k,m,sistemaVacio))
    }
    
  resp = sumatoriaUno+sumatoriaDos+(k*(1-sumatoriaTres));
  return resp.toFixed(3)
}

const numeroEsperadoClientesCola = (lambda,mu,n,k,m,sistemaVacio)=> {
    let sumatoria=0
    for(let j=k;j<=m;j++){
        if(j<k){
        sumatoria= sumatoria+((j-k)*hallarPnMenor(lambda,mu,j,k,m,sistemaVacio))
        }else{
            sumatoria= sumatoria+((j-k)*hallarPnMayor(lambda,mu,j,k,m,sistemaVacio))
        }
        
    }
    resp=sumatoria
  return resp.toFixed(3)
}

const numeroEsperadoClientesColaNoVacia=(lq, pe)=> {
  resp = lq/pe;
  return resp.toFixed(3)
}

const tiempoEsperadoSistema=(wq,mu)=> {
  resp = parseFloat(wq) + (1/mu)
  return resp.toFixed(3)
}
const tiempoEsperadoCola=(lq,m,l,lambda)=> {
  resp = (lq/((m-l)*lambda));
  return resp.toFixed(3)
}
const tiempoEsperadoColaNoVacia=(wq,pe)=> {
  resp = wq/pe;
  return resp.toFixed(3)
}

