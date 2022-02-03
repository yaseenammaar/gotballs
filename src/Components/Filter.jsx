import Select from "react-select";

export default function DateFilter({ ...props }) {
  return (
    <Select
      styles={{
        control: (styles) => {
          return {
            ...styles,
            backgroundColor: "white",
            borderRadius: "0.5rem",
          };
        },

        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          return {
            ...styles,
            width: "auto",
            margin: "6px 12px",
            borderRadius: "0.5rem",
          };
        },

        menu: (styles) => {
          return {
            ...styles,
            borderRadius: "0.75rem",
            boxShadow:
              "0 0 #0000, 0 0 #0000,0 0 #0000, 0 0 #0000, 0 10px 15px -3px #d1d5db, 0 4px 6px -4px #d1d5db",
          };
        },
      }}
      {...props}
    />
  );
}
