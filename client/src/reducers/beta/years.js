import { 
    LOADING_YEARS, 
    NEW_YEAR, CREATE_YEAR, 
    FETCH_YEARS, 
    EDIT_YEAR, UPDATE_YEAR, DELETE_YEAR 
} from "../../actions/types";

const initialState = {
    loading: false,
    years: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case LOADING_YEARS: 
            return {
                ...state,
                loading: true
            };
        case NEW_YEAR:
            return {
                ...state,
                loading: false,
                years: action.payload
            };
        case CREATE_YEAR:
            return {
                ...state,
                loading: false,
                years: [...state.years, action.payload]
            };
        case FETCH_YEARS:
            return {
                ...state,
                loading: false,
                years: action.payload
            };
        case EDIT_YEAR:
            return {
                ...state,
                loading: false,
                years: state.years.map(year => {
                    if(year._id !== action._id) {
                        return {
                            ...state.years
                        }
                    } else return {
                        year: action.payload 
                    };
                })
            };
        case UPDATE_YEAR:
            return {
                ...state,
                loading: false,
                years: state.years.map(year => {
                    const { _id, title, start, end } = action.payload;
                    if(year._id !== _id) {
                        return year;
                    } else return {
                        ...state.years,
                        year: {
                            title,
                            date: {
                                start,
                                end
                            }
                        }
                    };
                })  
            };
        case DELETE_YEAR:
            return {
                ...state,
                loading: false,
                years: state.years.filter(year => year._id !== action.payload)
            };
        default: 
            return state;
    };
};