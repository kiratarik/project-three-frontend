import React from 'react'
import { useParams } from 'react-router'
import { showUser } from '../../functionLib/api.js'
import CollectionCard from './CollectionCard.js'

function MyCollections() {
  const { userId } = useParams()
  const [collections, setCollections] = React.useState()

  React.useEffect(() => { 
    async function getCollections(){
      try {
        const result = await showUser(userId)
        setCollections(result.data.myCollections)
        
      } catch (err) {
        console.log(err)
      }
    }
    getCollections()
  }, [userId])

  return (
    <>
      {(collections) && (collections.length > 0) &&
        collections.map((collection, index) => {
          return (<CollectionCard key={index} collection={collection} />)
        })
      }
      {((!collections) || (collections.length === 0)) &&
      <p>No collections made</p>
      }
    </>
  )
}


export default MyCollections 