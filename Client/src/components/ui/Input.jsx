import React from "react";

const Input = React.forwardRef(({ ...props }, ref) => {
  return (
    <input
      className="text-black outline-none rounded pl-1 pr-1"
      {...props}
      ref={ref} // Asigna la ref directamente al input
    />
  );
});

export default Input;