import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import CheckIcon from "@mui/icons-material/Check";
import { DatePicker } from "@mui/x-date-pickers";

const Calendar = ({ onDateChange }) => {
  const [value, setValue] = useState(new Date());
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 13]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  };

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    setValue(date);
    onDateChange(formattedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        variant="static"
        orientation="portrait"
        value={value}
        disablePast
        onChange={handleDateChange}
        showToolbar={false}
        toolbarTitle={null}
        PopperProps={{ disablePortal: true, renderLayer: () => null }}
        renderInput={() => null}
        renderDay={(day, _value, DayComponentProps) => {
          const isSelected =
            !DayComponentProps.outsideCurrentMonth &&
            highlightedDays.indexOf(day.getDate()) >= 0;

          return (
            <Badge
              key={day.toString()}
              overlap="circular"
              badgeContent={isSelected ? <CheckIcon color="red" /> : undefined}
            >
              <PickersDay {...DayComponentProps} />
            </Badge>
          );
        }}
        disableToolbar
      />
    </LocalizationProvider>
  );
};

export default Calendar;
