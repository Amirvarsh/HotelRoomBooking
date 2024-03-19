import React, { useState, useEffect } from "react";

function Error({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      )}
    </>
  );
}

export default Error;
