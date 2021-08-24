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
    const arrayChoices = e.map(tag => tag.value)
    setTypeTags(arrayChoices)
  }


  const filteredImages = () => {
    const result = images.filter(image => {
      if (image.tags && image.tags.types) {
        const tagMatch = typeTags.filter(tag => {
          return image.tags.types.join().includes(tag)
        })
        return (tagMatch.length === typeTags.length)
      }
      return false
    })
    console.log(result)
    return result
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