import { FaDharmachakra } from 'react-icons/fa';


const Layout = ({ children, isLoggedIn, onLogout }) => (
  <div>
    <nav className='navbar-expand-lg navbar-light bg-light p-2'>
      <div className='container-fluid d-flex'>
        <div className='navbar-brand mr-auto'>
          <FaDharmachakra size="1.7em" style={{ color: '#d4af37', marginTop: '-.4em' }} />
          <span className="h2 mx-2 fw-bold">
            ChoreWheel
          </span>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-end">
            {isLoggedIn ? (
              <li className='nav-item'>
                <a className='nav-link' href='/' onClick={onLogout}>Logout</a>
              </li>
            ) : (
              <>
                <li className='nav-item'>
                  <a className='nav-link' href='/login'>Login</a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link' href='/signup'>Sign Up</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
    {children}
  </div>

);

export default Layout;

