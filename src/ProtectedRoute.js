import React from 'react';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return (
            <div className="container text-center">
                <h3 className='text-center mt-5'>Please log in to view this page.</h3>
                <a href="/login" className='text-center mt-5 h3'>Click To Log in</a>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;