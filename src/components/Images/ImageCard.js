import { Link } from 'react-router-dom'

function ImageCard({ image }){
  
  return (
    <Link to={`images/${image._id}`}>
      <div 
        key={image._id}
        className="card" 
      >
        <div className="overlay">
          <h5>{image.picName}</h5>
        </div>
        <img src={image.url} />
        
      </div>
    </Link> 
    
  )

}

export default ImageCard