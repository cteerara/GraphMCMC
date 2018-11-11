# mcmc [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Markov Chain Monte Carlo program to estimate distribution network

## Installation

```sh
$ npm install --save mcmc
```

## Modules
* ### State_mod
    Define state objects. The constructor takes in an integer from 0 to n-1 inclusive indicating the source vertex and a 2-b-n array of numbers indicating the position of the vertices in a 2D grid for n is the total number of vertices. 
    #### Usage:
        var state = new State(pts,source) // pts is the array of vertex position, and source is the source vertex 
        
* ### GraphTraversals_mod
    Contains graph related functions
    Does things
* ### Util_mod
    Does things
* ### Prob_mod
    Does things
* ### MetropolisHasting_mod
    Does things
* ### IO
    Does things


## Usage
```js
const mcmc = require('mcmc');

mcmc('Rainbow');
```
## License

MIT © [Chayut Teeraratkul]()


[npm-image]: https://badge.fury.io/js/mcmc.svg
[npm-url]: https://npmjs.org/package/mcmc
[travis-image]: https://travis-ci.org/cteerara/mcmc.svg?branch=master
[travis-url]: https://travis-ci.org/cteerara/mcmc
[daviddm-image]: https://david-dm.org/cteerara/mcmc.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/cteerara/mcmc
[coveralls-image]: https://coveralls.io/repos/cteerara/mcmc/badge.svg
[coveralls-url]: https://coveralls.io/r/cteerara/mcmc
