import React, { useState } from "react";

// example button component to demonstrate testing in react testing library

const ExampleButton = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <button onClick={handleClick}>{clicked ? "Clicked!" : "Click me"}</button>
  );
};

export default ExampleButton;
