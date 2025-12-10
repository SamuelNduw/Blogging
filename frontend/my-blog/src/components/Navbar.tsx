import { useState } from "react";
import { IoMdMenu, IoMdInformationCircleOutline,IoIosLogIn, IoIosLogOut, IoMdPerson, IoMdPaper} from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, signOut, loading } = useAuth();
  const loggedIn = !loading && isAuthenticated();

  const handleLogout = async () => {
    await signOut();              // clears localStorage + context
    toast.success("Signed out.");
    navigate("/");                // redirect home
  };

  const handleLogin = () => navigate("/signin");

  
  const linkCls = ({ isActive }) =>
    `px-4 py-2 rounded-md duration-150 ease-in-out ${
      isActive ? "bg-indigo-500" : "bg-none hover:bg-indigo-500"
    }`;

  return (
    <>
      <div className="w-full h-12 relative z-10 bg-indigo-600 text-white flex items-center justify-around">
        <div className="flex justify-between w-full">
          <div className="text-center pl-5 md:pl-0">
            <h1 className="text-3xl">
              <NavLink to="/">Blogging</NavLink>
            </h1>
          </div>

          <div className="hidden md:block">
            <ul className="flex gap-4 items-center">
                {loggedIn && (
                    <NavLink to="/create-post" className={linkCls}>
                        <li className="flex items-center gap-2">
                        <BsPencilSquare />
                        Compose
                        </li>
                    </NavLink>
                )}

              <NavLink to="/posts" className={linkCls}>
                <li>Posts</li>
              </NavLink>

              <NavLink to="/about" className={linkCls}>
                <li>About</li>
              </NavLink>

              {loggedIn && (
                <NavLink to="/profile" className={linkCls}>
                  <li>Profile</li>
                </NavLink>
              )}

              {loggedIn ? (
                <button onClick={handleLogout} className="px-4 py-2 rounded-md hover:bg-indigo-500">
                  Logout
                </button>
              ) : (
                <button onClick={handleLogin} className="px-4 py-2 rounded-md hover:bg-indigo-500">
                  Login
                </button>
              )}
            </ul>
          </div>
        </div>

        <div className="md:hidden pr-5 scale-150" onClick={() => setNav(!nav)}>
          {nav ? <IoCloseSharp /> : <IoMdMenu />}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`w-48 overflow-hidden h-full fixed top-12 z-50 shadow-md shadow-gray-800 ${
          nav ? "max-h-screen" : "max-h-0"
        } bg-indigo-600`}
      >
        <ul className="flex flex-col items-start gap-5 py-10 pl-10 text-white text-lg">
          {loggedIn && (
            <NavLink to="/create-post">
              <li className="px-4 py-2 flex items-center gap-2">
                <BsPencilSquare /> Compose 
              </li>
            </NavLink>
          )}

          <NavLink to="/posts">
            <li className="px-4 py-2 flex items-center gap-2">
                <IoMdPaper/> Posts 
            </li>
          </NavLink>

          <NavLink to="/about">
            <li className="px-4 py-2 flex items-center gap-2">
              <IoMdInformationCircleOutline /> About 
            </li>
          </NavLink>

          {loggedIn && (
            <NavLink to="/profile">
                <li className="px-4 py-2 flex items-center gap-2">
                    <IoMdPerson/> Profile
                </li>
            </NavLink>
          )}

          {loggedIn ? (
            <button onClick={handleLogout} className="px-4 py-2 flex items-center gap-2">
              <IoIosLogOut/> Logout 
            </button>
          ) : (
            <button onClick={handleLogin} className="px-4 py-2 flex items-center gap-2">
              <IoIosLogIn/> Login
            </button>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
