import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { ReactComponent as Spinner } from "../assets/spinner.svg";
import api from "../api";
import { selectStateKey, setToken } from "../store/slices/auth";
import { useAppSelector } from "../store/store";

function Verify() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stateKey = useAppSelector(selectStateKey);

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!code || state !== stateKey) {
      setHasError(true);
    }

    const getToken = async () => {
      try {
        const token = await api.getToken(code!);
        await dispatch(setToken(token));
        navigate("/playlists");
      } catch (err) {
        setHasError(true);
        throw err;
      }
    };
    getToken();
  }, []);

  const renderLoading = () => {
    return (
      <>
        <Spinner className="w-16 stroke-green" />
        <span className="text-lg font-bold mt-8">Loading...</span>
      </>
    );
  };

  const renderError = () => {
    return (
      <>
        <span className="text-md font-bold text-red-600">
          Something went wrong with the authorisation.
        </span>
        <Link to="/login" className="mt-8 hover:underline">
          Try again
        </Link>
      </>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {hasError ? renderError() : renderLoading()}
    </div>
  );
}

export default Verify;
