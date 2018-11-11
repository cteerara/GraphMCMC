> Markov Chain Monte Carlo program to estimate distribution network

## Usage
Download the repository.
Assuming PATH is the path from your current working directory to where GraphMCMC directory is, add the followings to the top of your script.
```sh
const state = require(".PATH/GraphMCMC/lib/State_mod.js");
const gt = require(".PATH/GraphMCMC/lib/GraphTraversals_mod.js");
const util = require(".PATH/GraphMCMC/lib/Util_mod.js");
const prob = require(".PATH/GraphMCMC/lib/Prob_mod.js");
const mh = require(".PATH/GraphMCMC/lib/MetropolisHasting_mod.js");
const io = require(".PATH/GraphMCMC/lib/IO.js");
```
Then call the functions in the modules elaborated below.  
See the script in GraphMCMC/example/ for an example of usage.  

## Modules
* ### State_mod
    Define state objects. The constructor takes in an integer from 0 to n-1 inclusive indicating the source vertex and a 2-b-n array of numbers indicating the position of the vertices in a 2D grid for n is the total number of vertices. 
    #### Usage:
        var state = new state.State(pts,source) // pts is the array of vertex position, and source is the source vertex 
        
* ### GraphTraversals_mod
    Contains graph related functions. If you are using the require statements as described above, and named the assign the module to 'gt', then when you call the functions, include 'gt.' infront of the function call. For example, if you want to call function getLenSP, do: gt.getLenSP(S)
    #### Functions:
    * getLenSP(S)
        Gives an array of distance of shortest path  
        INPUT: State object S  
        OUTPUT: 1-by-n array D where D[i] is the distance of the shortest path from the source vertex to vertex i. If there exist no path from source to the i-th vertex, then D[i] = infinity.  

    * IsConnected(S)  
        Check if the graph in state S is connected  
        INPUT: State object S  
        OUTPUT: true if the graph is connected, false otherwise.  
          
    * BridgeNumber(S)  
        Compute the number of bridge edges in the graph  
        INPUT: State object S  
        OUTPUT: Number of bridge edges in graph S  
          
    * CloneState(S)  
        Create a copy of state S. Used instead of '=' because of object assignment in javascript  
        INPUT: State object S  
        OUTPUT: State object Sclone which is identical to the input S  
          
* ### Util_mod  
    Contains some utility functions. If you are using the require statements as described above, and named the assign the module to 'util', then when you call the functions, include 'util.' infront of the function call. For example, if you want to call function Arr2DCmp, do: util.Arr2DCmp(A1,A2)  
    #### Functions:  
    *   Arr2DCmp(A1,A2)  
        Compare two 2D arrays  
        INPUT: 2D Array A1 and A2  
        OUTPUT: true if A1 == A2, and false otherwise  
  
    *   StateCmp(S1,S2)  
        Compare State object S1 and S2  
        INPUT: State objects S1 and S2  
        OUTPUT: true if S1 == S2, and false otherwise  
  
    *   maxarr(A)  
        Output the maximum value in the array  
        INPUT: 1D array A  
        OUTPUT: max(A[i])  
          
* ### Prob_mod  
    Calculates the Relative Stationary Distribution and the Proposal Distribution of the system. If you are using the require statements as described above, and named the assign the module to 'prob', then when you call the functions, include 'prob.' infront of the function call. For example, if you want to call function getRSD, do: prob.getRSD(S)  
    * getRSD(Si, Sj, r, T)  
        calculates RSD = e^{-1*(\theta_i - \theta_j)/T} where   
        \theta_i = r \Sum_e w_e + \Sum_k^M \Sum_{e \in \p_s_i k} w_e and  
        \w_e are weight edges and p_{uv} is the set of edges in the shortest (u,v) path  
        INPUT: State objects Si and Sj.  
               Parameters r and T  
        OUTPUT: Relative Stationary Distribution, RSD  
      
    * GetProposalDistribution(Si,Sj)  
        Calculate the proposal probability distribution of going to state j given state i based on adding and removing one edge from a graph at a time.   
        P(j|i) = 1/(M-Si.EdgeNumber) where M = Si.VertexNumber*(Si.VertexNumber-1)/2 if Sj hase more edges than Si  
        P(j|i) = 1/(Si.EdgeNumber-B) where B = BridgeNumber(Si) if Sj has las edges than Si  
        INPUT: State objects Si, Sj  
        OUTPUT: Probability of going from state Si to state Sj  
  
    * Get99thPercentile(StateArray)  
        Function takes in an array of States with the same vertices locations and different edge connections, and return an array S99.   
        INPUT: array of states with thee same vertices  
        OUTPUT: S99[0] = state in StateArray which is the top 1% most probable state  
                S99[1] = Array of states from StateArray without repitition  
          
* ### MetropolisHasting_mod  
    Module contains functions used for the MetropolisHasting selection. If you are using the require statements as described above, and named the assign the module to 'mh', then when you call the functions, include 'mh.' infront of the function call. For example, if you want to call function GetCandidate, do: mh.getLenSP(S)  
  
    * GetCandidate(S)  
    Generate a candidate state based on the input state S  
    INPUT: State object S  
    OUTPUT: candidate State Scand which is a connected graph with the same vertices as the input State S. Scand has either 1 more or 1 less edge than that of input S.  
  
    * MH(S0, Scand, r, T, u)  
    Gives the Metropolis Hasting selection. Determine whether to accept or reject the proposed state Scand  
    INPUT: Initial states S0, and candidate state Scand.  
    INPUT: parameters r and T  
    INPUT: selection parameter u  
    OUTPUT: Perform the metropolis hasting selection process. If the Acceptance Probability > u, then return true, otherwise return false  
* ### IO  
    Contains IO function. If you are using the require statements as described above, and named the assign the module to 'io', then when you call the functions, include 'io.' infront of the function call. For example, if you want to call function readPts, do: io.readPts(filepath)  
    * readPts(filepath)  
    read an input file containing the 2D position of each vertex in each line separated by space. Example file in the __test__ directory named testpts  

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
