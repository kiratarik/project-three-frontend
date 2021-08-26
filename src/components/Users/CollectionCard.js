import React from 'react'

import { getImage } from '../../functionLib/api.js'
import ImageCard from '../Images/ImageCard.js'

function CollectionCard({ collection }) {
  const [inputs, setInputs] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  
  React.useEffect(() => {
    const getData = async () => {
      console.log('getData')
      setIsLoading(true)
      try {
        if ((collection) && (collection.collectionArray.length > 0)) {
          const images = []
          await collection.collectionArray.forEach(async (imageId, index)=> {
            const resImage = await getImage(imageId)
            images.push({ ...resImage.data })
            if (collection.collectionArray.length === index + 1) {
              setInputs(images)
            }
            
          })
        }
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    getData()
  }, [collection])

  return (
    <div>
      <h1>{collection.collectionName}</h1>
      {(isLoading) && 
        <p>...Loading</p>
      }
      {(inputs.length > 0) &&
        inputs.map((image) => {
          return ( 
            <div className="card-container" key={image._id}>
              <ImageCard
                image={image}
              />
            </div>
          )
        })
      }
      {(inputs.length === 0) &&
        <p>Empty Collection</p>
      }
    </div>
  )
}


export default CollectionCard