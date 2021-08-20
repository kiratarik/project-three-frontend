import React from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'


function ImageSubmit() {
  const user = { 
    id: '123',
    username: 'kiratarik' ,
  }
  const [inputs, setInputs] = React.useState(
    { 
      caption: '',
      latitude: 0,
      longitude: 0,
    })



  const selectOptions = [
    { value: 'eggs', label: 'Eggs' },
    { value: 'bacon', label: 'Bacon' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'tea', label: 'Tea' },
    { value: 'beans', label: 'Beans' },
    { value: 'toast', label: 'Toast' },
    { value: 'cereal', label: 'Cereal' }
  ]
  
  const [viewport, setViewport] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
    zoom: 1,
  })
  const [regions, setRegions] = React.useState([])
  
  const url = {
    front: 'https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en&latitude=',
    mid: '&longitude=',
  }
  const getLocation = async ({ latitude, longitude }) => {
    try {
      if (latitude === '' || latitude === '-') latitude = '0'
      if (longitude === '' || longitude === '-') longitude = '0'
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
    getLocation(inputs)
  }, [])
  


  function handleImage(e) {
    if (e.target.files[0]) {
      setImagePath(URL.createObjectURL(e.target.files[0]))
      console.log(e.target.files)
    }
  }

  const [typeTags, setTypeTags] = React.useState([])
  const [customTags, setCustomTags] = React.useState([])

  function handleCaption(e) {
    if (e.target.value.length > 20) {
      e.target.classList.add('red')
    } else {
      const newInput = { ...inputs, [e.target.id]: e.target.value }
      setInputs(newInput)
      e.target.classList.remove('red')
    }
  }
  function handleLatLng(e) {
    const id = e.target.id
    const mod = id.length - 7
    const value = e.target.value
    const numValue = parseFloat(value)
    if (value === '') {
      e.target.classList.remove('red')
    } else if (String(numValue) !== value || numValue < -90 * mod || numValue > 90 * mod ) {
      e.target.classList.add('red')
    } else {
      setInputs({ ...inputs, [id]: numValue })
      getLocation({ ...inputs, [id]: numValue })
      e.target.classList.remove('red')
    }
  }
  function handleDragEnd(e) {
    console.log(e.lngLat)
    setInputs({ ...inputs, longitude: e.lngLat[0], latitude: e.lngLat[1] })
    document.querySelector('#longitude').value = e.lngLat[0]
    document.querySelector('#latitude').value = e.lngLat[1]
  }
  const [imagePath, setImagePath] = React.useState('')
  

  function handleSubmit() {
    try {

      const output = {
        ...inputs,
        url: '',
        tags: { 
          location: regions,
          type: typeTags,
          custom: customTags,
        },
      }
      console.log(output)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h1>Create New Image:</h1>
      <div>
        <label>Caption: </label>
        <input id='caption' placeholder='Describe Image' required onChange={handleCaption} />
      </div>
      <div>
        <label>Image Upload: </label>
        <input type='file' accept='image/png, image/jpeg' required onChange={handleImage} />
        {imagePath && <img src={imagePath} />}
      </div>
      <div>
        <label>Type Tags: </label>
        <Select
          id='type-tags'
          options={selectOptions}
          isMulti
          onChange={(e) => setTypeTags(e.map(item => item.value))}
        />
      </div>
      <div>
        <label>Custom Tags: </label>
        <CreatableSelect 
          isMulti
          onChange={(e) => setCustomTags(e.map(item => item.value))}
        />
      </div>
      <div className='location-input'>
        <label>Location: </label>
        <div>
          <div>
            <input id='latitude' placeholder='Latitude' required onChange={handleLatLng} />
            <input id='longitude' placeholder='Longitude' required onChange={handleLatLng} />
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
              >
                <Marker 
                  key={inputs.caption}
                  latitude={inputs.latitude}
                  longitude={inputs.longitude}
                  offsetLeft={-8}
                  offsetTop={-19}
                  draggable
                  onDragEnd={handleDragEnd}
                >
                  <span>📍</span>
                </Marker>
              </ReactMapGL>
            </div>
          </div>
          <div>
            <label>Regions: </label>
            {regions && <label>{regions.join(', ')}</label>}
          </div>
        </div>
      </div>
      <div>
        <label>Made By: </label>
        <label>{user.username}</label>
      </div>
      <div>
        <input type='submit' onClick={handleSubmit} ></input>
      </div>
    </>
  )
}

export default ImageSubmit