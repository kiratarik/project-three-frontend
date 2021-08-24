import { Link, useParams } from 'react-router-dom'



function UserNav(){
  const { userId } = useParams()

  return (
    <nav>
      <Link  to={`/users/${userId}/pictures`} > My pictures </Link>
      <Link  to={`/users/${userId}/collections`} > My Collections </Link>
      <Link  to={`/users/${userId}/follows`} > Follows </Link>
    </nav>
  )
}

export default UserNav