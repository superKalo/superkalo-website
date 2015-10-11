var elixir = require('laravel-elixir');

config.assetsPath = '.';
config.publicPath = '.';

elixir(function(mix) {
    mix
    .sass('/style.scss', 'css/style.css')
    .styles([
            '../lib/normalize-css/normalize.css',
            '../lib/TooltipStylesInspiration/css/tooltip-flip.css',
            'css/style.css'
        ], 'css/style.min.css');
});
