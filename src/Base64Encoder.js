import React, { useState } from "react";
import axios from "axios";

function Base64Encoder() {
  const [input, setInput] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [isEncoding, setIsEncoding] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const apiUrl = "https://localhost:7051/api";

  const handleTextChange = (event) => {
    setInput(event.target.value);
  };

  const handleConvertClick = async () => {
    setIsEncoding(true);
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      for (let i = 0; i < input.length; i++) {
        const char = input.charAt(i);
        const response = await axios.post(`${apiUrl}/Base64/encode?text=${char}`,
          null, { cancelToken: source.token }
        );
        setEncodedText((prevEncodedText) => prevEncodedText + response.data);
      }
    }catch(error) {
      if (axios.isCancel(error)) {
        console.log("Encoding canceled.");
      } else {
        console.error(error);
      }
    } finally {
      setIsEncoding(false);
      setCancelTokenSource(null);
    }
  };

  const handleCancel = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel("Encoding canceled by user.");
      setIsEncoding(false);
      setCancelTokenSource(null);
    }
  };

  const handleClearEncodedText = () => {
    setEncodedText("");
  };

  return (
    <div>
      <div style={{ textIndent: "1cm" }}>
        <p>
          <strong>Convert text into Base64 format.</strong>
        </p>
      </div>
      <div style={{ textIndent: "2cm" }}>
        <div>
          <p>Input:</p>
        </div>
        <div>
          <input
            type="text"
            value={input}
            onChange={handleTextChange}
            readOnly={isEncoding}
          />
          &nbsp;&nbsp;&nbsp;
          <button onClick={handleConvertClick} disabled={isEncoding}>
            {isEncoding ? "Encoding..." : "Convert"}
          </button>
          {isEncoding && (
            <button onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
        <div style={{ marginTop: "10px" }}>
          <div>
            <p>Output:</p>
          </div>
          <div>
            <textarea value={encodedText} readOnly />
          </div>
          <div>
            <button onClick={handleClearEncodedText} disabled={isEncoding}>
                Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Base64Encoder;
