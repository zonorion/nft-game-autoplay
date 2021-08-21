module.exports = {
    apps: [{
        name: 'game-autoplay',
        script: 'dist/main.js',
        instances: 1,
        autorestart: true,
        watch: false,
        time: true,
        env: {},
    }],
}
