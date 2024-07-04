import React from "react";
import "../css/TypingIndicator.css";

const TypingIndicator = ({ typingIndicatorMessage }) => {
    // Renders the typing indicator with the correct message
    return <div className='typing-indicator'>{typingIndicatorMessage}</div>;
};

export default TypingIndicator;

.typing - indicator {
    background - color: var(--third - colour);
    color: #fff;
    padding: 8px;
    border - radius: 4px;
    margin: 5px;
    clear: both;
    float: left;
}
