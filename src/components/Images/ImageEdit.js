import React from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { useParams } from 'react-router-dom'

function ImageEdit() {
  const { imageId } = useParams()
  const [inputs, setInputs] = React.useState([])
  const [madeBy, setMadeBy] = React.useState('')

  const selectOptions = [
    { value: 'Beach', label: 'Beach' },
    { value: 'Mountain', label: 'Mountain' },
    { value: 'Ocean', label: 'Ocean' },
    { value: 'Lake', label: 'Lake' },
    { value: 'Forest', label: 'Forest' },
    { value: 'Desert', label: 'Desert' },
    { value: 'Meadow', label: 'Meadow' }
  ]

  const [images, setImages] = React.useState([
    {
      id: 'test1',
      picName: 'Image 1',
      latitude: 51,
      longitude: 1,
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/France_manche_vue_dover.JPG',
      tags: { 
        locations: ['Europe','United Kingdom', 'Strait of Dover'],
        types: ['Cliff', 'Ocean'],
        customs: ['The Channel'],
      },
      addedBy: 'userId1',
    },
    {
      id: 'test2',
      picName: 'Image 2',
      latitude: 54.58,
      longitude: -3.14,
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Derwent-water.jpg/1920px-Derwent-water.jpg',
      tags: { 
        locations: ['Europe','United Kingdom', 'Derwentwater'],
        types: ['Lake', 'Mountain'],
        customs: ['England'],
      },
      addedBy: 'userId2',
    }
  ])
  const users = [
    {
      id: 'userId1',
      username: 'Tarik',
    },
    {
      id: 'userId2',
      username: 'Kirat',
    }
  ]

  const [viewport, setViewport] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
    zoom: 8,
  })

  React.useEffect(() => {
    const inputsArray = images.filter(item => {
      return imageId === item.id
    })

    if (inputsArray.length > 0) {
      setInputs(inputsArray)
      setLatLng({ latitude: inputsArray[0].latitude, longitude: inputsArray[0].longitude })
      setViewport({ ...viewport, latitude: parseFloat(inputsArray[0].latitude), longitude: parseFloat(inputsArray[0].longitude) })


      const userArray = users.filter(item => {
        return inputsArray[0].addedBy === item.id
      })
      if (userArray.length > 0) {
        setMadeBy(userArray[0].username)
      } else {
        setMadeBy('')
      }
    } else {
      setInputs({})
      setMadeBy('')
    }
  }, [])


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
      setInputs([{ ...inputs[0], tags: { ...inputs[0].tags, locations: [continent, countryName, locality].filter(item => item) } }])
    } catch (err) {
      console.log(err)
    }
  }
  React.useState(() => {
    getLocation(inputs)
  }, [])


  function handleChange(e) {
    setInputs([{ ...inputs[0], [e.target.id]: e.target.value }])
    console.log({ ...inputs[0], [e.target.id]: e.target.value })
  }

  const [latLng, setLatLng] = React.useState({})
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
      setInputs([{ ...inputs[0], [id]: numValue }])
      getLocation({ ...inputs[0], [id]: numValue })
      e.target.classList.remove('red')
    }
    setLatLng({ ...latLng, [id]: value })
  }

  function handleDragEnd(e) {
    console.log(e.lngLat)
    setInputs({ ...inputs, longitude: e.lngLat[0], latitude: e.lngLat[1] })
    document.querySelector('#longitude').value = e.lngLat[0]
    document.querySelector('#latitude').value = e.lngLat[1]
    getLocation({ latitude: e.lngLat[1], longitude: e.lngLat[0] })
  }


  function handleSubmit() {
    const newImages = images.map(image => {
      if (image.id === inputs[0].id) {
        return (inputs[0])
      } else {
        return (image)
      }
    })
    setImages(newImages)
    console.log('submitted', images, newImages)
  }


  return (
    <>
      <h1>Image Edit:</h1>
      {(inputs.length > 0) ? 
        <div>
          <div>
            <img src={inputs[0].url} />
          </div>
          <div>
            <p>Name: <input id='picName' onChange={handleChange} value={inputs[0].picName} /></p>
            <p>Latitude: <input id='latitude' onChange={handleLatLng} value={latLng.latitude} /></p>
            <p>Longitude: <input id='longitude' onChange={handleLatLng} value={latLng.longitude} /></p>
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
                  key={inputs[0].picName}
                  latitude={inputs[0].latitude}
                  longitude={inputs[0].longitude}
                  offsetLeft={-8}
                  offsetTop={-19}
                  draggable
                  onDragEnd={handleDragEnd}
                >
                  <span>📍</span>
                </Marker>
              </ReactMapGL>
            </div>
            <p>Regions: {inputs[0].tags.locations.join(', ')}</p>
            <p>Types: <Select
              id='type-tags'
              options={selectOptions}
              isMulti
              onChange={(e) => setInputs([{  ...inputs[0], tags: { ...inputs[0].tags, types: e.map(item => item.value) } }])}
              defaultValue={inputs[0].tags.types.map(item => ({ value: item, label: item }))}
            />
            </p>
            <p>Tags: <CreatableSelect 
              isMulti
              onChange={(e) => setInputs([{  ...inputs[0], tags: { ...inputs[0].tags, customs: e.map(item => item.value) } }])}
              defaultValue={inputs[0].tags.customs.map(item => ({ value: item, label: item }))}
            />
            </p>
            <p>Made By: {madeBy}</p>
          </div>
          <input type='submit' onClick={handleSubmit}></input>
        </div> 
        : 
        <div>
          <p>Invalid Image ID: Try another Url!</p>
        </div>
      }
    </>
  )
}

export default ImageEdit