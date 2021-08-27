import { useHistory } from 'react-router-dom'

function ImageCard({ image }){
  const history = useHistory()
  function handleClick() {
    history.push(`/images/${image._id}`)
  }

  return ( 
    <div 
      key={image._id}
      className="card" 
      onClick={handleClick}
    >
      <div className="overlay">
        <h5>{image.picName}</h5>
      </div>
      <img src={image.url} loading="lazy"/> 
    </div>
  )
}

export default ImageCard