import React from 'react'
import { getImages } from '../../functionLib/api'
import Select from 'react-select'
import { selectOptions } from '../../functionLib/variables'

function Home() {

  const [images, setImages] = React.useState(null)
  const [typeTags, setTypeTags] = React.useState([])

  React.useEffect(() => {
    const getData = async () => {

      try {
        const response = await getImages()
        setImages(response.data)
      } catch (err) {
        console.log(err)
      }
    }
    getData()

  }, [])

  const handleChange = (e) => {
    e.map(tag => {
      setTypeTags(tag.value)
    })
  }


  const filteredImages = () => {
    return images.filter(image => {
      if (typeof typeTags === 'object' || 
          typeof typeTags === 'string' && typeTags === ''){
        return image
      } else if (typeof typeTags === 'string'){
        return Object.values(image.tags.types).includes(typeTags)
      } 
    })
  }

  return (
    <>
      <section className="section">
        <div className="filters-container">
          <form>
            <div className="field">
              <label className="label">Types</label> 
              <Select
                id='type-tags'
                options={selectOptions}
                onChange={handleChange}
                isMulti
              />
            </div>
          </form>
        </div>
        <div className="card-container">
          {images && filteredImages().map(image => {
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