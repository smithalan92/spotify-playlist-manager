import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setToken } from "../store/slices/auth";
import { useEffect, useState } from "react";
import api from "../api";

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
      navigate("/home");
    };
    getToken();
  }, []);

  return <div>Loading...</div>;
}

export default Verify;
