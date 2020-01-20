import { LOADING_SETTINGS, 
    EDIT_PROFILE, UPDATE_PROFILE, 
    EDIT_PASSWORD, UPDATE_PASSWORD,
    EDIT_PREFERENCES, UPDATE_PREFERENCES
} from "../types";
import { tokenConfig } from "../auth/auth";
import { returnErrors } from "../auth/errors";
import axios from "axios";

export const setLoading = () => {
    return {
        type: LOADING_SETTINGS
    };
};

export const editProfile = () => (dispatch, getState) => {
    dispatch(setLoading());

    axios.get("http://localhost:8080/v1/users/profile", tokenConfig(getState))
    .then(res => dispatch({
        type: EDIT_PROFILE,
        payload: res.data
    }))
    .catch(err => dispatch(
        returnErrors(err.data, err.status)
    ));
};

export const updateProfile = profile => (dispatch, getState) => {
    dispatch(setLoading());
    
    axios.put("http://localhost:8080/v1/users/profile", profile, tokenConfig(getState))
    .then(res => dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
    }))
    .catch(err => dispatch(
        returnErrors(err.data, err.status)
    ));
};

export const editPassword = () => (dispatch, getState) => {
    dispatch(setLoading());

    axios.get("http://localhost:8080/v1/users/password", tokenConfig(getState))
    .then(res => dispatch({
        type: EDIT_PASSWORD,
        payload: res.data
    }))
    .catch(err => dispatch(
        returnErrors(err.data, err.status)
    ));
};

export const updatePassword = password => (dispatch, getState) => {
    dispatch(setLoading());

    axios.put("http://localhost:8080/v1/users/password", password, tokenConfig(getState))
    .then(res => dispatch({
        type: UPDATE_PASSWORD,
        payload: res.data
    }))
    .catch(err => dispatch(
        returnErrors(err.data, err.status)
    ));
};

export const editPreferences = () => (dispatch, getState) => {
    dispatch(setLoading());

    axios.get("http://localhost:8080/v1/users/preferences", tokenConfig(getState))
    .then(res => dispatch({
        type: EDIT_PREFERENCES,
        payload: res.data
    }))
    .catch(err => dispatch(
        returnErrors(err.data, err.status)
    ));
};

export const updatePreferences = preferences => (dispatch, getState) => {
    dispatch(setLoading());

    axios.put("http://localhost:8080/v1/users/preferences", preferences, tokenConfig(getState))
    .then(res => dispatch({
        type: UPDATE_PREFERENCES,
        payload: res.data
    }))
    .catch(err => dispatch(
        returnErrors(err.data, err.status)
    ));
};