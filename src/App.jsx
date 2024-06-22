import { useRef, useState, useEffect, useReducer, useCallback } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import { sortPlacesByDistance } from './loc.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';

function placeSelectionReducer (pickedPlaces, action) {
  let selectedPlaces = [...pickedPlaces];

  if(action.type === "SELECT_PLACE"){
    if (selectedPlaces.some((place) => place.id === action.id)) {//if the place has already being seledcted just return the exam array back
      return selectedPlaces;
    }

    const place = AVAILABLE_PLACES.find((place) => place.id === action.id);
    selectedPlaces = [place, ...selectedPlaces];
  }
  else if(action.type === "REMOVE_PLACE"){
    selectedPlaces = pickedPlaces.filter((place) => place.id !== action.id);
  }

  //store the selected places in the local storage
  localStorage.setItem('selectedPlaces', JSON.stringify(selectedPlaces.map(place=>(place.id))));

  return selectedPlaces;
}

function App() {
  const selectedPlaceId = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isDeleteModalOpen, openDeleteModal] = useState(false);

  //get selected places from the local storage and store it as a state value
  const [pickedPlaces, placeSelectionDispatch] = useReducer(placeSelectionReducer, 
    (JSON.parse(localStorage.getItem('selectedPlaces')) || []).map(id => (AVAILABLE_PLACES.find(place => (place.id === id))))
  );

  //useEffect is used for performing instructions that is required after a component is executed (Only use it for side effect operations that must execute on its own and affect the component's state after it is executed)
  //e.g. use it for AJAX calls
  //useEffect takes two parameters; 
  //1. -> the function to execute (wrapped in an anonymous function). it executes its passed function after the component is executed
  //2. -> the array of dependencies (or used variables) to keep track of such-that when those variable's values changes. The hook executes the function paramter again
  //(if the array of dependencies is empty, useEffect will execute the function only once after the component is done rendering)
  useEffect(()=>{
    if(navigator.onLine){
      navigator.geolocation.getCurrentPosition((userPosition)=>{//this gets the gps location of the user (after the user consents to share gps location)
        const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, userPosition.coords.latitude, userPosition.coords.longitude);
        setAvailablePlaces(sortedPlaces);
      });
    }
    else{
      setAvailablePlaces(AVAILABLE_PLACES);//snce the person is not online, just use the list of places as it is (unsorted)
    }
  }, []);//NOTE!!!: Be careful with using functions and objects as dependency variables (because no two function or object is recognised as "the same" by Javascript even if they contain the same content), the app can get locked in an infinite loop if such functions or object causes state-change

  function handleStartRemovePlace(id) {
    selectedPlaceId.current = id;
    openDeleteModal(true);

  }

  function handleStopRemovePlace() {
    openDeleteModal(false);
  }

  function handleSelectPlace(id) {
    placeSelectionDispatch({
      type: "SELECT_PLACE",
      id
    });
  }

  //the useCallback hook ensures that this function is only created once and never touched again when the component is being rendered again. We are doing this because a useEffect() hook in "DeleteConfirmation" component depends on it
  const handleRemovePlace = useCallback(function handleRemovePlace() {
    placeSelectionDispatch({
      type: "REMOVE_PLACE",
      id: selectedPlaceId.current
    });

    openDeleteModal(false);
  })

  return (
    <>
      <Modal open={isDeleteModalOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={'Sorting the places based on your location... (Kindly allow location access on the browser).'}
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
