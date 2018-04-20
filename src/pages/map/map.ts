import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation} from '@ionic-native/geolocation';

import { Observable } from 'rxjs/Observable';

import { GoogleMap } from "../../components/google-map/google-map";
import { MapProvider } from '../../providers/map/map';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public mapProvider: MapProvider,
    public geolocation: Geolocation
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  ngOnInit() {
    let _loading = this.loadingCtrl.create();
    _loading.present();

    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
      _loading.dismiss();
    });
  }

  ionViewDidEnter() {
    // Use ngOnInit instead
  }

  searchPlacesPredictions(query: string){
    let env = this;

    if(query !== "")
    {
      env.mapProvider.getPlacePredictions(query).subscribe(
        places_predictions => {
          env.map_model.search_places_predictions = places_predictions;
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }else{
      env.map_model.search_places_predictions = [];
    }
  }

//used to set origin on the map
  setOrigin(location: google.maps.LatLng){
    console.log("setOrigin");
    console.log(location);
    let env = this;

    // Clean map
    env.map_model.cleanMap();

    // Set the origin for later directions
    env.map_model.directions_origin.location = location;

    env.map_model.addPlaceToMap(location, '#00e9d5');

    // Create a location bound to center the map based on the results
    let bound = new google.maps.LatLngBounds(env.map_model.directions_origin.location);
    // To fit map with places
    env.map_model.map.fitBounds(bound);
    env.map_model.map.setZoom(15);
/*
    // With this result we should find restaurants (*places) arround this location and then show them in the map

    // Now we are able to search *restaurants near this location
    env.mapProvider.getPlacesNearby(location).subscribe(
      nearby_places => {
        // Create a location bound to center the map based on the results
        let bound = new google.maps.LatLngBounds();

        for (var i = 0; i < nearby_places.length; i++) {
          bound.extend(nearby_places[i].geometry.location);
          env.map_model.addNearbyPlace(nearby_places[i]);
        }

        // Select first place to give a hint to the user about how this works
        env.choosePlace(env.map_model.nearby_places[0]);

        // To fit map with places
        env.map_model.map.fitBounds(bound);
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
*/  }

  selectSearchResult(place: google.maps.places.AutocompletePrediction){
    let env = this;

    env.map_model.search_query = place.description;
    env.map_model.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.mapProvider.geocodePlace(place.place_id).subscribe(
      place_location => {
        env.setOrigin(place_location);
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }

//used to clear the search results
  clearSearch(){
    let env = this;
    // Clean map
    env.map_model.cleanMap();
  }

// Used to get current location of the user
  geolocateMe(){
    let env = this,
        _loading = env.loadingCtrl.create();

    _loading.present();

    this.geolocation.getCurrentPosition().then((position) => {
      let current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      env.map_model.search_query = position.coords.latitude.toFixed(2) + ", " + position.coords.longitude.toFixed(2);
      env.setOrigin(current_location);
      env.map_model.using_geolocation = true;

      _loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
      _loading.dismiss();
    });
  }

// used to select places from the map
  choosePlace(place: MapPlace){
    let env = this;

    // Check if the place is not already selected
    if(!place.selected)
    {
      // De-select previous places
      env.map_model.deselectPlaces();
      // Select current place
      place.select();

      // Get both route directions and distance between the two locations
      let directions_observable = env.mapProvider
            .getDirections(env.map_model.directions_origin.location, place.location),
          distance_observable = env.mapProvider
            .getDistanceMatrix(env.map_model.directions_origin.location, place.location);

      Observable.forkJoin(directions_observable, distance_observable).subscribe(
        data => {
          let directions = data[0],
              distance = data[1].rows[0].elements[0].distance.text,
              duration = data[1].rows[0].elements[0].duration.text;

          env.map_model.directions_display.setDirections(directions);

          let toast = env.toastCtrl.create({
                message: 'That\'s '+distance+' away and will take '+duration,
                duration: 3000
              });
          toast.present();
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    }
  }

}
