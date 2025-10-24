import React from "react";  
import { Link, useNavigate } from "react-router-dom";

const Wrapper = ({ token, handlelogout, children }) => {
    const navigate = useNavigate();
    const logout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            handlelogout();
            alert("You have been logged out.");
            navigate("/");
        }
    };

    return (
        <>
            {token ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <Link to="/login">
                    <button>Login</button>
                </Link>
            )}
            <main>{children}</main>   
        </>
    );
};

export default Wrapper;
