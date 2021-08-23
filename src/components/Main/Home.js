import React from 'react'
import { getImages } from '../../functionLib/api'


function Home() {

  const [images, setImages] = React.useState(null)

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



  return (
    <>
      <section className="section">
        <div className="card-container">
          {images && images.map(image => {
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