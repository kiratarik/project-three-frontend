import React from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'


function ImageSubmit() {
  const user = { username: 'kiratarik' }

  const [inputs, setInputs] = React.useState(
    { 
      caption: '',
      url: '',
      latitude: 0,
      latString: '',
      longitude: 0,
      lngString: '',
    })

  const [viewport, setViewport] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
    zoom: 1,
  })
  const [popup, setPopup] = React.useState(null)
  console.log('popup', popup)

  const [regions, setRegions] = React.useState([])
  

  const url = {
    front: 'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en&latitude=',
    mid: '&longitude=',
  }
  const getLocation = async (latitude, longitude) => {
    try {
      const search = url.front + latitude + url.mid + longitude
      const res = await axios.get(search)
      const { continent, countryName, locality } = res.data
      setRegions([continent, countryName, locality].filter(item => {
        return item
      }))
    } catch (err) {
      console.log(err)
    }
  }
  React.useState(() => {
    getLocation(inputs.latitude, inputs.longitude)
  }, [])
  


  function handleCaption(e) {
    if (e.target.value.length > 20) {
      e.target.classList.add('red')
    } else {
      const newInput = { ...inputs, [e.target.id]: e.target.value }
      setInputs(newInput)
      e.target.classList.remove('red')
    }
  }
  function handleLatitude(e) {
    if (e.target.value === '') {
      const newInput = { ...inputs, [e.target.id]: 0, latString: '' }
      setInputs(newInput)
      getLocation(0, inputs.longitude)
      e.target.classList.remove('red')

    } else if (e.target.value === '-') {
      const newInput = { ...inputs, [e.target.id]: 0, latString: '-' }
      setInputs(newInput)
      getLocation(0, inputs.longitude)
      e.target.classList.add('red')

    } else if (isNaN(parseFloat(e.target.value)) || String(parseFloat(e.target.value)) !== e.target.value) {
      e.target.classList.add('red')
      setInputs({ ...inputs, latString: e.target.value })

    } else if (parseFloat(e.target.value) < -90 || 
    parseFloat(e.target.value) > 90 ) {
      e.target.classList.add('red')
      setInputs({ ...inputs, latString: e.target.value })

    } else {
      const newInput = { ...inputs, [e.target.id]: parseFloat(e.target.value), latString: e.target.value }
      setInputs(newInput)
      getLocation(parseFloat(e.target.value), inputs.longitude)
      e.target.classList.remove('red')
    }
  }
  function handleLongitude(e) {
    if (e.target.value === '') {
      const newInput = { ...inputs, [e.target.id]: 0, lngString: '' }
      setInputs(newInput)
      getLocation(inputs.latitude, 0)
      e.target.classList.remove('red')

    } else if (e.target.value === '-') {
      const newInput = { ...inputs, [e.target.id]: 0, lngString: '-' }
      setInputs(newInput)
      getLocation(0, inputs.longitude)
      e.target.classList.add('red')

    } else if (isNaN(parseFloat(e.target.value)) || String(parseFloat(e.target.value)) !== e.target.value) {
      e.target.classList.add('red')
      setInputs({ ...inputs, lngString: e.target.value })

    } else if (parseFloat(e.target.value) < -180 || 
    parseFloat(e.target.value) > 180 ) {
      e.target.classList.add('red')
      setInputs({ ...inputs, lngString: e.target.value })

    } else {
      const newInput = { ...inputs, [e.target.id]: parseFloat(e.target.value), lngString: e.target.value }
      setInputs(newInput)
      getLocation(inputs.latitude, parseFloat(e.target.value))
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
            <input id='latitude' placeholder='Latitude' onChange={handleLatitude} value={inputs.latString} />
            <input id='longitude' placeholder='Longitude' onChange={handleLongitude} value={inputs.lngString} />
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
            {regions && <p>{regions.join(', ')}</p>}
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