import React, { useState, useEffect } from "react";

function Success({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {isVisible && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}
    </>
  );
}

export default Success;
