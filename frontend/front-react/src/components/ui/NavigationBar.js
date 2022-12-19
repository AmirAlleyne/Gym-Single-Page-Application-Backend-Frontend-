import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function NavigationBar() {
  return (
      <>
          <Navbar className="main-nav">
              <Link to="/accounts/login" className="site-title">
                  Toronto Fitness Center
              </Link>
              <div className="nav-link-boxes">
                  <CustomLink to="/accounts/login">Login</CustomLink>
                  <CustomLink to="/accounts/profile">My Profile</CustomLink>
                  <CustomLink to="/subscriptions/plans">Plans</CustomLink>
                  <CustomLink to="/studios/all">Studios</CustomLink>
                  <CustomLink to="/classes/all">Classes</CustomLink>
                  <CustomLink to="/accounts/logout">Logout</CustomLink>
              </div>
          </Navbar>
      </>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}
export {CustomLink}