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
        if (!result) console.log('there be errors here')
        setCollections(result.data.myCollections)
        
      } catch (err) {
        console.log(err)
      }
    }
    getCollections()
  },[])

  console.log(collections)

  return (
    <>
      {(collections) && (collections.length > 0) &&
        collections.map((collection, index) => {
          return (<CollectionCard key={index} collection={collection} />)
        })
      }
      
    </>
  )
}


export default MyCollections 