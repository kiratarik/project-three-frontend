import React from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'


function ImageSubmit() {
  const user = { username: 'kiratarik' }

  const [inputs, setInputs] = React.useState(
    { 
      caption: '',
      url: '',
      latitude: 52,
      longitude: 0,
    })

  const [viewport, setViewport] = React.useState({
    latitude: 51.0,
    longitude: 0.0,
    zoom: 4,
  })
  const [popup, setPopup] = React.useState(null)
  console.log('popup', popup)

  // function handleChange(e) {
  //   if ( // Check LatLng Limits
  //     ((e.target.id === 'latitude') && 
  //     (parseFloat(e.target.value) < -90 || 
  //     parseFloat(e.target.value) > 90 )) || 
  //     (e.target.id === 'longitude') && 
  //     (parseFloat(e.target.value) < -180 || 
  //     parseFloat(e.target.value) > 180 )) {
  //     e.target.classList.add('red')
  //   } else {
  //     const newInput = { ...inputs, [e.target.id]: e.target.value }
  //     setInputs(newInput)
  //     console.log(newInput)
  //     e.target.classList.remove('red')
  //   }
  // }

  function handleCaption(e) {
    if (e.target.value.length > 20) {
      e.target.classList.add('red')
    } else {
      const newInput = { ...inputs, [e.target.id]: e.target.value }
      setInputs(newInput)
      console.log(newInput)
      e.target.classList.remove('red')
    }
  }
  function handleLatitude(e) {
    if (e.target.value === '') {
      const newInput = { ...inputs, [e.target.id]: 0 }
      setInputs(newInput)
      console.log(newInput)
      e.target.classList.remove('red')
    } else if (parseFloat(e.target.value) < -90 || 
    parseFloat(e.target.value) > 90 ) {
      e.target.classList.add('red')
    } else {
      const newInput = { ...inputs, [e.target.id]: parseFloat(e.target.value) }
      setInputs(newInput)
      console.log(newInput)
      e.target.classList.remove('red')
    }
  }
  function handleLongitude(e) {
    if (e.target.value === '') {
      const newInput = { ...inputs, [e.target.id]: 0 }
      setInputs(newInput)
      console.log(newInput)
      e.target.classList.remove('red')
    } else if (parseFloat(e.target.value) < -180 || 
    parseFloat(e.target.value) > 180 ) {
      e.target.classList.add('red')
    } else {
      const newInput = { ...inputs, [e.target.id]: parseFloat(e.target.value) }
      setInputs(newInput)
      console.log(newInput)
      e.target.classList.remove('red')
    }
  }


  return (
    <>
      <h1>Create New Image:</h1>
      <div>
        <p>Caption:</p>
        <input id='caption' placeholder='Describe Image' onChange={handleCaption} />
      </div>
      <div>
        <p>Image Upload:</p>
        <input type='file' />
      </div>
      <div className='location-input'>
        <p>Location:</p>
        <div>
          <div>
            <input id='latitude' placeholder='Latitude' onChange={handleLatitude} value={inputs.latitude} />
            <input id='longitude' placeholder='Longitude' onChange={handleLongitude} value={inputs.longitude} />
          </div>
          <div>
            <div className='map-container'>
              <ReactMapGL
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                height='50vw'
                // width='Calc(100vw - 20px)'
                width='60vw'
                mapStyle='mapbox://styles/mapbox/streets-v11'
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                {...viewport}
                onClick={() => setPopup(null)}
              >
                <Marker 
                  key={inputs.caption}
                  latitude={inputs.latitude}
                  longitude={inputs.longitude}
                >
                  <span onClick={() => setPopup(inputs.name)}>🤖</span>
                </Marker>
                {popup &&
                  <Popup 
                    latitude={popup.latitude} 
                    longitude={popup.longitude}
                    onClose={() => setPopup(null)}
                  >
                    <p>{popup.name}</p>
                  </Popup>
                }
              </ReactMapGL>
            </div>
          </div>
          <div>
            
          </div>
        </div>
      </div>
      <div>
        <p>Made By:</p>
        <p>{user.username}</p>
      </div>
    </>
  )
}

export default ImageSubmit