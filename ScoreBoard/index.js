// selecting DOM element
const matchContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".addMatch");
const resetBtn = document.querySelector(".reset");

// action identifiers
const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const RESET = "score/reset";
const ADD_MATCH = "match/add";
const DELETE_MATCH = "match/delete";

// action creators
// action for incrementing match score
const increment = (payload) => {
  return {
    type: INCREMENT,
    payload,
  };
};
// action for decrementing match score
const decrement = (payload) => {
  return {
    type: DECREMENT,
    payload,
  };
};
// action for resetting match score
const reset = () => {
  return {
    type: RESET,
  };
};
// add new match action
const addMatch = () => {
  return { type: ADD_MATCH };
};
// delete match action
const deleteMatch = (matchId) => {
  return { type: DELETE_MATCH, payload: matchId };
};

// initial state
const initialState = [
  {
    id: 1,
    score: 0,
  },
];

// get unique match id
const nextMatchId = (matches) => {
  const maxId = matches.reduce((maxId, match) => Math.max(match.id, maxId), -1);
  return maxId + 1;
};
// create reducer function
function matchReducer(state = initialState, action) {
  // increment score
  if (action.type === INCREMENT) {
    const newMatchs = state.map((item) => {
      if (item.id === action.payload.id) {
        return { ...item, score: item.score + Number(action.payload.value) };
      } else {
        return item;
      }
    });
    return newMatchs;
  } else if (action.type === DECREMENT) {
    // Decrement Score
    const newMatchs = state.map((item) => {
      if (item.id === action.payload.id) {
        const newScore = item.score - Number(action.payload.value);
        return { ...item, score: newScore > 0 ? newScore : 0 };
      } else {
        return item;
      }
    });
    return newMatchs;
  } else if (action.type === RESET) {
    // reset scores
    const refreshedMatchs = state.map((item) => ({ ...item, score: 0 }));
    return refreshedMatchs;
  } else if (action.type === ADD_MATCH) {
    // Add new match
    const id = nextMatchId(state);
    return [...state, { id, score: 0 }];
  } else if (action.type === DELETE_MATCH) {
    const newMatches = state.filter((match) => match.id !== action.payload);
    return newMatches;
  } else {
    return state;
  }
}

// create store
const store = Redux.createStore(matchReducer);

// handler functions

// increment score handler
const incrementHandler = (id, formEl) => {
  // get the increment input
  const input = formEl.querySelector(".incrementInput");
  // get value
  const value = Number(input.value);
  if (value > 0) {
    store.dispatch(increment({ id, value }));
  }
};

// decrement score handler
const decrementHandler = (id, formEl) => {
  // get the decrement input
  const input = formEl.querySelector(".decrementInput");
  // get value
  const value = Number(input.value);
  if (value > 0) {
    store.dispatch(decrement({ id, value }));
  }
};

// delete match handle
const handleMatchDelete = (matchId) => {
  store.dispatch(deleteMatch(matchId));
};
// Add New Match On Button Click
// add new counter
addMatchBtn.addEventListener("click", () => {
  store.dispatch(addMatch());
});
// reset all match
resetBtn.addEventListener("click", () => {
  store.dispatch(reset());
});
// render function for update ui on each state update
const render = () => {
  const state = store.getState();
  const matchsView = state
    .map((item) => {
      return `
    <div class="match">
                    <div class="wrapper">
                        <button id="delete-match" onClick="handleMatchDelete(${item.id})" class="delete">
                            <img src="./image/delete.svg" alt="" />
                        </button>
                        <h3 class="lws-matchName">Match 1</h3>
                    </div>
                    <div class="inc-dec">
                        <form class="incrementForm" onSubmit="event.preventDefault(); incrementHandler(${item.id},this)" >
                            <h4>Increment</h4>
                            <input id="increment" type="number" name="increment" class="incrementInput" />
                        </form>
                        <form class="decrementForm" onSubmit="event.preventDefault(); decrementHandler(${item.id},this)">
                            <h4>Decrement</h4>
                            <input id="decrement" type="number" name="decrement" class="decrementInput" />
                        </form>
                    </div>
                    <div class="numbers">
                        <h2 id="counter" class="singleResult">${item.score}</h2>
                    </div>
                </div>
    `
    })
    .join("");
  matchContainer.innerHTML = matchsView
}

// render view
render()

// render view every time
store.subscribe(render)