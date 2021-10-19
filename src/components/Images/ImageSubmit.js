import React from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default
import axios from 'axios'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { useHistory } from 'react-router-dom'

import { createImage, showUser } from '../../functionLib/api.js'
import { getPayload } from '../../functionLib/auth.js'
import { selectOptions } from '../../functionLib/variables'

const uploadUrl = process.env.REACT_APP_CLOUDINARY_URL
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

function ImageSubmit() {
  const history = useHistory()
  const [madeBy, setMadeBy] = React.useState(null)
  const [inputs, setInputs] = React.useState(
    { 
      picName: '',
      latitude: 0,
      longitude: 0,
    })
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
      console.log(err.response.data)
    }
  }

  React.useState(async () => {
    getLocation(inputs)
    const payload = await getPayload()
    const user = await showUser(payload.sub)
    setMadeBy(user.data)
  }, [])
  
  const [imagePath, setImagePath] = React.useState('')
  const [imageFile, setImageFile] = React.useState({})
  function handleImage(e) {
    if (e.target.files[0]) {
      setImagePath(URL.createObjectURL(e.target.files[0]))
      setImageFile(e.target.files[0])
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
    const mod = id.length - 7 // differentiating between longitude and latitude based on length of id name
    const value = e.target.value
    const numValue = parseFloat(value)
    if (value === '') {
      e.target.classList.remove('red')
    } else if (String(numValue) !== value || numValue <= -90 * mod || numValue > 90 * mod ) {
      e.target.classList.add('red')
    } else {
      setInputs({ ...inputs, [id]: numValue })
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
    setInputs({ ...inputs, longitude: e.lngLat[0], latitude: e.lngLat[1] })
    document.querySelector('#longitude').value = e.lngLat[0]
    document.querySelector('#latitude').value = e.lngLat[1]
    getLocation({ latitude: e.lngLat[1], longitude: e.lngLat[0] })
  }

  async function handleSubmit () {
    try {
      const imageUrl = await handleUpload()
      const output = {
        ...inputs,
        url: imageUrl,
        addedBy: madeBy,
        tags: { 
          locations: regions,
          types: typeTags,
          customs: customTags,
        },
      }
      await createImage(output)
      history.push(`/users/${madeBy._id}/pictures`)
    } catch (err) {
      console.log(err.response.data)
    }
  }
  const [isUploading, setIsUploading] = React.useState(false)
  const handleUpload = async () => {
    try {
      setIsUploading(true)
      const data = new FormData()
      data.append('file', imageFile)
      data.append('upload_preset', uploadPreset)
      const res = await axios.post(uploadUrl, data)
      setIsUploading(false)
      return (res.data.url)
    } catch (err) {
      console.log(err.response.data)
    }
  }

  return (
    <>
      <section className="image-submit-container">
        <div className="center-container">
          <form className="form-container">
            <div>
              <label className="label">Name: </label>
              <input id='picName' 
                placeholder='Describe Image' 
                required onChange={handleCaption}
                className="input" />
            </div>
            <div>
              <label>Image Upload:</label>
              <input  
                type='file' 
                accept='image/png, image/jpeg'
                className="file-upload" 
                required onChange={handleImage} />
              {imagePath && <img src={imagePath} />}
            </div>
            <div>
              <label>Type Tags: </label>
              <Select
                id='type-tags'
                options={selectOptions.map(option => {
                  return ({ value: option, label: option })
                })}
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
                  <input 
                    id='latitude' 
                    placeholder='Latitude' 
                    required onChange={handleLatLng} 
                    className="input"/>
                  <input 
                    id='longitude' 
                    placeholder='Longitude' 
                    required onChange={handleLatLng} 
                    className="input"/>
                </div>
                <div>
                  <figure className="map-container image-submit">
                    <ReactMapGL
                      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                      height="90%"
                      width="90%"
                      mapStyle='mapbox://styles/mapbox/streets-v11'
                      // mapStyle="mapbox://styles/hollylouisarose/cksrc0zi20n2o17q8f17hifcw"
                      onViewportChange={(nextViewport) => setViewport(nextViewport)}
                      {...viewport}
                      pitch={0}
                      bearing={0}
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
                  </figure>
                </div>
                <div>
                  <label>Regions: </label>
                  {regions && <label>{regions.join(', ')}</label>}
                </div>
              </div>
            </div>
            {(madeBy) &&
      <div>
        <label>Made By: </label>
        <label>{madeBy.username}</label>
      </div>}
            <div>
              <button type="submit" className="button" 
                onClick={handleSubmit}>Upload</button>
              {isUploading && <p>...Uploading</p>}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default ImageSubmit