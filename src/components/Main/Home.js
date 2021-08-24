import React from 'react'
import Select from 'react-select'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'

import { getImages } from '../../functionLib/api'
import { selectOptions } from '../../functionLib/variables'

function Home() {

  const [images, setImages] = React.useState(null)
  // const [typeTags, setTypeTags] = React.useState([])
  const [filteredImages, setFilteredImages] = React.useState(null)

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

  const handleChange = (e) => {
    const arrayChoices = e.map(tag => tag.value)
    filterImages(arrayChoices)
  }


  const filterImages = (choices) => {
    const result = images.filter(image => {
      if (image.tags && image.tags.types) {
        const tagMatch = choices.filter(tag => {
          return image.tags.types.join().includes(tag)
        })
        return (tagMatch.length === choices.length)
      }
      return false
    })
    console.log(result)
    setFilteredImages(result)
  }

  return (
    <>
      <section className="section">
        <div className='map-container'>
          <ReactMapGL
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            height='50vw'
            // width='Calc(100vw - 20px)'
            width='80vw'
            mapStyle='mapbox://styles/mapbox/streets-v11'
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
          <form>
            <div className="field">
              <label className="label">Types</label> 
              <Select
                id='type-tags'
                options={selectOptions.map(option => {
                  return ({ value: option, label: option })
                })}
                onChange={handleChange}
                isMulti
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