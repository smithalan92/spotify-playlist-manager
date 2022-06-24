import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import api from "../api";
import { setToken } from "../store/slices/auth";
import { RootState } from "../store/store";

function Verify() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const stateKey = useSelector((state: RootState) => state.auth.stateKey);

  const code = searchParams.get("code");
  // const state = searchParams.get("state");

  // TODO handle code & state missing

  useEffect(() => {
    const getToken = async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const token = await api.getToken(code!);
      dispatch(setToken(token));
      navigate("/playlists");
    };
    getToken();
  }, []);

  return <div>Loading...</div>;
}

export default Verify;
