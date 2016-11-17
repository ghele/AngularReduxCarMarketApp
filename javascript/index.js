const store = Redux.createStore( ( state = {}, action ) => {
    switch( action.type ) {
        case 'RECEIVE_CARS':
            // console.log('RECEIVE_CARS', Object.assign({}, state, action.carData));
            // console.log('state', state);
            return Object.assign({}, state, action);
        case 'ADD_CAR':
        var id = action.carId;
            // console.log(Object.assign(state, state.carData.models[action.carId].isSelected = !state.carData.models[action.carId].isSelected));
            // console.log(Object.assign({}, state, {state.carData.models[id].isSelected : !state.carData.models[id].isSelected)});
console.log(state);
        default:
            return state
    }
} )

const calendarService = httpProvider => {
    const api = 'http://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=e6jd7d4rx7qx64r5dskzwdwc'
    var marketData = {};
    marketData.models = [];
    marketData.name = [];
    return {
        getMarketCars: ( ) => httpProvider( 'GET', `${ api }` )
          .then(function(response) {
              var id = 0;
              response.makes.forEach(function(entry) {
                  marketData.name.push(entry.name);
                  entry.models.forEach(function(model) {
                      marketData.models.push({
                          id: id++,
                          name: model.name,
                          make: entry.name,
                          isSelected: false
                      });
                  });
              })
              // console.log("sdfwero", marketData);
              return marketData;
          })
    }
}



/*
 * ANGULAR
 */

const app = angular.module( 'test', [ ] )

app.controller( 'CarMarketController', ( $scope, $timeout, calendar, store ) => {
    $scope.model = {
        carData: [ ]
    }

    store.subscribe( ( ) => {
        Object.assign( $scope.model, { list: store.getState( ) } )
        // console.log("GET_STATE", store.getState());
    } )

    $scope.getCars = ( ) => {
        calendar.getMarketCars( )
            .then( carData => store.dispatch( { type: 'RECEIVE_CARS', carData } ) )
    }

    $scope.addCar = ( carId ) => {
      console.log(carId);
        store.dispatch( { type: 'ADD_CAR', carId } )
    }

    $scope.getCars();
} )

app.value( 'store', store )

app.factory( 'calendar', $http => {
    return calendarService( ( method, url ) => {
        return $http[ method.toLowerCase( ) ]( url )
            .then( response => response.data )
    } )
} )


/*
 * VANILLA
 */

window.calendar = calendarService( ( method, url ) => {
    return fetch( url, { method } )
        .then( response => response.json( ) )
} )
