const modelo=()=>{
    switch(document.getElementsByClassName('modelo').value){
        case 'PICS':
            break
    }
}

const informacion=()=>{
    let div = document.createElement('div')
    div.setAttribute('class','informacionModelo');
    let h4= document.createElement('h4')
    let h5= document.createElement('h5')
    h4.innerText='PICS'
    h5.innerText='NOTACION: M/M/1'
    

    div.appendChild(h4);
    div.appendChild(h5);
}

