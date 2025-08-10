import React from "react";

function Button({
    children,
    type = 'button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = '',
    ...props        // props stores all other parameters, passed by user, and acts as a object. Further, this object(props) is spreaded to pass all other attributes to button.
}){
    return(
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`}
        {...props}>
            {children}
        </button>
    )
}

export default Button