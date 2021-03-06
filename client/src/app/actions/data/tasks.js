import { 
    TASKS_REQUESTED,
    TASKS_FETCHED, TASK_CREATED,
    TASK_RETURNED, TASK_COMPLETION_TOGGLED, TASK_UPDATED, TASK_DELETED
} from "../types";
import { tokenConfig } from "../auth/auth";
import { returnErrors } from "../auth/errors";
import axios from "axios";

/**
 * @return {Object} - action type
 */
export const setLoading = () => {
    return {
        type: TASKS_REQUESTED
    };
};
/**
 * @param {string} termId - ObjectId belonging to the term to filter the query by
 * @param  {function} dispatch - 
 * @param  {function} getState - 
 */
export const newTask = termId => (dispatch, getState) => {
    dispatch(setLoading());

    axios.get(`/api/v1/terms/${termId}/courses`/*, tokenConfig(getState)*/)
    .then(res => dispatch({
        type: TASKS_FETCHED,
        payload: res.data
    }))
    .catch(err => {
        if(err.response) {
            dispatch(
                returnErrors(err.response.data, err.response.status, "TASKS_ERROR")
            );
        } else if(err.request) {
            dispatch(
                returnErrors(err.request.data, err.request.status, "TASKS_ERROR")
            );
        } else {
            dispatch(
                returnErrors("An error occurred", 500, "TASKS_ERROR")
            );
        };
    });
};
/**
 * @param  {string} task - object containing form data
 * @param  {function} dispatch - 
 * @param  {function} getState - 
 */
export const createTask = task => (dispatch, getState) => {
    dispatch(setLoading());

    axios.post("/api/v1/tasks", task/*, tokenConfig(getState)*/)
    .then(res => dispatch({
        type: TASK_CREATED,
        payload: res.data
    }))
    .catch(err => {
        if(err.response) {
            dispatch(
                returnErrors(err.response.data, err.response.status, "TASKS_ERROR")
            );
        } else if(err.request) {
            dispatch(
                returnErrors(err.request.data, err.request.status, "TASKS_ERROR")
            );
        } else {
            dispatch(
                returnErrors("An error occurred", 500, "TASKS_ERROR")
            );
        };
    });
};
/**
 * @param  {string} parent - resource to filter the query by; either 'terms' or 'TASKS'
 * @param  {string} parentId - ObjectId of the resource to filter query by
 * @param  {string} query - optional query parameters
 * @param  {function} dispatch - function that returns an action to the reducer
 * @param  {function} getState - retrieves token configurations
 * @return {Object} - an action object passed through dispatch
 */
export const fetchTasks = (parent, parentId, query) => (dispatch, getState) => {
    dispatch(setLoading());

    axios.get(`/api/v1/${parent}/${parentId}/tasks${query}`/*, tokenConfig(getState)*/)
    .then(res => dispatch({
        type: TASKS_FETCHED, 
        payload: res.data
    }))
    .catch(err =>  {
        if(err.response) {
            dispatch(
                returnErrors(err.response.data, err.response.status, "TASKS_ERROR")
            );
        } else if(err.request) {
            dispatch(
                returnErrors(err.request.data, err.request.status, "TASKS_ERROR")
            );
        } else {
            dispatch(
                returnErrors("An error occurred", 500, "TASKS_ERROR")
            );
        };
    });
};
/**
 * @param  {string} id - ObjectId belonging to the task to return
 * @param  {function} dispatch - 
 * @param  {function} getState - 
 * @return {Object} - 
 */
export const editTask = id => (dispatch, getState) => {
    dispatch(setLoading());

    axios.get(`/api/v1/tasks/${id}`/*, tokenConfig(getState)*/)
    .then(res => {
        dispatch({
            type: TASK_RETURNED,
            payload: res.data
        });
    })
    .catch(err => {
        if(err.response) {
            dispatch(
                returnErrors(err.response.data, err.response.status, "TASKS_ERROR")
            );
        } else if(err.request) {
            dispatch(
                returnErrors(err.request.data, err.request.status, "TASKS_ERROR")
            );
        } else {
            dispatch(
                returnErrors("An error occurred", 500, "TASKS_ERROR")
            );
        };
    });
};

export const toggleTaskCompletion = id => (dispatch, getState) => {
    dispatch(setLoading());

    axios.patch(`/api/v1/tasks/${id}`/*, tokenConfig(getState)*/)
    .then(res => dispatch({
        type: TASK_COMPLETION_TOGGLED,
        payload: res.data
    }))
    .catch(err => {
        if(err.response) {
            dispatch(
                returnErrors(err.response.data, err.response.status, "TASKS_ERROR")
            );
        } else if(err.request) {
            dispatch(
                returnErrors(err.request.data, err.request.status, "TASKS_ERROR")
            );
        } else {
            dispatch(
                returnErrors("An error occurred", 500, "TASKS_ERROR")
            );
        };
    });
};

/**
 * @param  {string} id - 
 * @param  {Object} task - 
 * @param  {function} dispatch - 
 * @param  {function} getState - 
 */
export const updateTask = (id, task) => (dispatch, getState) => {
    dispatch(setLoading());

    axios.put(`/api/v1/tasks/${id}`, task/*, tokenConfig(getState)*/)
    .then(res => dispatch({
        type: TASK_UPDATED,
        payload: res.data
    }))
    .catch(err => {
        if(err.response) {
            dispatch(
                returnErrors(err.response.data, err.response.status, "TASKS_ERROR")
            );
        } else if(err.request) {
            dispatch(
                returnErrors(err.request.data, err.request.status, "TASKS_ERROR")
            );
        } else {
            dispatch(
                returnErrors("An error occurred", 500, "TASKS_ERROR")
            );
        };
    });
};

/**
 * @param  {string} id - ObjectId belonging to the task to delete
 * @param  {function} dispatch - 
 * @param  {function} getState - retrieves token configuration
 * @return {Object} - 
 */
export const deleteTask = id => (dispatch, getState) => {
    dispatch(setLoading());

    axios.delete(`/api/v1/tasks/${id}`/*, tokenConfig(getState)*/)
    .then(res => {
        dispatch({
            type: TASK_DELETED,
            payload: id
        });
    })
    .catch(err => {
        if(err.response) {
            dispatch(
                returnErrors(err.response.data, err.response.status, "TASKS_ERROR")
            );
        } else if(err.request) {
            dispatch(
                returnErrors(err.request.data, err.request.status, "TASKS_ERROR")
            );
        } else {
            dispatch(
                returnErrors("An error occurred", 500, "TASKS_ERROR")
            );
        };
    });
};