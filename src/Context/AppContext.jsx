import { createContext, useContext, useReducer } from "react";

//import { initialResidents } from "../Data/SocietyData";

import dbFile from "../../db.json";

/** holds the data to be shared */
const AppContext = createContext();

/** Defailt initial states declare here */
const InitialState = {
  residents: dbFile.residents,
  maintenance: dbFile.maintenance,
  activeSection: "Dashboard",
};

/** function that handles logic */
function reducer(state, action) {
  switch (action.type) {
    case "SET_LAYOUT": {
      return { ...state, activeSection: action.payload };
    }
    case "ADD_RESIDENTIAL": {
      return { ...state, residents: [action.payload, ...state.residents] };
    }
    case "UPDATE_RESIDENTIAL": {
      return {
        ...state,
        residents: state.residents.map((res) =>
          // Use == (loose equality) to handle string/number ID mismatches
          res.id == action.payload.id ? action.payload : res,
        ),
      };
    }
    case "DELETE_RESIDENTIAL": {
      return {
        ...state,
        residents: state.residents.filter((res) => res.id !== action.payload),
      };
    }
    case "ADD_MAINENANCE": {
      return { ...state, maintenance: [action.payload, ...state.payload] };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, InitialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
