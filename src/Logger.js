export default class Logger {
    constructor(id) {
        this.el = document.getElementById(id);
        this.el.innerHTML = '';
    }

    log(data, message = "") {
        if(message.length > 0) {
            message += ":";
        }

        this.el.innerHTML += `<pre>${message} ${JSON.stringify(data)}</pre>`;
    }
}