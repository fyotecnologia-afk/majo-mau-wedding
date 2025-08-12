import React from "react";

const imageUrl =
  "images/mansory/gallery-7.webp?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";

const ViewpagerSimple: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1260,
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <img
        src={imageUrl}
        alt="Gallery"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
};

export default ViewpagerSimple;
