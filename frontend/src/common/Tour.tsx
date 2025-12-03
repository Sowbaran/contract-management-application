import { useReducer, useEffect } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";

const TOUR_STEPS = [
  {
    target: ".mnu-module",
    content: "This area allows you to navigate between modules.",
    disableBeacon: true
  },
  {
    target: ".btn-new-form",
    content: "Here, you can create a new request."
  },
  {
    target: "#view-my-requests-tab",
    content: "You can see all your raised requests and their statuses in this section."
  },
  {
    target: "#view-team-requests-tab",
    content: "This section displays all requests your team members have requested."
  },
  {
    target: "#view-approve-request-tab",
    content: "You can review all requests waiting for your approval here."
  },
  {
    target: "#view-e-sign-requests-tab",
    content: "This section displays requests pending with digital signatures. You can update or reset their status here."
  },
  {
    target: "#view-my-approved-requests-tab",
    content: "This section displays all requests approved by you."
  }
];

const INITIAL_STATE = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: TOUR_STEPS
};

// Reducer will manage updating the local state
// biome-ignore lint/style/useDefaultParameterLast: <explanation>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const reducer = (state = INITIAL_STATE, action: { type: any; payload: any }) => {
  switch (action.type) {
    case "START":
      return { ...state, run: true };
    case "RESET":
      return { ...state, stepIndex: 0 };
    case "STOP":
      // localStorage.setItem('tour', 'done');
      return { ...state, run: false };
    case "NEXT_OR_PREV":
      return { ...state, ...action.payload };
    case "RESTART":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date()
      };
    default:
      return state;
  }
};

// Tour component
const Tour = () => {
  // Tour state is the state which control the JoyRide component
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    // Auto start the tour if the tour is not viewed before
    if (!localStorage.getItem("tour")) {
      dispatch({
        type: "START",
        payload: undefined
      });
    }
  }, []);

  // Set once tour is viewed, skipped or closed
  const setTourViewed = () => {
    localStorage.setItem("tour", "1");
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const callback = (data: { action: any; index: any; type: any; status: any }) => {
    const { action, index, type, status } = data;

    if (
      // If close button clicked, then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      setTourViewed();
      dispatch({
        type: "STOP",
        payload: undefined
      });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Check whether next or back button click and update the step.
      dispatch({
        type: "NEXT_OR_PREV",
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) }
      });
    }
  };

  return (
    <>
      <JoyRide
        key={tourState.key}
        run={tourState.run}
        continuous={tourState.continuous}
        loading={tourState.loading}
        stepIndex={tourState.stepIndex}
        steps={tourState.steps}
        callback={callback}
        showSkipButton={true}
        styles={{
          tooltipContainer: {
            textAlign: "left"
          },
          buttonSkip: {
            marginRight: 10,
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "rgb(22, 163, 74)",
            color: "rgb(22, 163, 74)",
            borderRadius: 6,
          },
          buttonNext: {
            backgroundColor: "rgb(22, 163, 74)"
          },
          buttonBack: {
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "rgb(22, 163, 74)",
            color: "rgb(22, 163, 74)",
            borderRadius: 6,
            background: "white"
          }
        }}
        locale={{
          last: "End tour"
        }}
      />
    </>
  );
};

export default Tour;
