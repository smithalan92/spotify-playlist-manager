import { Link, useNavigate } from "react-router-dom";

import { ReactComponent as AppLogo } from "../assets/logo.svg";
import { resetState, selectIsAuthed } from "../store/slices/auth";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsAuthed);

  const logout = async () => {
    await dispatch(resetState());
    navigate("/login");
  };

  return (
    <div className="w-full flex p-2 items-center bg-gray-800 border-b-4 border-solid border-gray-900">
      <div className="flex-1 p-2">
        <Link to="/">
          <AppLogo className="w-60" />
        </Link>
      </div>
      {isLoggedIn ? (
        <div className="px-4">
          <a
            href="#"
            onClick={logout}
            className="text-white text-sm hover:underline"
          >
            Logout
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
