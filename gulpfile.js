var elixir = require('laravel-elixir');

config.assetsPath = '.';
config.publicPath = '.';

elixir(function(mix) {
    mix.sass('/style.scss', 'css/style.css');
});
