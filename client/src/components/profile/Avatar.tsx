import { User } from 'src/store/userStore'

interface AvatarProps {
  user: User
}

const Avatar = ({ user }: AvatarProps) => {
  return (
    <div className="flex gap-x-12">
      <div className="flex items-center gap-x-3 flex-col ">
        <img src={user.picture} alt="User" className="w-12 h-12 rounded-full" />
        <span className="block text-gray-700 text-sm font-medium ">
          {user.name}
        </span>
        <span className="block text-gray-700 text-xs">{user.email}</span>
      </div>
    </div>
  )
}

export default Avatar
