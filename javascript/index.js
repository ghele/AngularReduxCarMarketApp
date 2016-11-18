
const store = Redux.createStore( ( state = {}, action ) => {
    switch( action.type ) {
        case 'RECEIVE_CARS':
            console.log(action.carData);
            return Object.assign({}, state, {carData:action.carData}, {showData: action.carData.models});
        case 'FILTER_BRAND':
            console.log("STATE1", action.brand);

            return Object.assign({}, state, {
                showData: state.carData.models.filter( (value) => { return value.make === action.brand } )
                                      });
            // return Object.assign({}, state, { showData: {
            //                               name: state.carData.name,
            //                               models: state.carData.models.filter( (value) => { return value.make === action.brand} )
            //                             }
            //                           });
        case 'FILTER_MODEL':
            console.log("STATE", action);
            if(action.model.length != 0) {
              return Object.assign({}, state, {
                  showData: state.carData.models.filter( (value) => { return value.name === action.model } )
              });
            } else {
              return Object.assign({}, state, {
                  showData: state.carData.models.filter( (value) => { return value.make === action.brand } )
              });
            }

        case 'ADD_CAR':
            Object.assign(state, state.carData.models[action.carId].isSelected = !state.carData.models[action.carId].isSelected);
            return Object.assign({}, state, {cartData: state.carData.models.filter( (value) => { return value.isSelected === true } )})
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
 * Action CREATOR
 */


/*
 * ANGULAR
 */

const app = angular.module( 'test', [ ] )

app.controller( 'CarMarketController', ( $scope, $timeout, calendar, store ) => {
    $scope.model = {
        // carData: [ ]
    }

    store.subscribe( ( ) => {
        Object.assign( $scope.model, { list: store.getState( ) } )
        console.log("GET_STATE", store.getState());
    } )
    // $scope.$digest();
    $scope.getCars = ( ) => {
        calendar.getMarketCars( )
            .then( carData => store.dispatch( { type: 'RECEIVE_CARS', carData } ) )
    }

    $scope.filterBrand = ( brand ) => {
        store.dispatch( { type: 'FILTER_BRAND', brand } )
    }

    $scope.filterModel = ( model ) => {
        store.dispatch( { type: 'FILTER_MODEL', model, brand } )
    }

    $scope.addCar = ( carId ) => {
        store.dispatch( { type: 'ADD_CAR', carId } )
    }

    $scope.getCars();
    $scope.addToCart = () => {
      console.log(store.getState());
    }
    // addToCart();
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
