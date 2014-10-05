var self = this;

if (!self.username.match(/^[A-Z0-9._%+-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,4}$/i)) {
    error('username', 'not a valid email');
}