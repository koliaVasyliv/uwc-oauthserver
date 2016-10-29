
module.exports = {
    server: {
        port: 3000
    },
    mongo: {
        host: 'localhost',
        port: '27017',
        url: function () {
            return 'mongodb://' + this.host + ':' + this.port;
        }
    }
};