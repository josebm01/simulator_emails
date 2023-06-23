//? Evento después de que se haya cargado la página HTML
document.addEventListener('DOMContentLoaded', () => {
    
    const email = {
        email: '',
        cc: '',
        asunto: '',
        mensaje: ''
    }

    //* Seleccionar elementos de la interfaz
    const inputEmail = document.querySelector('#email')
    const inputCC = document.querySelector('#cc')
    const inputAsunto = document.querySelector('#asunto')
    const inputMensaje = document.querySelector('#mensaje')
    const formulario = document.querySelector('#formulario')
    const btnSubmit =  document.querySelector('#formulario button[type="submit"]')
    const btnReset =  document.querySelector('#formulario button[type="reset"]')
    const spinner = document.querySelector('#spinner')



    //* Asignar eventos 
    // blur - se ejecuta al salir del campo
    // input - en tiempo real al escribir en el input
    inputEmail.addEventListener('input', validar)
    inputCC.addEventListener('input', validar)
    inputAsunto.addEventListener('input', validar)
    inputMensaje.addEventListener('input', validar)
    formulario.addEventListener('submit', enviarEmail)


    btnReset.addEventListener('click', (e) => {
        e.preventDefault()
        resetFormulario()
    })



    function enviarEmail(e) {
        e.preventDefault()

        spinner.classList.add('flex')
        spinner.classList.remove('hidden')

        setTimeout(() => {        
            spinner.classList.remove('flex')
            spinner.classList.add('hidden')

            resetFormulario()

            // Alerta exito
            const alertaExito = document.createElement('p')
            alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase')
            alertaExito.textContent = 'Mensaje enviado correctamente'
            formulario.appendChild(alertaExito)

            setTimeout(() => {
                alertaExito.remove()
            }, 3000);

        }, 3000);
    }



    function validar(e) {

        const value = e.target.value
        //* Aplicando Traversing the DOM para ir al padre y agregar el elemento después
        const referencia = e.target.parentElement

        
        // Se valida si no se escribió algo en los input del formulario
        //* trim elimina los espacios en blanco que se tienen en el input
        if ( value.trim() === '' && e.target.id !== 'cc' ){
            mostrarAlerta(`El campo ${e.target.id} es obligatorio`, referencia)
            // Al quitar la información del input se reinicia el objeto con valores vacíos
            email[e.target.name] = ''
            // Comprobando el objeto del email al haber un error para deshabilitar el botón
            comprobarEmail()
            return // Detiene la ejecución
        }   


        // Validando en CC en caso de tener algo
        if ( e.target.value.trim() !== '' && e.target.id === 'cc'  && !validarEmail( value ) ){
            mostrarAlerta('El email no es válido', referencia)  
            email[e.target.name] = ''
            // Comprobando el objeto del correo si hay un error deshabilita el botón
            comprobarEmail() 
            return
        }


        // Validar el formato del correo en email  
        if ( e.target.id === 'email' && !validarEmail( value ) ){
            mostrarAlerta('El email no es válido', referencia)  
            email[e.target.name] = ''
            // Comprobando el objeto del correo si hay un error deshabilita el botón
            comprobarEmail() 
            return
        }

        limpiarAlerta(referencia)

        // Asignar valores al objeto - convirtiendo el texto en minúsculas y removiendo los espacios 
        email[e.target.name] = e.target.value.trim().toLowerCase()

        // Comprobar objeto de email
        comprobarEmail()
    }




    const mostrarAlerta = ( mensaje, referencia ) => {
        
        limpiarAlerta( referencia )
        
        //* Generar alerta en HTML
        const error = document.createElement('p')
        error.textContent = mensaje
        error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center') // Aplicando clases a la alerta
        
        // formulario.innerHTML = error.innerHTML <-- remplaza en html con el contenido que se le pasa 
        
        //* Inyectar el error al formulario 
        referencia.appendChild(error)
        
    }
    

    
    const limpiarAlerta = ( referencia ) => {
        // Se queda con la referencia del elemento en el que se encuentra erscribiendo y no todo el documento
        const alerta = referencia.querySelector('.bg-red-600')
        //* Comprueba si ya existe una alerta dentro del div en el que se está escribiendo
        if ( alerta ){
            // Elimina alerta previa
            alerta.remove()
        }
    }




    const validarEmail = ( email ) => {
        // Expresión regular para el correo
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 

        // Validando que el email coincida con la expresión regular - true o false
        const resultado = regex.test(email)
        
        return resultado 
    }



    //? Activar o desactivar el botón de enviar
    const comprobarEmail = () => {
        // Object values crea un arreglo con los valors del objeto, y se usa includes para verificar si tiene string vacío
        // Si hay inputs vacíos entonces inhabilita el botón

        let newEmail = {
            email: email.email,
            asunto: email.asunto,
            mensaje: email.mensaje
        }


        // Validando que se hayan llenado los inputs principales y el CC opcional
        if ( Object.values(newEmail).includes('') && email.cc === '' || email.cc !== '' ){
            
            btnSubmit.classList.add('opacity-50')
            btnSubmit.disabled = true

            return
        } 

        // Cuando el objeto se ha llenado con la información de los inputs se habilita el botón de Enviar 
        btnSubmit.classList.remove('opacity-50')
        btnSubmit.disabled = false
        
    }



    const resetFormulario = () => {
        // reiniciar objeto del email
        email.email = ''
        email.cc = ''
        email.asunto = ''
        email.mensaje = ''

        formulario.reset()
        comprobarEmail()
    }

})