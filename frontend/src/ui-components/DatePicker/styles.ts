export const DatePickerStyle = `.react-datepicker__triangle {
    left: 25px !important;
    fill: #FFFFFF !important;
    stroke: #F0F0F0 !important;
    color: #FFFFFF !important;
  }
  .react-datepicker__view-calendar-icon input {
    width: 120px;
    height: 32px;
    border-radius: 4px;
    border-color: #DFE4EA;
    font-family: 'Inter';
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    text-align: center;
  }
  input[type="text"].border {
    width: 120px;
    height: 32px;
    outline: none;
    border-radius: 4px;
    border-color: #DFE4EA;
    font-family: 'Inter';
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    text-align: center;
  }
  input[type="text"].border:focus {
    border-color: #99C6F7;
    box-shadow: 0 0 0 4px rgba(147, 197, 253, 0.5);
  }    
  .react-datepicker {
    border-radius: 4px;
    border-color: #F0F0F0;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  }
  .react-datepicker-popper {
    translate: 81px 0 0 !important;
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: none;
  }
  .react-datepicker__today-button {
    color: #3C71E1;
    background-color: #FFFFFF;
    border-color: #F0F0F0;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 1px;
    font-weight: normal;
    height: 42px;
    padding: 10px 0 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .react-datepicker__navigation {
    height: 39px !important;
  }  
  .react-datepicker__day {
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    color: #111827;
    border-radius: 2px !important;
    width: 24px;
    height: 24px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 1px;
  }  
  .react-datepicker__day--selected {
    background-color: #3C71E1 !important;
    color: #FFFFFF;
  }
  .react-datepicker__day--keyboard-selected:hover {
    background-color: #f0f0f0 !important;
  }  
  .react-datepicker__day--today{
    font-weight: normal;
    border: solid 1px;
    border-color: #3C71E1;
  }  
  .react-datepicker__day--outside-month {
    color: #CBD5E1;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: white;
  }
  .react-datepicker__month-container {
    float: none;
  }
  .react-datepicker__month {
    margin: 0px;
    padding: 8px 12px 8px 12px;
    width: 280px;
  }
  .react-datepicker__week {
    height: 30px;
    padding: 3px 6px 3px 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .react-datepicker__day-names {
    padding: 8px 12px 8px 12px;
    border-bottom: none !important;
  }
  .react-datepicker__day-name {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 30px;
    line-height: 0;
    color: rgba(0, 0, 0, 0.85);
    margin: 0;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
  .react-datepicker__current-month {
    color: #111827;
    text-align: center;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
  .react-datepicker__header {
    padding: 0;
  }
  .react-datepicker-year-header {
    color: #111827;
    text-align: center;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    border-bottom: 1px solid #F0F0F0;
    padding: 8px 0;
    position: relative;
  }
  .react-datepicker__day--disabled {
    color: #CBD5E1;
  }
  .react-datepicker__year-wrapper {
    margin: 0px;
    padding: 10px 0px;
    max-width: 280px !important;
    justify-content: center;
  }
  .react-datepicker__year-text {
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    color: #111827;
    border-radius: 2px !important;
  }
  .react-datepicker__year--container {
    width: 280px !important;
  }  
  .react-datepicker__year-text--selected {
    background-color: #3C71E1 !important;
    color: #FFFFFF;
  }
  .react-datepicker__year-text--keyboard-selected {
    background-color: #FFFFFF !important;
  }  
  .react-datepicker__year-text--keyboard-selected:not([aria-disabled=true]):hover {
    background-color: #f0f0f0;
  }
  .react-datepicker__year-text--today {
    border: 1px solid #3C71E1;
  }  
  .react-datepicker__month-text {
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    color: #111827;
    border-radius: 2px !important;
  }
  .react-datepicker__month-text--selected {
    background-color: #3C71E1 !important;
    color: #FFFFFF;
  }
  .react-datepicker__month-text--keyboard-selected {
    background-color: #FFFFFF;
  }  
  .react-datepicker__month-text--keyboard-selected:not([aria-disabled=true]):hover {
    background-color: #f0f0f0;
  }
  .react-datepicker__month-text--today {
    border: 1px solid #3C71E1;
  }  `;
