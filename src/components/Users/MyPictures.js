import React from 'react'
import { getImages } from '../../functionLib/api.js'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

function MyPictures() {
  const { userId } = useParams()
  const [filteredImages, setFilteredImages] = React.useState()

  React.useEffect(() =>{
    
    async function getImageData(){
      try {
        const images = await getImages()
        filterImages(images.data)
      } catch (err) {
        console.log(err)
      }
    }
    getImageData()
  }, [])
  


  const filterImages = (images) => {
    const result = images.filter(image => {
      return image.addedBy === userId
    })
    setFilteredImages(result)
  }


  return (
    <>
      {!filteredImages ? ('Loading'
      ) : ( 
        <>
          <div className='card-container'>
            {filteredImages.map(image => {
              return (
                <div key={image._id} className='card'>
                  <Link to={`/images/${image._id}`}>
                    <img src={image.url} />
                  </Link>
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

export default MyPictures