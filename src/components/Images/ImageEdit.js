import React from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { useParams, useHistory } from 'react-router-dom'

import { getImage, showUser, editImage } from '../../functionLib/api.js'

function ImageEdit() {
  const history = useHistory()
  const { imageId } = useParams()
  const [inputs, setInputs] = React.useState(null)
  const [madeBy, setMadeBy] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)

  const selectOptions = [
    { value: 'Beach', label: 'Beach' },
    { value: 'Mountain', label: 'Mountain' },
    { value: 'Ocean', label: 'Ocean' },
    { value: 'Lake', label: 'Lake' },
    { value: 'Forest', label: 'Forest' },
    { value: 'Desert', label: 'Desert' },
    { value: 'Meadow', label: 'Meadow' }
  ]


  const [viewport, setViewport] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
    zoom: 8,
  })


  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true)
        const resImage = await getImage(imageId)
        setInputs(resImage.data)
        const resUser = await showUser(resImage.data.addedBy)
        setMadeBy(resUser.data.username)
        console.log(resImage.data)
        console.log(resUser.data)
        setLatLng({ latitude: resImage.data.latitude, longitude: resImage.data.longitude })
        setViewport({ ...viewport, latitude: parseFloat(resImage.data.latitude), longitude: parseFloat(resImage.data.longitude) })
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    getData()
    
  }, [imageId])


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
      setInputs({ ...inputs, latitude: latitude, longitude: longitude, tags: { ...inputs.tags, locations: [continent, countryName, locality].filter(item => item) } })
    } catch (err) {
      console.log(err)
    }
  }


  function handleChange(e) {
    setInputs({ ...inputs, [e.target.id]: e.target.value })
    console.log({ ...inputs, [e.target.id]: e.target.value })
  }

  const [latLng, setLatLng] = React.useState({})
  function handleLatLng(e) {
    const id = e.target.id
    const mod = id.length - 7
    const value = e.target.value
    console.log(e.target.value)
    const numValue = parseFloat(value)
    setLatLng({ ...latLng, [id]: value })
    if (value === '') {
      e.target.classList.remove('red')
    } else if (String(numValue) !== value || numValue <= -90 * mod || numValue > 90 * mod ) {
      e.target.classList.add('red')
    } else {
      getLocation({ ...inputs, [id]: numValue })
      e.target.classList.remove('red')
    }
  }

  function handleDragEnd(e) {
    e.lngLat[0] = e.lngLat[0] % 360
    if (e.lngLat[0] > 180) {
      e.lngLat[0] = e.lngLat[0] - 360
    } else if (e.lngLat[0] <= -180) {
      e.lngLat[0] = e.lngLat[0] + 360
    }

    console.log('LngLat', e.lngLat)
    setLatLng({ latitude: e.lngLat[1], longitude: e.lngLat[0] })
    setInputs({ ...inputs, longitude: e.lngLat[0], latitude: e.lngLat[1] })
    getLocation({ latitude: e.lngLat[1], longitude: e.lngLat[0] })
    
  }


  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const { data } = await editImage(imageId, inputs)
      history.push(`/images/${data._id}`)
    } catch (err) {
      console.log(err)
    }
    console.log('submitted')
    
  }


  return (
    <>
      <h1>Image Edit:</h1>
      {(inputs) && 
        <div>
          <div>
            <img src={inputs.url} />
          </div>
          <div>
            <p>Name: <input id='picName' onChange={handleChange} value={inputs.picName} /></p>
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
                  key={inputs.picName}
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
            <p>Regions: {inputs.tags.locations.join(', ')}</p>
            <p>Types: <Select
              id='type-tags'
              options={selectOptions}
              isMulti
              onChange={(e) => setInputs({  ...inputs, tags: { ...inputs.tags, types: e.map(item => item.value) } })}
              defaultValue={inputs.tags.types.map(item => ({ value: item, label: item }))}
            />
            </p>
            <p>Tags: <CreatableSelect 
              isMulti
              onChange={(e) => setInputs({  ...inputs, tags: { ...inputs.tags, customs: e.map(item => item.value) } })}
              defaultValue={inputs.tags.customs.map(item => ({ value: item, label: item }))}
            />
            </p>
            <p>Made By: {madeBy}</p>
          </div>
          <input type='submit' onClick={handleSubmit}></input>
        </div> 
      }
      {(isLoading) &&
        <div>
          <p>...Loading</p>
        </div>
      }
      { (!inputs) && (!isLoading) &&
        <div>
          <p>Invalid Image ID: Try another Url!</p>
        </div>
      }
    </>
  )
}

export default ImageEdit