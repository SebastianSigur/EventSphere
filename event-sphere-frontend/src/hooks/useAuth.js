import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isAdmin = false
    let isSuperAdmin = false
    let isUser = false
    let status = "guest"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles, id } = decoded.UserInfo
        isUser = roles.includes('user')
        isAdmin = roles.includes('admin')
        isSuperAdmin = roles.includes('superadmin')

        if (isUser) status = "user"
        if (isAdmin) status = "admin"
        if (isSuperAdmin) status = "superadmin"

        return { username, id, roles, status, isUser, isAdmin, isSuperAdmin }
    }

    return { username: '', roles: [],isUser, isAdmin, isSuperAdmin, status }
}
export default useAuth