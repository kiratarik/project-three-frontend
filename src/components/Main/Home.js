import React from 'react'
import Select from 'react-select'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'

import { getImages } from '../../functionLib/api'
import { selectOptions, continentOptions } from '../../functionLib/variables'

function Home() {

  const [images, setImages] = React.useState(null)
  // const [typeTags, setTypeTags] = React.useState([])
  const [filteredImages, setFilteredImages] = React.useState(null)
  const [countryOptions, setCountryOptions] = React.useState([])
  const [choices, setChoices] = React.useState({
    types: [],
    continent: '',
    country: '',
    customs: [],
  })

  const [viewport, setViewport] = React.useState({
    latitude: 0.0,
    longitude: 0.0,
    zoom: 0,
  })
  const [popup, setPopup] = React.useState(null)

  React.useEffect(() => {
    const getData = async () => {

      try {
        const response = await getImages()
        setImages(response.data)
        setFilteredImages(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()

  }, [])

  // Loads country options when images first set
  React.useEffect(() => {
    if (images) {
      filterImages(choices)
    }
  }, [images])

  const handleTypeChange = (e) => {
    const arrayChoices = e.map(tag => tag.value)
    setChoices({ ...choices, types: arrayChoices })
    filterImages({ ...choices, types: arrayChoices })
  }
  const handleContinentChange = (e) => {
    let arrayChoice = ''
    if (e) {
      arrayChoice = e.value
    }
    setChoices({ ...choices, continent: arrayChoice, country: '' })
    document.querySelector('#location-country-tags').value = ''
    filterImages({ ...choices, continent: arrayChoice, country: '' })
  }
  const handleCountryChange = (e) => { 
    let arrayChoice = ''
    if (e) {
      arrayChoice = e.value
    }
    setChoices({ ...choices, country: arrayChoice })
    filterImages({ ...choices, country: arrayChoice })
  }


  const filterImages = (chosen) => {
    console.log(chosen)
    const countries = []
    const result = images.filter(image => {
      if (image.tags && image.tags) {
        const typeMatch = chosen.types.filter(tag => {
          return image.tags.types.join().includes(tag)
        })
        
        let continentMatch = false
        if (image.tags.locations[0] === chosen.continent || chosen.continent === '') {
          countries.push(image.tags.locations[1])
          continentMatch = true
        }
        
        let countryMatch = false
        if (image.tags.locations[1] === chosen.country || chosen.country === '') {
          countryMatch = true
        }
        return (
          typeMatch.length === chosen.types.length &&
          continentMatch &&
          countryMatch
        )
      }
      return false
    })
    const orderedCountries = [...new Set(countries)]
    setCountryOptions(orderedCountries)
    console.log(result)
    setFilteredImages(result)
  }

  return (
    <>
      <section className="section">
        <div className="map-container">
          <ReactMapGL
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            height="100%"
            width="100%"
            mapStyle='mapbox://styles/hollylouisarose/cksrc0zi20n2o17q8f17hifcw'
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
            {...viewport}
          >
            {filteredImages && 
              filteredImages.map(image => {
                return (
                  <Marker 
                    key={image._id}
                    latitude={image.latitude}
                    longitude={image.longitude}
                    offsetLeft={-8}
                    offsetTop={-19}
                  >
                    <span onClick={() => setPopup(image)} >📍</span>
                  </Marker>
                )
              })
            }
            {popup &&
              <Popup 
                latitude={popup.latitude} 
                longitude={popup.longitude}
                closeButton={false}
                onClose={() => setPopup(null)}
              >
                <div className='popup'
                  style={{
                    backgroundImage: `url("${popup.url}")`,
                  }}
                >
                  <p className='popup-text' >{popup.picName}</p>
                </div>
              </Popup>
            }
            
          </ReactMapGL>
        </div>
      </section>
      <section className="section">
        <div className="filters-container">
          <form className="filters-form">
            <div className="field">
              <label className="label">Types</label> 
              <Select
                id='type-tags'
                options={selectOptions.map(option => {
                  return ({ value: option, label: option })
                })}
                onChange={handleTypeChange}
                isMulti
              />
            </div>
            <div className="field">
              <label className="label">Continent</label> 
              <Select
                id='location-continent-tags'
                options={continentOptions.map(option => {
                  return ({ value: option, label: option })
                })}
                onChange={handleContinentChange}
                isClearable
                isSearchable
                value={{ label: choices.continent, value: choices.continent } || ''}
              />
            </div>
            <div className="field">
              <label className="label">Country</label> 
              <Select
                id='location-country-tags'
                options={countryOptions.map(option => {
                  return ({ value: option, label: option })
                })}
                onChange={handleCountryChange}
                isClearable
                isSearchable
                value={{ label: choices.country, value: choices.country } || ''}
              />
            </div>
          </form>
        </div>
        <div className="card-container">
          {filteredImages && filteredImages.map(image => {
            return (
              <div 
                key={image._id}
                className="card">
                <img src={image.url} />
              </div>
            ) 
          })}
        </div>
      </section>
    </>
  )
}

export default Home