import { Link, useParams } from 'react-router-dom'



function UserNav(){
  const { userId } = useParams()

  return (
    <nav className='userNav nav-links'>
      <Link  to={`/users/${userId}/pictures`} > My pictures </Link>
      <Link  to={`/users/${userId}/collections`} > My Favorites </Link>
      <Link  to={`/users/${userId}/follows`} > Follows </Link>
    </nav>
  )
}

export default UserNav