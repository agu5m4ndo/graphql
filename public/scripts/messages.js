//-------------------------------CENTRO DE MENSAJES---------------------------------

// //variable utilizada en handlebars para ver que parte de la plantilla usar dependiendo si el mail fue insertado
let value = false;
let user = "";

//Llamado desde el html, guarda y emite el nuevo mensaje
const newMessage = () => {
    let line = document.getElementById('mensaje').value;
    let message = {
        email: user.value,
        content: line,
        date: new Date().toLocaleString()
    }
    socket.emit('new-message', message)
}

const mailProvided = () => {
    user = document.getElementById('mail');
    return (user != null && user.value != "");
}

const renderMessageTemplate = async(message) => {
    if (value == false) {
        value = mailProvided();
    }
    return await fetch('../views/messages.hbs')
        .then(res => res.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla)
            const html = template({ value, message }) //En caso de que el mail haya sido provisto, se carga una vista, y además se envía el array de mensajes
            const messages = document.getElementById('messages');
            messages.innerHTML = html;

        })
        .catch((err) => socket.emit('message-error', err))
}

//Llamado desde el html, carga los mensajes al recargar la página
const load = () => {
    if (document.getElementById('mail').value == '') {
        socket.emit('message-error', 'Mail has not been provided')
    } else {
        socket.emit('load-messages');
    }
}

socket.on('messages', (data) => {
    renderMessageTemplate(data)
})